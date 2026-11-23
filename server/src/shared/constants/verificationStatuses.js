// server/src/shared/constants/verificationStatuses.js
// Identity verification (FR-ADMIN-003). Extends accountStatuses'
// VERIFICATION_STATUSES with the finer states used by
// modules/administrator/identity-verification/*.

'use strict';

const VERIFICATION_STATUSES = Object.freeze({
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ADDITIONAL_INFO_REQUESTED: 'additional_info_requested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',                 // previously approved, docs expired
});

const VERIFICATION_STATUS_LIST = Object.freeze(Object.values(VERIFICATION_STATUSES));

// Which document types are accepted (SRS §4.1.2 / §5.3).
const VERIFICATION_DOCUMENT_TYPES = Object.freeze({
  NATIONAL_ID: 'national_id',
  PASSPORT: 'passport',
  DRIVER_LICENSE: 'driver_license',
  BUSINESS_LICENSE: 'business_license',
  TIN_CERTIFICATE: 'tin_certificate',
  KEBELE_ID: 'kebele_id',             // Ethiopian local ID
  FARMER_CERTIFICATE: 'farmer_certificate',
  SELFIE_WITH_ID: 'selfie_with_id',
  PROOF_OF_ADDRESS: 'proof_of_address',
});

const VERIFICATION_DOCUMENT_TYPE_LIST = Object.freeze(Object.values(VERIFICATION_DOCUMENT_TYPES));

// Which document types are required per role (used by validators).
const REQUIRED_DOCUMENTS_BY_ROLE = Object.freeze({
  farmer: [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID, VERIFICATION_DOCUMENT_TYPES.SELFIE_WITH_ID],
  buyer: [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID],
  expert: [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID, VERIFICATION_DOCUMENT_TYPES.SELFIE_WITH_ID],
  service_provider: [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID, VERIFICATION_DOCUMENT_TYPES.BUSINESS_LICENSE],
  support_agent: [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID],
  admin: [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID],
  super_admin: [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID],
});

// Verification state machine.
const VERIFICATION_TRANSITIONS = Object.freeze({
  unverified: ['pending'],
  pending: ['under_review', 'rejected'],
  under_review: ['approved', 'rejected', 'additional_info_requested'],
  additional_info_requested: ['under_review', 'rejected'],
  approved: ['expired'],
  rejected: ['pending'],              // applicant may reapply
  expired: ['pending'],
});

// Rejection reasons admins can select.
const VERIFICATION_REJECTION_REASONS = Object.freeze({
  DOCUMENT_ILLEGIBLE: 'document_illegible',
  DOCUMENT_EXPIRED: 'document_expired',
  IDENTITY_MISMATCH: 'identity_mismatch',
  SUSPECTED_FRAUD: 'suspected_fraud',
  INCOMPLETE_DOCUMENTS: 'incomplete_documents',
  WRONG_DOCUMENT_TYPE: 'wrong_document_type',
  OTHER: 'other',
});

const VERIFICATION_REJECTION_REASON_LIST = Object.freeze(
  Object.values(VERIFICATION_REJECTION_REASONS),
);

// How long an approved verification remains valid before re-review.
const VERIFICATION_VALIDITY_DAYS = 730; // 2 years

function isValidVerificationStatus(s) {
  return VERIFICATION_STATUS_LIST.includes(s);
}

function isValidDocumentType(t) {
  return VERIFICATION_DOCUMENT_TYPE_LIST.includes(t);
}

function isValidRejectionReason(r) {
  return VERIFICATION_REJECTION_REASON_LIST.includes(r);
}

function canTransition(from, to) {
  if (!isValidVerificationStatus(from) || !isValidVerificationStatus(to)) return false;
  return (VERIFICATION_TRANSITIONS[from] || []).includes(to);
}

function assertVerificationTransition(from, to) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal verification transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_VERIFICATION_TRANSITION';
    throw err;
  }
}

function requiredDocumentsForRole(role) {
  return REQUIRED_DOCUMENTS_BY_ROLE[role] || [VERIFICATION_DOCUMENT_TYPES.NATIONAL_ID];
}

module.exports = {
  VERIFICATION_STATUSES,
  VERIFICATION_STATUS_LIST,
  VERIFICATION_DOCUMENT_TYPES,
  VERIFICATION_DOCUMENT_TYPE_LIST,
  REQUIRED_DOCUMENTS_BY_ROLE,
  VERIFICATION_TRANSITIONS,
  VERIFICATION_REJECTION_REASONS,
  VERIFICATION_REJECTION_REASON_LIST,
  VERIFICATION_VALIDITY_DAYS,
  isValidVerificationStatus,
  isValidDocumentType,
  isValidRejectionReason,
  canTransition,
  assertVerificationTransition,
  requiredDocumentsForRole,
};