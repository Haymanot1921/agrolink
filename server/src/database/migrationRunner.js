// server/src/database/migrationRunner.js
// Ordered, idempotent, lock-protected MongoDB migration runner.
// Usage (CLI — src/database/migrate.js is a thin wrapper):
//     node src/database/migrate.js up
//     node src/database/migrate.js down [--force]
//     node src/database/migrate.js status
//
// Migration file contract:
//   module.exports = {
//     name: '001-initial-role-seed',      // must match filename prefix
//     up:   async ({ db, mongoose }) => { ... },
//     down: async ({ db, mongoose }) => { ... }, // optional
//   };
//
// Filenames must be `NNN-name.js` so ordering is deterministic and future
// additions can't collide. The `name` field must match the filename (without
// `.js`) — the runner enforces this to keep the ledger honest.
'use strict';

const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const env = require('../config/environment');
const logger = require('../config/logger');

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');
const LEDGER_COLLECTION = '_migrations';
const LOCK_COLLECTION = '_migration_lock';
const LOCK_ID = 'runner';
const LOCK_TTL_MS = 5 * 60 * 1000;

// ─── Utilities ─────────────────────────────────────────────────────────────

async function listMigrationFiles() {
  let entries;
  try {
    entries = await fs.readdir(MIGRATIONS_DIR);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  return entries
    .filter((f) => /^\d{3}-[a-z0-9-]+\.js$/i.test(f))
    .sort((a, b) => a.localeCompare(b));
}

async function loadMigration(fileName) {
  const fullPath = path.join(MIGRATIONS_DIR, fileName);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const migration = require(fullPath);
  if (!migration || typeof migration.up !== 'function') {
    throw new Error(`Migration ${fileName} missing 'up' function`);
  }
  const expected = fileName.replace(/\.js$/, '');
  if (migration.name && migration.name !== expected) {
    throw new Error(
      `Migration ${fileName}: 'name' (${migration.name}) must match filename (${expected})`,
    );
  }
  return { ...migration, name: expected, fileName };
}

async function ensureCollections(db) {
  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));
  if (!existing.has(LEDGER_COLLECTION)) {
    await db.createCollection(LEDGER_COLLECTION);
    await db.collection(LEDGER_COLLECTION).createIndex({ name: 1 }, { unique: true });
    await db.collection(LEDGER_COLLECTION).createIndex({ appliedAt: -1 });
  }
  if (!existing.has(LOCK_COLLECTION)) {
    await db.createCollection(LOCK_COLLECTION);
  }
}

async function acquireLock(db) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + LOCK_TTL_MS);
  const holder = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const result = await db.collection(LOCK_COLLECTION).findOneAndUpdate(
      { _id: LOCK_ID, $or: [{ expiresAt: { $lt: now } }, { expiresAt: null }] },
      { $set: { holder, acquiredAt: now, expiresAt } },
      { upsert: true, returnDocument: 'after' },
    );
    const doc = result.value || result;
    if (doc && doc.holder === holder) {
      return async function release() {
        await db
          .collection(LOCK_COLLECTION)
          .deleteOne({ _id: LOCK_ID, holder })
          .catch(() => {});
      };
    }
  } catch (err) {
    if (err.code === 11000) {
      const err2 = new Error('Another migration is currently running');
      err2.code = 'MIGRATION_LOCKED';
      throw err2;
    }
    throw err;
  }
  const err = new Error('Another migration is currently running');
  err.code = 'MIGRATION_LOCKED';
  throw err;
}

async function appliedMigrations(db) {
  const rows = await db
    .collection(LEDGER_COLLECTION)
    .find({})
    .sort({ appliedAt: 1 })
    .toArray();
  return new Map(rows.map((r) => [r.name, r]));
}

function resolveDb() {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error('MongoDB is not connected — call database.connect() first');
  }
  return mongoose.connection.db;
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Run all pending migrations in filename order.
 * @param {{ dryRun?: boolean, context?: object }} [opts]
 * @returns {Promise<Array<{ name, status, durationMs }>>}
 */
async function up(opts = {}) {
  const { dryRun = false, context = {} } = opts;
  const db = resolveDb();
  await ensureCollections(db);
  const release = await acquireLock(db);

  const files = await listMigrationFiles();
  const applied = await appliedMigrations(db);
  const results = [];

  try {
    for (const fileName of files) {
      const migration = await loadMigration(fileName);
      if (applied.has(migration.name)) {
        results.push({ name: migration.name, status: 'skipped' });
        continue;
      }

      if (dryRun) {
        results.push({ name: migration.name, status: 'pending' });
        continue;
      }

      const startedAt = Date.now();
      logger.info('[migration] applying', { name: migration.name });
      try {
        await migration.up({ db, mongoose, env, context });
        await db.collection(LEDGER_COLLECTION).insertOne({
          name: migration.name,
          fileName,
          appliedAt: new Date(),
          durationMs: Date.now() - startedAt,
        });
        const durationMs = Date.now() - startedAt;
        logger.info('[migration] applied', { name: migration.name, durationMs });
        results.push({ name: migration.name, status: 'applied', durationMs });
      } catch (err) {
        logger.error('[migration] failed', {
          name: migration.name,
          message: err.message,
          stack: err.stack,
        });
        results.push({ name: migration.name, status: 'failed', error: err.message });
        throw err;
      }
    }
  } finally {
    await release();
  }

  return results;
}

/**
 * Revert the last `steps` applied migrations (or a specific one by name).
 * In production, requires { force: true } — prevents accidental rollbacks.
 */
async function down({ steps = 1, name = null, force = false, context = {} } = {}) {
  if (env.isProduction && !force) {
    const err = new Error('Rollbacks are disabled in production without { force: true }');
    err.code = 'PROD_ROLLBACK_FORBIDDEN';
    throw err;
  }

  const db = resolveDb();
  await ensureCollections(db);
  const release = await acquireLock(db);

  const files = await listMigrationFiles();
  const applied = await appliedMigrations(db);
  const results = [];

  try {
    let toRevert;
    if (name) {
      if (!applied.has(name)) throw new Error(`Migration '${name}' not applied`);
      const m = await loadMigration(files.find((f) => f.replace(/\.js$/, '') === name));
      toRevert = [m];
    } else {
      const pending = files
        .map((f) => f.replace(/\.js$/, ''))
        .filter((n) => applied.has(n));
      const lastN = pending.slice(-steps);
      toRevert = [];
      for (const n of lastN) {
        // eslint-disable-next-line no-await-in-loop
        toRevert.push(await loadMigration(files.find((f) => f.replace(/\.js$/, '') === n)));
      }
      toRevert.reverse(); // revert newest first
    }

    for (const migration of toRevert) {
      if (typeof migration.down !== 'function') {
        logger.warn('[migration] no down function — skipping', { name: migration.name });
        results.push({ name: migration.name, status: 'skipped_no_down' });
        continue;
      }
      const startedAt = Date.now();
      logger.info('[migration] reverting', { name: migration.name });
      try {
        await migration.down({ db, mongoose, env, context });
        await db.collection(LEDGER_COLLECTION).deleteOne({ name: migration.name });
        const durationMs = Date.now() - startedAt;
        logger.info('[migration] reverted', { name: migration.name, durationMs });
        results.push({ name: migration.name, status: 'reverted', durationMs });
      } catch (err) {
        logger.error('[migration] revert failed', {
          name: migration.name,
          message: err.message,
          stack: err.stack,
        });
        results.push({ name: migration.name, status: 'failed', error: err.message });
        throw err;
      }
    }
  } finally {
    await release();
  }

  return results;
}

/**
 * Report pending + applied migrations.
 */
async function status() {
  const db = resolveDb();
  await ensureCollections(db);
  const files = await listMigrationFiles();
  const applied = await appliedMigrations(db);

  return files.map((fileName) => {
    const name = fileName.replace(/\.js$/, '');
    const rec = applied.get(name);
    return {
      name,
      status: rec ? 'applied' : 'pending',
      appliedAt: rec ? rec.appliedAt : null,
      durationMs: rec ? rec.durationMs : null,
    };
  });
}

module.exports = {
  up,
  down,
  status,
  // exposed for tests
  _internals: { listMigrationFiles, loadMigration, MIGRATIONS_DIR, LEDGER_COLLECTION },
};