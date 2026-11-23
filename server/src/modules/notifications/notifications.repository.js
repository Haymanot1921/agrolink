// All notification reads and writes use the MySQL notifications table.
'use strict';

const database = require('../../config/database');

const CHANNELS = new Set(['email', 'sms', 'push']);

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapNotification(row) {
  if (!row) return null;
  return {
    _id: String(row.id),
    id: String(row.id),
    userId: String(row.userId),
    type: row.type,
    priority: row.priority,
    title: row.title,
    body: row.body,
    data: parseJson(row.dataJson, {}),
    channels: parseJson(row.channelsJson, []),
    channelStatus: parseJson(row.channelStatusJson, {}),
    recipientEmail: row.recipientEmail,
    recipientPhone: row.recipientPhone,
    isMandatory: Boolean(row.isMandatory),
    language: row.language,
    readAt: row.readAt,
    readBy: row.readBy === null ? null : String(row.readBy),
    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const SELECT_NOTIFICATION = `
  SELECT id, user_id AS userId, type, priority, title, body,
         data_json AS dataJson, channels_json AS channelsJson,
         channel_status_json AS channelStatusJson, recipient_email AS recipientEmail,
         recipient_phone AS recipientPhone, is_mandatory AS isMandatory,
         language, read_at AS readAt, read_by AS readBy, deleted_at AS deletedAt,
         created_at AS createdAt, created_at AS updatedAt
  FROM notifications
`;

async function create(record) {
  const [result] = await database.query(
    `INSERT INTO notifications
     (user_id, type, priority, title, body, data_json, channels_json,
      channel_status_json, recipient_email, recipient_phone, is_mandatory,
      language, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.userId,
      record.type,
      record.priority || 'normal',
      record.title || null,
      record.body || null,
      JSON.stringify(record.data || {}),
      JSON.stringify(record.channels || ['in_app']),
      JSON.stringify(record.channelStatus || {}),
      record.recipientEmail || null,
      record.recipientPhone || null,
      record.isMandatory ? 1 : 0,
      record.language || 'en',
      record.createdAt || new Date(),
    ],
  );
  const [rows] = await database.query(`${SELECT_NOTIFICATION} WHERE id = ? LIMIT 1`, [result.insertId]);
  return mapNotification(rows[0]);
}

async function markRead(userId, notificationId) {
  const [result] = await database.query(
    `UPDATE notifications SET read_at = NOW(), read_by = ?
     WHERE id = ? AND user_id = ? AND read_at IS NULL AND deleted_at IS NULL`,
    [userId, notificationId, userId],
  );
  return result.affectedRows > 0;
}

async function markAllRead(userId) {
  const [result] = await database.query(
    `UPDATE notifications SET read_at = NOW(), read_by = ?
     WHERE user_id = ? AND read_at IS NULL AND deleted_at IS NULL`,
    [userId, userId],
  );
  return result.affectedRows;
}

async function softDelete(userId, notificationId) {
  const [result] = await database.query(
    'UPDATE notifications SET deleted_at = NOW() WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
    [notificationId, userId],
  );
  return result.affectedRows > 0;
}

async function updateChannelState(id, channel, state, extra = {}) {
  if (!CHANNELS.has(channel)) throw new Error(`Unsupported notification channel: ${channel}`);
  const assignments = [];
  const params = [];
  const setJson = (key, value) => {
    assignments.push('?, CAST(? AS JSON)');
    params.push(`$.${channel}.${key}`, JSON.stringify(value));
  };

  setJson('state', state);
  if (extra.lastError !== undefined) setJson('lastError', extra.lastError);
  if (state === 'sent') setJson('sentAt', new Date());
  if (state === 'retrying' || state === 'failed') setJson('lastAttemptAt', new Date());

  let expression = 'COALESCE(channel_status_json, JSON_OBJECT())';
  for (let i = 0; i < assignments.length; i += 1) {
    expression = `JSON_SET(${expression}, ${assignments[i]})`;
  }
  if (extra.attempts !== undefined) {
    expression = `JSON_SET(${expression}, ?, COALESCE(
      CAST(JSON_UNQUOTE(JSON_EXTRACT(channel_status_json, ?)) AS UNSIGNED), 0) + ?)`;
    params.push(
      `$.${channel}.attempts`,
      `$.${channel}.attempts`,
      extra.attempts,
    );
  }

  await database.query(
    `UPDATE notifications SET channel_status_json = ${expression} WHERE id = ?`,
    [...params, id],
  );
}

async function listForUser(userId, { filter = {}, page = 1, limit = 20, sort } = {}) {
  const conditions = ['user_id = ?', 'deleted_at IS NULL'];
  const params = [userId];
  if (filter.unread === true) conditions.push('read_at IS NULL');
  if (filter.unread === false) conditions.push('read_at IS NOT NULL');
  if (Array.isArray(filter.types) && filter.types.length) {
    conditions.push(`type IN (${filter.types.map(() => '?').join(', ')})`);
    params.push(...filter.types);
  }
  if (filter.priority) {
    conditions.push('priority = ?');
    params.push(filter.priority);
  }
  if (filter.from) {
    conditions.push('created_at >= ?');
    params.push(filter.from);
  }
  if (filter.to) {
    conditions.push('created_at <= ?');
    params.push(filter.to);
  }

  const safeSort = { createdAt: 'created_at', priority: 'priority', type: 'type' };
  const sortEntry = sort && Object.entries(sort).find(([field]) => safeSort[field]);
  const orderBy = sortEntry
    ? `${safeSort[sortEntry[0]]} ${Number(sortEntry[1]) === 1 ? 'ASC' : 'DESC'}`
    : 'created_at DESC';
  const offset = (page - 1) * limit;
  const where = conditions.join(' AND ');

  const [rows, countRows] = await Promise.all([
    database.query(
      `${SELECT_NOTIFICATION} WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    ),
    database.query(
      `SELECT COUNT(*) AS total FROM notifications WHERE ${where}`,
      params,
    ),
  ]);
  const total = Number(countRows[0][0].total);
  return {
    data: rows[0].map(mapNotification),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

async function findById(userId, notificationId) {
  const [rows] = await database.query(
    `${SELECT_NOTIFICATION} WHERE id = ? AND user_id = ? AND deleted_at IS NULL LIMIT 1`,
    [notificationId, userId],
  );
  return mapNotification(rows[0]);
}

async function unreadCount(userId) {
  const [rows] = await database.query(
    'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND read_at IS NULL AND deleted_at IS NULL',
    [userId],
  );
  return Number(rows[0].total);
}

async function unreadByType(userId) {
  const [rows] = await database.query(
    `SELECT type, COUNT(*) AS count FROM notifications
     WHERE user_id = ? AND read_at IS NULL AND deleted_at IS NULL GROUP BY type`,
    [userId],
  );
  return rows.map((row) => ({ type: row.type, count: Number(row.count) }));
}

async function statsForUser(userId) {
  const [rows] = await database.query(
    `SELECT COUNT(*) AS total, SUM(read_at IS NULL) AS unread
     FROM notifications WHERE user_id = ? AND deleted_at IS NULL`,
    [userId],
  );
  return { total: Number(rows[0].total), unread: Number(rows[0].unread || 0) };
}

async function findPendingChannelBatch(limit = 100) {
  const [rows] = await database.query(
    `${SELECT_NOTIFICATION}
     WHERE JSON_UNQUOTE(JSON_EXTRACT(channel_status_json, '$.email.state')) IN ('queued', 'retrying')
        OR JSON_UNQUOTE(JSON_EXTRACT(channel_status_json, '$.sms.state')) IN ('queued', 'retrying')
     ORDER BY created_at ASC LIMIT ?`,
    [limit],
  );
  return rows.map(mapNotification);
}

module.exports = {
  create,
  markRead,
  markAllRead,
  softDelete,
  updateChannelState,
  listForUser,
  findById,
  unreadCount,
  unreadByType,
  statsForUser,
  findPendingChannelBatch,
};
