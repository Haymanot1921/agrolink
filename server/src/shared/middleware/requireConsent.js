// server/src/shared/middleware/requireConsent.js
// SRS §6.8 (assisted actions) + data-processing consent.
// Blocks actions unless the actor (agent) has an unexpired consent record
// from the farmer they are acting on behalf of.

'use strict';

const logger = require('../../config/logger');
const { AppError } = require('../errors/AppError');
const env = require('../../config/environment');

/**
 * @param {Object} opts
 * @param {(req) => string} opts.getSubjectId — farmer id (assisted actor)
 * @param {(req) => string} [opts.getActorId] — defaults to req.user.id
 * @param {string} [opts.consentType] — e.g. 'assisted_management'
 * @param {number} [opts.maxAgeDays] — defaults to env.assistedMonitoring.maxConsentAgeDays
 */
function requireConsent(opts = {}) {
  const {
    getSubjectId,
    getActorId = (req) => req.user && req.user.id,
    consentType = 'assisted_management',
    maxAgeDays = env.assistedMonitoring.maxConsentAgeDays,
  } = opts;

  if (typeof getSubjectId !== 'function') {
    throw new Error('requireConsent: getSubjectId is required');
  }

  return async function consentGuard(req, res, next) {
    try {
      const subjectId = getSubjectId(req);
      const actorId = getActorId(req);

      if (!subjectId || !actorId) {
        return next(new AppError('Consent subject/actor missing', 400, 'CONSENT_CONTEXT_MISSING'));
      }

      // Lazy require to avoid circularity with assisted-farmer-monitoring.
      // eslint-disable-next-line global-require
      const consentRepo = require('../../modules/administrator/assisted-farmer-monitoring/assistedFarmer.repository');
      const consent = await consentRepo.findActiveConsent({
        subjectId,
        actorId,
        consentType,
      });

      if (!consent) {
        logger.warn('[consent] missing', { subjectId, actorId, consentType });
        return next(new AppError('Active consent required', 403, 'CONSENT_REQUIRED'));
      }

      if (consent.revokedAt) {
        return next(new AppError('Consent has been revoked', 403, 'CONSENT_REVOKED'));
      }

      const issuedAt = consent.grantedAt || consent.createdAt;
      const ageDays = issuedAt
        ? (Date.now() - new Date(issuedAt).getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;
      if (ageDays > maxAgeDays) {
        return next(new AppError('Consent is older than allowed', 403, 'CONSENT_EXPIRED'));
      }

      if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
        return next(new AppError('Consent expired', 403, 'CONSENT_EXPIRED'));
      }

      req.consent = {
        id: String(consent._id),
        type: consent.consentType,
        grantedAt: issuedAt,
        expiresAt: consent.expiresAt || null,
      };
      return next();
    } catch (err) {
      logger.error('[consent] check failed', { message: err.message });
      return next(err);
    }
  };
}

module.exports = { requireConsent };