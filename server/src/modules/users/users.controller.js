// server/src/modules/users/users.controller.js
'use strict';

const service = require('./users.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { parsePagination } = require('../../shared/utils/pagination');

// --- Self-service ----------------------------------------------------------

async function getMe(req, res) {
  const profile = await service.getSelfProfile(req.user.id, buildProfileDeps());
  return ApiResponse.ok(res, profile);
}

async function getPublicProfile(req, res) {
  const profile = await service.getPublicProfile(req.params.id, buildProfileDeps());
  return ApiResponse.ok(res, profile);
}

async function updateMe(req, res) {
  const profile = await service.updateProfile({ userId: req.user.id, payload: req.body, req });
  return ApiResponse.ok(res, profile, undefined, 'Profile updated');
}

async function requestEmailChange(req, res) {
  const result = await service.requestEmailChange({
    userId: req.user.id,
    newEmail: req.body.newEmail,
    req,
  });
  return ApiResponse.ok(res, result);
}

async function changeEmail(req, res) {
  const result = await service.changeEmail({ userId: req.user.id, payload: req.body, req });
  return ApiResponse.ok(res, result, undefined, 'Email updated');
}

async function requestPhoneChange(req, res) {
  const result = await service.requestPhoneChange({
    userId: req.user.id,
    newPhone: req.body.newPhone,
    req,
  });
  return ApiResponse.ok(res, result);
}

async function changePhone(req, res) {
  const result = await service.changePhone({ userId: req.user.id, payload: req.body, req });
  return ApiResponse.ok(res, result, undefined, 'Phone updated');
}

async function setNotificationPreferences(req, res) {
  const result = await service.setNotificationPreferences({
    userId: req.user.id,
    prefs: req.body,
    req,
  });
  return ApiResponse.ok(res, result);
}

async function deactivateMe(req, res) {
  const result = await service.deactivateAccount({ userId: req.user.id, payload: req.body, req });
  return ApiResponse.ok(res, result, undefined, 'Account deactivated');
}

async function deleteMe(req, res) {
  const result = await service.deleteAccount({ userId: req.user.id, payload: req.body, req });
  return ApiResponse.ok(res, result, undefined, 'Account deleted');
}

// --- Admin-scope ----------------------------------------------------------

async function adminList(req, res) {
  const { page, limit, sort } = parsePagination(req.query, {
    allowedSortFields: ['createdAt', 'fullName', 'email', 'role', 'status', 'lastLoginAt'],
  });
  const { data, pagination } = await service.adminList({
    filter: {
      q: req.query.q,
      role: req.query.role,
      status: req.query.status,
      verified: req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined,
    },
    page,
    limit,
    sort,
  });
  return ApiResponse.paginated(res, data, pagination);
}

async function adminGetUser(req, res) {
  const profile = await service.adminGetUser(req.params.id);
  return ApiResponse.ok(res, profile);
}

async function adminUpdateStatus(req, res) {
  const result = await service.adminUpdateStatus({
    targetUserId: req.params.id,
    payload: req.body,
    req,
  });
  return ApiResponse.ok(res, result);
}

async function adminChangeRole(req, res) {
  const result = await service.adminChangeRole({
    targetUserId: req.params.id,
    payload: req.body,
    req,
  });
  return ApiResponse.ok(res, result);
}

// --- Dependency injection for profile factory ---------------------------
// Each profile field is computed lazily from its owning module. Errors are
// swallowed inside profile.factory — a failure here cannot break profile reads.
function buildProfileDeps() {
  return {
    getListingStats: async (farmerId) => {
      // eslint-disable-next-line global-require
      const Listing = require('../farmer/listings/listing.model');
      const [total, published, pending] = await Promise.all([
        Listing.countDocuments({ farmerId }),
        Listing.countDocuments({ farmerId, status: 'published' }),
        Listing.countDocuments({ farmerId, status: 'pending_review' }),
      ]);
      return { total, published, pending };
    },
    getOrderStats: async (userId) => {
      // eslint-disable-next-line global-require
      const Order = require('../buyer/buyer-orders/order.model');
      const [total, completed] = await Promise.all([
        Order.countDocuments({ $or: [{ buyerId: userId }, { farmerId: userId }] }),
        Order.countDocuments({
          $or: [{ buyerId: userId }, { farmerId: userId }],
          status: 'completed',
        }),
      ]);
      return { total, completed };
    },
    getConsultationStats: async (expertId) => {
      // eslint-disable-next-line global-require
      const Consultation = require('../buyer/buyer-consultations/consultation.model');
      const now = new Date();
      const [total, upcoming] = await Promise.all([
        Consultation.countDocuments({ expertId }),
        Consultation.countDocuments({ expertId, status: 'scheduled', scheduledAt: { $gte: now } }),
      ]);
      return { total, upcoming };
    },
    getReviewSummary: async (subjectId) => {
      // eslint-disable-next-line global-require
      const Review = require('../buyer/buyer-reviews/review.model');
      const agg = await Review.aggregate([
        { $match: { subjectId: new (require('mongoose').Types.ObjectId)(String(subjectId)), status: 'published' } },
        { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      const r = agg[0] || { averageRating: 0, count: 0 };
      return { averageRating: Math.round((r.averageRating || 0) * 10) / 10, count: r.count };
    },
    getConsentSummary: async (farmerId) => {
      // eslint-disable-next-line global-require
      const Consent = require('../administrator/assisted-farmer-monitoring/consentRecordReview.model');
      const now = new Date();
      const warn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const [active, expiring] = await Promise.all([
        Consent.countDocuments({ farmerId, status: 'active' }),
        Consent.countDocuments({ farmerId, status: 'active', expiresAt: { $lte: warn, $gt: now } }),
      ]);
      return { active, expiring };
    },
  };
}

module.exports = {
  getMe,
  getPublicProfile,
  updateMe,
  requestEmailChange,
  changeEmail,
  requestPhoneChange,
  changePhone,
  setNotificationPreferences,
  deactivateMe,
  deleteMe,
  adminList,
  adminGetUser,
  adminUpdateStatus,
  adminChangeRole,
};