// server/src/sockets/index.js
// Socket bootstrap + shared registry.
// Called once from server.js: attachSockets(httpServer, { authenticate }).
// Sub-modules register their own listeners via the returned handle.

'use strict';

const { initSocket, getIO } = require('../config/socket');
const logger = require('../config/logger');
const adminNotifications = require('./adminNotifications.socket');
const moderationQueue = require('./moderationQueue.socket');
const disputeUpdates = require('./disputeUpdates.socket');

let initialized = false;

/**
 * Boot Socket.IO and wire every domain sub-module.
 * @param {import('http').Server} httpServer
 * @param {{ authenticate: (token: string) => Promise<object|null> }} deps
 * @returns {{ io: import('socket.io').Server, modules: Object }}
 */
function attachSockets(httpServer, deps = {}) {
  if (initialized) {
    logger.warn('[sockets] attachSockets called twice — returning existing instance');
    return { io: getIO(), modules: { adminNotifications, moderationQueue, disputeUpdates } };
  }

  const { authenticate } = deps;
  if (typeof authenticate !== 'function') {
    throw new Error('[sockets] attachSockets requires { authenticate }');
  }

  const io = initSocket(httpServer, { authenticate });
  if (!io) {
    logger.warn('[sockets] Socket.IO disabled by config — skipping domain listeners');
    initialized = true;
    return { io: null, modules: {} };
  }

  // Each module attaches its per-socket listeners.
  adminNotifications.attach(io);
  moderationQueue.attach(io);
  disputeUpdates.attach(io);

  initialized = true;
  logger.info('[sockets] all domain modules attached');
  return {
    io,
    modules: { adminNotifications, moderationQueue, disputeUpdates },
  };
}

/**
 * Idempotent shutdown — disconnect all sockets.
 */
async function detachSockets() {
  const io = getIO();
  if (!io) return;
  try {
    await io.close();
    logger.info('[sockets] closed');
  } catch (err) {
    logger.error('[sockets] close error', { message: err.message });
  }
  initialized = false;
}

module.exports = {
  attachSockets,
  detachSockets,
  adminNotifications,
  moderationQueue,
  disputeUpdates,
};