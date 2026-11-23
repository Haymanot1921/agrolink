// server/src/jobs/auditLogArchival.job.js
// SRS §15.3 — audit logs are append-only and retained for 12 months.
// After retention, entries are moved to the cold table
// (`audit_logs_archived`) and removed from the hot table.
// Runs weekly (Sunday 03:00). Never deletes — only archives.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const database = require('../config/database');

const NAME = 'auditLogArchival';
const SCHEDULE = '0 3 * * 0'; // Sunday 03:00
const RETENTION_MONTHS = 12;
const BATCH_SIZE = 1000;

async function run({ log, now }) {
  if (!database.isReady()) {
    log.warn('MySQL not connected — skipping');
    return { processed: 0, skipped: 1, failed: 0 };
  }

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
      const [rows] = await database.query(
        'SELECT id FROM audit_logs WHERE timestamp < ? ORDER BY timestamp ASC LIMIT ?',
        [cutoff, BATCH_SIZE],
      );
      batch = rows;
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
      const ids = batch.map((row) => row.id);
      await database.transaction(async (connection) => {
        const placeholders = ids.map(() => '?').join(', ');
        await connection.execute(
          `INSERT IGNORE INTO audit_logs_archived
           SELECT * FROM audit_logs WHERE id IN (${placeholders})`,
          ids,
        );
        await connection.execute(
          `DELETE FROM audit_logs WHERE id IN (${placeholders})`,
          ids,
        );
      });
      processed += batch.length;
    } catch (err) {
      failed += 1;
      log.error('archive transaction failed', { message: err.message });
      break;
    }

    if (batch.length < BATCH_SIZE) hasMore = false;
  }

  return { processed, failed, notes: { cutoff: cutoff.toISOString() } };
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };