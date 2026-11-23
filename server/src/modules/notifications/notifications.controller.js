// server/src/modules/notifications/notifications.controller.js
'use strict';

const service = require('./notifications.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { parsePagination } = require('../../shared/utils/pagination');

async function list(req, res) {
  const { page, limit, sort } = parsePagination(req.query, {
    allowedSortFields: ['createdAt', 'priority', 'type'],
  });
  const { data, pagination } = await service.listInbox({
    userId: req.user.id,
    query: req.query,
    page,
    limit,
    sort,
  });
  return ApiResponse.paginated(res, data, pagination);
}

async function getOne(req, res) {
  const record = await service.getOne({
    userId: req.user.id,
    notificationId: req.params.id,
  });
  return ApiResponse.ok(res, record);
}

async function markRead(req, res) {
  const result = await service.markRead({
    userId: req.user.id,
    notificationId: req.params.id,
  });
  return ApiResponse.ok(res, result);
}

async function markAllRead(req, res) {
  const result = await service.markAllRead({ userId: req.user.id });
  return ApiResponse.ok(res, result);
}

async function remove(req, res) {
  const result = await service.remove({
    userId: req.user.id,
    notificationId: req.params.id,
  });
  return ApiResponse.ok(res, result);
}

async function unreadCount(req, res) {
  const count = await service.unreadCount(req.user.id);
  return ApiResponse.ok(res, { count });
}

async function unreadByType(req, res) {
  const rows = await service.unreadByType(req.user.id);
  return ApiResponse.ok(res, rows);
}

async function stats(req, res) {
  const data = await service.stats(req.user.id);
  return ApiResponse.ok(res, data);
}

module.exports = {
  list,
  getOne,
  markRead,
  markAllRead,
  remove,
  unreadCount,
  unreadByType,
  stats,
};