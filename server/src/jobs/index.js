// server/src/jobs/index.js
'use strict';

const cron = require('node-cron');
const logger = require('../config/logger');
const JOBS = [
  require('./verificationReminder.job'),
  require('./staleListingReview.job'),
  require('./disputeDeadlineReminder.job'),
  require('./reportGeneration.job'),
  require('./auditLogArchival.job'),
  require('./systemHealthCheck.job'),
  require('./consentExpiryReminder.job'),
  require('./notificationDispatch.job'),
];

const tasks = new Map();
let started = false;

function start() {
  if (started) return tasks;

  for (const job of JOBS) {
    const task = cron.schedule(job.schedule, () => {
      job.run().catch((err) => logger.error('[jobs] top-level error', {
        name: job.name, message: err.message,
      }));
    });
    tasks.set(job.name, task);
    logger.info('[jobs] scheduled', { name: job.name, schedule: job.schedule });
  }
  started = true;
  return tasks;
}

function stop() {
  for (const [, task] of tasks) task.stop();
  tasks.clear();
  started = false;
  logger.info('[jobs] stopped');
}

async function runOnce(jobName, context) {
  const job = JOBS.find((j) => j.name === jobName);
  if (!job) {
    const err = new Error(`Unknown job: ${jobName}`);
    err.statusCode = 404;
    err.code = 'JOB_NOT_FOUND';
    throw err;
  }
  return job.run(context);
}

function listJobs() {
  return JOBS.map((j) => ({ name: j.name, schedule: j.schedule }));
}

module.exports = { start, stop, runOnce, listJobs, JOBS };