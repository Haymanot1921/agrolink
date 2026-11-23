// server/src/modules/uploads/upload.service.js
// Business logic for uploads. Called by upload.controller, verification,
// disputes, listing images, and article media.
'use strict';

const crypto = require('crypto');
const cloudinary = require('../../config/cloudinary');
const env = require('../../config/environment');
const logger = require('../../config/logger');
const { ApiError } = require('../../shared/utils/ApiError');
const { writeAudit } = require('../../shared/utils/auditLogger');
const { AUDIT_EVENT_TYPES } = require('../../shared/constants/auditEventTypes');
const { ROLES } = require('../../shared/constants/roles');

// --- Folder scoping --------------------------------------------------------
// Deterministic folder per purpose + owner. This prevents:
//   - one user overwriting another's files
//   - privilege confusion (e.g. a buyer uploading into verification docs)
const FOLDER_SCOPES = Object.freeze({
  avatar: { prefix: 'avatars', allow: [ROLES.BUYER, ROLES.FARMER, ROLES.EXPERT, ROLES.SERVICE_PROVIDER, ROLES.SUPPORT_AGENT, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  listing_image: { prefix: 'listings', allow: [ROLES.FARMER] },
  article_image: { prefix: 'articles', allow: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  verification_document: { prefix: 'verification-docs', allow: [ROLES.BUYER, ROLES.FARMER, ROLES.EXPERT, ROLES.SERVICE_PROVIDER] },
  dispute_evidence: { prefix: 'dispute-evidence', allow: [ROLES.BUYER, ROLES.FARMER, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  support_attachment: { prefix: 'support-attachments', allow: [ROLES.BUYER, ROLES.FARMER, ROLES.EXPERT, ROLES.SERVICE_PROVIDER, ROLES.SUPPORT_AGENT] },
});

// Per-purpose content-type rules. Any attempt to upload a disallowed MIME
// is rejected at both the middleware and service layer (defense in depth).
const MIME_RULES = Object.freeze({
  avatar: ['image/jpeg', 'image/png', 'image/webp'],
  listing_image: ['image/jpeg', 'image/png', 'image/webp'],
  article_image: ['image/jpeg', 'image/png', 'image/webp'],
  verification_document: ['image/jpeg', 'image/png', 'application/pdf'],
  dispute_evidence: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  support_attachment: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
});

const SIZE_LIMITS = Object.freeze({
  avatar: 2 * 1024 * 1024,
  listing_image: 5 * 1024 * 1024,
  article_image: 5 * 1024 * 1024,
  verification_document: 15 * 1024 * 1024,
  dispute_evidence: 15 * 1024 * 1024,
  support_attachment: 10 * 1024 * 1024,
});

function assertPurposeAllowed({ purpose, user }) {
  const rule = FOLDER_SCOPES[purpose];
  if (!rule) throw ApiError.badRequest(`Unknown upload purpose: ${purpose}`, 'INVALID_PURPOSE');
  const roles = Array.isArray(user.roles) && user.roles.length ? user.roles : [user.role];
  if (!roles.some((r) => rule.allow.includes(r))) {
    throw ApiError.forbidden(`Role cannot upload ${purpose}`, 'UPLOAD_FORBIDDEN');
  }
  return rule;
}

function assertMimeAllowed({ purpose, mimeType }) {
  const allowed = MIME_RULES[purpose] || [];
  if (!allowed.includes(mimeType)) {
    throw ApiError.unprocessable(
      `File type not allowed for ${purpose}`,
      [{ field: 'file', allowed, received: mimeType }],
      'MIME_NOT_ALLOWED',
    );
  }
}

function assertSizeAllowed({ purpose, size }) {
  const limit = SIZE_LIMITS[purpose] || env.uploads.maxFileSizeMb * 1024 * 1024;
  if (!size || size <= 0) {
    throw ApiError.badRequest('Empty file', 'EMPTY_FILE');
  }
  if (size > limit) {
    throw ApiError.unprocessable(
      `File exceeds ${Math.round(limit / 1024 / 1024)}MB limit`,
      [{ field: 'file', limitBytes: limit, receivedBytes: size }],
      'FILE_TOO_LARGE',
    );
  }
}

function buildPublicId({ purpose, ownerId, originalName }) {
  const ext = getExtension(originalName) || defaultExtForPurpose(purpose);
  const stamp = Date.now();
  const rand = crypto.randomBytes(6).toString('hex');
  return `${purpose}-${stamp}-${rand}.${ext}`;
}

function getExtension(name) {
  if (!name) return null;
  const m = String(name).match(/\.([A-Za-z0-9]{1,8})$/);
  return m ? m[1].toLowerCase() : null;
}

function defaultExtForPurpose(purpose) {
  if (purpose === 'verification_document' || purpose === 'dispute_evidence' || purpose === 'support_attachment') {
    return 'jpg'; // fallback; Cloudinary will normalize
  }
  return 'jpg';
}

// --- Upload orchestration -------------------------------------------------

/**
 * Upload a single buffer (called by controller for each file).
 * @param {Object} params
 * @param {Buffer} params.buffer
 * @param {string} params.originalName
 * @param {string} params.mimeType
 * @param {number} params.size
 * @param {string} params.purpose
 * @param {Object} params.user — req.user
 * @param {Object} [params.req] — for audit logging
 * @param {Object} [params.metadata] — optional context ({ verificationId, disputeId, ... })
 */
async function uploadOne({ buffer, originalName, mimeType, size, purpose, user, req, metadata }) {
  const scope = assertPurposeAllowed({ purpose, user });
  assertMimeAllowed({ purpose, mimeType });
  assertSizeAllowed({ purpose, size });

  if (!cloudinary.isEnabled()) {
    throw ApiError.serviceUnavailable('File storage not configured', 'CLOUDINARY_DISABLED');
  }

  const publicId = buildPublicId({ purpose, ownerId: user.id, originalName });
  const folder = `${scope.prefix}/${user.id}`; // per-owner isolation

  let result;
  try {
    result = await cloudinary.uploadBuffer(buffer, {
      folder,
      publicId,
      resourceType: purpose === 'verification_document' || purpose === 'dispute_evidence' || purpose === 'support_attachment'
        ? 'auto'
        : 'image',
      tags: [purpose, String(user.id)],
    });
  } catch (err) {
    logger.error('[uploads] cloudinary upload failed', { purpose, message: err.message });
    throw ApiError.serviceUnavailable('Upload failed', 'UPLOAD_FAILED');
  }

  // Audit every upload — verification docs especially.
  if (req) {
    await writeAudit({
      req,
      action:
        purpose === 'verification_document'
          ? AUDIT_EVENT_TYPES.VERIFICATION_SUBMITTED
          : AUDIT_EVENT_TYPES.USER_UPDATED,
      category: purpose === 'verification_document' ? 'verification' : 'user',
      targetType: purpose === 'verification_document' ? 'verification_document' : 'file',
      targetId: result.public_id,
      severity: purpose === 'verification_document' ? 'medium' : 'low',
      metadata: {
        purpose,
        folder,
        bytes: result.bytes,
        format: result.format,
        ...sanitizeMetadata(metadata),
      },
    });
  }

  return {
    publicId: result.public_id,
    url: result.secure_url,
    // Short-lived signed URL — safer default for sensitive docs.
    signedUrl: buildSignedUrl(result.public_id, { expiresInSeconds: 3600 }),
    format: result.format,
    bytes: result.bytes,
    width: result.width || null,
    height: result.height || null,
    resourceType: result.resource_type,
    purpose,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Batch upload — used by verification-documents uploader (multi-file).
 * @returns {{ uploaded: Array, failed: Array }}
 */
async function uploadMany({ files, purpose, user, req, metadata }) {
  const results = { uploaded: [], failed: [] };
  for (const f of files) {
    try {
      const uploaded = await uploadOne({
        buffer: f.buffer,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        purpose,
        user,
        req,
        metadata,
      });
      results.uploaded.push(uploaded);
    } catch (err) {
      results.failed.push({
        originalName: f.originalname,
        code: err.code || 'UPLOAD_FAILED',
        message: err.message,
      });
    }
  }
  return results;
}

/**
 * Delete a file. Ownership is enforced by checking the folder prefix
 * (`<purpose>/<userId>/`) — non-admins can only delete their own files.
 */
async function deleteOne({ publicId, user, req, reason }) {
  if (!publicId) throw ApiError.badRequest('publicId required', 'MISSING_PUBLIC_ID');

  const isAdmin = user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPER_ADMIN);
  // public_id format: "<purpose>/<userId>/<filename>"
  const parts = String(publicId).split('/');
  const ownerId = parts[1];
  if (!isAdmin && String(user.id) !== String(ownerId)) {
    throw ApiError.forbidden('Cannot delete this file', 'DELETE_FORBIDDEN');
  }

  try {
    const result = await cloudinary.destroy(publicId, { resourceType: 'auto' });
    if (req) {
      await writeAudit({
        req,
        action: AUDIT_EVENT_TYPES.USER_UPDATED,
        category: 'user',
        targetType: 'file',
        targetId: publicId,
        metadata: { delete: true, reason: reason || null, result: result.result },
      });
    }
    return { ok: true, result: result.result };
  } catch (err) {
    logger.error('[uploads] delete failed', { publicId, message: err.message });
    throw ApiError.serviceUnavailable('Delete failed', 'DELETE_FAILED');
  }
}

/**
 * Build a short-lived signed URL for private documents.
 * Default 15-min TTL — used by admin verification viewers.
 */
function buildSignedUrl(publicId, { expiresInSeconds = 900 } = {}) {
  if (!cloudinary.isEnabled()) return null;
  return cloudinary.buildSignedUrl(publicId, { expiresInSeconds });
}

function sanitizeMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return {};
  const out = {};
  for (const [k, v] of Object.entries(metadata)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out[k] = typeof v === 'string' ? v.slice(0, 200) : v;
    } else if (v && typeof v === 'object' && v._id) {
      out[k] = String(v._id);
    }
  }
  return out;
}

module.exports = {
  uploadOne,
  uploadMany,
  deleteOne,
  buildSignedUrl,
  FOLDER_SCOPES,
  MIME_RULES,
  SIZE_LIMITS,
};