// server/src/modules/auth/password.service.js
// Password hashing + policy enforcement. Never logs plaintext.
'use strict';

const bcrypt = require('bcryptjs');
const env = require('../../config/environment');
const { ApiError } = require('../../shared/utils/ApiError');

const ROUNDS = env.security.bcryptRounds;

const COMMON_WEAK_PASSWORDS = new Set([
  'password', 'password1', '12345678', '123456789', 'qwerty123',
  'letmein1', 'welcome1', 'admin123', 'iloveyou', 'agrolink',
]);

/**
 * Hash a plaintext password.
 */
async function hash(plain) {
  if (typeof plain !== 'string' || plain.length < 8) {
    throw ApiError.badRequest('Password too short', 'WEAK_PASSWORD');
  }
  return bcrypt.hash(plain, ROUNDS);
}

/**
 * Compare plaintext to a hash.
 */
async function verify(plain, hashValue) {
  if (!plain || !hashValue) return false;
  return bcrypt.compare(plain, hashValue);
}

/**
 * Enforce password policy at the service layer (in addition to Joi).
 * Throws ApiError(422) with a `details` array.
 */
function enforcePolicy(plain) {
  const problems = [];
  if (!plain || plain.length < env.security.passwordMinLength) {
    problems.push({ field: 'password', message: `Minimum ${env.security.passwordMinLength} characters` });
  }
  if (!/[A-Z]/.test(plain || '')) problems.push({ field: 'password', message: 'Must include an uppercase letter' });
  if (!/[a-z]/.test(plain || '')) problems.push({ field: 'password', message: 'Must include a lowercase letter' });
  if (!/[0-9]/.test(plain || '')) problems.push({ field: 'password', message: 'Must include a digit' });
  if (COMMON_WEAK_PASSWORDS.has(String(plain || '').toLowerCase())) {
    problems.push({ field: 'password', message: 'Too common — choose a stronger password' });
  }
  if (problems.length) {
    throw ApiError.unprocessable('Password does not meet policy', problems, 'WEAK_PASSWORD');
  }
  return true;
}

module.exports = { hash, verify, enforcePolicy };