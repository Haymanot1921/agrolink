// server/src/shared/middleware/authorizeRole.js
// Coarse role gate. Use for module entry (e.g. only buyers hit /api/v1/buyers/*).
// Fine-grained checks belong in authorizePermission.

'use strict';

const { AppError } = require('../errors/AppError');
const logger = require('../../config/logger');

/**
 * Allow only the listed roles. Accepts string or array.
 * Also accepts '*' as a wildcard (authenticated only).
 */
function authorizeRole(allowedRoles = []) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
    }

    if (roles.includes('*')) return next();

    const userRoles = Array.isArray(req.user.roles) && req.user.roles.length
      ? req.user.roles
      : [req.user.role];

    const allowed = userRoles.some((r) => roles.includes(r));
    if (!allowed) {
      logger.warn('[authz:role] denied', {
        userId: req.user.id,
        userRoles,
        required: roles,
        path: req.originalUrl,
      });
      return next(new AppError('Insufficient role', 403, 'ROLE_FORBIDDEN'));
    }
    return next();
  };
}

module.exports = { authorizeRole };