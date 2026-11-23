// server/src/modules/auth/user.model.js
'use strict';

const mongoose = require('mongoose');
const { ACCOUNT_STATUS_LIST, ACCOUNT_STATUSES } = require('../../shared/constants/accountStatuses');
const { ROLE_LIST, ROLES } = require('../../shared/constants/roles');
const { PERMISSION_LIST } = require('../../shared/constants/permissions');

const RefreshTokenSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    deviceFingerprint: { type: String, default: null },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
  },
  { _id: false },
);

const AddressSchema = new mongoose.Schema(
  {
    region: { type: String, trim: true },
    zone: { type: String, trim: true },
    woreda: { type: String, trim: true },
    kebele: { type: String, trim: true },
    city: { type: String, trim: true },
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    geo: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordChangedAt: { type: Date, default: null },

    role: { type: String, enum: ROLE_LIST, required: true, default: ROLES.BUYER },
    roles: { type: [String], enum: ROLE_LIST, default: [] },
    permissions: { type: [String], enum: PERMISSION_LIST, default: [] },

    status: { type: String, enum: ACCOUNT_STATUS_LIST, default: ACCOUNT_STATUSES.PENDING, index: true },
    language: { type: String, enum: ['en', 'am'], default: 'en' },

    isEmailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    isPhoneVerified: { type: Boolean, default: false },
    phoneVerifiedAt: { type: Date, default: null },

    verificationStatus: { type: String, default: 'unverified' },
    verificationApplicationId: { type: mongoose.Schema.Types.ObjectId, default: null },

    address: { type: AddressSchema, default: null },
    businessName: { type: String, trim: true, default: null },
    providerType: { type: String, default: null },
    primaryCrops: { type: [String], default: [] },
    avatarUrl: { type: String, default: null },

    refreshTokens: { type: [RefreshTokenSchema], default: [] },
    tokenVersion: { type: Number, default: 0 },

    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: null },
    lastLoginUserAgent: { type: String, default: null },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

UserSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model('User', UserSchema);