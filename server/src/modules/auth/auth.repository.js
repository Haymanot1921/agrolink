'use strict';

const users = require('../users/users.repository');

module.exports = {
  findActiveUserById: users.findActiveUserById,
  findByEmail: users.findByEmail,
  findByPhone: users.findByPhone,
  findById: users.findById,
  findByEmailOrPhone: users.findByEmailOrPhone,
  createUser: users.createUser,
  updateUser: users.updateById,
  existsEmailOrPhone: users.existsEmailOrPhone,
  setEmailVerified: users.setEmailVerified,
  setPhoneVerified: users.setPhoneVerified,
  updatePassword: users.updatePassword,
  aggregateDailyRegistrations: users.aggregateDailyRegistrations,
  pushRefreshToken: users.addRefreshToken,
  setRefreshTokens: users.setRefreshTokens,
  revokeAllTokens: users.revokeAllTokens,
  recordLogin: users.recordLogin,
  findActiveByRole: users.findActiveByRole,
};
