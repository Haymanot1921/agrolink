// server/src/modules/users/users.repository.js
// Canonical users repository. This is the ONLY file allowed to hit the
// users collection directly. auth.repository.js re-exports from here.
'use strict';

const User = require('../auth/user.model');

// --- Reads -----------------------------------------------------------------

async function findById(id) {
  return User.findOne({ _id: id, deletedAt: null });
}

/**
 * Lean read for the auth middleware hot path.
 * Field projection is tight to keep latency low.
 */
async function findActiveUserById(id) {
  if (!id) return null;
  return User.findOne({ _id: id, deletedAt: null })
    .select(
      '_id email phone fullName role roles status language ' +
      'isEmailVerified isPhoneVerified tokenVersion permissions verificationStatus createdAt',
    )
    .lean();
}

async function findByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase(), deletedAt: null });
}

async function findByPhone(phone) {
  return User.findOne({ phone, deletedAt: null });
}

async function findByEmailOrPhone(identifier) {
  const value = String(identifier);
  return value.includes('@') ? findByEmail(value) : findByPhone(value);
}

async function existsEmailOrPhone({ email, phone }) {
  const or = [];
  if (email) or.push({ email: String(email).toLowerCase() });
  if (phone) or.push({ phone });
  if (!or.length) return false;
  const n = await User.countDocuments({ $or: or, deletedAt: null });
  return n > 0;
}

/**
 * Public profile view — no secrets, no internal fields.
 * Used when rendering another user's profile (e.g. farmer public page).
 */
async function findPublicProfileById(id) {
  return User.findOne({ _id: id, deletedAt: null })
    .select(
      '_id fullName role verificationStatus avatarUrl businessName ' +
      'address primaryCrops providerType bio specialties yearsOfExperience ' +
      'createdAt',
    )
    .lean();
}

// --- Writes ----------------------------------------------------------------

async function createUser(data) {
  const user = new User(data);
  await user.save();
  return user;
}

async function updateById(id, patch) {
  return User.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
}

async function setEmail(id, newEmail) {
  await User.updateOne(
    { _id: id },
    {
      $set: {
        email: String(newEmail).toLowerCase(),
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
      $inc: { tokenVersion: 1 },
    },
  );
}

async function setPhone(id, newPhone) {
  await User.updateOne(
    { _id: id },
    {
      $set: {
        phone: newPhone,
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
      },
      $inc: { tokenVersion: 1 },
    },
  );
}

async function setNotificationPreferences(id, prefs) {
  await User.updateOne({ _id: id }, { $set: { notificationPreferences: prefs } });
}

async function setStatus(id, status) {
  await User.updateOne({ _id: id }, { $set: { status } });
}

async function setRole(id, role, roles) {
  await User.updateOne(
    { _id: id },
    { $set: { role, roles: roles || [role] } },
  );
}

async function softDelete(id, reason) {
  await User.updateOne(
    { _id: id },
    {
      $set: {
        deletedAt: new Date(),
        deletionReason: reason || null,
        status: 'deleted',
      },
      $inc: { tokenVersion: 1 },
      $unset: { refreshTokens: 1 },
    },
  );
}

// --- Admin queries ---------------------------------------------------------

/**
 * Paginated admin listing with flexible filters.
 * @param {Object} opts
 * @param {Object} opts.filter — { q?, role?, status?, verified? }
 * @param {{ page, limit, sort }} opts
 */
async function listUsers({ filter = {}, page, limit, sort }) {
  const query = { deletedAt: null };

  if (filter.role) query.role = filter.role;
  if (filter.status) query.status = filter.status;
  if (typeof filter.verified === 'boolean') {
    query.isEmailVerified = filter.verified;
  }
  if (filter.q) {
    const rx = new RegExp(escapeRegex(filter.q), 'i');
    query.$or = [
      { fullName: rx },
      { email: rx },
      { phone: rx },
      { businessName: rx },
    ];
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    User.find(query)
      .sort(sort || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        '_id fullName email phone role roles status verificationStatus ' +
        'isEmailVerified isPhoneVerified lastLoginAt createdAt',
      )
      .lean(),
    User.countDocuments(query),
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

/**
 * Aggregate daily registrations for reports.
 */
async function aggregateDailyRegistrations({ from, to }) {
  return User.aggregate([
    { $match: { createdAt: { $gte: from, $lte: to }, deletedAt: null } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        buyers: { $sum: { $cond: [{ $eq: ['$role', 'buyer'] }, 1, 0] } },
        farmers: { $sum: { $cond: [{ $eq: ['$role', 'farmer'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, day: '$_id', count: 1, buyers: 1, farmers: 1 } },
  ]);
}

// --- Helpers ---------------------------------------------------------------

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  findById,
  findActiveUserById,
  findByEmail,
  findByPhone,
  findByEmailOrPhone,
  existsEmailOrPhone,
  findPublicProfileById,
  createUser,
  updateById,
  setEmail,
  setPhone,
  setNotificationPreferences,
  setStatus,
  setRole,
  softDelete,
  listUsers,
  aggregateDailyRegistrations,
};