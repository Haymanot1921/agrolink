// server/src/shared/events/disputeEvents.js
// Dispute lifecycle events (SRS §5.15 FR-DISPUTE-001..007).

'use strict';

const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');

const DISPUTE_SOCKET_EVENTS = Object.freeze({
  DISPUTE_OPENED: 'dispute:opened',
  DISPUTE_ASSIGNED: 'dispute:assigned',
  DISPUTE_EVIDENCE_REQUESTED: 'dispute:evidence_requested',
  DISPUTE_EVIDENCE_ADDED: 'dispute:evidence_added',
  DISPUTE_MESSAGE_ADDED: 'dispute:message_added',
  DISPUTE_ESCALATED: 'dispute:escalated',
  DISPUTE_RESOLVED: 'dispute:resolved',
  DISPUTE_WITHDRAWN: 'dispute:withdrawn',
  DISPUTE_UPDATED: 'dispute:updated',
});

const DISPUTE_NOTIFICATION_MAP = Object.freeze({
  [DISPUTE_SOCKET_EVENTS.DISPUTE_OPENED]: NOTIFICATION_TYPES.DISPUTE_OPENED,
  [DISPUTE_SOCKET_EVENTS.DISPUTE_EVIDENCE_REQUESTED]: NOTIFICATION_TYPES.DISPUTE_EVIDENCE_REQUESTED,
  [DISPUTE_SOCKET_EVENTS.DISPUTE_RESOLVED]: NOTIFICATION_TYPES.DISPUTE_RESOLVED,
  [DISPUTE_SOCKET_EVENTS.DISPUTE_UPDATED]: NOTIFICATION_TYPES.DISPUTE_UPDATED,
});

/**
 * @param {Object} params
 * @param {string} params.disputeId
 * @param {string} params.buyerId
 * @param {string} params.farmerId
 * @param {string} [params.adminId]
 * @param {string} [params.orderId]
 * @param {string} [params.status]
 * @param {string} [params.category]
 * @param {Object} [params.resolution] — { type, amountMinor?, notes? }
 * @param {string} [params.reason]
 */
function buildDisputeEvent(event, params) {
  const {
    disputeId,
    buyerId,
    farmerId,
    adminId,
    orderId,
    status,
    category,
    resolution,
    reason,
  } = params || {};

  return {
    event,
    emittedAt: new Date().toISOString(),
    payload: {
      disputeId: String(disputeId),
      buyerId: buyerId ? String(buyerId) : null,
      farmerId: farmerId ? String(farmerId) : null,
      adminId: adminId ? String(adminId) : null,
      orderId: orderId ? String(orderId) : null,
      status: status || null,
      category: category || null,
      resolution: resolution || null,
      reason: reason || null,
    },
  };
}

/**
 * Which user rooms should receive a dispute event.
 * Admin events additionally go to the admin role room.
 */
function recipientsFor(event, payload) {
  const rooms = new Set();
  if (payload.buyerId) rooms.add(`user:${payload.buyerId}`);
  if (payload.farmerId) rooms.add(`user:${payload.farmerId}`);
  if (payload.adminId) rooms.add(`user:${payload.adminId}`);
  // Admin oversight events
  const adminScoped = [
    DISPUTE_SOCKET_EVENTS.DISPUTE_OPENED,
    DISPUTE_SOCKET_EVENTS.DISPUTE_ESCALATED,
    DISPUTE_SOCKET_EVENTS.DISPUTE_EVIDENCE_ADDED,
    DISPUTE_SOCKET_EVENTS.DISPUTE_RESOLVED,
  ];
  if (adminScoped.includes(event)) rooms.add('role:admin');
  return Array.from(rooms);
}

module.exports = {
  DISPUTE_SOCKET_EVENTS,
  DISPUTE_NOTIFICATION_MAP,
  buildDisputeEvent,
  recipientsFor,
};