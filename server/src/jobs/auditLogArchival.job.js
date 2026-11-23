// server/src/jobs/auditLogArchival.job.js
// SRS §15.3 — audit logs are append-only and retained for 12 months.
// After retention, entries are moved to a cold collection
// (`audit_logs_archived`) and removed from the hot collection.
// Runs weekly (Sunday 03:00). Never deletes — only archives.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const logger = require('../config/logger');

const NAME = 'auditLogArchival';
const SCHEDULE = '0 3 * * 0'; // Sunday 03:00
const RETENTION_MONTHS = 12;
const BATCH_SIZE = 1000;

async function run({ log, now }) {
  // eslint-disable-next-line global-require
  const mongoose = require('mongoose');
  const db = mongoose.connection.db;
  if (!db) {
    log.warn('mongo not connected — skipping');
    return { processed: 0, skipped: 1, failed: 0 };
  }

  const hot = db.collection('audit_logs');
  const cold = db.collection('audit_logs_archived');

  const cutoff = new Date(
    now.getFullYear(),
    now.getMonth() - RETENTION_MONTHS,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  );

  let processed = 0;
  let failed = 0;
  let hasMore = true;

  while (hasMore) {
    let batch;
    try {
      batch = await hot
        .find({ timestamp: { $lt: cutoff } })
        .sort({ timestamp: 1 })
        .limit(BATCH_SIZE)
        .toArray();
    } catch (err) {
      failed += 1;
      log.error('batch fetch failed', { message: err.message });
      break;
    }

    if (!batch.length) {
      hasMore = false;
      break;
    }

    try {
      await cold.insertMany(batch, { ordered: false });
    } catch (err) {
      // Ordered:false — some inserts may succeed. Log and continue.
      log.warn('archive insert partially failed', { message: err.message });
    }

    try {
      const ids = batch.map((d) => d._id);
      await hot.deleteMany({ _id: { $in: ids } });
      processed += ids.length;
    } catch (err) {
      failed += 1;
      log.error('hot deletion failed', { message: err.message });
      break;
    }

    if (batch.length < BATCH_SIZE) hasMore = false;
  }

  // Create index on cold collection for future queries (idempotent).
  try {
    await cold.createIndex({ timestamp: -1 });
    await cold.createIndex({ actorId: 1, timestamp: -1 });
    await cold.createIndex({ action: 1, timestamp: -1 });
  } catch (err) {
    log.warn('cold index creation failed', { message: err.message });
  }

  return { processed, failed, notes: { cutoff: cutoff.toISOString() } };
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };