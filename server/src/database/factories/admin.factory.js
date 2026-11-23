// server/src/database/factories/admin.factory.js
// Admin/super_admin fixtures built on top of user.factory.
// Adds the admin-only fields (permissions, MFA-required flag) and
// ensures deterministic naming so seeders don't create duplicate super_admins.
'use strict';

const userFactory = require('./user.factory');
const { ROLES } = require('../../shared/constants/roles');
const { getDefaultPermissionsForRole } = require('../../shared/constants/permissions');
const { ACCOUNT_STATUSES } = require('../../shared/constants/accountStatuses');

/**
 * Build an admin fixture.
 * @param {Object} [overrides]
 * @param {string} [overrides.email]   — default: admin@agrolink.test
 * @param {string} [overrides.password]
 * @param {'admin'|'super_admin'} [overrides.role] — default: admin
 */
function buildAdmin(overrides = {}) {
  const role = overrides.role || ROLES.ADMIN;
  if (![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role)) {
    throw new Error(`admin.factory.buildAdmin: role must be admin or super_admin (got ${role})`);
  }

  return userFactory.build({
    role,
    email: overrides.email || (role === ROLES.SUPER_ADMIN ? 'superadmin@agrolink.test' : 'admin@agrolink.test'),
    phone: overrides.phone || (role === ROLES.SUPER_ADMIN ? '+251911000001' : '+251911000002'),
    fullName: overrides.fullName || (role === ROLES.SUPER_ADMIN ? 'Super Administrator' : 'Platform Administrator'),
    status: overrides.status || ACCOUNT_STATUSES.ACTIVE,
    verificationStatus: 'approved',
    isEmailVerified: true,
    isPhoneVerified: true,
    permissions:
      overrides.permissions ||
      (role === ROLES.SUPER_ADMIN ? ['admin'] : getDefaultPermissionsForRole(ROLES.ADMIN)),
    notificationPreferences: overrides.notificationPreferences || {
      email: true,
      sms: true,
      push: true,
      inApp: true,
    },
    ...overrides,
  });
}

/**
 * Build a superadmin fixture — always idempotent. Seeders should upsert by email.
 */
function buildSuperAdmin(overrides = {}) {
  return buildAdmin({
    role: ROLES.SUPER_ADMIN,
    ...overrides,
  });
}

/**
 * Build N distinct admin fixtures (for stress tests, dashboards).
 */
function batchAdmins(count, overrides = {}) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const idx = String(i + 1).padStart(3, '0');
    out.push(
      buildAdmin({
        email: `admin-${idx}@agrolink.test`,
        phone: `+25191${String(i + 1).padStart(8, '0')}`,
        fullName: `Admin ${idx}`,
        ...overrides,
      }),
    );
  }
  return out;
}

/**
 * Canonical seed set — one super_admin + two admins. Used by seeders.
 * Deterministic emails so re-running never duplicates.
 */
function seedSet({ superAdminPassword = 'SuperAdmin#2026', adminPassword = 'Admin#2026' } = {}) {
  return [
    buildSuperAdmin({ password: superAdminPassword }),
    buildAdmin({ password: adminPassword }),
    buildAdmin({
      email: 'ops-admin@agrolink.test',
      phone: '+251911000003',
      fullName: 'Operations Admin',
      password: adminPassword,
    }),
  ];
}

module.exports = {
  buildAdmin,
  buildSuperAdmin,
  batchAdmins,
  seedSet,
};