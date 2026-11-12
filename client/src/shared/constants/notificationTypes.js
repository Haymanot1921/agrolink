// client/src/shared/constants/notificationTypes.js
// Canonical notification event types — mirrors backend notificationEvents.js.
// SRS refs: FR-NOTIFY-001..010.

export const NOTIFICATION_TYPES = Object.freeze({
  // Account
  ACCOUNT_CREATED: 'account.created',
  ACCOUNT_VERIFIED: 'account.verified',
  ACCOUNT_SUSPENDED: 'account.suspended',
  PASSWORD_CHANGED: 'account.password_changed',
  // Orders
  ORDER_PLACED: 'order.placed',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_PREPARING: 'order.preparing',
  ORDER_READY: 'order.ready_for_dispatch',
  ORDER_COMPLETED: 'order.completed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_DISPUTED: 'order.disputed',
  // Consultation
  CONSULTATION_REQUESTED: 'consultation.requested',
  CONSULTATION_ACCEPTED: 'consultation.accepted',
  CONSULTATION_REJECTED: 'consultation.rejected',
  CONSULTATION_RESCHEDULED: 'consultation.rescheduled',
  CONSULTATION_COMPLETED: 'consultation.completed',
  // Support tickets
  TICKET_CREATED: 'ticket.created',
  TICKET_ASSIGNED: 'ticket.assigned',
  TICKET_REPLIED: 'ticket.replied',
  TICKET_RESOLVED: 'ticket.resolved',
  TICKET_ESCALATED: 'ticket.escalated',
  // Reviews / disputes
  REVIEW_RECEIVED: 'review.received',
  REVIEW_REPORTED: 'review.reported',
  DISPUTE_OPENED: 'dispute.opened',
  DISPUTE_UPDATED: 'dispute.updated',
  DISPUTE_RESOLVED: 'dispute.resolved',
  // Moderation
  LISTING_PENDING: 'listing.pending_review',
  LISTING_PUBLISHED: 'listing.published',
  LISTING_REJECTED: 'listing.rejected',
  VERIFICATION_APPROVED: 'verification.approved',
  VERIFICATION_REJECTED: 'verification.rejected',
  VERIFICATION_MORE_INFO: 'verification.more_info_required',
  // Messages
  MESSAGE_RECEIVED: 'message.received',
  // Assisted
  CONSENT_WITHDRAWN: 'assisted.consent_withdrawn',
  CONSENT_EXPIRING: 'assisted.consent_expiring',
  ASSISTED_ACTION_REVIEWED: 'assisted.action_reviewed',
  // System
  MAINTENANCE_SOON: 'system.maintenance_soon',
  SECURITY_ALERT: 'system.security_alert',
});

/** Channels supported by the notification system. */
export const NOTIFICATION_CHANNELS = Object.freeze({
  IN_APP: 'in_app',
  SMS: 'sms',
  EMAIL: 'email',
  PUSH: 'push',
});

/**
 * Map notification type → icon + color tone for the UI notification list.
 */
export const NOTIFICATION_ICONS = Object.freeze({
  'order.placed': { icon: '🛒', tone: 'info' },
  'order.confirmed': { icon: '✅', tone: 'success' },
  'order.completed': { icon: '🎉', tone: 'success' },
  'order.cancelled': { icon: '❌', tone: 'danger' },
  'order.disputed': { icon: '⚠️', tone: 'warning' },
  'consultation.requested': { icon: '📋', tone: 'info' },
  'consultation.accepted': { icon: '✅', tone: 'success' },
  'consultation.completed': { icon: '🎉', tone: 'success' },
  'ticket.created': { icon: '📩', tone: 'info' },
  'ticket.resolved': { icon: '✅', tone: 'success' },
  'ticket.escalated': { icon: '🚨', tone: 'warning' },
  'dispute.opened': { icon: '⚠️', tone: 'warning' },
  'dispute.resolved': { icon: '🤝', tone: 'success' },
  'review.received': { icon: '⭐', tone: 'info' },
  'listing.published': { icon: '🌱', tone: 'success' },
  'listing.rejected': { icon: '🚫', tone: 'danger' },
  'verification.approved': { icon: '✓', tone: 'success' },
  'verification.rejected': { icon: '✕', tone: 'danger' },
  'message.received': { icon: '💬', tone: 'info' },
  'assisted.consent_withdrawn': { icon: '🔒', tone: 'warning' },
  'assisted.action_reviewed': { icon: '📝', tone: 'info' },
  'system.security_alert': { icon: '🛡️', tone: 'danger' },
});

export function notificationIcon(type) {
  return NOTIFICATION_ICONS[type] ?? { icon: '🔔', tone: 'neutral' };
}