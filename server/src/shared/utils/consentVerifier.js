// server/src/shared/utils/consentVerifier.js
// Programmatic consent checks used by:
//   - requireConsent middleware (request-time guard)
//   - assistedFarmer.service (business logic)
//   - audits & reports (proving consent existed at action time)
//
// SRS §6.8 step 4: every assisted action must show farmer + agent + consent
// + action + timestamp. This util is the single source of truth for the
// consent half of that requirement.

'use strict';

const env = require('../../config/environment');
const logger = require('../../config/logger');

/**
 * Fetch the active consent record between an actor (agent) and a subject
 * (farmer). Returns the raw document or null.
 *
 * @param {Object} params
 * @param {string} params.subjectId  — farmer user id
 * @param {string} params.actorId    — agent user id
 * @param {string} [params.consentType='assisted_management']
 */
async function findActiveConsent({ subjectId, actorId, consentType = 'assisted_management' }) {
  if (!subjectId || !actorId) return null;
  // eslint-disable-next-line global-require
  const consentRepo = require('../../modules/administrator/assisted-farmer-monitoring/assistedFarmer.repository');
  return consentRepo.findActiveConsent({ subjectId, actorId, consentType });
}

/**
 * Higher-level verification. Returns a normalized result the caller can
 * embed in API responses and audit logs.
 *
 * @returns {{
 *   valid: boolean,
 *   reason: string|null,
 *   consentId: string|null,
 *   grantedAt: Date|null,
 *   expiresAt: Date|null,
 *   ageDays: number|null
 * }}
 */
async function verifyConsent({
  subjectId,
  actorId,
  consentType = 'assisted_management',
  maxAgeDays = env.assistedMonitoring.maxConsentAgeDays,
  at = new Date(),
} = {}) {
  const base = {
    valid: false,
    reason: null,
    consentId: null,
    grantedAt: null,
    expiresAt: null,
    ageDays: null,
  };

  if (!subjectId || !actorId) {
    return { ...base, reason: 'MISSING_CONTEXT' };
  }

  let consent;
  try {
    consent = await findActiveConsent({ subjectId, actorId, consentType });
  } catch (err) {
    logger.error('[consent] lookup failed', { message: err.message });
    return { ...base, reason: 'LOOKUP_ERROR' };
  }

  if (!consent) return { ...base, reason: 'NO_CONSENT' };
  if (consent.revokedAt) {
    return { ...base, reason: 'REVOKED', consentId: String(consent._id) };
  }

  const grantedAt = consent.grantedAt || consent.createdAt || null;
  const expiresAt = consent.expiresAt || null;
  const ageDays = grantedAt
    ? (new Date(at).getTime() - new Date(grantedAt).getTime()) / (1000 * 60 * 60 * 24)
    : null;

  if (expiresAt && new Date(expiresAt) < new Date(at)) {
    return {
      valid: false,
      reason: 'EXPIRED',
      consentId: String(consent._id),
      grantedAt,
      expiresAt,
      ageDays,
    };
  }

  if (ageDays !== null && ageDays > maxAgeDays) {
    return {
      valid: false,
      reason: 'STALE',
      consentId: String(consent._id),
      grantedAt,
      expiresAt,
      ageDays,
    };
  }

  return {
    valid: true,
    reason: null,
    consentId: String(consent._id),
    grantedAt,
    expiresAt,
    ageDays,
  };
}

/**
 * Convenience boolean wrapper (when caller doesn't need details).
 */
async function hasActiveConsent(params) {
  const result = await verifyConsent(params);
  return result.valid;
}

/**
 * Assertion variant for service-layer use: throws ApiError(403) if invalid.
 */
async function assertActiveConsent(params, errorMessage = 'Active consent required') {
  const result = await verifyConsent(params);
  if (result.valid) return result;

  // eslint-disable-next-line global-require
  const { ApiError } = require('./ApiError');
  const code = `CONSENT_${result.reason || 'REQUIRED'}`;
  throw new ApiError(errorMessage, 403, code, [
    { reason: result.reason, consentId: result.consentId },
  ]);
}

module.exports = {
  findActiveConsent,
  verifyConsent,
  hasActiveConsent,
  assertActiveConsent,
};