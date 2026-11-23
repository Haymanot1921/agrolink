// server/src/modules/users/users.controller.js
'use strict';

const service = require('./users.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { parsePagination } = require('../../shared/utils/pagination');
const database = require('../../config/database');

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
      const [[stats]] = await database.query(
        `SELECT COUNT(*) AS total,
                SUM(status = 'published') AS published,
                SUM(status = 'pending_review') AS pending
         FROM listings WHERE farmer_id = ? AND deleted_at IS NULL`,
        [farmerId],
      );
      return {
        total: Number(stats.total),
        published: Number(stats.published || 0),
        pending: Number(stats.pending || 0),
      };
    },
    getOrderStats: async (userId) => {
      const [[stats]] = await database.query(
        `SELECT COUNT(*) AS total, SUM(status = 'completed') AS completed
         FROM orders WHERE buyer_id = ? OR farmer_id = ?`,
        [userId, userId],
      );
      return { total: Number(stats.total), completed: Number(stats.completed || 0) };
    },
    getConsultationStats: async (expertId) => {
      const now = new Date();
      const [[stats]] = await database.query(
        `SELECT COUNT(*) AS total,
                SUM(status = 'scheduled' AND scheduled_at >= ?) AS upcoming
         FROM consultations WHERE expert_id = ?`,
        [now, expertId],
      );
      return { total: Number(stats.total), upcoming: Number(stats.upcoming || 0) };
    },
    getReviewSummary: async (subjectId) => {
      const [[stats]] = await database.query(
        `SELECT AVG(rating) AS averageRating, COUNT(*) AS count
         FROM reviews WHERE subject_id = ? AND status = 'published'`,
        [subjectId],
      );
      return {
        averageRating: Math.round(Number(stats.averageRating || 0) * 10) / 10,
        count: Number(stats.count),
      };
    },
    getConsentSummary: async (farmerId) => {
      const now = new Date();
      const warn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const [[stats]] = await database.query(
        `SELECT COUNT(*) AS active,
                SUM(expires_at > ? AND expires_at <= ?) AS expiring
         FROM consent_records WHERE farmer_id = ? AND status = 'active'`,
        [now, warn, farmerId],
      );
      return { active: Number(stats.active), expiring: Number(stats.expiring || 0) };
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