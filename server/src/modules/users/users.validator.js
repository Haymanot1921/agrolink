// server/src/modules/users/users.validator.js
'use strict';

const Joi = require('joi');
const {
  email,
  phone,
  humanName,
  language,
  addressBlock,
  url,
  idOrIds,
  reasonText,
} = require('../../shared/validators/commonSchemas');
const { buildPaginationSchema } = require('../../shared/validators/paginationSchema');
const { ROLES } = require('../../shared/constants/roles');

const listQuery = buildPaginationSchema({
  allowedSortFields: ['createdAt', 'fullName', 'email', 'role', 'status', 'lastLoginAt'],
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
});

// Profile update — a subset that users can change directly.
// Email + phone are intentionally omitted; those go through OTP verification.
const updateProfileSchema = Joi.object({
  fullName: humanName.optional(),
  language: language.optional(),
  address: addressBlock.optional(),
  avatarUrl: url.optional(),
  businessName: Joi.string().max(160).optional(),
  bio: Joi.string().max(1000).optional(),
  // Farmer-specific
  primaryCrops: Joi.array().items(Joi.string().max(60)).max(20).optional(),
  farmingExperienceYears: Joi.number().integer().min(0).max(80).optional(),
  // Expert / service-provider-specific
  providerType: Joi.string().max(60).optional(),
  yearsOfExperience: Joi.number().integer().min(0).max(80).optional(),
  specialties: Joi.array().items(Joi.string().max(120)).max(20).optional(),
  // Notification preferences
  notificationPreferences: Joi.object({
    email: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
    inApp: Joi.boolean().optional(),
  }).optional(),
}).min(1).unknown(false);

// Staged email change — verifies OTP before finalizing.
const changeEmailSchema = Joi.object({
  newEmail: email.required(),
  otpCode: Joi.string().pattern(/^\d{4,8}$/).required(),
});

// Staged phone change — verifies OTP before finalizing.
const changePhoneSchema = Joi.object({
  newPhone: phone.required(),
  otpCode: Joi.string().pattern(/^\d{4,8}$/).required(),
});

const deactivateSchema = Joi.object({
  currentPassword: Joi.string().min(1).max(128).required(),
  reason: Joi.string().max(500).optional(),
});

const deleteAccountSchema = Joi.object({
  currentPassword: Joi.string().min(1).max(128).required(),
  reason: reasonText.optional(),
  confirmPhrase: Joi.string().valid('DELETE MY ACCOUNT').required(),
});

const setNotificationPreferencesSchema = Joi.object({
  email: Joi.boolean(),
  sms: Joi.boolean(),
  push: Joi.boolean(),
  inApp: Joi.boolean(),
}).min(1);

// Admin-scope operations on users (kept here so admin module can re-export).
const adminListQuery = buildPaginationSchema({
  allowedSortFields: ['createdAt', 'fullName', 'email', 'role', 'status', 'lastLoginAt'],
});

const adminUpdateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'suspended', 'deactivated').required(),
  reason: reasonText.required(),
  notifyUser: Joi.boolean().default(true),
});

const adminBulkActionSchema = Joi.object({
  userIds: idOrIds.required(),
  action: Joi.string().valid('suspend', 'reactivate').required(),
  reason: reasonText.required(),
});

const adminRoleChangeSchema = Joi.object({
  newRole: Joi.string().valid(...Object.values(ROLES)).required(),
  reason: reasonText.required(),
});

module.exports = {
  listQuery,
  updateProfileSchema,
  changeEmailSchema,
  changePhoneSchema,
  deactivateSchema,
  deleteAccountSchema,
  setNotificationPreferencesSchema,
  adminListQuery,
  adminUpdateStatusSchema,
  adminBulkActionSchema,
  adminRoleChangeSchema,
};