// server/src/shared/constants/notificationTypes.js
// Every notification event in the platform (SRS §5.12 FR-NOTIFY-001..010).
// Grouped by domain so both `channels` (in_app / email / sms / push)
// and user preferences reference a stable list.

'use strict';

const NOTIFICATION_TYPES = Object.freeze({
  // Account / auth
  WELCOME: 'account.welcome',
  EMAIL_VERIFIED: 'account.email_verified',
  PASSWORD_CHANGED: 'account.password_changed',
  PASSWORD_RESET: 'account.password_reset',
  LOGIN_FROM_NEW_DEVICE: 'account.login_new_device',
  ACCOUNT_SUSPENDED: 'account.suspended',
  ACCOUNT_REACTIVATED: 'account.reactivated',

  // Identity verification
  VERIFICATION_SUBMITTED: 'verification.submitted',
  VERIFICATION_APPROVED: 'verification.approved',
  VERIFICATION_REJECTED: 'verification.rejected',
  VERIFICATION_INFO_NEEDED: 'verification.info_needed',
  VERIFICATION_EXPIRED: 'verification.expired',

  // Listings
  LISTING_SUBMITTED: 'listing.submitted',
  LISTING_APPROVED: 'listing.approved',
  LISTING_REJECTED: 'listing.rejected',
  LISTING_CHANGES_REQUESTED: 'listing.changes_requested',
  LISTING_REMOVED: 'listing.removed',
  LISTING_EXPIRING_SOON: 'listing.expiring_soon',
  LISTING_EXPIRED: 'listing.expired',

  // Orders
  ORDER_PLACED: 'order.placed',                   // -> farmer
  ORDER_CONFIRMED: 'order.confirmed',             // -> buyer
  ORDER_REJECTED: 'order.rejected',               // -> buyer
  ORDER_PREPARING: 'order.preparing',             // -> buyer
  ORDER_READY: 'order.ready',                     // -> buyer
  ORDER_COMPLETED: 'order.completed',             // -> both
  ORDER_CANCELLED: 'order.cancelled',             // -> both
  ORDER_DISPUTED: 'order.disputed',               // -> both + admin

  // Payments
  PAYMENT_RECORDED: 'payment.recorded',
  REFUND_REQUESTED: 'payment.refund_requested',
  REFUND_PROCESSED: 'payment.refund_processed',

  // Consultations
  CONSULTATION_REQUESTED: 'consultation.requested',   // -> expert
  CONSULTATION_ACCEPTED: 'consultation.accepted',     // -> buyer
  CONSULTATION_DECLINED: 'consultation.declined',     // -> buyer
  CONSULTATION_SCHEDULED: 'consultation.scheduled',   // -> both
  CONSULTATION_REMINDER: 'consultation.reminder',     // -> both (T-30m)
  CONSULTATION_COMPLETED: 'consultation.completed',   // -> both
  CONSULTATION_CANCELLED: 'consultation.cancelled',   // -> both

  // Messages
  MESSAGE_RECEIVED: 'message.received',
  MESSAGE_REPORTED: 'message.reported',

  // Reviews
  REVIEW_RECEIVED: 'review.received',
  REVIEW_REMOVED: 'review.removed',

  // Disputes
  DISPUTE_OPENED: 'dispute.opened',
  DISPUTE_UPDATED: 'dispute.updated',
  DISPUTE_RESOLVED: 'dispute.resolved',
  DISPUTE_EVIDENCE_REQUESTED: 'dispute.evidence_requested',

  // Support tickets
  TICKET_CREATED: 'ticket.created',
  TICKET_ASSIGNED: 'ticket.assigned',
  TICKET_REPLIED: 'ticket.replied',
  TICKET_RESOLVED: 'ticket.resolved',
  TICKET_CLOSED: 'ticket.closed',
  TICKET_ESCALATED: 'ticket.escalated',

  // Assisted farming (SRS §6.8)
  CONSENT_REQUESTED: 'consent.requested',
  CONSENT_GRANTED: 'consent.granted',
  CONSENT_REVOKED: 'consent.revoked',
  CONSENT_EXPIRING: 'consent.expiring',
  ASSISTED_ACTION_PERFORMED: 'assisted.action_performed',
  ASSISTED_ACTION_FLAGGED: 'assisted.action_flagged',

  // Market info
  MARKET_PRICE_UPDATED: 'market_info.price_updated',
  MARKET_PRICE_SOURCE_CHANGED: 'market_info.source_changed',

  // Articles
  ARTICLE_PUBLISHED: 'article.published',
  ARTICLE_UPDATED: 'article.updated',

  // Admin
  ADMIN_SYSTEM_ALERT: 'admin.system_alert',
  ADMIN_NEW_REPORTED_CONTENT: 'admin.new_reported_content',
  ADMIN_NEW_DISPUTE: 'admin.new_dispute',
  ADMIN_NEW_VERIFICATION: 'admin.new_verification',
  ADMIN_DAILY_SUMMARY: 'admin.daily_summary',
  ADMIN_CONFIG_CHANGED: 'admin.config_changed',

  // System
  MAINTENANCE_SCHEDULED: 'system.maintenance_scheduled',
  MAINTENANCE_STARTED: 'system.maintenance_started',
});

const NOTIFICATION_TYPE_LIST = Object.freeze(Object.values(NOTIFICATION_TYPES));

// Delivery channels.
const NOTIFICATION_CHANNELS = Object.freeze({
  IN_APP: 'in_app',
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
});

const NOTIFICATION_CHANNEL_LIST = Object.freeze(Object.values(NOTIFICATION_CHANNELS));

// Priority (affects batching / push behavior).
const NOTIFICATION_PRIORITIES = Object.freeze({
  LOW: 'low',           // can batch
  NORMAL: 'normal',     // immediate in-app, batched email
  HIGH: 'high',         // immediate across channels
  CRITICAL: 'critical', // immediate + audit-logged
});

const NOTIFICATION_PRIORITY_LIST = Object.freeze(Object.values(NOTIFICATION_PRIORITIES));

// Default channel routing per notification type.
const DEFAULT_CHANNELS = Object.freeze({
  [NOTIFICATION_TYPES.WELCOME]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.EMAIL_VERIFIED]: ['in_app'],
  [NOTIFICATION_TYPES.PASSWORD_CHANGED]: ['email'],
  [NOTIFICATION_TYPES.PASSWORD_RESET]: ['email', 'sms'],
  [NOTIFICATION_TYPES.LOGIN_FROM_NEW_DEVICE]: ['email', 'sms'],
  [NOTIFICATION_TYPES.ACCOUNT_SUSPENDED]: ['email'],
  [NOTIFICATION_TYPES.ACCOUNT_REACTIVATED]: ['email'],
  [NOTIFICATION_TYPES.VERIFICATION_APPROVED]: ['in_app', 'email', 'sms'],
  [NOTIFICATION_TYPES.VERIFICATION_REJECTED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.VERIFICATION_INFO_NEEDED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.ORDER_PLACED]: ['in_app', 'email', 'sms'],
  [NOTIFICATION_TYPES.ORDER_CONFIRMED]: ['in_app', 'email', 'sms'],
  [NOTIFICATION_TYPES.ORDER_REJECTED]: ['in_app', 'email', 'sms'],
  [NOTIFICATION_TYPES.ORDER_READY]: ['in_app', 'sms'],
  [NOTIFICATION_TYPES.ORDER_DISPUTED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.PAYMENT_RECORDED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.REFUND_PROCESSED]: ['in_app', 'email', 'sms'],
  [NOTIFICATION_TYPES.CONSULTATION_REQUESTED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.CONSULTATION_SCHEDULED]: ['in_app', 'email', 'sms'],
  [NOTIFICATION_TYPES.CONSULTATION_REMINDER]: ['in_app', 'sms'],
  [NOTIFICATION_TYPES.MESSAGE_RECEIVED]: ['in_app'],
  [NOTIFICATION_TYPES.DISPUTE_OPENED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.DISPUTE_RESOLVED]: ['in_app', 'email', 'sms'],
  [NOTIFICATION_TYPES.TICKET_ASSIGNED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.TICKET_REPLIED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.CONSENT_REQUESTED]: ['in_app', 'sms'],
  [NOTIFICATION_TYPES.CONSENT_EXPIRING]: ['in_app', 'sms', 'email'],
  [NOTIFICATION_TYPES.ASSISTED_ACTION_PERFORMED]: ['in_app', 'sms'],
  [NOTIFICATION_TYPES.ASSISTED_ACTION_FLAGGED]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.ADMIN_NEW_DISPUTE]: ['in_app', 'email'],
  [NOTIFICATION_TYPES.ADMIN_NEW_VERIFICATION]: ['in_app'],
  [NOTIFICATION_TYPES.MAINTENANCE_STARTED]: ['in_app', 'email'],
});

// Types the user CANNOT opt out of (critical security/legal).
const MANDATORY_TYPES = Object.freeze([
  NOTIFICATION_TYPES.PASSWORD_CHANGED,
  NOTIFICATION_TYPES.PASSWORD_RESET,
  NOTIFICATION_TYPES.LOGIN_FROM_NEW_DEVICE,
  NOTIFICATION_TYPES.ACCOUNT_SUSPENDED,
  NOTIFICATION_TYPES.ACCOUNT_REACTIVATED,
  NOTIFICATION_TYPES.VERIFICATION_APPROVED,
  NOTIFICATION_TYPES.VERIFICATION_REJECTED,
  NOTIFICATION_TYPES.DISPUTE_RESOLVED,
  NOTIFICATION_TYPES.CONSENT_REVOKED,
  NOTIFICATION_TYPES.MAINTENANCE_STARTED,
]);

function isValidType(t) {
  return NOTIFICATION_TYPE_LIST.includes(t);
}

function channelsFor(type) {
  return DEFAULT_CHANNELS[type] || ['in_app'];
}

function isMandatory(type) {
  return MANDATORY_TYPES.includes(type);
}

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPE_LIST,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_CHANNEL_LIST,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_PRIORITY_LIST,
  DEFAULT_CHANNELS,
  MANDATORY_TYPES,
  isValidType,
  channelsFor,
  isMandatory,
};