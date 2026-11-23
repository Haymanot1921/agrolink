// server/src/shared/middleware/authorizePermission.js
// Fine-grained RBAC (FR-ADMIN-002, SRS §14.2 BR-008).
// Every privileged endpoint in modules/administrator/* uses this.
// Permission strings live in permission.model.js and are seeded at boot.

'use strict';

const { AppError } = require('../errors/AppError');
const logger = require('../../config/logger');

const ADMIN_SUPERPERMISSION = 'admin'; // superadmin bypass

function normalize(required) {
  if (!required) return [];
  if (Array.isArray(required)) return required.flat();
  return [required];
}

/**
 * @param {string|string[]} required — permission code(s) required
 * @param {{ mode?: 'all'|'any', superAdmin?: boolean }} options
 */
function authorizePermission(required, options = {}) {
  const { mode = 'all', superAdmin = true } = options;
  const needed = normalize(required);

  return async function permissionGuard(req, res, next) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
      }

      const userPerms = Array.isArray(req.user.permissions) ? req.user.permissions : [];

      if (superAdmin && userPerms.includes(ADMIN_SUPERPERMISSION)) {
        return next();
      }

      const check = mode === 'any'
        ? needed.some((p) => userPerms.includes(p))
        : needed.every((p) => userPerms.includes(p));

      if (!check) {
        logger.warn('[authz:permission] denied', {
          userId: req.user.id,
          needed,
          mode,
          path: req.originalUrl,
        });
        return next(
          new AppError(
            `Missing permission: ${needed.join(mode === 'any' ? ' | ' : ' & ')}`,
            403,
            'PERMISSION_FORBIDDEN',
          ),
        );
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { authorizePermission, ADMIN_SUPERPERMISSION };