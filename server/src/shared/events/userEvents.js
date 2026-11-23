// server/src/shared/events/userEvents.js
// Event contracts for user account lifecycle. Consumed by sockets/* for
// real-time admin dashboards and by notifications for channel routing.

'use strict';

const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');

// Socket event names emitted to admin room.
const USER_SOCKET_EVENTS = Object.freeze({
  USER_CREATED: 'user:created',
  USER_UPDATED: 'user:updated',
  USER_SUSPENDED: 'user:suspended',
  USER_REACTIVATED: 'user:reactivated',
  USER_ROLE_CHANGED: 'user:role_changed',
  USER_DELETED: 'user:deleted',
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
});

// Notification mapping — event -> notification type (may be null if none).
const USER_NOTIFICATION_MAP = Object.freeze({
  [USER_SOCKET_EVENTS.USER_CREATED]: NOTIFICATION_TYPES.WELCOME,
  [USER_SOCKET_EVENTS.USER_SUSPENDED]: NOTIFICATION_TYPES.ACCOUNT_SUSPENDED,
  [USER_SOCKET_EVENTS.USER_REACTIVATED]: NOTIFICATION_TYPES.ACCOUNT_REACTIVATED,
  [USER_SOCKET_EVENTS.USER_LOGIN]: NOTIFICATION_TYPES.LOGIN_FROM_NEW_DEVICE,
  [USER_SOCKET_EVENTS.USER_DELETED]: null,
  [USER_SOCKET_EVENTS.USER_UPDATED]: null,
  [USER_SOCKET_EVENTS.USER_ROLE_CHANGED]: null,
  [USER_SOCKET_EVENTS.USER_LOGOUT]: null,
});

/**
 * Build a normalized socket payload.
 * @param {string} event
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} [params.actorId] — admin who triggered the change
 * @param {Object} [params.changes]
 * @param {Object} [params.user] — safe user snapshot (no secrets)
 */
function buildUserEvent(event, { userId, actorId, changes, user }) {
  return {
    event,
    emittedAt: new Date().toISOString(),
    payload: {
      userId,
      actorId: actorId || null,
      changes: changes || null,
      user: sanitizeUser(user),
    },
  };
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: String(user._id || user.id || ''),
    role: user.role,
    status: user.status,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    isEmailVerified: Boolean(user.isEmailVerified),
    isPhoneVerified: Boolean(user.isPhoneVerified),
    createdAt: user.createdAt,
  };
}

module.exports = {
  USER_SOCKET_EVENTS,
  USER_NOTIFICATION_MAP,
  buildUserEvent,
  sanitizeUser,
};