// server/src/sockets/moderationQueue.socket.js
// Live moderation queue (listings, articles, reviews, content reports).
// Emits queue deltas so admin dashboards update without polling.
// Mirrors shared/events/moderationEvents.js.

'use strict';

const { emitToRole, emitToUser } = require('../config/socket');
const logger = require('../config/logger');
const {
  MODERATION_SOCKET_EVENTS,
  buildModerationEvent,
} = require('../shared/events/moderationEvents');

const ADMIN_ROOM = 'role:admin';

/**
 * Attach per-socket listeners. Admins can subscribe to a target-type feed
 * to get scoped queue updates (e.g. only listings or only reviews).
 */
function attach(io) {
  io.on('connection', (socket) => {
    const { role } = socket.user || {};
    const isAdmin = role === 'admin' || role === 'super_admin';

    socket.on('moderation:subscribe', ({ targetType } = {}, ack) => {
      if (!isAdmin) {
        if (typeof ack === 'function') ack({ error: 'FORBIDDEN' });
        return;
      }
      const roomName = targetType ? `moderation:${targetType}` : 'moderation:all';
      socket.join(roomName);
      if (typeof ack === 'function') ack({ ok: true, room: roomName });
    });

    socket.on('moderation:unsubscribe', ({ targetType } = {}, ack) => {
      const roomName = targetType ? `moderation:${targetType}` : 'moderation:all';
      socket.leave(roomName);
      if (typeof ack === 'function') ack({ ok: true });
    });
  });

  logger.info('[sockets:moderation] attached');
}

// --- Public emitters -------------------------------------------------------

/**
 * Emit a moderation event.
 * - Owner gets a private update if their content was acted on.
 * - Admins in role room + target-specific room get the queue delta.
 * @param {string} event — one of MODERATION_SOCKET_EVENTS
 * @param {Object} params — see buildModerationEvent
 * @param {{ notifyOwner?: boolean, queueDelta?: { pending?: number } }} [opts]
 */
function emitModerationEvent(event, params, opts = {}) {
  try {
    const evt = buildModerationEvent(event, params);
    emitToRole('admin', evt.event, evt.payload);

    // Target-specific room (e.g. only listing admins see listing events)
    const roomName = params.targetType ? `moderation:${params.targetType}` : 'moderation:all';
    emitToRoom(roomName, evt.event, evt.payload);

    // Owner side (their account page / notification inbox)
    if (opts.notifyOwner !== false && params.ownerId) {
      emitToUser(params.ownerId, evt.event, evt.payload);
    }

    // Queue depth update for badges
    if (opts.queueDelta) {
      emitToRole('admin', MODERATION_SOCKET_EVENTS.QUEUE_UPDATED, {
        targetType: params.targetType || 'all',
        delta: opts.queueDelta,
        at: new Date().toISOString(),
      });
    }

    return evt.payload;
  } catch (err) {
    logger.error('[sockets:moderation] emit error', { message: err.message });
    return null;
  }
}

/**
 * Helper for the admin dashboard's queue summary — called after batch operations.
 */
function emitQueueSnapshot({ counts }) {
  emitToRole('admin', MODERATION_SOCKET_EVENTS.QUEUE_UPDATED, {
    targetType: 'all',
    counts: counts || {},
    at: new Date().toISOString(),
  });
}

// Internal — emit to a specific room (avoids exposing io directly).
const { getIO } = require('../config/socket');
function emitToRoom(roomName, event, payload) {
  const io = getIO();
  if (!io) return;
  io.to(roomName).emit(event, payload);
}

module.exports = {
  attach,
  emitModerationEvent,
  emitQueueSnapshot,
};