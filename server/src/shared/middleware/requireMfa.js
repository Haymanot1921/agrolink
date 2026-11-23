// server/src/shared/middleware/requireMfa.js
// SRS §7.1 BR-008: privileged actions require step-up verification.
// Checks the `x-mfa-token` header (short-lived OTP JWT issued by
// modules/auth MFA challenge) for endpoints flagged as high-risk.

'use strict';

const jwt = require('jsonwebtoken');
const env = require('../../config/environment');
const logger = require('../../config/logger');
const { AppError } = require('../errors/AppError');

const MFA_SECRET = process.env.MFA_STEP_UP_SECRET || env.jwt.accessSecret;
const MFA_MAX_AGE_SECONDS = Number(process.env.MFA_MAX_AGE_SECONDS || 300); // 5 min

function readMfaToken(req) {
  return (
    req.headers['x-mfa-token'] ||
    req.headers['x-otp-token'] ||
    (req.body && req.body.mfaToken) ||
    null
  );
}

/**
 * @param {{ scope?: string, maxAgeSeconds?: number }} options
 *   scope — optional subject tag (e.g. 'admin:refund', 'admin:suspend_user')
 *           to ensure an MFA token issued for one action cannot be reused.
 */
function requireMfa(options = {}) {
  const { scope = null, maxAgeSeconds = MFA_MAX_AGE_SECONDS } = options;

  return function mfaGuard(req, res, next) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
      }

      const token = readMfaToken(req);
      if (!token) {
        return next(new AppError('MFA verification required', 401, 'MFA_REQUIRED'));
      }

      let payload;
      try {
        payload = jwt.verify(token, MFA_SECRET, {
          issuer: env.jwt.issuer,
          audience: env.jwt.audience,
        });
      } catch (err) {
        const code = err.name === 'TokenExpiredError' ? 'MFA_EXPIRED' : 'MFA_INVALID';
        return next(new AppError('Invalid or expired MFA token', 401, code));
      }

      if (payload.sub !== req.user.id) {
        return next(new AppError('MFA token does not belong to user', 401, 'MFA_MISMATCH'));
      }

      if (payload.type !== 'mfa_step_up') {
        return next(new AppError('Wrong token type for MFA', 401, 'MFA_WRONG_TYPE'));
      }

      if (scope && payload.scope !== scope) {
        return next(new AppError('MFA token scope mismatch', 401, 'MFA_SCOPE_MISMATCH'));
      }

      const ageSeconds = Math.floor(Date.now() / 1000) - (payload.iat || 0);
      if (ageSeconds > maxAgeSeconds) {
        return next(new AppError('MFA verification is stale', 401, 'MFA_STALE'));
      }

      req.mfa = { payload, verifiedAt: new Date(payload.iat * 1000) };
      logger.info('[mfa] step-up verified', { userId: req.user.id, scope: scope || 'default' });
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { requireMfa };