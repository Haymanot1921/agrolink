// server/src/modules/notifications/notifications.service.js
// The routing engine. Every module calls dispatch() with a payload that
// matches shared/events/notificationEvents.js buildNotificationPayload().
// This service:
//   1. Persists the notification (all channels, with queued state)
//   2. Emits in_app immediately via sockets/adminNotifications.socket.js
//   3. Leaves email/sms for jobs/notificationDispatch.job.js
'use strict';

const repository = require('./notifications.repository');
const usersRepository = require('../users/users.repository');
const {
  buildNotificationPayload,
} = require('../../shared/events/notificationEvents');
const {
  NOTIFICATION_CHANNELS,
  channelsFor,
  isMandatory,
} = require('../../shared/constants/notificationTypes');
const { emitAdminNotification } = require('../../sockets/adminNotifications.socket');
const { ApiError } = require('../../shared/utils/ApiError');
const logger = require('../../config/logger');

// --- Dispatch --------------------------------------------------------------

/**
 * Main entry point — used by every other module.
 *
 * @param {Object} params
 * @param {string|string[]} params.userId — recipient(s); 'role:admin' broadcasts to admins
 * @param {string} params.type — NOTIFICATION_TYPES value
 * @param {string} [params.title]
 * @param {string} [params.body]
 * @param {Object} [params.data]
 * @param {string[]} [params.channels] — override default channelsFor(type)
 * @param {string} [params.priority] — 'low' | 'normal' | 'high' | 'critical'
 * @param {string} [params.language] — 'en' | 'am'
 * @param {Date} [params.scheduledAt] — optional send-after timestamp
 * @returns {Promise<Object|Object[]>} — the persisted notification(s)
 */
async function dispatch(params) {
  // Role-targeted notifications — fan out to every admin user.
  if (params.userId === 'role:admin') {
    return dispatchToRole('admin', params);
  }
  if (Array.isArray(params.userId)) {
    return Promise.all(params.userId.map((uid) => dispatchOne({ ...params, userId: uid })));
  }
  return dispatchOne(params);
}

/**
 * Dispatch to every user holding a given role.
 * Used for ADMIN_SYSTEM_ALERT, verification SLA breach, dispute opened, etc.
 */
async function dispatchToRole(role, params) {
  const recipients = await usersRepository.findActiveByRole(role);

  if (!recipients.length) {
    logger.debug('[notifications] no recipients for role', { role });
    return [];
  }

  return Promise.all(recipients.map((u) => dispatchOne({ ...params, userId: String(u._id) })));
}

async function dispatchOne(params) {
  const {
    userId,
    type,
    title,
    body,
    data,
    channels,
    priority = 'normal',
    language,
    scheduledAt,
  } = params;

  // 1. Load recipient (single DB read per notification).
  const user = await usersRepository.findById(userId);
  if (!user || user.deletedAt) {
    logger.warn('[notifications] recipient not found', { userId, type });
    return null;
  }

  // 2. Normalize channels + check user opt-outs (except mandatory types).
  const requestedChannels = channels && channels.length ? channels : channelsFor(type);
  const effectiveChannels = filterChannelsForUser({
    user,
    type,
    requested: requestedChannels,
    mandatory: isMandatory(type),
  });

  // 3. Build the normalized payload (contract from shared/events).
  const payload = buildNotificationPayload({
    userId: String(user._id),
    type,
    title,
    body,
    data,
    channels: effectiveChannels,
    priority,
    language: language || user.language || 'en',
  });

  // 4. Build channel state map for persistence.
  const channelStatus = {};
  for (const ch of effectiveChannels) {
    if (ch === NOTIFICATION_CHANNELS.IN_APP) continue; // in_app = readAt field
    channelStatus[ch] = { state: 'queued', attempts: 0 };
  }

  // 5. Persist.
  const record = await repository.create({
    userId: user._id,
    type: payload.type,
    priority: payload.priority,
    title: payload.title,
    body: payload.body,
    data: payload.data,
    channels: effectiveChannels,
    channelStatus,
    recipientEmail: effectiveChannels.includes('email') ? user.email : null,
    recipientPhone: effectiveChannels.includes('sms') ? user.phone : null,
    isMandatory: payload.isMandatory,
    language: payload.language,
    // scheduledAt used later by the dispatch job — store in createdAt-friendly way
    createdAt: scheduledAt || new Date(),
  });

  // 6. Emit in_app immediately via sockets.
  if (effectiveChannels.includes(NOTIFICATION_CHANNELS.IN_APP)) {
    try {
      emitAdminNotification({
        userId: String(user._id),
        type: payload.type,
        title: payload.title,
        body: payload.body,
        data: payload.data,
        channels: effectiveChannels,
        priority: payload.priority,
        language: payload.language,
      });
    } catch (err) {
      logger.error('[notifications] socket emit failed', { userId: String(user._id), message: err.message });
    }
  }

  // 7. Email/SMS handled asynchronously by jobs/notificationDispatch.job.js.
  return record;
}

// --- Query / inbox APIs ---------------------------------------------------

async function listInbox({ userId, query, page, limit, sort }) {
  const filter = {
    unread: query.unread === 'true' ? true : query.unread === 'false' ? false : undefined,
    types: query.types ? String(query.types).split(',').filter(Boolean) : [],
    priority: query.priority || undefined,
    from: query.from ? new Date(query.from) : undefined,
    to: query.to ? new Date(query.to) : undefined,
  };
  return repository.listForUser(userId, { filter, page, limit, sort });
}

async function getOne({ userId, notificationId }) {
  const record = await repository.findById(userId, notificationId);
  if (!record) throw ApiError.notFound('Notification not found', 'NOTIFICATION_NOT_FOUND');
  return record;
}

async function markRead({ userId, notificationId }) {
  const updated = await repository.markRead(userId, notificationId);
  return { ok: true, updated };
}

async function markAllRead({ userId }) {
  const count = await repository.markAllRead(userId);
  return { ok: true, count };
}

async function remove({ userId, notificationId }) {
  const ok = await repository.softDelete(userId, notificationId);
  return { ok };
}

async function unreadCount(userId) {
  return repository.unreadCount(userId);
}

async function unreadByType(userId) {
  return repository.unreadByType(userId);
}

async function stats(userId) {
  return repository.statsForUser(userId);
}

// --- Helpers ---------------------------------------------------------------

/**
 * User opt-outs. Mandatory types always use their defaults.
 * Default (undefined) preferences = all channels allowed.
 */
function filterChannelsForUser({ user, requested, mandatory }) {
  const prefs = user.notificationPreferences || {};
  const allowed = new Set();

  for (const ch of requested) {
    switch (ch) {
      case NOTIFICATION_CHANNELS.IN_APP:
        if (mandatory || prefs.inApp !== false) allowed.add(ch);
        break;
      case NOTIFICATION_CHANNELS.EMAIL:
        if (mandatory || prefs.email !== false) allowed.add(ch);
        break;
      case NOTIFICATION_CHANNELS.SMS:
        if (mandatory || prefs.sms !== false) allowed.add(ch);
        break;
      case NOTIFICATION_CHANNELS.PUSH:
        if (mandatory || prefs.push !== false) allowed.add(ch);
        break;
      default:
        break;
    }
  }

  // Guarantee at least in_app for a deliverable notification.
  if (!allowed.size) allowed.add(NOTIFICATION_CHANNELS.IN_APP);
  return Array.from(allowed);
}

module.exports = {
  dispatch,
  dispatchToRole,
  listInbox,
  getOne,
  markRead,
  markAllRead,
  remove,
  unreadCount,
  unreadByType,
  stats,
};