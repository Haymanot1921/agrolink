// server/src/shared/constants/accountStatuses.js
// Unified account lifecycle statuses for all users (buyer, farmer, expert,
// support agent, admin). Also covers verification status of a user's
// identity (ID + business docs).

'use strict';

// Account lifecycle (what the user can do)
const ACCOUNT_STATUSES = Object.freeze({
  PENDING: 'pending',             // registered but email/phone unverified
  ACTIVE: 'active',               // usable
  SUSPENDED: 'suspended',         // admin-only suspension, login blocked
  DEACTIVATED: 'deactivated',     // user self-deactivated, login blocked
  DELETED: 'deleted',             // soft-deleted; login blocked; retained for audit
});

const ACCOUNT_STATUS_LIST = Object.freeze(Object.values(ACCOUNT_STATUSES));

// Which transitions are allowed (used by users.service).
const ALLOWED_ACCOUNT_TRANSITIONS = Object.freeze({
  pending: ['active', 'deleted'],
  active: ['suspended', 'deactivated', 'deleted'],
  suspended: ['active', 'deleted'],
  deactivated: ['active', 'deleted'],
  deleted: [],
});

// Identity verification status (separate from account status)
const VERIFICATION_STATUSES = Object.freeze({
  UNVERIFIED: 'unverified',
  PENDING: 'pending',             // application submitted, awaiting admin review
  UNDER_REVIEW: 'under_review',   // admin opened it
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_MORE_INFO: 'needs_more_info',
});

const VERIFICATION_STATUS_LIST = Object.freeze(Object.values(VERIFICATION_STATUSES));

// Email / phone verification (independent)
const CONTACT_VERIFICATION_STATUSES = Object.freeze({
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
});

function isValidAccountStatus(s) {
  return ACCOUNT_STATUS_LIST.includes(s);
}

function isValidVerificationStatus(s) {
  return VERIFICATION_STATUS_LIST.includes(s);
}

function canTransitionAccount(from, to) {
  if (!isValidAccountStatus(from) || !isValidAccountStatus(to)) return false;
  return (ALLOWED_ACCOUNT_TRANSITIONS[from] || []).includes(to);
}

function assertAccountTransition(from, to) {
  if (!canTransitionAccount(from, to)) {
    const err = new Error(`Illegal account status transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_ACCOUNT_TRANSITION';
    throw err;
  }
}

// Shortcut: is the account login-capable?
function isLoginAllowed(status) {
  return status === ACCOUNT_STATUSES.ACTIVE;
}

module.exports = {
  ACCOUNT_STATUSES,
  ACCOUNT_STATUS_LIST,
  ALLOWED_ACCOUNT_TRANSITIONS,
  VERIFICATION_STATUSES,
  VERIFICATION_STATUS_LIST,
  CONTACT_VERIFICATION_STATUSES,
  isValidAccountStatus,
  isValidVerificationStatus,
  canTransitionAccount,
  assertAccountTransition,
  isLoginAllowed,
};