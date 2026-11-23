// server/src/shared/middleware/rateLimiter.js
// Central rate-limit factory. Supports Redis when available (SRS §14.3),
// falls back to in-memory for dev/test.
// Pre-built limiters cover: global, auth, password reset, uploads, admin mutations.

'use strict';

const rateLimit = require('express-rate-limit');
const env = require('../../config/environment');
const logger = require('../../config/logger');

let redisStoreFactory = null;

// Optional Redis backing — try to load once at module init.
try {
  // eslint-disable-next-line global-require
  const Redis = require('ioredis');
  // eslint-disable-next-line global-require
  const { RedisStore } = require('rate-limit-redis');
  if (process.env.REDIS_URL) {
    const client = new Redis(process.env.REDIS_URL);
    client.on('error', (err) => logger.error('[ratelimit] redis error', { message: err.message }));
    redisStoreFactory = () =>
      new RedisStore({
        sendCommand: (...args) => client.call(...args),
      });
    logger.info('[ratelimit] using Redis store');
  }
} catch {
  // Redis optional — fall back silently.
}

function buildStore() {
  if (redisStoreFactory) {
    try {
      return redisStoreFactory();
    } catch (err) {
      logger.warn('[ratelimit] redis store failed, using memory', { message: err.message });
    }
  }
  return undefined; // express-rate-limit default (MemoryStore)
}

function commonHandler(req, res) {
  const requestId = req.id || req.headers['x-request-id'] || null;
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests — please try again later',
    },
    requestId,
    timestamp: new Date().toISOString(),
  });
}

function createLimiter({ windowMs, max, message, keyGenerator, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: buildStore(),
    handler: (req, res) => {
      logger.warn('[ratelimit] exceeded', {
        path: req.originalUrl,
        ip: req.ip,
        userId: req.user ? req.user.id : null,
        limiter: message,
      });
      commonHandler(req, res);
    },
    keyGenerator:
      keyGenerator ||
      ((req) => (req.user && req.user.id ? `u:${req.user.id}` : `ip:${req.ip}`)),
    skipSuccessfulRequests,
    skip: () => env.isTest && !process.env.RATELIMIT_IN_TEST,
  });
}

// --- Pre-built limiters ----------------------------------------------------

// Applies to every request. Conservative for prod, generous for dev.
const globalLimiter = createLimiter({
  windowMs: env.security.rateLimitWindowMs,
  max: env.isProduction ? env.security.rateLimitMax : 10000,
  message: 'global',
});

// Auth endpoints (login, register, refresh, OTP).
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 10 : 1000,
  message: 'auth',
  keyGenerator: (req) =>
    `auth:${req.ip}:${(req.body && req.body.email) || (req.body && req.body.phone) || 'anon'}`,
});

// Password reset / email verification.
const passwordResetLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'password-reset',
});

// File uploads (Cloudinary heavy).
const uploadLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: env.isProduction ? 30 : 1000,
  message: 'upload',
});

// Admin mutating endpoints (privileged) — audit-worthy.
const adminMutationLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: env.isProduction ? 60 : 1000,
  message: 'admin-mutation',
});

// Reports export (expensive).
const reportExportLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'report-export',
});

// Message sending (chat).
const messageLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: 'message',
});

// Support / dispute ticket creation.
const ticketCreateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'ticket-create',
});

module.exports = {
  createLimiter,
  globalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  adminMutationLimiter,
  reportExportLimiter,
  messageLimiter,
  ticketCreateLimiter,
};