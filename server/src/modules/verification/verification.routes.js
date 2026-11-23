// server/src/modules/verification/verification.routes.js
'use strict';

const router = require('express').Router();
const Joi = require('joi');
const controller = require('./verification.controller');
const { authenticate } = require('../../shared/middleware/authenticate');
const { validateRequest } = require('../../shared/middleware/validateRequest');
const { asyncHandler } = require('../../shared/utils/asyncHandler');
const { objectId } = require('../../shared/validators/commonSchemas');
const { VERIFICATION_DOCUMENT_TYPE_LIST } = require('../../shared/constants/verificationStatuses');

const documentSchema = Joi.object({
  publicId: Joi.string().min(5).max(400).required(),
  url: Joi.string().uri().optional(),
  signedUrl: Joi.string().uri().optional(),
  fileName: Joi.string().max(200).optional(),
  mimeType: Joi.string().max(120).optional(),
  size: Joi.number().integer().min(0).optional(),
});

const submitSchema = Joi.object({
  documentTypes: Joi.array()
    .items(Joi.string().valid(...VERIFICATION_DOCUMENT_TYPE_LIST))
    .min(1)
    .max(10)
    .unique()
    .required(),
  documents: Joi.array().items(documentSchema).min(1).max(10).required(),
  notes: Joi.string().max(2000).optional(),
}).unknown(false);

const additionalDocsSchema = Joi.object({
  documentTypes: Joi.array()
    .items(Joi.string().valid(...VERIFICATION_DOCUMENT_TYPE_LIST))
    .min(1)
    .max(10)
    .optional(),
  documents: Joi.array().items(documentSchema).min(1).max(10).required(),
}).unknown(false);

const withdrawSchema = Joi.object({
  reason: Joi.string().min(3).max(500).optional(),
});

router.use(authenticate);

router.post(
  '/submit',
  validateRequest({ body: submitSchema }),
  asyncHandler(controller.submit),
);

router.get('/me', asyncHandler(controller.getMyStatus));
router.get('/me/list', asyncHandler(controller.listMine));

router.get(
  '/:id',
  validateRequest({ params: Joi.object({ id: objectId.required() }) }),
  asyncHandler(controller.getOne),
);

router.post(
  '/:id/additional-documents',
  validateRequest({
    params: Joi.object({ id: objectId.required() }),
    body: additionalDocsSchema,
  }),
  asyncHandler(controller.uploadAdditional),
);

router.post(
  '/:id/withdraw',
  validateRequest({
    params: Joi.object({ id: objectId.required() }),
    body: withdrawSchema,
  }),
  asyncHandler(controller.withdraw),
);

module.exports = router;