// server/src/server.js
// Entry point: connect DB, attach sockets, start jobs, run HTTP server,
// handle graceful shutdown on SIGINT/SIGTERM, and guard against uncaught
// errors leaving the process in a broken state.
'use strict';

const http = require('http');
const env = require('./config/environment');
const logger = require('./config/logger');
const database = require('./config/database');
const app = require('./app');
const { attachSockets, detachSockets } = require('./sockets');
const { authenticateSocket } = require('./shared/middleware/authenticate');
const jobs = require('./jobs');

let httpServer = null;
let shuttingDown = false;

async function start() {
  try {
    // 1. Database
    await database.connect();
    logger.info('[server] database connected');

    // 2. HTTP server (bound first so socket handshake has a socket to attach to)
    httpServer = http.createServer(app);
    httpServer.keepAliveTimeout = 65_000;
    httpServer.headersTimeout = 66_000;

    // 3. Sockets
    attachSockets(httpServer, { authenticate: authenticateSocket });

    // 4. Background jobs (start after sockets so health alerts can emit)
    if (!env.isTest) {
      jobs.start();
    }

    // 5. Listen
    await new Promise((resolve, reject) => {
      httpServer.once('error', reject);
      httpServer.listen(env.app.port, () => {
        logger.info(
          `[server] listening on ${env.app.baseUrl} (env=${env.nodeEnv})`,
        );
        resolve();
      });
    });

    // 6. Signal handlers
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // 7. Unhandled errors — log, alert, do not crash the process loop silently
    process.on('unhandledRejection', (reason) => {
      logger.error('[server] unhandledRejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    });
    process.on('uncaughtException', async (err) => {
      logger.error('[server] uncaughtException', {
        message: err.message,
        stack: err.stack,
      });
      // For a truly fatal error, do a graceful shutdown so orchestrators restart us cleanly.
      await gracefulShutdown('uncaughtException', 1);
    });
  } catch (err) {
    logger.error('[server] startup failed', {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

async function gracefulShutdown(signal, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`[server] graceful shutdown triggered (${signal})`);

  // Force exit if shutdown stalls
  const killTimer = setTimeout(() => {
    logger.error('[server] graceful shutdown timed out — forcing exit');
    process.exit(exitCode || 1);
  }, 15_000);
  killTimer.unref();

  try {
    // 1. Stop accepting new requests
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve));
      logger.info('[server] http server closed');
    }

    // 2. Stop cron jobs before closing sockets (jobs may emit)
    try {
      jobs.stop();
      logger.info('[server] jobs stopped');
    } catch (err) {
      logger.warn('[server] job stop error', { message: err.message });
    }

    // 3. Detach sockets
    try {
      await detachSockets();
      logger.info('[server] sockets closed');
    } catch (err) {
      logger.warn('[server] socket close error', { message: err.message });
    }

    // 4. Close DB last
    try {
      await database.disconnect();
      logger.info('[server] database disconnected');
    } catch (err) {
      logger.warn('[server] db disconnect error', { message: err.message });
    }

    clearTimeout(killTimer);
    logger.info('[server] shutdown complete');
    process.exit(exitCode);
  } catch (err) {
    logger.error('[server] shutdown error', { message: err.message });
    clearTimeout(killTimer);
    process.exit(exitCode || 1);
  }
}

// Only start when executed directly (`node src/server.js`); allow requiring
// server.js for tests without side effects.
if (require.main === module) {
  start();
}

module.exports = { start, gracefulShutdown };