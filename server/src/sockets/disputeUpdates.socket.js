// server/src/sockets/disputeUpdates.socket.js
// Real-time dispute updates (SRS §5.15).
// - Buyer, farmer, assigned admin, and the admin role room all receive
//   status/evidence/message updates.
// - Supports per-dispute rooms so parties can chat without noise.
// Mirrors shared/events/disputeEvents.js.

'use strict';

const { emitToUser, emitToRole, getIO } = require('../config/socket');
const logger = require('../config/logger');
const {
  DISPUTE_SOCKET_EVENTS,
  buildDisputeEvent,
  recipientsFor,
} = require('../shared/events/disputeEvents');

// Room naming convention
const DISPUTE_ROOM = (id) => `dispute:${id}`;
const ADMIN_ROOM = 'role:admin';

/**
 * Attach per-socket listeners.
 * Any authenticated user who is a party to a dispute can join its room.
 * Authorization check happens here — not trusting client-supplied roles.
 */
function attach(io) {
  io.on('connection', (socket) => {
    const { _id: userId, role } = socket.user || {};
    const isAdmin = role === 'admin' || role === 'super_admin';

    socket.on('dispute:join', async ({ disputeId } = {}, ack) => {
      try {
        if (!disputeId) {
          if (typeof ack === 'function') ack({ error: 'MISSING_ID' });
          return;
        }
        const allowed = isAdmin || (await isPartyToDispute(userId, disputeId));
        if (!allowed) {
          if (typeof ack === 'function') ack({ error: 'FORBIDDEN' });
          return;
        }
        const room = DISPUTE_ROOM(disputeId);
        socket.join(room);
        if (typeof ack === 'function') ack({ ok: true, room });
      } catch (err) {
        logger.error('[sockets:dispute] join error', { message: err.message });
        if (typeof ack === 'function') ack({ error: 'JOIN_FAILED' });
      }
    });

    socket.on('dispute:leave', ({ disputeId } = {}, ack) => {
      if (!disputeId) {
        if (typeof ack === 'function') ack({ error: 'MISSING_ID' });
        return;
      }
      socket.leave(DISPUTE_ROOM(disputeId));
      if (typeof ack === 'function') ack({ ok: true });
    });

    socket.on('dispute:typing', ({ disputeId } = {}) => {
      if (!disputeId || !userId) return;
      const ioRef = getIO();
      if (!ioRef) return;
      socket.to(DISPUTE_ROOM(disputeId)).emit('dispute:typing', {
        disputeId,
        userId,
        at: new Date().toISOString(),
      });
    });
  });

  logger.info('[sockets:dispute] attached');
}

// --- Authorization helper --------------------------------------------------

async function isPartyToDispute(userId, disputeId) {
  try {
    // eslint-disable-next-line global-require
    const disputesRepo = require('../modules/administrator/disputes-management/disputes.repository');
    const dispute = await disputesRepo.findById(disputeId);
    if (!dispute) return false;
    return (
      String(dispute.buyerId) === String(userId) ||
      String(dispute.farmerId) === String(userId) ||
      (dispute.assignedAdminId && String(dispute.assignedAdminId) === String(userId))
    );
  } catch (err) {
    logger.error('[sockets:dispute] party check failed', { message: err.message });
    return false;
  }
}

// --- Public emitters -------------------------------------------------------

/**
 * Emit a dispute event. Fan-out rules:
 * - buyer, farmer, assigned admin -> their user rooms
 * - admins -> role room for oversight events
 * - parties -> the per-dispute room (chat/evidence updates)
 *
 * @param {string} event — one of DISPUTE_SOCKET_EVENTS
 * @param {Object} params — see buildDisputeEvent
 * @param {{ broadcastToDisputeRoom?: boolean }} [opts]
 */
function emitDisputeEvent(event, params, opts = {}) {
  try {
    const evt = buildDisputeEvent(event, params);
    const rooms = recipientsFor(evt.event, evt.payload);

    for (const room of rooms) {
      const [kind, id] = room.split(':');
      if (kind === 'user') emitToUser(id, evt.event, evt.payload);
      else if (kind === 'role') emitToRole(id, evt.event, evt.payload);
    }

    // Also broadcast to the per-dispute room (joined by parties + admin)
    if (opts.broadcastToDisputeRoom !== false && params.disputeId) {
      const io = getIO();
      if (io) io.to(DISPUTE_ROOM(params.disputeId)).emit(evt.event, evt.payload);
    }

    return evt.payload;
  } catch (err) {
    logger.error('[sockets:dispute] emit error', { message: err.message });
    return null;
  }
}

/**
 * Convenience wrapper used by dispute message handlers.
 */
function emitDisputeMessage({ disputeId, buyerId, farmerId, adminId, message }) {
  const evt = buildDisputeEvent(DISPUTE_SOCKET_EVENTS.DISPUTE_MESSAGE_ADDED, {
    disputeId,
    buyerId,
    farmerId,
    adminId,
  });
  const io = getIO();
  const payload = {
    ...evt.payload,
    message: {
      id: message && message._id ? String(message._id) : null,
      senderId: message && message.senderId ? String(message.senderId) : null,
      senderRole: message && message.senderRole ? message.senderRole : null,
      body:
        message && typeof message.body === 'string'
          ? message.body.slice(0, 5000)
          : null,
      createdAt: (message && message.createdAt) || new Date().toISOString(),
    },
  };
  if (io) io.to(DISPUTE_ROOM(disputeId)).emit(evt.event, payload);
  // Mirror to each party's personal inbox.
  [buyerId, farmerId, adminId].filter(Boolean).forEach((uid) => {
    emitToUser(uid, evt.event, payload);
  });
  return payload;
}

/**
 * Emit an evidence upload event.
 */
function emitDisputeEvidence({ disputeId, buyerId, farmerId, adminId, uploadedBy, fileCount }) {
  const evt = buildDisputeEvent(DISPUTE_SOCKET_EVENTS.DISPUTE_EVIDENCE_ADDED, {
    disputeId,
    buyerId,
    farmerId,
    adminId,
  });
  const payload = {
    ...evt.payload,
    uploadedBy: uploadedBy ? String(uploadedBy) : null,
    fileCount: fileCount || 1,
    at: new Date().toISOString(),
  };
  const io = getIO();
  if (io) io.to(DISPUTE_ROOM(disputeId)).emit(evt.event, payload);
  emitToRole('admin', evt.event, payload);
  return payload;
}

module.exports = {
  attach,
  emitDisputeEvent,
  emitDisputeMessage,
  emitDisputeEvidence,
  DISPUTE_ROOM,
  ADMIN_ROOM,
};