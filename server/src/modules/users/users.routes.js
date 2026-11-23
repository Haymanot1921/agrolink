// server/src/modules/users/users.routes.js
'use strict';

const router = require('express').Router();
const controller = require('./users.controller');
const validators = require('./users.validator');
const { authenticate } = require('../../shared/middleware/authenticate');
const { authorizeRole } = require('../../shared/middleware/authorizeRole');
const { authorizePermission } = require('../../shared/middleware/authorizePermission');
const { requireMfa } = require('../../shared/middleware/requireMfa');
const { validateRequest } = require('../../shared/middleware/validateRequest');
const { adminMutationLimiter } = require('../../shared/middleware/rateLimiter');
const { asyncHandler } = require('../../shared/utils/asyncHandler');
const { PERMISSIONS } = require('../../shared/constants/permissions');
const { PRIVILEGED_ROLES } = require('../../shared/constants/roles');

// --- Self-service (authenticated) -----------------------------------------
router.get('/me', authenticate, asyncHandler(controller.getMe));
router.patch(
  '/me',
  authenticate,
  validateRequest({ body: validators.updateProfileSchema }),
  asyncHandler(controller.updateMe),
);
router.post(
  '/me/email/request',
  authenticate,
  validateRequest({ body: validators.changeEmailSchema.fork(['otpCode'], (s) => s.optional()) }),
  asyncHandler(controller.requestEmailChange),
);
router.post(
  '/me/email/verify',
  authenticate,
  validateRequest({ body: validators.changeEmailSchema }),
  asyncHandler(controller.changeEmail),
);
router.post(
  '/me/phone/request',
  authenticate,
  validateRequest({ body: validators.changePhoneSchema.fork(['otpCode'], (s) => s.optional()) }),
  asyncHandler(controller.requestPhoneChange),
);
router.post(
  '/me/phone/verify',
  authenticate,
  validateRequest({ body: validators.changePhoneSchema }),
  asyncHandler(controller.changePhone),
);
router.patch(
  '/me/notifications',
  authenticate,
  validateRequest({ body: validators.setNotificationPreferencesSchema }),
  asyncHandler(controller.setNotificationPreferences),
);
router.post(
  '/me/deactivate',
  authenticate,
  validateRequest({ body: validators.deactivateSchema }),
  asyncHandler(controller.deactivateMe),
);
router.post(
  '/me/delete',
  authenticate,
  validateRequest({ body: validators.deleteAccountSchema }),
  asyncHandler(controller.deleteMe),
);

// --- Public profile (view another user) -----------------------------------
router.get('/:id/public', authenticate, asyncHandler(controller.getPublicProfile));

// --- Admin-scope ----------------------------------------------------------
const adminRouter = require('express').Router();
adminRouter.use(authenticate, authorizeRole(PRIVILEGED_ROLES));

adminRouter.get(
  '/',
  authorizePermission(PERMISSIONS.USERS_READ),
  validateRequest({ query: validators.adminListQuery }),
  asyncHandler(controller.adminList),
);
adminRouter.get(
  '/:id',
  authorizePermission(PERMISSIONS.USERS_READ),
  asyncHandler(controller.adminGetUser),
);
adminRouter.patch(
  '/:id/status',
  adminMutationLimiter,
  authorizePermission(PERMISSIONS.USERS_SUSPEND),
  requireMfa({ scope: 'admin.user.suspend' }),
  validateRequest({ body: validators.adminUpdateStatusSchema }),
  asyncHandler(controller.adminUpdateStatus),
);
adminRouter.patch(
  '/:id/role',
  adminMutationLimiter,
  authorizePermission(PERMISSIONS.USERS_ROLE_CHANGE),
  requireMfa({ scope: 'admin.user.role' }),
  validateRequest({ body: validators.adminRoleChangeSchema }),
  asyncHandler(controller.adminChangeRole),
);

router.use('/admin', adminRouter);

module.exports = router;