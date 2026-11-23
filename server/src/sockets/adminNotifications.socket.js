// server/src/sockets/adminNotifications.socket.js
// Admin inbox + security alert stream.
// - Emits new admin notifications, security alerts, high-severity audit events.
// - Handles per-admin room joins, badge counts.
// - Bridges shared/events/notificationEvents + shared/events/auditEvents.

'use strict';

const { emitToUser, emitToRole } = require('../config/socket');
const logger = require('../config/logger');
const {
  NOTIFICATION_SOCKET_EVENTS,
  buildNotificationPayload,
} = require('../shared/events/notificationEvents');
const {
  AUDIT_SOCKET_EVENTS,
  buildAuditEvent,
  priorityFor,
  isSecurityEvent,
} = require('../shared/events/auditEvents');

const ADMIN_ROOM = 'role:admin';

/**
 * Attach per-socket listeners for admins. Called once at boot.
 * Only sockets authenticated as admin/super_admin join ADMIN_ROOM (already
 * done by config/socket.js based on role) — this adds admin-only handlers.
 */
function attach(io) {
  io.on('connection', (socket) => {
    const { role, _id: userId } = socket.user || {};
    const isAdmin = role === 'admin' || role === 'super_admin';
    if (!isAdmin) return;

    // Admin can request current unread count on connect.
    socket.on('admin:notifications:badge', async (_, ack) => {
      try {
        // Lazy require to avoid loading mongoose at boot.
        // eslint-disable-next-line global-require
        const notificationsService = require('../modules/administrator/notifications/notifications.service');
        const count = await notificationsService.unreadCount(userId);
        if (typeof ack === 'function') ack({ count });
        socket.emit(NOTIFICATION_SOCKET_EVENTS.BADGE_COUNT, { count });
      } catch (err) {
        logger.error('[sockets:admin] badge error', { message: err.message });
        if (typeof ack === 'function') ack({ error: 'BADGE_FAILED' });
      }
    });

    socket.on('admin:notifications:mark_read', async ({ notificationId }, ack) => {
      try {
        // eslint-disable-next-line global-require
        const notificationsService = require('../modules/administrator/notifications/notifications.service');
        await notificationsService.markRead(userId, notificationId);
        socket.emit(NOTIFICATION_SOCKET_EVENTS.MARKED_READ, { notificationId });
        if (typeof ack === 'function') ack({ ok: true });
      } catch (err) {
        logger.error('[sockets:admin] mark_read error', { message: err.message });
        if (typeof ack === 'function') ack({ error: 'MARK_READ_FAILED' });
      }
    });

    socket.on('admin:notifications:read_all', async (_, ack) => {
      try {
        // eslint-disable-next-line global-require
        const notificationsService = require('../modules/administrator/notifications/notifications.service');
        await notificationsService.markAllRead(userId);
        socket.emit(NOTIFICATION_SOCKET_EVENTS.READ_ALL, { at: new Date().toISOString() });
        if (typeof ack === 'function') ack({ ok: true });
      } catch (err) {
        logger.error('[sockets:admin] read_all error', { message: err.message });
        if (typeof ack === 'function') ack({ error: 'READ_ALL_FAILED' });
      }
    });
  });

  logger.info('[sockets:admin] attached');
}

// --- Public emitters -------------------------------------------------------

/**
 * Fan out a new admin notification. Called by services after a trigger.
 * @param {Object} params — see buildNotificationPayload
 */
function emitAdminNotification(params) {
  try {
    const payload = buildNotificationPayload(params);
    emitToUser(payload.userId, NOTIFICATION_SOCKET_EVENTS.NEW_NOTIFICATION, payload);
    // Admins often watch a role-wide feed too.
    emitToRole('admin', NOTIFICATION_SOCKET_EVENTS.BADGE_COUNT, {
      userId: payload.userId,
      delta: 1,
      at: new Date().toISOString(),
    });
    return payload;
  } catch (err) {
    logger.error('[sockets:admin] emit notification error', { message: err.message });
    return null;
  }
}

/**
 * Broadcast a security alert to all admins.
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.body
 * @param {Object} [params.data]
 * @param {'low'|'medium'|'high'|'critical'} [params.priority]
 */
function emitSecurityAlert({ title, body, data, priority = 'high' }) {
  const payload = {
    title,
    body,
    data: data || {},
    priority,
    at: new Date().toISOString(),
  };
  emitToRole('admin', 'audit:security_alert', payload);
  return payload;
}

/**
 * Emit a real-time audit event to admins. Bridges auditLogger output.
 * @param {Object} entry — sanitized audit entry
 */
function emitAuditEvent(entry) {
  try {
    const evt = buildAuditEvent(entry);
    const payload = {
      ...evt.payload,
      priority: priorityFor(entry),
      isSecurity: isSecurityEvent(entry),
    };
    emitToRole('admin', evt.event, payload);
    if (payload.isSecurity) {
      emitToRole('admin', AUDIT_SOCKET_EVENTS.SECURITY_ALERT, payload);
    }
    return payload;
  } catch (err) {
    logger.error('[sockets:admin] emit audit error', { message: err.message });
    return null;
  }
}

/**
 * Convenience helper used by system-health jobs and configuration changes.
 */
function emitSystemAlert({ title, body, severity = 'high', data }) {
  const payload = {
    title,
    body,
    severity,
    data: data || {},
    at: new Date().toISOString(),
  };
  emitToRole('admin', 'admin:system_alert', payload);
  return payload;
}

module.exports = {
  attach,
  emitAdminNotification,
  emitSecurityAlert,
  emitAuditEvent,
  emitSystemAlert,
  ADMIN_ROOM,
};