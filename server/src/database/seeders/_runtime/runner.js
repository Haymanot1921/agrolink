// server/src/database/seeders/_runtime/runner.js
'use strict';

const fs = require('fs').promises;
const path = require('path');
const logger = require('../../config/logger');

const SEEDERS_DIR = path.resolve(__dirname, '..');
const LEDGER_TABLE = '_seeders';

async function ensureLedger(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${LEDGER_TABLE} (
      name VARCHAR(255) PRIMARY KEY,
      last_run_at DATETIME NOT NULL,
      duration_ms INT NOT NULL,
      status ENUM('success','failed') NOT NULL,
      error_message TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function listSeederFiles() {
  const entries = await fs.readdir(SEEDERS_DIR);
  return entries
    .filter((f) => /^\d{3}_.+\.seeder\.js$/.test(f))
    .sort((a, b) => a.localeCompare(b));
}

async function loadSeeder(file) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const mod = require(path.join(SEEDERS_DIR, file));
  if (!mod || typeof mod.run !== 'function') {
    throw new Error(`Seeder ${file} missing 'run' export`);
  }
  return { name: file.replace(/\.seeder\.js$/, ''), fileName: file, run: mod.run };
}

async function recordLedger(pool, name, durationMs, status, errorMessage = null) {
  await pool.query(
    `INSERT INTO ${LEDGER_TABLE} (name, last_run_at, duration_ms, status, error_message)
     VALUES (?, NOW(), ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       last_run_at = VALUES(last_run_at),
       duration_ms = VALUES(duration_ms),
       status = VALUES(status),
       error_message = VALUES(error_message)`,
    [name, durationMs, status, errorMessage],
  );
}

/**
 * @param {import('mysql2/promise').Pool} pool
 * @param {{ only?: string[] }} [opts]
 */
async function runAll(pool, opts = {}) {
  const { only = null } = opts;
  await ensureLedger(pool);

  const files = await listSeederFiles();
  const results = [];

  for (const fileName of files) {
    if (only && !only.includes(fileName.replace(/\.seeder\.js$/, ''))) continue;
    const seeder = await loadSeeder(fileName);
    const startedAt = Date.now();
    logger.info('[seeder] running', { name: seeder.name });
    try {
      await seeder.run({ pool, logger });
      const durationMs = Date.now() - startedAt;
      await recordLedger(pool, seeder.name, durationMs, 'success');
      logger.info('[seeder] done', { name: seeder.name, durationMs });
      results.push({ name: seeder.name, status: 'success', durationMs });
    } catch (err) {
      const durationMs = Date.now() - startedAt;
      await recordLedger(pool, seeder.name, durationMs, 'failed', err.message);
      logger.error('[seeder] failed', { name: seeder.name, message: err.message });
      results.push({ name: seeder.name, status: 'failed', durationMs, error: err.message });
      throw err;
    }
  }

  return results;
}

module.exports = { runAll };