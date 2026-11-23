// server/src/shared/events/notificationEvents.js
// Contract for real-time notification delivery (SRS §5.12). The
// notifications service emits through sockets/getIO and adapter channels.

'use strict';

const {
  NOTIFICATION_TYPES,
  channelsFor,
  isMandatory,
  NOTIFICATION_CHANNELS,
} = require('../constants/notificationTypes');

// Socket event names.
const NOTIFICATION_SOCKET_EVENTS = Object.freeze({
  NEW_NOTIFICATION: 'notification:new',
  BADGE_COUNT: 'notification:badge_count',
  MARKED_READ: 'notification:marked_read',
  READ_ALL: 'notification:read_all',
  PREFERENCES_UPDATED: 'notification:preferences_updated',
  DELETED: 'notification:deleted',
});

// Outbound user-facing notifications (delivered via socket + channel adapters).
// Inbound is just notify(userId, event, payload).

/**
 * Normalize a notification dispatch request.
 * @param {Object} params
 * @param {string} params.userId — recipient
 * @param {string} params.type — one of NOTIFICATION_TYPES
 * @param {string} [params.title]
 * @param {string} [params.body]
 * @param {Object} [params.data] — deep-link metadata
 * @param {string[]} [params.channels] — override channelsFor(type)
 * @param {string} [params.priority]
 * @param {string} [params.language] — 'en' | 'am'
 */
function buildNotificationPayload({
  userId,
  type,
  title,
  body,
  data,
  channels,
  priority = 'normal',
  language = 'en',
}) {
  if (!userId || !type) {
    throw new Error('notificationEvents: userId and type are required');
  }

  const effectiveChannels = channels && channels.length ? channels : channelsFor(type);

  return {
    userId: String(userId),
    type,
    title: title || null,
    body: body || null,
    data: data || {},
    channels: effectiveChannels.filter((c) => Object.values(NOTIFICATION_CHANNELS).includes(c)),
    priority,
    isMandatory: isMandatory(type),
    language,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Preset builders for common notification types — saves boilerplate in services.
 */
const templates = {
  orderPlaced: ({ buyerName, orderId }) => ({
    type: NOTIFICATION_TYPES.ORDER_PLACED,
    title: 'New order received',
    body: `${buyerName || 'A buyer'} placed an order`,
    data: { orderId, deepLink: `/orders/${orderId}` },
  }),
  orderConfirmed: ({ orderId }) => ({
    type: NOTIFICATION_TYPES.ORDER_CONFIRMED,
    title: 'Order confirmed',
    body: 'The farmer confirmed your order',
    data: { orderId, deepLink: `/orders/${orderId}` },
  }),
  messageReceived: ({ conversationId, senderName }) => ({
    type: NOTIFICATION_TYPES.MESSAGE_RECEIVED,
    title: 'New message',
    body: `Message from ${senderName || 'a user'}`,
    data: { conversationId, deepLink: `/messages/${conversationId}` },
  }),
  disputeResolved: ({ disputeId, outcome }) => ({
    type: NOTIFICATION_TYPES.DISPUTE_RESOLVED,
    title: 'Dispute resolved',
    body: `Resolution: ${outcome || 'see details'}`,
    data: { disputeId, deepLink: `/disputes/${disputeId}` },
  }),
  verificationApproved: () => ({
    type: NOTIFICATION_TYPES.VERIFICATION_APPROVED,
    title: 'Identity verified',
    body: 'Your identity verification was approved',
    data: { deepLink: '/profile/verification' },
  }),
};

module.exports = {
  NOTIFICATION_SOCKET_EVENTS,
  buildNotificationPayload,
  templates,
};