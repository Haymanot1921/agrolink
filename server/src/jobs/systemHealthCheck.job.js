// server/src/jobs/systemHealthCheck.job.js
// Periodic infrastructure health probe — Mongo, Redis (if configured),
// Cloudinary, disk space, and background job failure rate.
// Emits system alerts on the admin socket channel + notifications.
// Schedule: every 5 minutes.

'use strict';

const os = require('os');
const { execute } = require('./_runtime/jobRunner');
const logger = require('../config/logger');
const env = require('../config/environment');
const database = require('../config/database');
const cloudinary = require('../config/cloudinary');
const { emitSystemAlert } = require('../sockets/adminNotifications.socket');
const { NOTIFICATION_TYPES } = require('../shared/constants/notificationTypes');

const NAME = 'systemHealthCheck';
const SCHEDULE = '*/5 * * * *';
const DISK_WARN_PERCENT = 85;
const DISK_CRITICAL_PERCENT = 95;
const JOB_FAILURE_WARN_RATE = 0.1; // 10%

async function run({ log, now }) {
  const report = {
    checkedAt: now.toISOString(),
    mongo: null,
    cloudinary: null,
    disk: null,
    jobs: null,
    memory: null,
  };
  let critical = 0;
  let warned = 0;

  // 1. Mongo
  try {
    report.mongo = await database.healthCheck();
    if (report.mongo.status !== 'up') {
      critical += 1;
      emitSystemAlert({
        title: 'MongoDB unhealthy',
        body: `Status: ${report.mongo.status}`,
        severity: 'critical',
        data: report.mongo,
      });
    }
  } catch (err) {
    critical += 1;
    report.mongo = { status: 'down', error: err.message };
  }

  // 2. Cloudinary (only if enabled)
  if (cloudinary.isEnabled()) {
    try {
      // Cheap authenticated call — lists one resource.
      await cloudinary.cloudinary.api.resources({ max_results: 1 });
      report.cloudinary = { status: 'up' };
    } catch (err) {
      warned += 1;
      report.cloudinary = { status: 'degraded', error: err.message };
      emitSystemAlert({
        title: 'Cloudinary degraded',
        body: err.message,
        severity: 'high',
      });
    }
  } else {
    report.cloudinary = { status: 'disabled' };
  }

  // 3. Disk usage (only when filesystem is accessible)
  try {
    const stat = await fsStatfs('/');
    const usedPercent = ((stat.blocks - stat.bfree) / stat.blocks) * 100;
    report.disk = { usedPercent: Number(usedPercent.toFixed(1)) };
    if (usedPercent >= DISK_CRITICAL_PERCENT) {
      critical += 1;
      emitSystemAlert({
        title: 'Disk space critical',
        body: `${report.disk.usedPercent}% used`,
        severity: 'critical',
      });
    } else if (usedPercent >= DISK_WARN_PERCENT) {
      warned += 1;
      emitSystemAlert({
        title: 'Disk space warning',
        body: `${report.disk.usedPercent}% used`,
        severity: 'high',
      });
    }
  } catch (err) {
    report.disk = { error: err.message };
  }

  // 4. Memory
  try {
    const total = os.totalmem();
    const free = os.freemem();
    report.memory = {
      usedPercent: Number((((total - free) / total) * 100).toFixed(1)),
      freeMb: Math.round(free / (1024 * 1024)),
      totalMb: Math.round(total / (1024 * 1024)),
    };
  } catch (err) {
    report.memory = { error: err.message };
  }

  // 5. Job failure rate (last 24h)
  try {
    // eslint-disable-next-line global-require
    const BackgroundJobLog = require('../modules/administrator/system-health/backgroundJobLog.model');
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const [total, failed] = await Promise.all([
      BackgroundJobLog.countDocuments({ startedAt: { $gte: since } }),
      BackgroundJobLog.countDocuments({ startedAt: { $gte: since }, status: 'failed' }),
    ]);
    const rate = total > 0 ? failed / total : 0;
    report.jobs = { total, failed, failureRate: Number(rate.toFixed(3)) };
    if (rate >= JOB_FAILURE_WARN_RATE && total >= 10) {
      warned += 1;
      emitSystemAlert({
        title: 'High background job failure rate',
        body: `${(rate * 100).toFixed(1)}% of jobs failed in last 24h`,
        severity: 'high',
        data: report.jobs,
      });
    }
  } catch (err) {
    report.jobs = { error: err.message };
  }

  if (critical === 0 && warned === 0) {
    log.info('system healthy', report);
  } else {
    log.warn('system degraded', { critical, warned, report });
  }

  return {
    processed: 1,
    skipped: 0,
    failed: critical > 0 ? 1 : 0,
    notes: { report, critical, warned },
  };
}

// Small helper to avoid importing fs globally on all platforms.
async function fsStatfs(_target) {
  // eslint-disable-next-line global-require
  const fs = require('fs');
  return fs.promises.statfs
    ? fs.promises.statfs(_target)
    : Promise.reject(new Error('statfs unavailable'));
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };