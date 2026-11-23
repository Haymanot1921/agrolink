// server/src/modules/auth/auth.routes.js
'use strict';

const router = require('express').Router();
const controller = require('./auth.controller');
const validators = require('./auth.validator');
const { validateRequest } = require('../../shared/middleware/validateRequest');
const { authenticate } = require('../../shared/middleware/authenticate');
const { authLimiter, passwordResetLimiter } = require('../../shared/middleware/rateLimiter');
const { asyncHandler } = require('../../shared/utils/asyncHandler');

// --- Public ----------------------------------------------------------------
router.post(
  '/register',
  authLimiter,
  validateRequest({ body: validators.registerSchema }),
  asyncHandler(controller.register),
);

router.post(
  '/login',
  authLimiter,
  validateRequest({ body: validators.loginSchema }),
  asyncHandler(controller.login),
);

router.post(
  '/refresh',
  validateRequest({ body: validators.refreshSchema }),
  asyncHandler(controller.refresh),
);

router.post(
  '/password/request-reset',
  passwordResetLimiter,
  validateRequest({ body: validators.requestPasswordResetSchema }),
  asyncHandler(controller.requestPasswordReset),
);

router.post(
  '/password/reset',
  passwordResetLimiter,
  validateRequest({ body: validators.resetPasswordSchema }),
  asyncHandler(controller.resetPassword),
);

// --- Authenticated ---------------------------------------------------------

router.post(
  '/logout',
  authenticate,
  validateRequest({ body: validators.logoutSchema }),
  asyncHandler(controller.logout),
);

router.post(
  '/email/verify',
  authenticate,
  validateRequest({ body: validators.verifyEmailSchema }),
  asyncHandler(controller.verifyEmail),
);

router.post(
  '/phone/request-otp',
  authenticate,
  validateRequest({ body: validators.requestPhoneOtpSchema }),
  asyncHandler(controller.requestPhoneOtp),
);

router.post(
  '/phone/verify',
  authenticate,
  validateRequest({ body: validators.verifyPhoneSchema }),
  asyncHandler(controller.verifyPhone),
);

router.post(
  '/password/change',
  authenticate,
  validateRequest({ body: validators.changePasswordSchema }),
  asyncHandler(controller.changePassword),
);

// --- MFA step-up ----------------------------------------------------------

router.post(
  '/mfa/request',
  authenticate,
  validateRequest({ body: validators.requestMfaSchema }),
  asyncHandler(controller.requestMfa),
);

router.post(
  '/mfa/verify',
  authenticate,
  validateRequest({ body: validators.verifyMfaSchema }),
  asyncHandler(controller.verifyMfa),
);

module.exports = router;