// server/src/modules/users/users.service.js
'use strict';

const repository = require('./users.repository');
const profileFactory = require('./profile.factory');
const passwordService = require('../auth/password.service');
const otpService = require('../auth/otp.service');
const tokenService = require('../auth/token.service');
const { ApiError } = require('../../shared/utils/ApiError');
const { writeAudit } = require('../../shared/utils/auditLogger');
const { AUDIT_EVENT_TYPES } = require('../../shared/constants/auditEventTypes');
const { ACCOUNT_STATUSES } = require('../../shared/constants/accountStatuses');
const { NOTIFICATION_TYPES } = require('../../shared/constants/notificationTypes');
const { ROLES } = require('../../shared/constants/roles');

// --- Self-service ----------------------------------------------------------

async function getSelfProfile(userId, deps = {}) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  return profileFactory.buildSelfProfile(user, deps);
}

async function getPublicProfile(userId, deps = {}) {
  const user = await repository.findPublicProfileById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  return profileFactory.buildPublicProfile(user, deps);
}

async function updateProfile({ userId, payload, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');

  const patch = {};
  const changes = { before: {}, after: {} };

  const allowedFields = [
    'fullName', 'language', 'address', 'avatarUrl', 'businessName', 'bio',
    'primaryCrops', 'farmingExperienceYears', 'providerType',
    'yearsOfExperience', 'specialties',
  ];
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      patch[key] = payload[key];
      changes.before[key] = user[key];
      changes.after[key] = payload[key];
    }
  }

  if (payload.notificationPreferences) {
    patch.notificationPreferences = {
      ...(user.notificationPreferences || {}),
      ...payload.notificationPreferences,
    };
    changes.before.notificationPreferences = user.notificationPreferences;
    changes.after.notificationPreferences = patch.notificationPreferences;
  }

  if (!Object.keys(patch).length) {
    return { ok: true, changed: 0 };
  }

  const updated = await repository.updateById(user._id, patch);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_UPDATED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    metadata: { selfService: true, changes },
  });

  return profileFactory.buildSelfProfile(updated);
}

// --- Email / phone change (OTP-gated) -------------------------------------

async function changeEmail({ userId, payload, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');

  const newEmail = String(payload.newEmail).toLowerCase();
  if (newEmail === user.email) throw ApiError.conflict('Email unchanged', 'EMAIL_UNCHANGED');
  if (await repository.existsEmailOrPhone({ email: newEmail })) {
    throw ApiError.conflict('Email already registered', 'EMAIL_TAKEN');
  }

  otpService.verifyOtp({
    subject: String(user._id),
    purpose: 'email_change',
    code: payload.otpCode,
  });

  const oldEmail = user.email;
  await repository.setEmail(user._id, newEmail);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_EMAIL_CHANGED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    severity: 'medium',
    changes: { before: { email: oldEmail }, after: { email: newEmail } },
  });

  return { ok: true, email: newEmail };
}

async function requestEmailChange({ userId, newEmail, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  if (String(newEmail).toLowerCase() === user.email) {
    throw ApiError.conflict('Email unchanged', 'EMAIL_UNCHANGED');
  }
  if (await repository.existsEmailOrPhone({ email: newEmail })) {
    throw ApiError.conflict('Email already registered', 'EMAIL_TAKEN');
  }
  return otpService.sendOtp({
    subject: String(user._id),
    purpose: 'email_change',
    channel: 'email',
    recipient: newEmail,
    language: user.language,
  });
}

async function changePhone({ userId, payload, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');

  const newPhone = payload.newPhone;
  if (newPhone === user.phone) throw ApiError.conflict('Phone unchanged', 'PHONE_UNCHANGED');
  if (await repository.existsEmailOrPhone({ phone: newPhone })) {
    throw ApiError.conflict('Phone already registered', 'PHONE_TAKEN');
  }

  otpService.verifyOtp({
    subject: String(user._id),
    purpose: 'phone_change',
    code: payload.otpCode,
  });

  const oldPhone = user.phone;
  await repository.setPhone(user._id, newPhone);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_PHONE_CHANGED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    severity: 'medium',
    changes: { before: { phone: oldPhone }, after: { phone: newPhone } },
  });

  return { ok: true, phone: newPhone };
}

async function requestPhoneChange({ userId, newPhone, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  if (newPhone === user.phone) throw ApiError.conflict('Phone unchanged', 'PHONE_UNCHANGED');
  if (await repository.existsEmailOrPhone({ phone: newPhone })) {
    throw ApiError.conflict('Phone already registered', 'PHONE_TAKEN');
  }
  return otpService.sendOtp({
    subject: String(user._id),
    purpose: 'phone_change',
    channel: 'sms',
    recipient: newPhone,
    language: user.language,
  });
}

// --- Preferences ----------------------------------------------------------

async function setNotificationPreferences({ userId, prefs, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');

  const merged = { ...(user.notificationPreferences || {}), ...prefs };
  await repository.setNotificationPreferences(user._id, merged);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_UPDATED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    metadata: { change: 'notification_preferences', prefs: merged },
  });

  return { ok: true, notificationPreferences: merged };
}

// --- Self-service deactivate / delete ------------------------------------

async function deactivateAccount({ userId, payload, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');

  const ok = await passwordService.verify(payload.currentPassword, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Current password incorrect', 'INVALID_PASSWORD');

  await repository.setStatus(user._id, ACCOUNT_STATUSES.DEACTIVATED);
  await repository.revokeAllTokens(user._id);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_STATUS_CHANGED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    severity: 'high',
    reason: payload.reason || 'self-deactivation',
    changes: { before: { status: user.status }, after: { status: ACCOUNT_STATUSES.DEACTIVATED } },
  });

  return { ok: true };
}

async function deleteAccount({ userId, payload, req }) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');

  const ok = await passwordService.verify(payload.currentPassword, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Current password incorrect', 'INVALID_PASSWORD');

  await repository.softDelete(user._id, payload.reason);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_DELETED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    severity: 'high',
    reason: payload.reason || 'self-deletion',
    metadata: { selfService: true },
  });

  return { ok: true };
}

// --- Admin-scope operations ---------------------------------------------

async function adminList({ filter = {}, page, limit, sort }) {
  return repository.listUsers({ filter, page, limit, sort });
}

async function adminGetUser(userId) {
  const user = await repository.findById(userId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  return profileFactory.buildSelfProfile(user);
}

async function adminUpdateStatus({ targetUserId, payload, req }) {
  const user = await repository.findById(targetUserId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');

  if (user.role === ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('Cannot modify super admin', 'CANNOT_MODIFY_SUPER_ADMIN');
  }

  const before = user.status;
  await repository.setStatus(user._id, payload.status);
  if (payload.status === ACCOUNT_STATUSES.SUSPENDED || payload.status === ACCOUNT_STATUSES.DEACTIVATED) {
    await repository.revokeAllTokens(user._id);
  }

  await writeAudit({
    req,
    action:
      payload.status === ACCOUNT_STATUSES.SUSPENDED
        ? AUDIT_EVENT_TYPES.USER_SUSPENDED
        : payload.status === ACCOUNT_STATUSES.ACTIVE
        ? AUDIT_EVENT_TYPES.USER_REACTIVATED
        : AUDIT_EVENT_TYPES.USER_STATUS_CHANGED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    severity: 'high',
    reason: payload.reason,
    changes: { before: { status: before }, after: { status: payload.status } },
  });

  return { ok: true, status: payload.status };
}

async function adminChangeRole({ targetUserId, payload, req }) {
  const user = await repository.findById(targetUserId);
  if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  if (user.role === ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('Cannot modify super admin', 'CANNOT_MODIFY_SUPER_ADMIN');
  }

  const before = user.role;
  await repository.setRole(user._id, payload.newRole, [payload.newRole]);
  await repository.revokeAllTokens(user._id); // Force re-login with new role

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_ROLE_CHANGED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    severity: 'high',
    reason: payload.reason,
    changes: { before: { role: before }, after: { role: payload.newRole } },
  });

  return { ok: true, role: payload.newRole };
}

module.exports = {
  // self-service
  getSelfProfile,
  getPublicProfile,
  updateProfile,
  requestEmailChange,
  changeEmail,
  requestPhoneChange,
  changePhone,
  setNotificationPreferences,
  deactivateAccount,
  deleteAccount,
  // admin
  adminList,
  adminGetUser,
  adminUpdateStatus,
  adminChangeRole,
};