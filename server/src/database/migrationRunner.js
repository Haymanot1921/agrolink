// Ordered, lock-protected runner for the SQL migrations in database/migrations.
'use strict';

const fs = require('fs').promises;
const path = require('path');
const database = require('../config/database');
const env = require('../config/environment');
const logger = require('../config/logger');

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');
const LEDGER_TABLE = 'schema_migrations';
const LOCK_NAME = 'agrolink_schema_migrations';

async function listMigrationFiles() {
  let entries;
  try {
    entries = await fs.readdir(MIGRATIONS_DIR);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  return entries
    .filter((file) => /^\d{3}_[a-z0-9_]+\.sql$/i.test(file))
    .sort((a, b) => a.localeCompare(b));
}

async function ensureLedger(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS ${LEDGER_TABLE} (
      name VARCHAR(120) NOT NULL PRIMARY KEY,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function acquireLock(connection) {
  const [rows] = await connection.execute('SELECT GET_LOCK(?, 0) AS acquired', [LOCK_NAME]);
  if (rows[0].acquired !== 1) {
    const err = new Error('Another migration is currently running');
    err.code = 'MIGRATION_LOCKED';
    throw err;
  }
}

async function releaseLock(connection) {
  await connection.execute('SELECT RELEASE_LOCK(?)', [LOCK_NAME]);
}

async function readApplied(connection) {
  const [rows] = await connection.execute(
    `SELECT name, applied_at AS appliedAt FROM ${LEDGER_TABLE} ORDER BY applied_at, name`,
  );
  return new Map(rows.map((row) => [row.name, row]));
}

function splitSqlStatements(sql) {
  const statements = [];
  let statement = '';
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];

    if (lineComment) {
      if (char === '\n') {
        lineComment = false;
        statement += '\n';
      }
      continue;
    }

    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }

    if (quote) {
      statement += char;
      if (char === '\\' && next) {
        statement += next;
        i += 1;
      } else if (char === quote) {
        if (next === quote) {
          statement += next;
          i += 1;
        } else {
          quote = null;
        }
      }
      continue;
    }

    if ((char === '-' && next === '-' && (i + 2 === sql.length || /\s/.test(sql[i + 2])))
      || char === '#') {
      lineComment = true;
      if (char === '-') i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      statement += char;
      continue;
    }
    if (char === ';') {
      if (statement.trim()) statements.push(statement.trim());
      statement = '';
      continue;
    }
    statement += char;
  }

  if (statement.trim()) statements.push(statement.trim());
  return statements;
}

async function up({ dryRun = false } = {}) {
  const files = await listMigrationFiles();
  if (dryRun) return files.map((file) => ({ name: file.replace(/\.sql$/, ''), status: 'pending' }));

  const connection = await database.getConnection();
  try {
    await ensureLedger(connection);
    await acquireLock(connection);
    const applied = await readApplied(connection);
    const results = [];

    for (const fileName of files) {
      const name = fileName.replace(/\.sql$/, '');
      if (applied.has(name)) {
        results.push({ name, status: 'skipped' });
        continue;
      }

      const sql = await fs.readFile(path.join(MIGRATIONS_DIR, fileName), 'utf8');
      const startedAt = Date.now();
      logger.info('[migration] applying', { name });
      for (const statement of splitSqlStatements(sql)) {
        await connection.query(statement);
      }
      await connection.execute(`INSERT INTO ${LEDGER_TABLE} (name) VALUES (?)`, [name]);
      const durationMs = Date.now() - startedAt;
      logger.info('[migration] applied', { name, durationMs });
      results.push({ name, status: 'applied', durationMs });
    }

    return results;
  } catch (err) {
    logger.error('[migration] failed', { message: err.message, stack: err.stack });
    throw err;
  } finally {
    try {
      await releaseLock(connection);
    } catch (err) {
      if (err.code !== 'ER_SP_DOES_NOT_EXIST') {
        logger.warn('[migration] lock release failed', { message: err.message });
      }
    }
    connection.release();
  }
}

async function down() {
  throw new Error('SQL migrations are forward-only; no down migrations are defined.');
}

async function status() {
  const files = await listMigrationFiles();
  const connection = await database.getConnection();
  try {
    await ensureLedger(connection);
    const applied = await readApplied(connection);
    return files.map((fileName) => {
      const name = fileName.replace(/\.sql$/, '');
      const record = applied.get(name);
      return {
        name,
        status: record ? 'applied' : 'pending',
        appliedAt: record ? record.appliedAt : null,
      };
    });
  } finally {
    connection.release();
  }
}

module.exports = {
  up,
  down,
  status,
  _internals: { listMigrationFiles, splitSqlStatements, MIGRATIONS_DIR, LEDGER_TABLE, env },
};
