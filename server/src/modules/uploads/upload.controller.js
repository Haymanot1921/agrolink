// server/src/modules/uploads/upload.controller.js
'use strict';

const service = require('./upload.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { ApiError } = require('../../shared/utils/ApiError');

/**
 * Single-file upload.
 * Route: POST /api/v1/uploads/:purpose
 *   - middleware: uploadMiddleware based on purpose
 *   - body.purpose must match :purpose
 */
async function uploadSingle(req, res) {
  if (!req.file) throw ApiError.badRequest('No file uploaded', 'NO_FILE');

  const purpose = req.params.purpose;
  const result = await service.uploadOne({
    buffer: req.file.buffer,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    purpose,
    user: req.user,
    req,
    metadata: extractMetadata(req.body),
  });
  return ApiResponse.created(res, result, 'File uploaded');
}

/**
 * Multi-file upload (verification docs, dispute evidence).
 */
async function uploadMultiple(req, res) {
  if (!req.files || !req.files.length) throw ApiError.badRequest('No files uploaded', 'NO_FILES');

  const purpose = req.params.purpose;
  const results = await service.uploadMany({
    files: req.files,
    purpose,
    user: req.user,
    req,
    metadata: extractMetadata(req.body),
  });
  return ApiResponse.created(res, results, 'Uploads processed');
}

async function deleteFile(req, res) {
  const { publicId, reason } = req.body;
  const result = await service.deleteOne({ publicId, user: req.user, req, reason });
  return ApiResponse.ok(res, result);
}

/**
 * Request a signed URL for a private document (verification, dispute evidence).
 * Used by the admin verification viewer + dispute evidence viewer.
 */
async function signUrl(req, res) {
  const { publicId } = req.query;
  if (!publicId) throw ApiError.badRequest('publicId required', 'MISSING_PUBLIC_ID');

  // Ownership check — reuse delete's authorization logic conceptually:
  // only the owner or an admin can request a signed URL.
  const { ROLES } = require('../../shared/constants/roles');
  const isAdmin = req.user.roles.includes(ROLES.ADMIN) || req.user.roles.includes(ROLES.SUPER_ADMIN);
  const parts = String(publicId).split('/');
  const ownerId = parts[1];
  if (!isAdmin && String(req.user.id) !== String(ownerId)) {
    throw ApiError.forbidden('Cannot sign this URL', 'SIGN_FORBIDDEN');
  }

  const url = service.buildSignedUrl(publicId, { expiresInSeconds: 900 });
  return ApiResponse.ok(res, { url, expiresInSeconds: 900 });
}

function extractMetadata(body = {}) {
  // Whitelist metadata keys — prevents arbitrary client payloads entering audit logs
  const allowed = ['verificationId', 'disputeId', 'listingId', 'articleId', 'ticketId', 'documentType'];
  const meta = {};
  for (const k of allowed) {
    if (body[k] !== undefined) meta[k] = body[k];
  }
  return meta;
}

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  signUrl,
};