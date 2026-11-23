'use strict';

const database = require('../config/database');
const logger = require('../config/logger');
const { runAll } = require('./seeders/_runtime/runner');

async function main() {
  try {
    const pool = await database.connect();
    const results = await runAll(pool);
    // eslint-disable-next-line no-console
    console.table(results);
  } catch (err) {
    logger.error('[seed] failed', { message: err.message, stack: err.stack });
    process.exitCode = 1;
  } finally {
    await database.disconnect();
  }
}

main();
