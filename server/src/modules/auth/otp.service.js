// server/src/modules/auth/otp.service.js
// OTP generation + verification for phone/email verification, password reset,
// and step-up MFA. Codes are 6 digits, hashed with SHA-256, TTL 5 min,
// max 5 attempts. Rate-limiting is enforced by middleware at the route level.
'use strict';

const crypto = require('crypto');
const env = require('../../config/environment');
const logger = require('../../config/logger');
const email = require('../../config/email');
const sms = require('../../config/smsProvider');
const { ApiError } = require('../../shared/utils/ApiError');

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = env.security.otpTtlSeconds || 300;
const MAX_ATTEMPTS = 5;

// In-memory store for OTPs (per process). For multi-instance production,
// swap with Redis; the interface stays the same.
const store = new Map();

function hashCode(code, subject) {
  return crypto.createHash('sha256').update(`${code}:${subject}`).digest('hex');
}

function generateCode() {
  // crypto-based — not Math.random
  return String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');
}

function storeOtp({ subject, purpose, channel }) {
  const code = generateCode();
  const entry = {
    hash: hashCode(code, subject),
    purpose,
    channel,
    attempts: 0,
    expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
    createdAt: Date.now(),
  };
  store.set(`${purpose}:${subject}`, entry);
  logger.info('[auth:otp] generated', { purpose, channel, subject: mask(subject) });
  return code;
}

async function sendOtp({ subject, purpose, channel, recipient, language = 'en' }) {
  const code = storeOtp({ subject, purpose, channel });
  try {
    if (channel === 'email') {
      await email.sendMail({
        to: recipient,
        subject: 'AgroLink — verification code',
        html: `<p>Your code is <strong>${code}</strong>. It expires in ${Math.floor(OTP_TTL_SECONDS / 60)} minutes.</p>`,
        text: `Your AgroLink code is ${code}. Expires in ${Math.floor(OTP_TTL_SECONDS / 60)} min.`,
      });
    } else {
      await sms.sendSms({
        to: recipient,
        message: `AgroLink: ${code} is your verification code. Expires in ${Math.floor(OTP_TTL_SECONDS / 60)} min.`,
      });
    }
  } catch (err) {
    logger.error('[auth:otp] send failed', { purpose, channel, message: err.message });
    // Do NOT leak delivery failure to caller in prod — but throw in dev.
    if (!env.isProduction) throw ApiError.serviceUnavailable('OTP delivery failed', 'OTP_SEND_FAILED');
  }
  return { sent: true, channel, ttlSeconds: OTP_TTL_SECONDS };
}

/**
 * Verify an OTP. On success, the entry is deleted.
 * Returns true. Throws ApiError on failure.
 */
function verifyOtp({ subject, purpose, code }) {
  const key = `${purpose}:${subject}`;
  const entry = store.get(key);
  if (!entry) throw ApiError.badRequest('Code not found or expired', 'OTP_NOT_FOUND');
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    throw ApiError.badRequest('Code expired', 'OTP_EXPIRED');
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key);
    throw ApiError.tooManyRequests('Too many attempts', 'OTP_TOO_MANY_ATTEMPTS');
  }
  entry.attempts += 1;
  const expected = entry.hash;
  const given = hashCode(code, subject);
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given))) {
    throw ApiError.badRequest('Invalid code', 'OTP_INVALID');
  }
  store.delete(key);
  logger.info('[auth:otp] verified', { purpose, subject: mask(subject) });
  return true;
}

// Periodic cleanup of expired entries.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (v.expiresAt < now) store.delete(k);
  }
}, 60 * 1000).unref();

function mask(value) {
  if (!value) return '';
  const s = String(value);
  if (s.includes('@')) {
    const [u, d] = s.split('@');
    return `${u.slice(0, 2)}***@${d}`;
  }
  return `${s.slice(0, 3)}***${s.slice(-2)}`;
}

function _resetStore() {
  store.clear();
}

module.exports = { sendOtp, verifyOtp, _resetStore };