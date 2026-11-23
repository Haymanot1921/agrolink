// server/src/modules/notifications/notifications.repository.js
// All Notification reads/writes go through here — including those used by
// the jobs/notificationDispatch.job.js pipeline.
'use strict';

const mongoose = require('mongoose');
const Notification = require('./notification.model');

// --- Writes ----------------------------------------------------------------

async function create(record) {
  const doc = new Notification(record);
  await doc.save();
  return doc;
}

async function markRead(userId, notificationId) {
  const result = await Notification.updateOne(
    { _id: notificationId, userId, readAt: null },
    { $set: { readAt: new Date(), readBy: userId } },
  );
  return result.modifiedCount > 0;
}

async function markAllRead(userId) {
  const result = await Notification.updateMany(
    { userId, readAt: null, deletedAt: null },
    { $set: { readAt: new Date(), readBy: userId } },
  );
  return result.modifiedCount;
}

async function softDelete(userId, notificationId) {
  const result = await Notification.updateOne(
    { _id: notificationId, userId },
    { $set: { deletedAt: new Date() } },
  );
  return result.modifiedCount > 0;
}

/**
 * Called by the notificationDispatch job after a channel send attempt.
 * `state` is one of: sending | sent | retrying | failed | skipped
 */
async function updateChannelState(id, channel, state, extra = {}) {
  const set = { [`channelStatus.${channel}.state`]: state };
  if (extra.lastError !== undefined) {
    set[`channelStatus.${channel}.lastError`] = extra.lastError;
  }
  if (state === 'sent') {
    set[`channelStatus.${channel}.sentAt`] = new Date();
  }
  if (state === 'retrying' || state === 'failed') {
    set[`channelStatus.${channel}.lastAttemptAt`] = new Date();
  }

  const update = { $set: set };
  if (extra.attempts !== undefined) {
    update.$inc = { [`channelStatus.${channel}.attempts`]: extra.attempts };
  }
  await Notification.updateOne({ _id: id }, update);
}

// --- Reads -----------------------------------------------------------------

/**
 * Paginated inbox listing.
 * @param {string} userId
 * @param {Object} opts
 * @param {{ page, limit, sort }} opts
 * @param {Object} [opts.filter] — { unread?, types?, priority?, from?, to? }
 */
async function listForUser(userId, { filter = {}, page, limit, sort }) {
  const query = { userId, deletedAt: null };

  if (filter.unread === true) query.readAt = null;
  if (filter.unread === false) query.readAt = { $ne: null };
  if (Array.isArray(filter.types) && filter.types.length) query.type = { $in: filter.types };
  if (filter.priority) query.priority = filter.priority;
  if (filter.from || filter.to) {
    query.createdAt = {};
    if (filter.from) query.createdAt.$gte = filter.from;
    if (filter.to) query.createdAt.$lte = filter.to;
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Notification.find(query)
      .sort(sort || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function findById(userId, notificationId) {
  return Notification.findOne({ _id: notificationId, userId, deletedAt: null }).lean();
}

async function unreadCount(userId) {
  return Notification.countDocuments({ userId, readAt: null, deletedAt: null });
}

/**
 * Grouped unread counts per type (used by badge menus).
 */
async function unreadByType(userId) {
  const rows = await Notification.aggregate([
    { $match: { userId: toObjectId(userId), readAt: null, deletedAt: null } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $project: { _id: 0, type: '$_id', count: 1 } },
  ]);
  return rows;
}

async function statsForUser(userId) {
  const objectId = toObjectId(userId);
  const [total, unread] = await Promise.all([
    Notification.countDocuments({ userId: objectId, deletedAt: null }),
    Notification.countDocuments({ userId: objectId, readAt: null, deletedAt: null }),
  ]);
  return { total, unread };
}

// --- Used by jobs/notificationDispatch.job.js -------------------------------

/**
 * Fetch pending notifications whose channel status is queued/retrying.
 * Called by the dispatch job — returns lean docs so we don't load full models.
 */
async function findPendingChannelBatch(limit = 100) {
  return Notification.find({
    $or: [
      { 'channelStatus.email.state': { $in: ['queued', 'retrying'] } },
      { 'channelStatus.sms.state': { $in: ['queued', 'retrying'] } },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
}

// --- Helpers ---------------------------------------------------------------

function toObjectId(id) {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  return new mongoose.Types.ObjectId(String(id));
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