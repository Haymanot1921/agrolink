// server/src/shared/events/assistedFarmerEvents.js
// SRS §6.8 — events for the assisted-farmer workflow. Covers consent
// changes, assisted actions, and suspicious-activity flags.

'use strict';

const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');
const {
  ASSISTED_ACTION_TYPES,
  riskLevel,
} = require('../constants/assistedActionTypes');

const ASSISTED_SOCKET_EVENTS = Object.freeze({
  CONSENT_REQUESTED: 'assisted:consent_requested',
  CONSENT_GRANTED: 'assisted:consent_granted',
  CONSENT_REVOKED: 'assisted:consent_revoked',
  CONSENT_EXPIRING: 'assisted:consent_expiring',
  ACTION_PERFORMED: 'assisted:action_performed',
  ACTION_FLAGGED: 'assisted:action_flagged',
  ACTION_REVIEWED: 'assisted:action_reviewed',
  SUSPICIOUS_ACTIVITY: 'assisted:suspicious_activity',
});

const ASSISTED_NOTIFICATION_MAP = Object.freeze({
  [ASSISTED_SOCKET_EVENTS.CONSENT_REQUESTED]: NOTIFICATION_TYPES.CONSENT_REQUESTED,
  [ASSISTED_SOCKET_EVENTS.CONSENT_GRANTED]: NOTIFICATION_TYPES.CONSENT_GRANTED,
  [ASSISTED_SOCKET_EVENTS.CONSENT_REVOKED]: NOTIFICATION_TYPES.CONSENT_REVOKED,
  [ASSISTED_SOCKET_EVENTS.CONSENT_EXPIRING]: NOTIFICATION_TYPES.CONSENT_EXPIRING,
  [ASSISTED_SOCKET_EVENTS.ACTION_PERFORMED]: NOTIFICATION_TYPES.ASSISTED_ACTION_PERFORMED,
  [ASSISTED_SOCKET_EVENTS.ACTION_FLAGGED]: NOTIFICATION_TYPES.ASSISTED_ACTION_FLAGGED,
  [ASSISTED_SOCKET_EVENTS.SUSPICIOUS_ACTIVITY]: NOTIFICATION_TYPES.ASSISTED_ACTION_FLAGGED,
});

/**
 * @param {Object} params
 * @param {string} params.farmerId
 * @param {string} params.agentId
 * @param {string} [params.consentId]
 * @param {string} [params.actionId]
 * @param {string} [params.actionType]
 * @param {Object} [params.actionPayload]
 * @param {string} [params.reason] — for flagged/suspicious
 * @param {Object} [params.evidence] — heuristic details
 * @param {string} [params.adminId]
 */
function buildAssistedEvent(event, params) {
  const {
    farmerId,
    agentId,
    consentId,
    actionId,
    actionType,
    actionPayload,
    reason,
    evidence,
    adminId,
  } = params || {};

  return {
    event,
    emittedAt: new Date().toISOString(),
    payload: {
      farmerId: farmerId ? String(farmerId) : null,
      agentId: agentId ? String(agentId) : null,
      consentId: consentId ? String(consentId) : null,
      actionId: actionId ? String(actionId) : null,
      actionType: actionType || null,
      actionRisk: actionType ? riskLevel(actionType) : null,
      actionPayload: sanitizeActionPayload(actionPayload),
      reason: reason || null,
      evidence: evidence || null,
      adminId: adminId ? String(adminId) : null,
    },
  };
}

function sanitizeActionPayload(payload) {
  if (!payload || typeof payload !== 'object') return null;
  // Never leak full documents/PII — only identifiers + short summary.
  return {
    entityId: payload.entityId ? String(payload.entityId) : null,
    entityType: payload.entityType || null,
    summary:
      typeof payload.summary === 'string' ? payload.summary.slice(0, 500) : null,
  };
}

/**
 * Which user rooms should receive the event.
 *  - Farmer always notified of consent changes and own data being modified.
 *  - Agent always notified of consent decisions.
 *  - Admins notified on flagged/suspicious actions only.
 */
function recipientsFor(event, payload) {
  const rooms = new Set();
  if (payload.farmerId) rooms.add(`user:${payload.farmerId}`);
  if (payload.agentId) rooms.add(`user:${payload.agentId}`);
  if (payload.adminId) rooms.add(`user:${payload.adminId}`);

  const adminScoped = [
    ASSISTED_SOCKET_EVENTS.CONSENT_REQUESTED,
    ASSISTED_SOCKET_EVENTS.ACTION_FLAGGED,
    ASSISTED_SOCKET_EVENTS.SUSPICIOUS_ACTIVITY,
  ];
  if (adminScoped.includes(event)) rooms.add('role:admin');
  return Array.from(rooms);
}

// High-risk action types get priority 'high' in notification dispatch.
function priorityFor(event, payload) {
  if (event === ASSISTED_SOCKET_EVENTS.SUSPICIOUS_ACTIVITY) return 'critical';
  if (event === ASSISTED_SOCKET_EVENTS.ACTION_FLAGGED) return 'high';
  if (payload.actionType && riskLevel(payload.actionType) === 'high') return 'high';
  return 'normal';
}

// Guard: ensures event names stay in sync with the assistedActionTypes list.
function isValidActionEventPair(event, actionType) {
  if (!actionType) return true;
  if (!Object.values(ASSISTED_ACTION_TYPES).includes(actionType)) return false;
  return true;
}

module.exports = {
  ASSISTED_SOCKET_EVENTS,
  ASSISTED_NOTIFICATION_MAP,
  buildAssistedEvent,
  recipientsFor,
  priorityFor,
  isValidActionEventPair,
};