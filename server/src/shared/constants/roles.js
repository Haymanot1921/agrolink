// server/src/shared/constants/roles.js
// Canonical role codes. Every authorizeRole / access-control / user-management
// reference must use these constants — never inline strings.

'use strict';

const ROLES = Object.freeze({
  BUYER: 'buyer',
  FARMER: 'farmer',
  EXPERT: 'expert',                    // Agricultural expert (consultations)
  SERVICE_PROVIDER: 'service_provider', // Input/tool provider
  SUPPORT_AGENT: 'support_agent',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
});

const ROLE_LIST = Object.freeze(Object.values(ROLES));

// Roles that a user may hold in addition to their primary role.
// (Admin can never be self-assigned; support_agent can be combined with
// none — enforced in access-control.)
const PRIMARY_ROLES = Object.freeze([
  ROLES.BUYER,
  ROLES.FARMER,
  ROLES.EXPERT,
  ROLES.SERVICE_PROVIDER,
  ROLES.SUPPORT_AGENT,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
]);

// Roles considered "public-facing" (marketplace actors).
const MARKETPLACE_ROLES = Object.freeze([
  ROLES.BUYER,
  ROLES.FARMER,
  ROLES.EXPERT,
  ROLES.SERVICE_PROVIDER,
]);

// Roles that may be assisted by a support_agent (SRS §6.8).
const ASSISTABLE_ROLES = Object.freeze([ROLES.FARMER]);

// Roles permitted to enter administrator module routes.
const PRIVILEGED_ROLES = Object.freeze([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

// Roles that are internally managed (cannot self-register).
const INTERNAL_ROLES = Object.freeze([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]);

function isValidRole(role) {
  return ROLE_LIST.includes(role);
}

function isPrivilegedRole(role) {
  return PRIVILEGED_ROLES.includes(role);
}

function assertValidRole(role) {
  if (!isValidRole(role)) {
    const err = new Error(`Invalid role: ${role}`);
    err.statusCode = 400;
    err.code = 'INVALID_ROLE';
    throw err;
  }
  return role;
}

module.exports = {
  ROLES,
  ROLE_LIST,
  PRIMARY_ROLES,
  MARKETPLACE_ROLES,
  ASSISTABLE_ROLES,
  PRIVILEGED_ROLES,
  INTERNAL_ROLES,
  isValidRole,
  isPrivilegedRole,
  assertValidRole,
};