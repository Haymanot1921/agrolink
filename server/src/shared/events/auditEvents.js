// server/src/shared/events/auditEvents.js
// Bridges high-severity audit events (BR-009, FR-ADMIN-015) to the admin
// security-events stream. Separate from `shared/utils/auditLogger.js` — that
// writes to the DB; this file emits real-time notifications for admins.

'use strict';

const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');
const {
  AUDIT_EVENT_TYPES,
  AUDIT_CATEGORIES,
  categoryFor,
  isHighSeverity,
} = require('../constants/auditEventTypes');

// Live socket events for the admin "Security & Audit" panel.
const AUDIT_SOCKET_EVENTS = Object.freeze({
  AUDIT_WRITTEN: 'audit:written',
  SECURITY_ALERT: 'audit:security_alert',
  HIGH_SEVERITY: 'audit:high_severity',
});

// Which audit event types surface as user-facing admin notifications.
const AUDIT_NOTIFICATION_MAP = Object.freeze({
  [AUDIT_EVENT_TYPES.USER_SUSPENDED]: NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT,
  [AUDIT_EVENT_TYPES.USER_ROLE_CHANGED]: NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT,
  [AUDIT_EVENT_TYPES.CONFIG_UPDATED]: NOTIFICATION_TYPES.ADMIN_CONFIG_CHANGED,
  [AUDIT_EVENT_TYPES.CONFIG_MAINTENANCE_ENABLED]: NOTIFICATION_TYPES.MAINTENANCE_STARTED,
  [AUDIT_EVENT_TYPES.CONFIG_MAINTENANCE_DISABLED]: NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT,
  [AUDIT_EVENT_TYPES.DISPUTE_OPENED]: NOTIFICATION_TYPES.ADMIN_NEW_DISPUTE,
  [AUDIT_EVENT_TYPES.VERIFICATION_SUBMITTED]: NOTIFICATION_TYPES.ADMIN_NEW_VERIFICATION,
  [AUDIT_EVENT_TYPES.LISTING_REPORTED]: NOTIFICATION_TYPES.ADMIN_NEW_REPORTED_CONTENT,
  [AUDIT_EVENT_TYPES.REVIEW_REPORTED]: NOTIFICATION_TYPES.ADMIN_NEW_REPORTED_CONTENT,
  [AUDIT_EVENT_TYPES.CONTENT_REPORTED]: NOTIFICATION_TYPES.ADMIN_NEW_REPORTED_CONTENT,
  [AUDIT_EVENT_TYPES.SECURITY_SUSPICIOUS_LOGIN]: NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT,
  [AUDIT_EVENT_TYPES.SECURITY_UNAUTHORIZED_ACCESS]: NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT,
  [AUDIT_EVENT_TYPES.ASSISTED_SUSPICIOUS_ACTIVITY]: NOTIFICATION_TYPES.ASSISTED_ACTION_FLAGGED,
});

/**
 * Build a real-time payload from an audit entry produced by
 * `shared/utils/auditLogger.js`. Never includes secrets — the entry is
 * already sanitized before it reaches this function.
 *
 * @param {Object} entry — the audit log document (or the object returned
 *   by writeAudit)
 * @param {string} [eventType] — override socket event; default is derived
 *   from entry.severity and entry.outcome.
 */
function buildAuditEvent(entry, eventType) {
  if (!entry || !entry.action) {
    throw new Error('auditEvents: entry.action is required');
  }
  const resolvedEvent =
    eventType ||
    (isHighSeverity(entry.action)
      ? AUDIT_SOCKET_EVENTS.HIGH_SEVERITY
      : AUDIT_SOCKET_EVENTS.AUDIT_WRITTEN);

  return {
    event: resolvedEvent,
    emittedAt: new Date().toISOString(),
    payload: {
      action: entry.action,
      category: entry.category || categoryFor(entry.action),
      severity: entry.severity || 'low',
      outcome: entry.outcome || 'success',
      actorId: entry.actorId ? String(entry.actorId) : null,
      actorRole: entry.actorRole || null,
      targetType: entry.targetType || null,
      targetId: entry.targetId ? String(entry.targetId) : null,
      reason: entry.reason || null,
      requestId: entry.requestId || null,
      ip: entry.ip || null,
      timestamp: entry.timestamp || new Date().toISOString(),
    },
  };
}

/**
 * Only admins should receive audit socket events. If the entry is a
 * high-severity security event, also target super_admins (future-proof).
 */
function recipientsFor() {
  return ['role:admin'];
}

/**
 * Priority is driven by the audit event's severity.
 */
function priorityFor(entry) {
  if (!entry) return 'normal';
  if (entry.severity === 'high' || isHighSeverity(entry.action)) return 'critical';
  if (entry.severity === 'medium') return 'high';
  return 'normal';
}

/**
 * Whether an audit entry should surface a user-facing notification
 * (returned as NOTIFICATION_TYPES key or null).
 */
function notificationTypeFor(entry) {
  if (!entry || !entry.action) return null;
  return AUDIT_NOTIFICATION_MAP[entry.action] || null;
}

/**
 * Convenience: is this event category one of the "security" streams?
 */
function isSecurityEvent(entry) {
  if (!entry) return false;
  if (entry.category === AUDIT_CATEGORIES.SECURITY) return true;
  return Boolean(entry.action && entry.action.startsWith('security.'));
}

module.exports = {
  AUDIT_SOCKET_EVENTS,
  AUDIT_NOTIFICATION_MAP,
  buildAuditEvent,
  recipientsFor,
  priorityFor,
  notificationTypeFor,
  isSecurityEvent,
};