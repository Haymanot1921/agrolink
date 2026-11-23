// server/src/shared/utils/auditLogger.js
// BR-009 / FR-ADMIN-014/015 / SRS §15.3: every mutating admin action must
// write an append-only audit entry. This helper is the ONLY sanctioned way
// to write to audit_log — never write directly from a service.

'use strict';

const logger = require('../../config/logger');
const database = require('../../config/database');

// Actions are namespaced: 'admin.user.suspend', 'admin.listing.remove', etc.
// Kept open so new sub-modules don't need a schema change.
const CATEGORY = Object.freeze({
  AUTH: 'auth',
  USER: 'user',
  ACCESS_CONTROL: 'access_control',
  VERIFICATION: 'verification',
  MODERATION: 'moderation',
  DISPUTE: 'dispute',
  CONFIG: 'config',
  REPORT: 'report',
  ASSISTED: 'assisted',
  SUPPORT: 'support',
  PAYMENT: 'payment',
});

/**
 * @param {Object} params
 * @param {Object} params.req                — Express req (uses req.user, req.ip, headers)
 * @param {string} params.action             — e.g. 'admin.user.suspend'
 * @param {string} params.category           — one of CATEGORY
 * @param {string} params.targetType         — e.g. 'user' | 'listing' | 'dispute'
 * @param {string|Object} [params.targetId]  — affected resource id
 * @param {Object} [params.changes]          — { before, after } deltas
 * @param {Object} [params.metadata]         — extra context (never secrets)
 * @param {'low'|'medium'|'high'} [params.severity='low']
 * @param {'success'|'failure'} [params.outcome='success']
 * @param {string} [params.reason]           — required for high severity
 */
async function writeAudit({
  req,
  action,
  category,
  targetType,
  targetId,
  changes,
  metadata,
  severity = 'low',
  outcome = 'success',
  reason,
}) {
  if (!action || !category) {
    throw new Error('auditLogger: action and category are required');
  }
  if (severity === 'high' && !reason) {
    // High-severity actions require an operator-supplied reason.
    throw new Error('auditLogger: high-severity actions require a reason');
  }

  const actor = req && req.user
    ? {
        id: req.user.id,
        role: req.user.role,
        roles: req.user.roles || [req.user.role],
        email: req.user.email || null,
      }
    : { id: null, role: 'system' };

  const entry = {
    actorId: actor.id,
    actorRole: actor.role,
    actorRoles: actor.roles,
    action,
    category,
    severity,
    outcome,
    targetType: targetType || null,
    targetId: targetId ? String(targetId) : null,
    changes: changes || undefined,
    metadata: sanitize(metadata),
    reason: reason || null,
    ip: req ? req.ip : null,
    userAgent: req ? (req.headers && req.headers['user-agent']) || null : null,
    requestId: req ? req.id || (req.headers && req.headers['x-request-id']) || null : null,
    mfaVerified: Boolean(req && req.mfa),
    consentId: req && req.consent ? req.consent.id : null,
    timestamp: new Date(),
  };

  try {
    await database.query(
      `INSERT INTO audit_logs
       (actor_id, actor_role, action, category, severity, outcome, target_type,
        target_id, changes_json, metadata_json, reason, ip, user_agent, request_id,
        mfa_verified, consent_id, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        actor.id,
        actor.role,
        action,
        category,
        severity,
        outcome,
        entry.targetType,
        entry.targetId,
        changes ? JSON.stringify(changes) : null,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
        entry.reason,
        entry.ip,
        entry.userAgent,
        entry.requestId,
        entry.mfaVerified ? 1 : 0,
        entry.consentId,
        entry.timestamp,
      ],
    );
    logger.info('[audit] written', {
      action,
      actorId: actor.id,
      targetType,
      targetId: entry.targetId,
      severity,
      outcome,
    });
  } catch (err) {
    // Never let an audit failure block the business action silently:
    // log loudly so ops can backfill, but rethrow in non-prod to surface bugs.
    logger.error('[audit] write failed', { action, message: err.message });
    if (process.env.NODE_ENV !== 'production') {
      throw err;
    }
  }

  return entry;
}

/**
 * Guard against accidentally logging secrets or PII in metadata.
 * Removes known sensitive keys and caps value lengths.
 */
const REDACTED_KEYS = new Set([
  'password', 'passwordHash', 'token', 'accessToken', 'refreshToken',
  'authorization', 'otp', 'otpHash', 'mfaToken', 'secret', 'apiKey',
  'nationalId', 'bankAccount',
]);

function sanitize(obj, depth = 0) {
  if (obj === null || obj === undefined || depth > 5) return obj;
  if (typeof obj === 'string') return obj.length > 500 ? `${obj.slice(0, 500)}…` : obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.slice(0, 50).map((v) => sanitize(v, depth + 1));

  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (REDACTED_KEYS.has(k)) {
      out[k] = '[REDACTED]';
    } else {
      out[k] = sanitize(v, depth + 1);
    }
  }
  return out;
}

module.exports = { writeAudit, CATEGORY, sanitize };