// server/src/modules/auth/auth.repository.js
// Single DB touchpoint for the users collection. Every other module that
// needs a user record (authenticate.js, user-management, notifications)
// goes through this repository.
'use strict';

const User = require('./user.model');
const repo = require('../users/users.repository');
/**
 * Used by shared/middleware/authenticate.js.
 * Returns a lean user object with role + permission sets hydrated.
 * Returns null for deleted or missing users.
 */
async function findActiveUserById(id) {
  if (!id) return null;
  const user = await User.findOne({ _id: id, deletedAt: null })
    .select(
      '_id email phone fullName role roles status language isEmailVerified isPhoneVerified ' +
      'tokenVersion permissions verificationStatus createdAt',
    )
    .lean();
  return user || null;
}

async function findByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase(), deletedAt: null });
}

async function findByPhone(phone) {
  return User.findOne({ phone, deletedAt: null });
}

async function findById(id) {
  return User.findOne({ _id: id, deletedAt: null });
}

async function findByEmailOrPhone(identifier) {
  const value = String(identifier);
  const isEmail = value.includes('@');
  return isEmail ? findByEmail(value) : findByPhone(value);
}

/**
 * Create a user. Caller has already hashed the password.
 * Fields not provided are set to model defaults.
 */
async function createUser(data) {
  const user = new User(data);
  await user.save();
  return user;
}

async function updateUser(id, patch) {
  return User.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
}

/**
 * Persist the refresh-token record (append) and cap history at 10.
 */
async function pushRefreshToken(id, record) {
  await User.updateOne(
    { _id: id },
    {
      $push: {
        refreshTokens: {
          $each: [record],
          $slice: -10,
        },
      },
    },
  );
}

/**
 * Replace the entire refreshTokens array — used after rotation.
 */
async function setRefreshTokens(id, records) {
  await User.updateOne({ _id: id }, { $set: { refreshTokens: records } });
}

/**
 * Bump tokenVersion + clear refresh tokens — invalidates sessions.
 */
async function revokeAllTokens(id) {
  await User.updateOne(
    { _id: id },
    { $inc: { tokenVersion: 1 }, $set: { refreshTokens: [] } },
  );
}

async function setEmailVerified(id) {
  await User.updateOne(
    { _id: id },
    { $set: { isEmailVerified: true, emailVerifiedAt: new Date() } },
  );
}

async function setPhoneVerified(id) {
  await User.updateOne(
    { _id: id },
    { $set: { isPhoneVerified: true, phoneVerifiedAt: new Date() } },
  );
}

async function updatePassword(id, hash) {
  await User.updateOne(
    { _id: id },
    {
      $set: { passwordHash: hash, passwordChangedAt: new Date() },
      $inc: { tokenVersion: 1 },
    },
  );
}

async function recordLogin(id, meta = {}) {
  await User.updateOne(
    { _id: id },
    {
      $set: {
        lastLoginAt: new Date(),
        lastLoginIp: meta.ip || null,
        lastLoginUserAgent: meta.userAgent || null,
      },
    },
  );
}

async function existsEmailOrPhone({ email, phone }) {
  const query = [];
  if (email) query.push({ email: String(email).toLowerCase() });
  if (phone) query.push({ phone });
  if (!query.length) return false;
  const count = await User.countDocuments({ $or: query, deletedAt: null });
  return count > 0;
}

/**
 * Used by jobs — daily registration aggregation for reports.
 */
async function aggregateDailyRegistrations({ from, to }) {
  const pipeline = [
    { $match: { createdAt: { $gte: from, $lte: to }, deletedAt: null } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
        buyers: { $sum: { $cond: [{ $eq: ['$role', 'buyer'] }, 1, 0] } },
        farmers: { $sum: { $cond: [{ $eq: ['$role', 'farmer'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        day: '$_id',
        count: 1,
        buyers: 1,
        farmers: 1,
      },
    },
  ];
  return User.aggregate(pipeline);
}

module.exports = {
  findActiveUserById: repo.findActiveUserById,
  findByEmail: repo.findByEmail,
  findByPhone: repo.findByPhone,
  findById: repo.findById,
  findByEmailOrPhone: repo.findByEmailOrPhone,
  createUser: repo.createUser,
  updateUser: repo.updateById,
  existsEmailOrPhone: repo.existsEmailOrPhone,
  setEmailVerified: repo.setEmail,
  setPhoneVerified: repo.setPhone,
  updatePassword: require('./password.service').hash, // not called directly
  aggregateDailyRegistrations: repo.aggregateDailyRegistrations,
  // Auth-specific ones stay in auth.service (refresh token handling)
  pushRefreshToken: async (id, record) => {
    const { User } = require('../auth/user.model');
    await User.updateOne(
      { _id: id },
      { $push: { refreshTokens: { $each: [record], $slice: -10 } } },
    );
  },
  setRefreshTokens: async (id, records) => {
    const { User } = require('../auth/user.model');
    await User.updateOne({ _id: id }, { $set: { refreshTokens: records } });
  },
  revokeAllTokens: async (id) => {
    const { User } = require('../auth/user.model');
    await User.updateOne({ _id: id }, { $inc: { tokenVersion: 1 }, $set: { refreshTokens: [] } });
  },
  recordLogin: async (id, meta = {}) => {
    const { User } = require('../auth/user.model');
    await User.updateOne(
      { _id: id },
      {
        $set: {
          lastLoginAt: new Date(),
          lastLoginIp: meta.ip || null,
          lastLoginUserAgent: meta.userAgent || null,
        },
      },
    );
  },
  updatePassword: async (id, hash) => {
    const { User } = require('../auth/user.model');
    await User.updateOne(
      { _id: id },
      { $set: { passwordHash: hash, passwordChangedAt: new Date() }, $inc: { tokenVersion: 1 } },
    );
  },
};