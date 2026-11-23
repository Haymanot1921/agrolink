// server/src/shared/utils/ApiError.js
// Canonical error class. Every module throws this (or the alias AppError
// re-exported from ../errors/AppError for backwards compatibility).

'use strict';

class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=400]
   * @param {string} [code]
   * @param {Array}  [details]
   * @param {Object} [meta]
   */
  constructor(message, statusCode = 400, code = null, details = undefined, meta = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code || ApiError.codeFromStatus(statusCode);
    this.details = details;
    this.meta = meta;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static codeFromStatus(status) {
    const map = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      415: 'UNSUPPORTED_MEDIA_TYPE',
      422: 'VALIDATION_ERROR',
      423: 'LOCKED',
      429: 'RATE_LIMITED',
      500: 'INTERNAL_ERROR',
      501: 'NOT_IMPLEMENTED',
      503: 'SERVICE_UNAVAILABLE',
    };
    return map[status] || 'ERROR';
  }

  // --- Convenience factories used widely across modules -------------------
  static badRequest(message, code = 'BAD_REQUEST', details) {
    return new ApiError(message, 400, code, details);
  }
  static unauthorized(message = 'Authentication required', code = 'UNAUTHORIZED') {
    return new ApiError(message, 401, code);
  }
  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new ApiError(message, 403, code);
  }
  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(message, 404, code);
  }
  static conflict(message, code = 'CONFLICT') {
    return new ApiError(message, 409, code);
  }
  static unprocessable(message = 'Validation failed', details, code = 'VALIDATION_ERROR') {
    return new ApiError(message, 422, code, details);
  }
  static tooManyRequests(message = 'Too many requests', code = 'RATE_LIMITED') {
    return new ApiError(message, 429, code);
  }
  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
    const err = new ApiError(message, 500, code);
    err.isOperational = false;
    return err;
  }
  static serviceUnavailable(message = 'Service unavailable', code = 'SERVICE_UNAVAILABLE') {
    return new ApiError(message, 503, code);
  }
}

module.exports = { ApiError };
module.exports.AppError = ApiError; // backwards-compatible alias