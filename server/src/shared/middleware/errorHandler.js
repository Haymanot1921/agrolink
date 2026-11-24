// server/src/shared/middleware/errorHandler.js
// Final Express error handler. Normalizes AppError, Mongoose, JWT,
// Multer, and Joi errors into a consistent JSON envelope.

'use strict';

const env = require('../../config/environment');
const logger = require('../../config/logger');
const { AppError } = require('../errors/AppError');

function isMongooseValidation(err) {
  return err && err.name === 'ValidationError' && err.errors;
}
function isMongooseCast(err) {
  return err && err.name === 'CastError';
}
function isMongoDuplicate(err) {
  return err && err.code === 11000;
}
function isJwt(err) {
  return err && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError');
}
function isMulter(err) {
  return err && err.name === 'MulterError';
}
function isJoi(err) {
  return err && err.isJoi && Array.isArray(err.details);
}

function normalize(err) {
  if (err && err.code === 'CORS_ORIGIN_DENIED') {
    return {
      statusCode: 403,
      code: err.code,
      message: err.message,
      isOperational: true,
    };
  }

  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode || 400,
      code: err.code || 'APP_ERROR',
      message: err.message,
      details: err.details || undefined,
      isOperational: true,
    };
  }

  if (isMongooseValidation(err)) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return {
      statusCode: 422,
      code: 'DB_VALIDATION_ERROR',
      message: 'Database validation failed',
      details,
      isOperational: true,
    };
  }

  if (isMongooseCast(err)) {
    return {
      statusCode: 400,
      code: 'DB_CAST_ERROR',
      message: `Invalid value for ${err.path}`,
      details: [{ field: err.path, message: err.message }],
      isOperational: true,
    };
  }

  if (isMongoDuplicate(err)) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return {
      statusCode: 409,
      code: 'DUPLICATE_KEY',
      message: `A record with this ${field} already exists`,
      details: [{ field, value: err.keyValue ? err.keyValue[field] : undefined }],
      isOperational: true,
    };
  }

  if (isJwt(err)) {
    return {
      statusCode: 401,
      code: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
      message: 'Invalid or expired token',
      isOperational: true,
    };
  }

  if (isMulter(err)) {
    const map = {
      LIMIT_FILE_SIZE: 'File too large',
      LIMIT_FILE_COUNT: 'Too many files',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field',
      LIMIT_PART_COUNT: 'Too many parts',
    };
    return {
      statusCode: 400,
      code: err.code || 'UPLOAD_ERROR',
      message: map[err.code] || 'Upload error',
      isOperational: true,
    };
  }

  if (isJoi(err)) {
    return {
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
      isOperational: true,
    };
  }

  // Fallback — unknown error
  return {
    statusCode: err.statusCode || 500,
    code: 'INTERNAL_ERROR',
    message: env.isProduction ? 'Internal server error' : (err.message || 'Unknown error'),
    isOperational: false,
  };
}

function errorHandler(err, req, res, _next) {
  const normalized = normalize(err);
  const requestId = req.id || req.headers['x-request-id'] || null;

  const logPayload = {
    requestId,
    method: req.method,
    path: req.originalUrl,
    userId: req.user ? req.user.id : null,
    statusCode: normalized.statusCode,
    code: normalized.code,
    message: normalized.message,
  };

  if (normalized.statusCode >= 500) {
    logger.error('[error] unhandled', { ...logPayload, stack: err.stack });
  } else {
    logger.warn('[error] client', logPayload);
  }

  if (res.headersSent) return;

  res.status(normalized.statusCode).json({
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
      details: normalized.details,
    },
    requestId,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { errorHandler, normalize };