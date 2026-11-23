// server/src/database/migrate.js
'use strict';

const database = require('../config/database');
const logger = require('../config/logger');
const runner = require('./migrationRunner');

async function main() {
  const cmd = process.argv[2] || 'up';
  const flags = process.argv.slice(3);
  const force = flags.includes('--force');
  const dryRun = flags.includes('--dry-run');

  try {
    await database.connect();

    switch (cmd) {
      case 'up': {
        const result = await runner.up({ dryRun });
        // eslint-disable-next-line no-console
        console.table(result);
        break;
      }
      case 'down': {
        const result = await runner.down({ force });
        // eslint-disable-next-line no-console
        console.table(result);
        break;
      }
      case 'status': {
        const result = await runner.status();
        // eslint-disable-next-line no-console
        console.table(result);
        break;
      }
      default:
        // eslint-disable-next-line no-console
        console.error(`Unknown command: ${cmd}. Use up | down | status`);
        process.exitCode = 1;
    }
  } catch (err) {
    logger.error('[migrate] failed', { message: err.message, stack: err.stack });
    process.exitCode = 1;
  } finally {
    await database.disconnect();
  }
}

main();