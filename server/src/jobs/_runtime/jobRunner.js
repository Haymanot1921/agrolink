// server/src/jobs/_runtime/jobRunner.js
// Wraps a job's run() with: lock acquisition, timing, structured logging,
// and per-run background_job_log persistence (used by system-health).

'use strict';

const { acquire } = require('./lockService');
const logger = require('../../config/logger');

/**
 * Execute a job with lock + logging.
 * @param {Object} jobDef
 * @param {string} jobDef.name
 * @param {Function} jobDef.run — async ({ log, now }) => { processed, skipped, failed, notes }
 * @param {number} [jobDef.lockTtlMs]
 * @param {Object} [context] — optional context override (e.g. actorId for manual run)
 */
async function execute(jobDef, context = {}) {
  const { name, run, lockTtlMs } = jobDef;
  const startedAt = new Date();
  const lock = await acquire(name, lockTtlMs);

  if (!lock.acquired) {
    logger.debug('[job] skipped — locked', { name, holder: lock.holder });
    return { name, status: 'skipped', reason: 'locked', startedAt, finishedAt: new Date() };
  }

  const log = {
    info: (msg, meta) => logger.info(`[job:${name}] ${msg}`, meta),
    warn: (msg, meta) => logger.warn(`[job:${name}] ${msg}`, meta),
    error: (msg, meta) => logger.error(`[job:${name}] ${msg}`, meta),
  };

  let result;
  let error;
  try {
    result = (await run({ log, now: startedAt, context })) || {};
  } catch (err) {
    error = err;
    logger.error('[job] failed', { name, message: err.message, stack: err.stack });
  } finally {
    await lock.release();
  }

  const finishedAt = new Date();
  const durationMs = finishedAt - startedAt;
  const status = error ? 'failed' : 'succeeded';

  const summary = {
    name,
    status,
    startedAt,
    finishedAt,
    durationMs,
    processed: result.processed || 0,
    skipped: result.skipped || 0,
    failed: result.failed || 0,
    notes: result.notes || null,
    error: error ? { message: error.message } : null,
    context: context || null,
  };

  // Persist to background_job_log for the system-health dashboard.
  try {
    // eslint-disable-next-line global-require
    const BackgroundJobLog = require('../../modules/administrator/system-health/backgroundJobLog.model');
    await BackgroundJobLog.create({
      jobName: name,
      status,
      startedAt,
      finishedAt,
      durationMs,
      processed: summary.processed,
      skipped: summary.skipped,
      failed: summary.failed,
      notes: summary.notes,
      errorMessage: error ? error.message : null,
      triggeredBy: context.actorId || 'scheduler',
    });
  } catch (err) {
    logger.warn('[job] could not persist job log', { name, message: err.message });
  }

  logger.info('[job] complete', {
    name,
    status,
    durationMs,
    processed: summary.processed,
    failed: summary.failed,
  });

  return summary;
}

module.exports = { execute };