// server/src/shared/middleware/authenticate.js
// Verifies JWT access token, attaches req.user, and enforces account state.
// Also exposes `authenticateSocket` for socket.js wiring.

'use strict';

const jwt = require('jsonwebtoken');
const env = require('../../config/environment');
const logger = require('../../config/logger');
const { AppError } = require('../errors/AppError');

/**
 * Verify a JWT access token and return its decoded payload, or throw.
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret, {
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
  });
}

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  // Allow token in cookie for browser sessions (web client)
  if (req.cookies && req.cookies.access_token) return req.cookies.access_token;
  return null;
}

/**
 * Loads the user record referenced by the token. Uses a lazy require so
 * this middleware does not create a circular import with modules/auth.
 */
async function loadUser(payload) {
  // eslint-disable-next-line global-require
  const userRepository = require('../../modules/auth/auth.repository');
  return userRepository.findActiveUserById(payload.sub);
}

/**
 * Express middleware — rejects unauthenticated requests with 401.
 * Attaches req.user = { id, role, permissions, status, verified, ... }.
 */
async function authenticate(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
      return next(new AppError('Invalid or expired token', 401, code));
    }

    const user = await loadUser(payload);
    if (!user) {
      return next(new AppError('Account not found', 401, 'ACCOUNT_NOT_FOUND'));
    }
    if (user.status === 'suspended') {
      return next(new AppError('Account suspended', 403, 'ACCOUNT_SUSPENDED'));
    }
    if (user.status === 'deactivated') {
      return next(new AppError('Account deactivated', 403, 'ACCOUNT_DEACTIVATED'));
    }
    if (user.deletedAt) {
      return next(new AppError('Account deleted', 401, 'ACCOUNT_DELETED'));
    }

    // Optional global rule: verified users only for mutating endpoints.
    // Individual routes can further restrict — see authorizePermission.
    req.user = {
      id: String(user._id),
      role: user.role,
      roles: user.roles || [user.role],
      permissions: user.permissions || [],
      status: user.status,
      email: user.email,
      phone: user.phone,
      isEmailVerified: Boolean(user.isEmailVerified),
      isPhoneVerified: Boolean(user.isPhoneVerified),
      language: user.language || env.app.defaultLanguage,
      tokenIssuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
    };
    req.authToken = token;
    return next();
  } catch (err) {
    logger.error('[auth] authenticate error', { message: err.message });
    return next(err);
  }
}

/**
 * Lightweight guard that only validates the token signature (no DB hit).
 * Useful for public-but-identified routes (e.g. optional favourites badge).
 */
function authenticateOptional(req, res, next) {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    req.authPayload = payload;
    return next();
  } catch {
    return next(); // swallow — treat as guest
  }
}

/**
 * Socket.IO auth adapter — passed to initSocket(httpServer, { authenticate }).
 * Returns a minimal user object or null (socket.js converts null → error).
 */
async function authenticateSocket(token) {
  try {
    const payload = verifyAccessToken(token);
    const user = await loadUser(payload);
    if (!user || user.status === 'suspended' || user.deletedAt) return null;
    return {
      _id: String(user._id),
      id: String(user._id),
      role: user.role,
      roles: user.roles || [user.role],
      permissions: user.permissions || [],
    };
  } catch {
    return null;
  }
}

module.exports = {
  authenticate,
  authenticateOptional,
  authenticateSocket,
  verifyAccessToken,
};