// server/src/modules/verification/verification.repository.js
// The applicant-facing repository. Admins have their own repository
// (modules/administrator/identity-verification/verification.repository.js)
// that handles list-all, decision-write, etc.
'use strict';

const mongoose = require('mongoose');

// Reuse the admin-side model to guarantee a single collection.
// eslint-disable-next-line global-require
const VerificationApplication = require('../administrator/identity-verification/verificationApplication.model');

async function findLatestByUser(userId) {
  return VerificationApplication.findOne({ applicantId: userId })
    .sort({ createdAt: -1 })
    .lean();
}

async function findByIdForUser(applicationId, userId) {
  return VerificationApplication.findOne({
    _id: applicationId,
    applicantId: userId,
  }).lean();
}

async function listByUser(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    VerificationApplication.find({ applicantId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    VerificationApplication.countDocuments({ applicantId: userId }),
  ]);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function hasOpenApplication(userId) {
  const count = await VerificationApplication.countDocuments({
    applicantId: userId,
    status: { $in: ['pending', 'under_review', 'additional_info_requested'] },
  });
  return count > 0;
}

async function createApplication(data) {
  const doc = new VerificationApplication(data);
  await doc.save();
  return doc;
}

async function updateApplication(applicationId, patch) {
  return VerificationApplication.findOneAndUpdate(
    { _id: applicationId },
    { $set: patch },
    { new: true, runValidators: true },
  );
}

/**
 * Applicant withdraws their application (only allowed while pending).
 */
async function withdrawApplication(applicationId, userId) {
  return VerificationApplication.findOneAndUpdate(
    { _id: applicationId, applicantId: userId, status: { $in: ['pending', 'additional_info_requested'] } },
    { $set: { status: 'rejected', withdrawnAt: new Date(), withdrawnByApplicant: true } },
    { new: true },
  );
}

async function toObjectId(id) {
  return id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(String(id));
}

module.exports = {
  findLatestByUser,
  findByIdForUser,
  listByUser,
  hasOpenApplication,
  createApplication,
  updateApplication,
  withdrawApplication,
  toObjectId,
};