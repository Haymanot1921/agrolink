// server/src/modules/uploads/upload.routes.js
'use strict';

const router = require('express').Router();
const controller = require('./upload.controller');
const { authenticate } = require('../../shared/middleware/authenticate');
const { uploadLimiter } = require('../../shared/middleware/rateLimiter');
const { asyncHandler } = require('../../shared/utils/asyncHandler');
const {
  singleImage,
  multipleImages,
  verificationDocs,
  disputeEvidence,
} = require('../../shared/middleware/uploadMiddleware');

router.use(authenticate);

// Per-purpose middleware — multer is invoked based on purpose.
// Anything not covered here falls through to the generic handler below.
const purposeMiddleware = {
  avatar: singleImage('file'),
  listing_image: multipleImages('files', 8),
  article_image: singleImage('file'),
  verification_document: verificationDocs('files', 5),
  dispute_evidence: disputeEvidence('files', 10),
  support_attachment: multipleImages('files', 5),
};

/**
 * Middleware dispatcher — inspects :purpose and applies the right multer.
 * If purpose isn't recognized, we still pass through; the service will
 * reject with INVALID_PURPOSE.
 */
function dispatchUpload(req, res, next) {
  const mw = purposeMiddleware[req.params.purpose];
  if (!mw) return next();
  return mw(req, res, next);
}

router.post(
  '/:purpose',
  uploadLimiter,
  dispatchUpload,
  (req, res, next) => {
    // Route to single vs. multiple based on how many files were attached
    if (req.files) return asyncHandler(controller.uploadMultiple)(req, res, next);
    return asyncHandler(controller.uploadSingle)(req, res, next);
  },
);

router.post('/delete', asyncHandler(controller.deleteFile));
router.get('/sign', asyncHandler(controller.signUrl));

module.exports = router;