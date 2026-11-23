// server/src/shared/events/moderationEvents.js
// Events for listing/content/review moderation (SRS §5.10, FR-ADMIN-006,
// FR-REVIEW-004). Emitted when moderation status changes; consumed by
// moderation queues, admin dashboards, notifications.

'use strict';

const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');

const MODERATION_SOCKET_EVENTS = Object.freeze({
  LISTING_SUBMITTED: 'moderation:listing_submitted',
  LISTING_APPROVED: 'moderation:listing_approved',
  LISTING_REJECTED: 'moderation:listing_rejected',
  LISTING_CHANGES_REQUESTED: 'moderation:listing_changes_requested',
  LISTING_REMOVED: 'moderation:listing_removed',
  CONTENT_REPORTED: 'moderation:content_reported',
  CONTENT_REMOVED: 'moderation:content_removed',
  REVIEW_REPORTED: 'moderation:review_reported',
  REVIEW_REMOVED: 'moderation:review_removed',
  QUEUE_UPDATED: 'moderation:queue_updated',
});

// Domain entity types affected by moderation.
const MODERATION_TARGETS = Object.freeze({
  LISTING: 'listing',
  ARTICLE: 'article',
  COMMENT: 'comment',
  REVIEW: 'review',
});

// Notification mapping — which notification types are triggered.
const MODERATION_NOTIFICATION_MAP = Object.freeze({
  [MODERATION_SOCKET_EVENTS.LISTING_SUBMITTED]: NOTIFICATION_TYPES.LISTING_SUBMITTED,
  [MODERATION_SOCKET_EVENTS.LISTING_APPROVED]: NOTIFICATION_TYPES.LISTING_APPROVED,
  [MODERATION_SOCKET_EVENTS.LISTING_REJECTED]: NOTIFICATION_TYPES.LISTING_REJECTED,
  [MODERATION_SOCKET_EVENTS.LISTING_CHANGES_REQUESTED]: NOTIFICATION_TYPES.LISTING_CHANGES_REQUESTED,
  [MODERATION_SOCKET_EVENTS.LISTING_REMOVED]: NOTIFICATION_TYPES.LISTING_REMOVED,
  [MODERATION_SOCKET_EVENTS.REVIEW_REMOVED]: NOTIFICATION_TYPES.REVIEW_REMOVED,
  [MODERATION_SOCKET_EVENTS.CONTENT_REPORTED]: NOTIFICATION_TYPES.ADMIN_NEW_REPORTED_CONTENT,
  [MODERATION_SOCKET_EVENTS.REVIEW_REPORTED]: NOTIFICATION_TYPES.ADMIN_NEW_REPORTED_CONTENT,
});

/**
 * Build a moderation event payload. Emitted to:
 *  - the owner's user room (for listing/verification approval decisions)
 *  - the admin room (for queue updates + new reports)
 */
function buildModerationEvent(event, {
  targetType,
  targetId,
  ownerId,
  moderatorId,
  reason,
  reasonCode,
  changes,
}) {
  return {
    event,
    emittedAt: new Date().toISOString(),
    payload: {
      targetType,
      targetId: String(targetId),
      ownerId: ownerId ? String(ownerId) : null,
      moderatorId: moderatorId ? String(moderatorId) : null,
      reason: reason || null,
      reasonCode: reasonCode || null,
      changes: changes || null,
    },
  };
}

module.exports = {
  MODERATION_SOCKET_EVENTS,
  MODERATION_TARGETS,
  MODERATION_NOTIFICATION_MAP,
  buildModerationEvent,
};