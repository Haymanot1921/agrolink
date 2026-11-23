// server/src/shared/constants/auditEventTypes.js
// Canonical audit event names (BR-009, FR-ADMIN-014/015, SRS §15.3).
// Used by shared/utils/auditLogger.js and audit-logs module filters.
// Format: <domain>.<entity>.<verb>

'use strict';

const AUDIT_EVENT_TYPES = Object.freeze({
  // --- Auth & session ---------------------------------------------------
  AUTH_LOGIN_SUCCESS: 'auth.login.success',
  AUTH_LOGIN_FAILED: 'auth.login.failed',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_TOKEN_REFRESH: 'auth.token.refresh',
  AUTH_PASSWORD_CHANGED: 'auth.password.changed',
  AUTH_PASSWORD_RESET_REQUESTED: 'auth.password.reset_requested',
  AUTH_PASSWORD_RESET_COMPLETED: 'auth.password.reset_completed',
  AUTH_MFA_ENABLED: 'auth.mfa.enabled',
  AUTH_MFA_DISABLED: 'auth.mfa.disabled',
  AUTH_MFA_STEP_UP: 'auth.mfa.step_up',

  // --- Users ------------------------------------------------------------
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_SUSPENDED: 'user.suspended',
  USER_REACTIVATED: 'user.reactivated',
  USER_ROLE_CHANGED: 'user.role.changed',
  USER_STATUS_CHANGED: 'user.status.changed',
  USER_EMAIL_CHANGED: 'user.email.changed',
  USER_PHONE_CHANGED: 'user.phone.changed',
  USER_PASSWORD_RESET_BY_ADMIN: 'user.password.reset_by_admin',
  USER_EXPORTED: 'user.exported',

  // --- Access control ---------------------------------------------------
  ROLE_CREATED: 'access_control.role.created',
  ROLE_UPDATED: 'access_control.role.updated',
  ROLE_DELETED: 'access_control.role.deleted',
  ROLE_PERMISSIONS_CHANGED: 'access_control.role.permissions_changed',
  ROLE_ASSIGNED: 'access_control.role.assigned',
  ROLE_REVOKED: 'access_control.role.revoked',

  // --- Verification -----------------------------------------------------
  VERIFICATION_SUBMITTED: 'verification.submitted',
  VERIFICATION_APPROVED: 'verification.approved',
  VERIFICATION_REJECTED: 'verification.rejected',
  VERIFICATION_INFO_REQUESTED: 'verification.info_requested',

  // --- Listings ---------------------------------------------------------
  LISTING_CREATED: 'listing.created',
  LISTING_UPDATED: 'listing.updated',
  LISTING_DELETED: 'listing.deleted',
  LISTING_APPROVED: 'listing.approved',
  LISTING_REJECTED: 'listing.rejected',
  LISTING_CHANGES_REQUESTED: 'listing.changes_requested',
  LISTING_REMOVED: 'listing.removed',
  LISTING_REPORTED: 'listing.reported',

  // --- Content & reviews ------------------------------------------------
  CONTENT_REMOVED: 'content.removed',
  CONTENT_REPORTED: 'content.reported',
  REVIEW_REMOVED: 'review.removed',
  REVIEW_REPORTED: 'review.reported',

  // --- Categories & articles --------------------------------------------
  CATEGORY_CREATED: 'category.created',
  CATEGORY_UPDATED: 'category.updated',
  CATEGORY_DEACTIVATED: 'category.deactivated',
  ARTICLE_CREATED: 'article.created',
  ARTICLE_UPDATED: 'article.updated',
  ARTICLE_PUBLISHED: 'article.published',
  ARTICLE_DEACTIVATED: 'article.deactivated',

  // --- Market info ------------------------------------------------------
  MARKET_PRICE_CREATED: 'market_info.price.created',
  MARKET_PRICE_UPDATED: 'market_info.price.updated',
  MARKET_PRICE_DEACTIVATED: 'market_info.price.deactivated',
  MARKET_SOURCE_CREATED: 'market_info.source.created',
  MARKET_SOURCE_UPDATED: 'market_info.source.updated',

  // --- Orders & payments ------------------------------------------------
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_CHANGED: 'order.status.changed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_COMPLETED: 'order.completed',
  PAYMENT_RECORDED: 'payment.recorded',
  PAYMENT_REFUND_REQUESTED: 'payment.refund.requested',
  PAYMENT_REFUND_PROCESSED: 'payment.refund.processed',

  // --- Consultations ----------------------------------------------------
  CONSULTATION_REQUESTED: 'consultation.requested',
  CONSULTATION_ACCEPTED: 'consultation.accepted',
  CONSULTATION_SCHEDULED: 'consultation.scheduled',
  CONSULTATION_CANCELLED: 'consultation.cancelled',
  CONSULTATION_COMPLETED: 'consultation.completed',

  // --- Disputes ---------------------------------------------------------
  DISPUTE_OPENED: 'dispute.opened',
  DISPUTE_ASSIGNED: 'dispute.assigned',
  DISPUTE_EVIDENCE_REQUESTED: 'dispute.evidence_requested',
  DISPUTE_RESOLVED: 'dispute.resolved',
  DISPUTE_ESCALATED: 'dispute.escalated',
  DISPUTE_WITHDRAWN: 'dispute.withdrawn',

  // --- Support tickets --------------------------------------------------
  TICKET_CREATED: 'ticket.created',
  TICKET_ASSIGNED: 'ticket.assigned',
  TICKET_REASSIGNED: 'ticket.reassigned',
  TICKET_ESCALATED: 'ticket.escalated',
  TICKET_RESOLVED: 'ticket.resolved',
  TICKET_CLOSED: 'ticket.closed',

  // --- Assisted farmer monitoring (SRS §6.8) ----------------------------
  CONSENT_REQUESTED: 'assisted.consent.requested',
  CONSENT_GRANTED: 'assisted.consent.granted',
  CONSENT_REVOKED: 'assisted.consent.revoked',
  CONSENT_EXPIRED: 'assisted.consent.expired',
  ASSISTED_ACTION_PERFORMED: 'assisted.action.performed',
  ASSISTED_ACTION_REVIEWED: 'assisted.action.reviewed',
  ASSISTED_ACTION_FLAGGED: 'assisted.action.flagged',
  ASSISTED_SUSPICIOUS_ACTIVITY: 'assisted.suspicious_activity',

  // --- Platform configuration -------------------------------------------
  CONFIG_UPDATED: 'config.updated',
  CONFIG_MAINTENANCE_ENABLED: 'config.maintenance.enabled',
  CONFIG_MAINTENANCE_DISABLED: 'config.maintenance.disabled',
  CONFIG_NOTIFICATIONS_UPDATED: 'config.notifications.updated',

  // --- Admin profile & notifications ------------------------------------
  ADMIN_PROFILE_UPDATED: 'admin.profile.updated',
  ADMIN_NOTIFICATION_PREFS_UPDATED: 'admin.notification_prefs.updated',

  // --- Reports ----------------------------------------------------------
  REPORT_GENERATED: 'report.generated',
  REPORT_EXPORTED: 'report.exported',

  // --- Audit logs -------------------------------------------------------
  AUDIT_LOG_EXPORTED: 'audit.log.exported',
  AUDIT_LOG_ACCESSED: 'audit.log.accessed',

  // --- Security ---------------------------------------------------------
  SECURITY_SUSPICIOUS_LOGIN: 'security.suspicious_login',
  SECURITY_UNAUTHORIZED_ACCESS: 'security.unauthorized_access',
  SECURITY_RATE_LIMIT_HIT: 'security.rate_limit_hit',
  SECURITY_PERMISSION_DENIED: 'security.permission_denied',
  SECURITY_DATA_EXPORT: 'security.data_export',
});

const AUDIT_EVENT_TYPE_LIST = Object.freeze(Object.values(AUDIT_EVENT_TYPES));

// High-severity events: must include a reason and are never batched.
const HIGH_SEVERITY_EVENTS = Object.freeze([
  AUDIT_EVENT_TYPES.USER_SUSPENDED,
  AUDIT_EVENT_TYPES.USER_ROLE_CHANGED,
  AUDIT_EVENT_TYPES.USER_DELETED,
  AUDIT_EVENT_TYPES.USER_PASSWORD_RESET_BY_ADMIN,
  AUDIT_EVENT_TYPES.ROLE_PERMISSIONS_CHANGED,
  AUDIT_EVENT_TYPES.ROLE_ASSIGNED,
  AUDIT_EVENT_TYPES.ROLE_REVOKED,
  AUDIT_EVENT_TYPES.VERIFICATION_APPROVED,
  AUDIT_EVENT_TYPES.VERIFICATION_REJECTED,
  AUDIT_EVENT_TYPES.LISTING_REMOVED,
  AUDIT_EVENT_TYPES.REVIEW_REMOVED,
  AUDIT_EVENT_TYPES.CONTENT_REMOVED,
  AUDIT_EVENT_TYPES.DISPUTE_RESOLVED,
  AUDIT_EVENT_TYPES.DISPUTE_REFUND_PROCESSED,
  AUDIT_EVENT_TYPES.PAYMENT_REFUND_PROCESSED,
  AUDIT_EVENT_TYPES.CONFIG_UPDATED,
  AUDIT_EVENT_TYPES.CONFIG_MAINTENANCE_ENABLED,
  AUDIT_EVENT_TYPES.CONSENT_REVOKED,
  AUDIT_EVENT_TYPES.ASSISTED_SUSPICIOUS_ACTIVITY,
  AUDIT_EVENT_TYPES.SECURITY_UNAUTHORIZED_ACCESS,
  AUDIT_EVENT_TYPES.SECURITY_DATA_EXPORT,
]);

// Category for each event prefix (used for filtering in audit-logs UI).
const AUDIT_CATEGORIES = Object.freeze({
  AUTH: 'auth',
  USER: 'user',
  ACCESS_CONTROL: 'access_control',
  VERIFICATION: 'verification',
  LISTING: 'listing',
  CONTENT: 'content',
  REVIEW: 'review',
  CATEGORY: 'category',
  ARTICLE: 'article',
  MARKET_INFO: 'market_info',
  ORDER: 'order',
  PAYMENT: 'payment',
  CONSULTATION: 'consultation',
  DISPUTE: 'dispute',
  TICKET: 'ticket',
  ASSISTED: 'assisted',
  CONFIG: 'config',
  ADMIN: 'admin',
  REPORT: 'report',
  AUDIT: 'audit',
  SECURITY: 'security',
});

const AUDIT_CATEGORY_LIST = Object.freeze(Object.values(AUDIT_CATEGORIES));

function categoryFor(eventType) {
  if (!eventType || typeof eventType !== 'string') return null;
  return eventType.split('.')[0] || null;
}

function isValidEventType(t) {
  return AUDIT_EVENT_TYPE_LIST.includes(t);
}

function isHighSeverity(t) {
  return HIGH_SEVERITY_EVENTS.includes(t);
}

function assertValidEventType(t) {
  if (!isValidEventType(t)) {
    const err = new Error(`Invalid audit event type: ${t}`);
    err.statusCode = 400;
    err.code = 'INVALID_AUDIT_EVENT';
    throw err;
  }
  return t;
}

module.exports = {
  AUDIT_EVENT_TYPES,
  AUDIT_EVENT_TYPE_LIST,
  HIGH_SEVERITY_EVENTS,
  AUDIT_CATEGORIES,
  AUDIT_CATEGORY_LIST,
  categoryFor,
  isValidEventType,
  isHighSeverity,
  assertValidEventType,
};