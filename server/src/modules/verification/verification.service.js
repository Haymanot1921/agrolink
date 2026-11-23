// server/src/modules/verification/verification.service.js
// Applicant-side business logic. Admin decisions are made in
// modules/administrator/identity-verification/verification.service.js —
// that module writes the decision; this module reads it and allows the
// applicant to submit/re-upload/withdraw.
'use strict';

const repository = require('./verification.repository');
const usersRepository = require('../users/users.repository');
const uploadService = require('../uploads/upload.service');
const notificationsService = require('../notifications/notifications.service');
const { ApiError } = require('../../shared/utils/ApiError');
const { writeAudit } = require('../../shared/utils/auditLogger');
const { AUDIT_EVENT_TYPES } = require('../../shared/constants/auditEventTypes');
const { NOTIFICATION_TYPES } = require('../../shared/constants/notificationTypes');
const {
  VERIFICATION_STATUSES,
  VERIFICATION_DOCUMENT_TYPE_LIST,
  requiredDocumentsForRole,
} = require('../../shared/constants/verificationStatuses');
const { ROLES } = require('../../shared/constants/roles');

// --- Submission ------------------------------------------------------------

/**
 * Submit a new identity verification application.
 *
 * Body (from validator):
 *   documentTypes: string[]   — must cover requiredDocumentsForRole(user.role)
 *   documents: Array<{ publicId, url, fileName, mimeType, size }>
 *                               — one per documentType (order matters unless
 *                                 documentTypes entry is per-doc)
 *   notes: optional
 */
async function submitApplication({ user, payload, req }) {
  // 1. Guard role — admins/support agents can't self-verify this way.
  const verifiableRoles = [ROLES.BUYER, ROLES.FARMER, ROLES.EXPERT, ROLES.SERVICE_PROVIDER];
  if (!verifiableRoles.includes(user.role)) {
    throw ApiError.forbidden('Role not eligible for self-verification', 'ROLE_NOT_ELIGIBLE');
  }

  // 2. Prevent duplicate open applications.
  const hasOpen = await repository.hasOpenApplication(user.id);
  if (hasOpen) {
    throw ApiError.conflict(
      'You already have an open verification application',
      'VERIFICATION_ALREADY_OPEN',
    );
  }

  // 3. Validate required documents per role.
  const required = requiredDocumentsForRole(user.role);
  const submittedTypes = Array.isArray(payload.documentTypes) ? payload.documentTypes : [];
  const missing = required.filter((t) => !submittedTypes.includes(t));
  if (missing.length) {
    throw ApiError.unprocessable(
      'Missing required documents',
      missing.map((t) => ({ field: 'documentTypes', missing: t })),
      'MISSING_REQUIRED_DOCUMENTS',
    );
  }

  // 4. Ensure every submitted document type is valid.
  const invalidTypes = submittedTypes.filter((t) => !VERIFICATION_DOCUMENT_TYPE_LIST.includes(t));
  if (invalidTypes.length) {
    throw ApiError.unprocessable(
      'Invalid document type',
      invalidTypes.map((t) => ({ field: 'documentTypes', invalid: t })),
      'INVALID_DOCUMENT_TYPE',
    );
  }

  // 5. Cross-check documents array — one per document type.
  if (!Array.isArray(payload.documents) || payload.documents.length !== submittedTypes.length) {
    throw ApiError.unprocessable(
      'Each submitted document type must have exactly one uploaded file',
      [{ field: 'documents', expected: submittedTypes.length, received: payload.documents?.length || 0 }],
      'DOCUMENT_COUNT_MISMATCH',
    );
  }

  // 6. Verify every document was uploaded via the shared uploads module
  //    and belongs to this applicant (folder prefix `<purpose>/<userId>/`).
  for (let i = 0; i < payload.documents.length; i += 1) {
    const d = payload.documents[i];
    if (!d || !d.publicId) {
      throw ApiError.unprocessable(
        'Document reference missing publicId',
        [{ field: `documents[${i}].publicId` }],
        'DOCUMENT_MISSING_PUBLICID',
      );
    }
    const parts = String(d.publicId).split('/');
    if (parts[1] !== String(user.id)) {
      throw ApiError.forbidden(
        `Document ${i} does not belong to you`,
        'DOCUMENT_OWNERSHIP_MISMATCH',
      );
    }
  }

  // 7. Build document records.
  const documents = payload.documents.map((d, idx) => ({
    documentType: submittedTypes[idx],
    publicId: d.publicId,
    url: d.url || null,
    signedUrl: d.signedUrl || null,
    fileName: d.fileName || null,
    mimeType: d.mimeType || null,
    size: d.size || null,
    uploadedAt: new Date(),
  }));

  // 8. Create the application.
  const application = await repository.createApplication({
    applicantId: user.id,
    applicantRole: user.role,
    status: VERIFICATION_STATUSES.PENDING,
    submittedAt: new Date(),
    notes: payload.notes || null,
    documents,
    documentTypes: submittedTypes,
    reviewHistory: [
      { event: 'submitted', at: new Date(), actorId: user.id, actorRole: user.role },
    ],
  });

  // 9. Update user's verificationStatus so account module can gate features.
  await usersRepository.updateById(user.id, {
    verificationStatus: VERIFICATION_STATUSES.PENDING,
    verificationApplicationId: application._id,
  });

  // 10. Notify applicant + admin queue.
  await notificationsService.dispatch({
    userId: String(user.id),
    type: NOTIFICATION_TYPES.VERIFICATION_SUBMITTED,
    title: 'Verification submitted',
    body: 'Your identity verification is under review. We will notify you once a decision is made.',
    data: { applicationId: String(application._id), deepLink: '/profile/verification' },
    priority: 'normal',
  });
  await notificationsService.dispatch({
    userId: 'role:admin',
    type: NOTIFICATION_TYPES.ADMIN_NEW_VERIFICATION,
    title: 'New verification application',
    body: `${user.fullName} submitted identity verification documents`,
    data: { applicationId: String(application._id), deepLink: `/administrator/identity-verification/${application._id}` },
    priority: 'normal',
  });

  // 11. Audit.
  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.VERIFICATION_SUBMITTED,
    category: 'verification',
    targetType: 'verification_application',
    targetId: application._id,
    severity: 'medium',
    metadata: {
      applicantRole: user.role,
      documentTypes: submittedTypes,
    },
  });

  return sanitizeApplication(application);
}

// --- Read -----------------------------------------------------------------

async function getMyStatus({ user }) {
  const latest = await repository.findLatestByUser(user.id);
  if (!latest) {
    return { status: VERIFICATION_STATUSES.UNVERIFIED, application: null };
  }
  return { status: latest.status, application: sanitizeApplication(latest) };
}

async function getMyApplication({ user, applicationId }) {
  const app = await repository.findByIdForUser(applicationId, user.id);
  if (!app) throw ApiError.notFound('Application not found', 'APPLICATION_NOT_FOUND');
  return sanitizeApplication(app);
}

async function listMyApplications({ user, page, limit }) {
  return repository.listByUser(user.id, { page, limit });
}

// --- Updates --------------------------------------------------------------

/**
 * Applicant re-uploads documents after admin requests more info.
 * Only allowed while status === ADDITIONAL_INFO_REQUESTED.
 */
async function uploadAdditionalDocuments({ user, applicationId, payload, req }) {
  const app = await repository.findByIdForUser(applicationId, user.id);
  if (!app) throw ApiError.notFound('Application not found', 'APPLICATION_NOT_FOUND');

  if (app.status !== VERIFICATION_STATUSES.ADDITIONAL_INFO_REQUESTED) {
    throw ApiError.conflict(
      'Additional documents are only allowed when more information is requested',
      'INVALID_STATUS_FOR_UPLOAD',
    );
  }

  if (!Array.isArray(payload.documents) || !payload.documents.length) {
    throw ApiError.badRequest('No documents supplied', 'NO_DOCUMENTS');
  }

  // Verify ownership of each public ID (same rule as submit).
  for (const d of payload.documents) {
    const parts = String(d.publicId || '').split('/');
    if (parts[1] !== String(user.id)) {
      throw ApiError.forbidden('Document does not belong to you', 'DOCUMENT_OWNERSHIP_MISMATCH');
    }
  }

  const appended = payload.documents.map((d, idx) => ({
    documentType: payload.documentTypes ? payload.documentTypes[idx] : d.documentType || 'other',
    publicId: d.publicId,
    url: d.url || null,
    signedUrl: d.signedUrl || null,
    fileName: d.fileName || null,
    mimeType: d.mimeType || null,
    size: d.size || null,
    uploadedAt: new Date(),
    isAdditional: true,
  }));

  const updated = await repository.updateApplication(applicationId, {
    status: VERIFICATION_STATUSES.UNDER_REVIEW,
    documents: [...(app.documents || []), ...appended],
    additionalInfoSubmittedAt: new Date(),
    $push: {
      reviewHistory: {
        event: 'additional_info_submitted',
        at: new Date(),
        actorId: user.id,
        actorRole: user.role,
      },
    },
  });

  await notificationsService.dispatch({
    userId: 'role:admin',
    type: NOTIFICATION_TYPES.ADMIN_NEW_VERIFICATION,
    title: 'Additional verification documents',
    body: `${user.fullName} submitted additional documents`,
    data: { applicationId: String(applicationId), deepLink: `/administrator/identity-verification/${applicationId}` },
    priority: 'high',
  });

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.VERIFICATION_SUBMITTED,
    category: 'verification',
    targetType: 'verification_application',
    targetId: applicationId,
    severity: 'medium',
    metadata: { isAdditional: true, count: appended.length },
  });

  return sanitizeApplication(updated);
}

/**
 * Applicant withdraws an open application.
 */
async function withdrawMyApplication({ user, applicationId, req, reason }) {
  const app = await repository.findByIdForUser(applicationId, user.id);
  if (!app) throw ApiError.notFound('Application not found', 'APPLICATION_NOT_FOUND');

  if (!['pending', 'additional_info_requested'].includes(app.status)) {
    throw ApiError.conflict('Application cannot be withdrawn in current status', 'INVALID_STATUS_FOR_WITHDRAW');
  }

  const updated = await repository.withdrawApplication(applicationId, user.id);
  if (!updated) {
    throw ApiError.conflict('Withdrawal failed', 'WITHDRAW_FAILED');
  }

  await usersRepository.updateById(user.id, {
    verificationStatus: VERIFICATION_STATUSES.UNVERIFIED,
    verificationApplicationId: null,
  });

  await writeAudit({
    req,
    action: AUDIT_EVENT_TYPES.VERIFICATION_REJECTED,
    category: 'verification',
    targetType: 'verification_application',
    targetId: applicationId,
    severity: 'medium',
    reason: reason || 'withdrawn by applicant',
    metadata: { withdrawnByApplicant: true },
  });

  return { ok: true };
}

// --- Helpers ---------------------------------------------------------------

function sanitizeApplication(app) {
  if (!app) return null;
  return {
    id: String(app._id),
    status: app.status,
    applicantRole: app.applicantRole,
    submittedAt: app.submittedAt,
    reviewedAt: app.reviewedAt || null,
    infoRequestedAt: app.infoRequestedAt || null,
    rejectionReason: app.rejectionReason || null,
    rejectionNote: app.rejectionNote || null,
    documentTypes: app.documentTypes || [],
    documents: (app.documents || []).map((d) => ({
      documentType: d.documentType,
      publicId: d.publicId,
      fileName: d.fileName,
      mimeType: d.mimeType,
      size: d.size,
      uploadedAt: d.uploadedAt,
      // NOTE: no signedUrl in the read payload — client requests it on-demand
      // via GET /uploads/sign?publicId=... to keep URLs short-lived.
    })),
    reviewHistory: app.reviewHistory || [],
  };
}

module.exports = {
  submitApplication,
  getMyStatus,
  getMyApplication,
  listMyApplications,
  uploadAdditionalDocuments,
  withdrawMyApplication,
};