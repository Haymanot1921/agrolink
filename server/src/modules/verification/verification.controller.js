// server/src/modules/verification/verification.controller.js
'use strict';

const service = require('./verification.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { parsePagination } = require('../../shared/utils/pagination');

async function submit(req, res) {
  const application = await service.submitApplication({
    user: req.user,
    payload: req.body,
    req,
  });
  return ApiResponse.created(res, application, 'Verification submitted');
}

async function getMyStatus(req, res) {
  const result = await service.getMyStatus({ user: req.user });
  return ApiResponse.ok(res, result);
}

async function listMine(req, res) {
  const { page, limit } = parsePagination(req.query, { allowedSortFields: ['createdAt'] });
  const { data, pagination } = await service.listMyApplications({
    user: req.user,
    page,
    limit,
  });
  return ApiResponse.paginated(res, data, pagination);
}

async function getOne(req, res) {
  const app = await service.getMyApplication({
    user: req.user,
    applicationId: req.params.id,
  });
  return ApiResponse.ok(res, app);
}

async function uploadAdditional(req, res) {
  const app = await service.uploadAdditionalDocuments({
    user: req.user,
    applicationId: req.params.id,
    payload: req.body,
    req,
  });
  return ApiResponse.ok(res, app, undefined, 'Documents submitted');
}

async function withdraw(req, res) {
  const result = await service.withdrawMyApplication({
    user: req.user,
    applicationId: req.params.id,
    req,
    reason: req.body && req.body.reason,
  });
  return ApiResponse.ok(res, result);
}

module.exports = {
  submit,
  getMyStatus,
  listMine,
  getOne,
  uploadAdditional,
  withdraw,
};