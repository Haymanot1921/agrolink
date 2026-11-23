// server/src/modules/auth/auth.controller.js
'use strict';

const service = require('./auth.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');

async function register(req, res) {
  const user = await service.register({ payload: req.body, req });
  return ApiResponse.created(res, user, 'Registration successful. Verify your email and phone.');
}

async function login(req, res) {
  const result = await service.login({ payload: req.body, req });
  return ApiResponse.ok(res, result, undefined, 'Login successful');
}

async function refresh(req, res) {
  const result = await service.refresh({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

async function logout(req, res) {
  const result = await service.logout({ payload: req.body || {}, req });
  return ApiResponse.ok(res, result);
}

async function verifyEmail(req, res) {
  const result = await service.verifyEmail({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

async function requestPhoneOtp(req, res) {
  const result = await service.requestPhoneOtp({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

async function verifyPhone(req, res) {
  const result = await service.verifyPhone({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

async function requestPasswordReset(req, res) {
  const result = await service.requestPasswordReset({ payload: req.body, req });
  // Always 200 to avoid leaking existence.
  return ApiResponse.ok(res, result);
}

async function resetPassword(req, res) {
  const result = await service.resetPassword({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

async function changePassword(req, res) {
  const result = await service.changePassword({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

async function requestMfa(req, res) {
  const result = await service.requestMfa({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

async function verifyMfa(req, res) {
  const result = await service.verifyMfa({ payload: req.body, req });
  return ApiResponse.ok(res, result);
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  requestPhoneOtp,
  verifyPhone,
  requestPasswordReset,
  resetPassword,
  changePassword,
  requestMfa,
  verifyMfa,
};