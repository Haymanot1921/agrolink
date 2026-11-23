// server/src/modules/auth/token.service.js
// JWT access + refresh tokens. Refresh tokens rotate on every use.
// A per-user `tokenVersion` invalidates every issued token on password change
// or global logout.
'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/environment');
const logger = require('../../config/logger');

// Refresh tokens are stored as hashes in the SQL refresh_tokens table.
const REFRESH_TOKEN_BYTES = 48;

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
      roles: user.roles || [user.role],
      ver: user.tokenVersion || 0,
    },
    env.jwt.accessSecret,
    {
      expiresIn: env.jwt.accessExpiresIn,
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
    },
  );
}

function signRefreshToken(user, meta = {}) {
  const raw = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
  const hash = hashRefresh(raw);
  const createdAt = new Date();
  return {
    raw: `${user._id}.${raw}`,
    hash,
    record: {
      hash,
      createdAt,
      expiresAt: new Date(createdAt.getTime() + refreshLifetimeMs(env.jwt.refreshExpiresIn)),
      deviceFingerprint: meta.deviceFingerprint || null,
      userAgent: meta.userAgent || null,
      ip: meta.ip || null,
    },
  };
}

function hashRefresh(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret, {
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
  });
}

/**
 * Issue a fresh access + refresh token pair.
 * Caller must persist `refreshRecord` onto the user via auth.repository.
 */
function issueTokens(user, meta = {}) {
  const accessToken = signAccessToken(user);
  const { raw: refreshToken, record: refreshRecord } = signRefreshToken(user, meta);
  return {
    accessToken,
    refreshToken,
    refreshRecord,
    expiresIn: env.jwt.accessExpiresIn,
  };
}

/**
 * Sign a short-lived MFA step-up token (used by requireMfa middleware).
 */
function signMfaToken(user, scope) {
  return jwt.sign(
    { sub: String(user._id), type: 'mfa_step_up', scope: scope || 'default' },
    process.env.MFA_STEP_UP_SECRET || env.jwt.accessSecret,
    {
      expiresIn: '5m',
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
    },
  );
}

/**
 * Verify a refresh token against the stored hash list.
 * Returns the matched record (or null). Caller compares.
 */
function matchRefreshToken(user, raw) {
  if (!user || !Array.isArray(user.refreshTokens)) return null;
  const tokenParts = String(raw).split('.');
  if (tokenParts.length !== 2 || tokenParts[0] !== String(user._id)) return null;
  const hash = hashRefresh(tokenParts[1]);
  const match = user.refreshTokens.find((t) => t.hash === hash);
  return match || null;
}

/**
 * Remove a specific refresh token (logout one device).
 */
function removeRefreshToken(user, raw) {
  if (!user || !Array.isArray(user.refreshTokens)) return user;
  const hash = hashRefresh(raw);
  user.refreshTokens = user.refreshTokens.filter((t) => t.hash !== hash);
  return user;
}

/**
 * Nuke all refresh tokens and bump tokenVersion — invalidates everything.
 */
function revokeAllTokens(user) {
  user.refreshTokens = [];
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  logger.info('[auth:token] all tokens revoked', { userId: String(user._id) });
  return user;
}

function refreshLifetimeMs(value) {
  const match = /^(\d+)(s|m|h|d|w)$/.exec(String(value));
  if (!match) throw new Error(`Unsupported JWT_REFRESH_EXPIRES_IN value: ${value}`);
  const units = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 };
  return Number(match[1]) * units[match[2]];
}

module.exports = {
  issueTokens,
  verifyAccessToken,
  signMfaToken,
  matchRefreshToken,
  removeRefreshToken,
  revokeAllTokens,
  hashRefresh,
};