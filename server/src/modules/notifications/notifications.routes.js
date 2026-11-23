// server/src/modules/notifications/notifications.routes.js
'use strict';

const router = require('express').Router();
const Joi = require('joi');
const controller = require('./notifications.controller');
const { authenticate } = require('../../shared/middleware/authenticate');
const { validateRequest } = require('../../shared/middleware/validateRequest');
const { asyncHandler } = require('../../shared/utils/asyncHandler');
const { objectId } = require('../../shared/validators/commonSchemas');
const { buildPaginationSchema } = require('../../shared/validators/paginationSchema');

const listQuery = buildPaginationSchema({
  allowedSortFields: ['createdAt', 'priority', 'type'],
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
}).keys({
  unread: Joi.boolean().optional(),
  types: Joi.string().max(500).optional(), // comma-separated
  priority: Joi.string().valid('low', 'normal', 'high', 'critical').optional(),
});

router.use(authenticate);

router.get(
  '/',
  validateRequest({ query: listQuery }),
  asyncHandler(controller.list),
);

router.get('/unread-count', asyncHandler(controller.unreadCount));
router.get('/unread-by-type', asyncHandler(controller.unreadByType));
router.get('/stats', asyncHandler(controller.stats));

router.post('/mark-all-read', asyncHandler(controller.markAllRead));

router.get(
  '/:id',
  validateRequest({ params: Joi.object({ id: objectId.required() }) }),
  asyncHandler(controller.getOne),
);

router.patch(
  '/:id/read',
  validateRequest({ params: Joi.object({ id: objectId.required() }) }),
  asyncHandler(controller.markRead),
);

router.delete(
  '/:id',
  validateRequest({ params: Joi.object({ id: objectId.required() }) }),
  asyncHandler(controller.remove),
);

module.exports = router;