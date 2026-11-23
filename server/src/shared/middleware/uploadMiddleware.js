// server/src/shared/middleware/uploadMiddleware.js
// Multer memory-storage uploader. Bytes never touch disk — they go straight
// to Cloudinary (config/cloudinary.js). Enforces MIME + size from config.

'use strict';

const multer = require('multer');
const env = require('../../config/environment');
const { AppError } = require('../errors/AppError');

const MAX_BYTES = env.uploads.maxFileSizeMb * 1024 * 1024;

function fileFilter(allowedMimes) {
  return (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) return cb(null, true);
    return cb(
      new AppError(
        `Unsupported file type: ${file.mimetype}`,
        { statusCode: 415, code: 'UNSUPPORTED_FILE_TYPE', details: [{ field: file.fieldname }] }.statusCode,
        'UNSUPPORTED_FILE_TYPE',
        [{ field: file.fieldname, allowed: allowedMimes }],
      ),
    );
  };
}

function buildUploader({ maxFiles = env.uploads.maxFilesPerRequest, allowedMimes = env.uploads.allowedMimeTypes, maxBytes = MAX_BYTES } = {}) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxBytes,
      files: maxFiles,
    },
    fileFilter: fileFilter(allowedMimes),
  });
}

// --- Pre-built uploaders ---------------------------------------------------

// Single image (profile avatar, listing primary image).
const singleImage = (fieldName = 'image') =>
  buildUploader({ maxFiles: 1, allowedMimes: ['image/jpeg', 'image/png', 'image/webp'] }).single(fieldName);

// Multiple images (listing gallery, article cover).
const multipleImages = (fieldName = 'images', maxFiles = 8) =>
  buildUploader({ maxFiles, allowedMimes: ['image/jpeg', 'image/png', 'image/webp'] }).array(fieldName, maxFiles);

// Verification documents (national ID, business license) — PDF + images.
const verificationDocs = (fieldName = 'documents', maxFiles = 5) =>
  buildUploader({
    maxFiles,
    allowedMimes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxBytes: 15 * 1024 * 1024,
  }).array(fieldName, maxFiles);

// Dispute evidence.
const disputeEvidence = (fieldName = 'evidence', maxFiles = 10) =>
  buildUploader({
    maxFiles,
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxBytes: 15 * 1024 * 1024,
  }).array(fieldName, maxFiles);

// Generic — for module-specific validators.
const generic = (opts) => buildUploader(opts);

module.exports = {
  singleImage,
  multipleImages,
  verificationDocs,
  disputeEvidence,
  generic,
  buildUploader,
};