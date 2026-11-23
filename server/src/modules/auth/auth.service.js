// server/src/modules/auth/auth.service.js
'use strict';

const env = require('../../config/environment');
const logger = require('../../config/logger');
const repository = require('./auth.repository');
const passwordService = require('./password.service');
const tokenService = require('./token.service');
const otpService = require('./otp.service');
const { ApiError } = require('../../shared/utils/ApiError');
const { ACCOUNT_STATUSES } = require('../../shared/constants/accountStatuses');
const { ROLES } = require('../../shared/constants/roles');
const { getDefaultPermissionsForRole } = require('../../shared/constants/permissions');
const { writeAudit } = require('../../shared/utils/auditLogger');
const { AUDIT_EVENT_TYPES } = require('../../shared/constants/auditEventTypes');
const { NOTIFICATION_TYPES } = require('../../shared/constants/notificationTypes');

// --- Registration -----------------------------------------------------------

async function register({ payload, req }) {
  const {
    fullName, email, phone, password, role, language, address,
    primaryCrops, providerType, businessName,
  } = payload;

  passwordService.enforcePolicy(password);

  const exists = await repository.existsEmailOrPhone({ email, phone });
  if (exists) throw ApiError.conflict('Email or phone already registered', 'ACCOUNT_EXISTS');

  const hash = await passwordService.hash(password);

  const user = await repository.createUser({
    fullName,
    email,
    phone,
    passwordHash: hash,
    role,
    roles: [role],
    permissions: getDefaultPermissionsForRole(role),
    status: ACCOUNT_STATUSES.PENDING,
    language: language || 'en',
    address: address || null,
    primaryCrops: primaryCrops || [],
    providerType: providerType || null,
    businessName: businessName || null,
  });

  // Send verification OTPs on both channels.
  try {
    await otpService.sendOtp({
      subject: String(user._id),
      purpose: 'email_verify',
      channel: 'email',
      recipient: user.email,
      language: user.language,
    });
    await otpService.sendOtp({
      subject: String(user._id),
      purpose: 'phone_verify',
      channel: 'sms',
      recipient: user.phone,
      language: user.language,
    });
  } catch (err) {
    logger.warn('[auth:register] OTP delivery failed', { userId: String(user._id), message: err.message });
  }

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_CREATED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    metadata: { role, selfRegistered: true },
  });

  return sanitizeUser(user);
}

// --- Login ------------------------------------------------------------------

async function login({ payload, req }) {
  const { identifier, password, deviceFingerprint, language } = payload;

  const user = await repository.findByEmailOrPhone(identifier);
  if (!user) throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');

  if (user.deletedAt) throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
  if (user.status === ACCOUNT_STATUSES.SUSPENDED) {
    throw ApiError.forbidden('Account suspended', 'ACCOUNT_SUSPENDED');
  }
  if (user.status === ACCOUNT_STATUSES.DEACTIVATED) {
    throw ApiError.forbidden('Account deactivated', 'ACCOUNT_DEACTIVATED');
  }

  const ok = await passwordService.verify(password, user.passwordHash);
  if (!ok) {
    await writeAudit({
      req,
      action: AUDIT_EVENT_TYPES.AUTH_LOGIN_FAILED,
      category: 'auth',
      targetType: 'user',
      targetId: user._id,
      outcome: 'failure',
      severity: 'medium',
      metadata: { identifier: mask(identifier) },
    });
    throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
  }

  // First successful verification promotes PENDING -> ACTIVE.
  if (user.status === ACCOUNT_STATUSES.PENDING && (user.isEmailVerified || user.isPhoneVerified)) {
    user.status = ACCOUNT_STATUSES.ACTIVE;
  }

  if (language && language !== user.language) {
    user.language = language;
  }

  const meta = {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    deviceFingerprint,
  };

  const { accessToken, refreshToken, refreshRecord } = tokenService.issueTokens(user, meta);

  await repository.pushRefreshToken(user._id, refreshRecord);
  await repository.recordLogin(user._id, meta);
  if (user.isModified && user.isModified('status')) {
    await repository.updateUser(user._id, { status: user.status, language: user.language });
  } else {
    await repository.updateUser(user._id, { language: user.language });
  }

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.AUTH_LOGIN_SUCCESS,
    category: 'auth',
    targetType: 'user',
    targetId: user._id,
    metadata: { ip: req.ip },
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    expiresIn: env.jwt.accessExpiresIn,
  };
}

// --- Refresh ----------------------------------------------------------------

async function refresh({ payload, req }) {
  const { refreshToken } = payload;
  // 1. Verify signature by matching against stored hashes.
  //    We don't trust the JWT; refresh tokens are opaque strings.
  const payloadDecoded = safeDecodeRefresh(refreshToken);
  if (!payloadDecoded) throw ApiError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');

  const user = await repository.findById(payloadDecoded.userId);
  if (!user) throw ApiError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
  if (user.status === ACCOUNT_STATUSES.SUSPENDED) {
    throw ApiError.forbidden('Account suspended', 'ACCOUNT_SUSPENDED');
  }

  const match = tokenService.matchRefreshToken(user, refreshToken);
  if (!match) throw ApiError.unauthorized('Refresh token reuse detected', 'REFRESH_REUSE');

  // Rotate: remove old, issue new pair.
  const remaining = user.refreshTokens.filter((t) => t.hash !== match.hash);
  const { accessToken, refreshToken: newRefresh, refreshRecord } = tokenService.issueTokens(
    user,
    { ip: req.ip, userAgent: req.get('user-agent') },
  );
  remaining.push(refreshRecord);
  await repository.setRefreshTokens(user._id, remaining);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.AUTH_TOKEN_REFRESH,
    category: 'auth',
    targetType: 'user',
    targetId: user._id,
  });

  return { accessToken, refreshToken: newRefresh, expiresIn: env.jwt.accessExpiresIn };
}

/**
 * Opaque refresh tokens are 96-char hex strings — no embedded payload.
 * We derive the user by scanning `refreshTokens.hash` across users.
 * To avoid a full-collection scan, the token format is:
 *   <userId>.<raw>
 * where `<raw>` is the 96-char random hex. This is not secret (userId is
 * already public-ish), and the raw part is what's hashed server-side.
 */
function safeDecodeRefresh(refreshToken) {
  if (typeof refreshToken !== 'string') return null;
  const dot = refreshToken.indexOf('.');
  if (dot < 1) return null;
  const userId = refreshToken.slice(0, dot);
  if (!/^[0-9a-fA-F]{24}$/.test(userId)) return null;
  return { userId };
}

// --- Logout -----------------------------------------------------------------

async function logout({ payload, req }) {
  const { refreshToken, allDevices } = payload;
  const user = req.user ? await repository.findById(req.user.id) : null;
  if (!user) throw ApiError.unauthorized('Not authenticated', 'AUTH_REQUIRED');

  if (allDevices) {
    await repository.revokeAllTokens(user._id);
  } else if (refreshToken) {
    const match = tokenService.matchRefreshToken(user, refreshToken);
    if (match) {
      const remaining = user.refreshTokens.filter((t) => t.hash !== match.hash);
      await repository.setRefreshTokens(user._id, remaining);
    }
  }

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.AUTH_LOGOUT,
    category: 'auth',
    targetType: 'user',
    targetId: user._id,
    metadata: { allDevices: Boolean(allDevices) },
  });

  return { ok: true };
}

// --- Verification -----------------------------------------------------------

async function requestPhoneOtp({ payload, req }) {
  const { phone } = payload;
  const user = req.user ? await repository.findById(req.user.id) : null;
  if (!user) throw ApiError.unauthorized('Not authenticated', 'AUTH_REQUIRED');
  if (user.isPhoneVerified) throw ApiError.conflict('Phone already verified', 'PHONE_ALREADY_VERIFIED');

  const result = await otpService.sendOtp({
    subject: String(user._id),
    purpose: 'phone_verify',
    channel: 'sms',
    recipient: phone || user.phone,
    language: user.language,
  });
  return result;
}

async function verifyPhone({ payload, req }) {
  const user = req.user ? await repository.findById(req.user.id) : null;
  if (!user) throw ApiError.unauthorized('Not authenticated', 'AUTH_REQUIRED');

  otpService.verifyOtp({
    subject: String(user._id),
    purpose: 'phone_verify',
    code: payload.code,
  });

  await repository.setPhoneVerified(user._id);
  if (user.status === ACCOUNT_STATUSES.PENDING) {
    await repository.updateUser(user._id, { status: ACCOUNT_STATUSES.ACTIVE });
  }

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_UPDATED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    metadata: { change: 'phone_verified' },
  });

  return { ok: true };
}

async function verifyEmail({ payload, req }) {
  const user = req.user ? await repository.findById(req.user.id) : null;
  if (!user) throw ApiError.unauthorized('Not authenticated', 'AUTH_REQUIRED');

  otpService.verifyOtp({
    subject: String(user._id),
    purpose: 'email_verify',
    code: payload.token,
  });

  await repository.setEmailVerified(user._id);
  if (user.status === ACCOUNT_STATUSES.PENDING) {
    await repository.updateUser(user._id, { status: ACCOUNT_STATUSES.ACTIVE });
  }

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.USER_UPDATED,
    category: 'user',
    targetType: 'user',
    targetId: user._id,
    metadata: { change: 'email_verified' },
  });

  return { ok: true };
}

// --- Password ---------------------------------------------------------------

async function requestPasswordReset({ payload, req }) {
  const { identifier, channel } = payload;
  const user = await repository.findByEmailOrPhone(identifier);
  // Do NOT leak account existence.
  if (!user) return { sent: true, channel };

  const recipient = channel === 'sms' ? user.phone : user.email;
  await otpService.sendOtp({
    subject: String(user._id),
    purpose: 'password_reset',
    channel,
    recipient,
    language: user.language,
  });

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.AUTH_PASSWORD_RESET_REQUESTED,
    category: 'auth',
    targetType: 'user',
    targetId: user._id,
    severity: 'medium',
    metadata: { channel },
  });

  return { sent: true, channel };
}

async function resetPassword({ payload, req }) {
  const { token, newPassword } = payload;
  passwordService.enforcePolicy(newPassword);

  // We piggyback on the OTP store: password_reset codes were sent to the user.
  // Token format is `<userId>.<code>`.
  const dot = String(token).indexOf('.');
  if (dot < 1) throw ApiError.badRequest('Invalid reset token', 'INVALID_RESET_TOKEN');
  const userId = token.slice(0, dot);
  const code = token.slice(dot + 1);

  const user = await repository.findById(userId);
  if (!user) throw ApiError.badRequest('Invalid reset token', 'INVALID_RESET_TOKEN');

  otpService.verifyOtp({ subject: String(user._id), purpose: 'password_reset', code });

  const hash = await passwordService.hash(newPassword);
  await repository.updatePassword(user._id, hash);
  await repository.revokeAllTokens(user._id);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.AUTH_PASSWORD_RESET_COMPLETED,
    category: 'auth',
    targetType: 'user',
    targetId: user._id,
    severity: 'high',
    reason: 'self-service password reset via OTP',
  });

  return { ok: true };
}

async function changePassword({ payload, req }) {
  const user = req.user ? await repository.findById(req.user.id) : null;
  if (!user) throw ApiError.unauthorized('Not authenticated', 'AUTH_REQUIRED');

  const ok = await passwordService.verify(payload.currentPassword, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Current password incorrect', 'INVALID_CURRENT_PASSWORD');

  passwordService.enforcePolicy(payload.newPassword);
  const hash = await passwordService.hash(payload.newPassword);
  await repository.updatePassword(user._id, hash);
  await repository.revokeAllTokens(user._id);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.AUTH_PASSWORD_CHANGED,
    category: 'auth',
    targetType: 'user',
    targetId: user._id,
    severity: 'medium',
  });

  return { ok: true };
}

// --- MFA step-up ------------------------------------------------------------

async function requestMfa({ payload, req }) {
  const user = req.user ? await repository.findById(req.user.id) : null;
  if (!user) throw ApiError.unauthorized('Not authenticated', 'AUTH_REQUIRED');

  await otpService.sendOtp({
    subject: String(user._id),
    purpose: `mfa:${payload.scope}`,
    channel: 'sms',
    recipient: user.phone,
    language: user.language,
  });

  return { sent: true, channel: 'sms' };
}

async function verifyMfa({ payload, req }) {
  const user = req.user ? await repository.findById(req.user.id) : null;
  if (!user) throw ApiError.unauthorized('Not authenticated', 'AUTH_REQUIRED');

  otpService.verifyOtp({
    subject: String(user._id),
    purpose: `mfa:${payload.scope}`,
    code: payload.code,
  });

  const mfaToken = tokenService.signMfaToken(user, payload.scope);

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.AUTH_MFA_STEP_UP,
    category: 'auth',
    targetType: 'user',
    targetId: user._id,
    metadata: { scope: payload.scope },
  });

  return { mfaToken, expiresInSeconds: 300 };
}

// --- Helpers ----------------------------------------------------------------

function sanitizeUser(user) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    roles: user.roles || [user.role],
    status: user.status,
    language: user.language,
    isEmailVerified: Boolean(user.isEmailVerified),
    isPhoneVerified: Boolean(user.isPhoneVerified),
    verificationStatus: user.verificationStatus,
    createdAt: user.createdAt,
  };
}

function mask(v) {
  if (!v) return '';
  const s = String(v);
  if (s.includes('@')) {
    const [u, d] = s.split('@');
    return `${u.slice(0, 2)}***@${d}`;
  }
  return `${s.slice(0, 3)}***${s.slice(-2)}`;
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  requestPhoneOtp,
  verifyPhone,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  requestMfa,
  verifyMfa,
};