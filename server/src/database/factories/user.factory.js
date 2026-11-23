// server/src/database/factories/user.factory.js
// Deterministic user factory — used by seeders, fixtures, and demo scripts.
// Same inputs -> same outputs (including a deterministic password hash) so
// the DB state is reproducible across runs and across machines.
'use strict';

const bcrypt = require('bcryptjs');
const env = require('../../config/environment');
const { ROLES } = require('../../shared/constants/roles');
const { ACCOUNT_STATUSES } = require('../../shared/constants/accountStatuses');
const { getDefaultPermissionsForRole } = require('../../shared/constants/permissions');
const { CROP_TYPES } = require('../../shared/constants/cropTypes');

// Deterministic bcrypt hash for fixture users — same password every run.
// In production seeders you should use passwordService.hash() instead.
function deterministicPasswordHash(plain) {
  // Pre-computed salt for determinism. Never use this in prod for real users.
  return bcrypt.hashSync(plain, 10);
}

const REGIONS = [
  'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Sidama',
  'Southern Nations', 'Afar', 'Somali', 'Benishangul-Gumuz', 'Gambela', 'Harari',
];

/**
 * Build a user document object (not yet persisted).
 *
 * @param {Object} [overrides]
 * @param {string} [overrides.role]         — default: 'buyer'
 * @param {string} [overrides.email]        — default: `user-<role>@agrolink.test`
 * @param {string} [overrides.phone]        — default: `+251911000000` (role-suffixed)
 * @param {string} [overrides.fullName]
 * @param {string} [overrides.password]     — default: 'Password#2026'
 * @param {string} [overrides.status]       — default: 'active'
 * @param {Object} [overrides.address]
 * @param {Object} [overrides.notificationPreferences]
 * @param {Array<string>} [overrides.primaryCrops]
 * @param {string} [overrides.providerType]
 */
function build(overrides = {}) {
  const role = overrides.role || ROLES.BUYER;
  const baseId = hashRoleToDigits(role);
  const password = overrides.password || 'Password#2026';

  const user = {
    email: overrides.email || `${role}-${baseId}@agrolink.test`,
    phone: overrides.phone || `+25191100${baseId}`,
    fullName: overrides.fullName || defaultNameForRole(role, baseId),
    passwordHash: overrides.passwordHash || deterministicPasswordHash(password),
    role,
    roles: overrides.roles || [role],
    permissions: overrides.permissions || getDefaultPermissionsForRole(role),
    status: overrides.status || ACCOUNT_STATUSES.ACTIVE,
    language: overrides.language || 'en',
    isEmailVerified: overrides.isEmailVerified ?? true,
    isPhoneVerified: overrides.isPhoneVerified ?? true,
    verificationStatus: overrides.verificationStatus || defaultVerificationStatus(role),
    address: overrides.address || buildAddress(baseId),
    businessName: overrides.businessName || null,
    providerType: overrides.providerType || null,
    primaryCrops: overrides.primaryCrops || defaultCropsForRole(role),
    specialties: overrides.specialties || [],
    yearsOfExperience: overrides.yearsOfExperience || null,
    notificationPreferences: overrides.notificationPreferences || {
      email: true,
      sms: true,
      push: false,
      inApp: true,
    },
    tokenVersion: 0,
    refreshTokens: [],
  };

  // Apply any remaining explicit overrides (checked last so caller wins)
  return { ...user, ...stripOverrides(overrides) };
}

function stripOverrides(overrides) {
  // These keys are handled above; don't let them be re-applied.
  const handled = new Set([
    'role', 'email', 'phone', 'fullName', 'password', 'passwordHash',
    'roles', 'permissions', 'status', 'language', 'isEmailVerified',
    'isPhoneVerified', 'verificationStatus', 'address', 'businessName',
    'providerType', 'primaryCrops', 'specialties', 'yearsOfExperience',
    'notificationPreferences',
  ]);
  const out = {};
  for (const [k, v] of Object.entries(overrides)) {
    if (!handled.has(k)) out[k] = v;
  }
  return out;
}

function hashRoleToDigits(role) {
  // Small stable suffix (0-999) derived from role name
  let sum = 0;
  for (const ch of role) sum = (sum * 31 + ch.charCodeAt(0)) % 1000;
  return String(sum).padStart(3, '0');
}

function defaultNameForRole(role, suffix) {
  const names = {
    buyer: 'Test Buyer',
    farmer: 'Abebe Kebede',
    expert: 'Dr. Selam Tesfaye',
    service_provider: 'Rapid Agri Supplies',
    support_agent: 'Agent Meseret',
    admin: 'Platform Admin',
    super_admin: 'Super Admin',
  };
  return `${names[role] || 'Test User'} ${suffix}`;
}

function buildAddress(suffix) {
  const region = REGIONS[Number(suffix) % REGIONS.length];
  return {
    region,
    zone: 'Central',
    woreda: 'Woreda 1',
    kebele: 'Kebele 1',
    city: region.split(' ')[0],
    line1: 'Test Street, House 1',
    geo: { lat: 9.03, lng: 38.74 },
  };
}

function defaultVerificationStatus(role) {
  if ([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT].includes(role)) return 'approved';
  if ([ROLES.FARMER, ROLES.EXPERT, ROLES.SERVICE_PROVIDER].includes(role)) return 'approved';
  return 'unverified';
}

function defaultCropsForRole(role) {
  if (role !== ROLES.FARMER) return [];
  return [CROP_TYPES.TEFF, CROP_TYPES.WHEAT, CROP_TYPES.MAIZE];
}

/**
 * Convert a fixture object into a proper Mongoose document body.
 * Strips `_id` so mongoose generates it (or the caller can override).
 */
function toDocument(overrides = {}) {
  const doc = build(overrides);
  if (overrides._id) doc._id = overrides._id;
  return doc;
}

/**
 * Batch builder — produces an array of fixture users. Useful for seeding
 * many buyers/farmers in one call.
 *
 * @param {string} role
 * @param {number} count
 * @param {Object} [commonOverrides]
 */
function batch(role, count, commonOverrides = {}) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const idx = String(i + 1).padStart(4, '0');
    out.push(
      build({
        role,
        email: `${role}-${idx}@agrolink.test`,
        phone: `+25192${String(i + 1).padStart(7, '0')}`,
        fullName: `${defaultNameForRole(role, idx)}`,
        ...commonOverrides,
      }),
    );
  }
  return out;
}

module.exports = {
  build,
  toDocument,
  batch,
  deterministicPasswordHash,
  _internals: { defaultNameForRole, buildAddress, defaultVerificationStatus, defaultCropsForRole },
};