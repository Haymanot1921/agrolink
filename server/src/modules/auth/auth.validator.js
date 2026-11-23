// server/src/modules/auth/auth.validator.js
'use strict';

const Joi = require('joi');
const {
  email,
  password,
  phone,
  humanName,
  language,
  addressBlock,
} = require('../../shared/validators/commonSchemas');
const { ROLES } = require('../../shared/constants/roles');

const SELF_SIGNUP_ROLES = [
  ROLES.BUYER,
  ROLES.FARMER,
  ROLES.EXPERT,
  ROLES.SERVICE_PROVIDER,
];

const registerSchema = Joi.object({
  fullName: humanName.required(),
  email: email.required(),
  phone: phone.required(),
  password: password.required(),
  role: Joi.string()
    .valid(...SELF_SIGNUP_ROLES)
    .default(ROLES.BUYER),
  language: language.optional(),
  address: addressBlock.optional(),
  // Farmer-only hints (optional at signup)
  primaryCrops: Joi.array().items(Joi.string().max(60)).max(20).optional(),
  // Expert / provider metadata
  providerType: Joi.string().max(60).optional(),
  businessName: Joi.string().max(160).optional(),
}).unknown(false);

const loginSchema = Joi.object({
  identifier: Joi.string().min(3).max(254).required(), // email or phone
  password: Joi.string().min(1).max(128).required(),
  deviceFingerprint: Joi.string().max(200).optional(),
  language: language.optional(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().min(20).required(),
});

const logoutSchema = Joi.object({
  refreshToken: Joi.string().min(20).optional(),
  allDevices: Joi.boolean().default(false),
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().min(10).required(),
});

const verifyPhoneSchema = Joi.object({
  code: Joi.string().pattern(/^\d{4,8}$/).required(),
});

const requestPhoneOtpSchema = Joi.object({
  phone: phone.required(),
});

const requestPasswordResetSchema = Joi.object({
  identifier: Joi.string().min(3).max(254).required(), // email or phone
  channel: Joi.string().valid('email', 'sms').default('email'),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().min(10).required(),
  newPassword: password.required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).max(128).required(),
  newPassword: password.required(),
});

const requestMfaSchema = Joi.object({
  scope: Joi.string().max(120).required(),
});

const verifyMfaSchema = Joi.object({
  code: Joi.string().pattern(/^\d{6}$/).required(),
  scope: Joi.string().max(120).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  requestPhoneOtpSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  changePasswordSchema,
  requestMfaSchema,
  verifyMfaSchema,
};