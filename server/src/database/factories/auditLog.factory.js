// server/src/database/factories/auditLog.factory.js
// Deterministic audit_log fixture builder.
// Every field matches auditLog.model.js and the shape produced by
// shared/utils/auditLogger.writeAudit(). Useful for:
//   - integration tests of audit-logs module (filters, exports)
//   - seeding admin dashboards with realistic activity
'use strict';

const {
  AUDIT_EVENT_TYPES,
  AUDIT_CATEGORIES,
  categoryFor,
  isHighSeverity,
} = require('../../shared/constants/auditEventTypes');

const SAMPLE_ACTORS = [
  { id: '000000000000000000000001', role: 'admin' },
  { id: '000000000000000000000002', role: 'admin' },
  { id: '000000000000000000000003', role: 'super_admin' },
];

const SAMPLE_ACTIONS = [
  AUDIT_EVENT_TYPES.USER_SUSPENDED,
  AUDIT_EVENT_TYPES.USER_REACTIVATED,
  AUDIT_EVENT_TYPES.USER_ROLE_CHANGED,
  AUDIT_EVENT_TYPES.VERIFICATION_APPROVED,
  AUDIT_EVENT_TYPES.VERIFICATION_REJECTED,
  AUDIT_EVENT_TYPES.LISTING_APPROVED,
  AUDIT_EVENT_TYPES.LISTING_REMOVED,
  AUDIT_EVENT_TYPES.REVIEW_REMOVED,
  AUDIT_EVENT_TYPES.DISPUTE_RESOLVED,
  AUDIT_EVENT_TYPES.CONFIG_UPDATED,
  AUDIT_EVENT_TYPES.SECURITY_SUSPICIOUS_LOGIN,
  AUDIT_EVENT_TYPES.AUTH_LOGIN_SUCCESS,
  AUDIT_EVENT_TYPES.AUTH_LOGIN_FAILED,
];

const SAMPLE_IPS = ['10.0.0.1', '10.0.0.2', '10.0.0.3', '192.168.1.5'];
const SAMPLE_UAS = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
  'AgroLinkMobile/1.0 (Android 14)',
];

/**
 * Build a single audit log fixture.
 * @param {Object} [overrides]
 * @param {string} [overrides.action]         — default: random from SAMPLE_ACTIONS
 * @param {string} [overrides.category]       — derived from action if absent
 * @param {'low'|'medium'|'high'} [overrides.severity] — derived from action
 * @param {'success'|'failure'} [overrides.outcome]
 * @param {string} [overrides.reason]         — required when severity === 'high'
 * @param {Object} [overrides.actor]          — { id, role }
 * @param {Object} [overrides.target]         — { type, id }
 * @param {Object} [overrides.changes]        — { before, after }
 * @param {Object} [overrides.metadata]
 * @param {Date}   [overrides.timestamp]
 */
function build(overrides = {}) {
  const action = overrides.action || SAMPLE_ACTIONS[randomIndex(SAMPLE_ACTIONS.length)];
  const category = overrides.category || categoryFor(action) || AUDIT_CATEGORIES.SECURITY;
  const severity =
    overrides.severity || (isHighSeverity(action) ? 'high' : 'medium');
  const outcome = overrides.outcome || 'success';
  const actor = overrides.actor || SAMPLE_ACTORS[randomIndex(SAMPLE_ACTORS.length)];
  const target = overrides.target || {
    type: pickTargetType(action),
    id: randomHex(24),
  };
  const reason =
    overrides.reason !== undefined
      ? overrides.reason
      : severity === 'high'
      ? 'Seed fixture — operator action recorded'
      : null;

  if (severity === 'high' && !reason) {
    throw new Error('auditLog.factory: high-severity entries require a reason');
  }

  const timestamp = overrides.timestamp || new Date();

  return {
    actorId: actor.id || null,
    actorRole: actor.role || null,
    actorRoles: overrides.actorRoles || (actor.role ? [actor.role] : []),
    action,
    category,
    severity,
    outcome,
    targetType: target.type || null,
    targetId: target.id ? String(target.id) : null,
    changes: overrides.changes || undefined,
    metadata: sanitize(overrides.metadata) || undefined,
    reason,
    ip: overrides.ip || SAMPLE_IPS[randomIndex(SAMPLE_IPS.length)],
    userAgent: overrides.userAgent || SAMPLE_UAS[randomIndex(SAMPLE_UAS.length)],
    requestId: overrides.requestId || `seed-${randomHex(8)}`,
    mfaVerified: overrides.mfaVerified ?? (severity === 'high'),
    consentId: overrides.consentId || null,
    timestamp,
  };
}

/**
 * Build N fixtures spread across the last `daysBack` days for realistic
 * dashboards / exports. Timestamps are deterministic (spread evenly).
 */
function batch(count, { daysBack = 30, overrides = {} } = {}) {
  const out = [];
  const now = Date.now();
  const spanMs = daysBack * 24 * 60 * 60 * 1000;
  for (let i = 0; i < count; i += 1) {
    const ts = new Date(now - Math.floor((spanMs / count) * i));
    out.push(
      build({
        timestamp: ts,
        ...overrides,
      }),
    );
  }
  return out;
}

/**
 * Curated sample — a realistic spread of actions for integration tests.
 * Includes at least one of every event category.
 */
function sample() {
  return [
    build({
      action: AUDIT_EVENT_TYPES.AUTH_LOGIN_SUCCESS,
      severity: 'low',
      target: { type: 'user', id: '000000000000000000000010' },
    }),
    build({
      action: AUDIT_EVENT_TYPES.USER_SUSPENDED,
      severity: 'high',
      reason: 'Policy violation',
      target: { type: 'user', id: '000000000000000000000011' },
      changes: { before: { status: 'active' }, after: { status: 'suspended' } },
    }),
    build({
      action: AUDIT_EVENT_TYPES.LISTING_REMOVED,
      severity: 'high',
      reason: 'Prohibited item',
      target: { type: 'listing', id: '000000000000000000000012' },
    }),
    build({
      action: AUDIT_EVENT_TYPES.DISPUTE_RESOLVED,
      severity: 'high',
      reason: 'Favor buyer — refund issued',
      target: { type: 'dispute', id: '000000000000000000000013' },
    }),
    build({
      action: AUDIT_EVENT_TYPES.CONFIG_UPDATED,
      severity: 'high',
      reason: 'Enable maintenance mode',
      target: { type: 'config', id: 'maintenance' },
    }),
    build({
      action: AUDIT_EVENT_TYPES.SECURITY_SUSPICIOUS_LOGIN,
      severity: 'high',
      outcome: 'failure',
      reason: 'New device from unrecognized location',
      target: { type: 'user', id: '000000000000000000000010' },
    }),
  ];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function pickTargetType(action) {
  if (action.startsWith('user.')) return 'user';
  if (action.startsWith('listing.')) return 'listing';
  if (action.startsWith('verification.')) return 'verification_application';
  if (action.startsWith('dispute.')) return 'dispute';
  if (action.startsWith('ticket.')) return 'ticket';
  if (action.startsWith('review.')) return 'review';
  if (action.startsWith('content.')) return 'content';
  if (action.startsWith('config.')) return 'config';
  if (action.startsWith('security.')) return 'session';
  if (action.startsWith('auth.')) return 'user';
  return 'system';
}

const REDACTED = new Set([
  'password', 'passwordHash', 'token', 'accessToken', 'refreshToken',
  'authorization', 'otp', 'otpHash', 'mfaToken', 'secret', 'apiKey',
]);

function sanitize(metadata) {
  if (!metadata || typeof metadata !== 'object') return undefined;
  const out = {};
  for (const [k, v] of Object.entries(metadata)) {
    if (REDACTED.has(k)) out[k] = '[REDACTED]';
    else if (typeof v === 'string') out[k] = v.slice(0, 500);
    else out[k] = v;
  }
  return out;
}

// Small deterministic PRNG (seeded by call index) so fixtures are reproducible
// when called in the same order during a test.
let _seed = 0xdeadbeef;
function nextRandom() {
  // xorshift32
  _seed ^= _seed << 13; _seed >>>= 0;
  _seed ^= _seed >>> 17;
  _seed ^= _seed << 5; _seed >>>= 0;
  return _seed / 0xffffffff;
}

function randomIndex(max) {
  return Math.floor(nextRandom() * max) % max;
}

function randomHex(len) {
  let s = '';
  for (let i = 0; i < len; i += 1) {
    s += Math.floor(nextRandom() * 16).toString(16);
  }
  return s;
}

function _resetSeed(seed = 0xdeadbeef) {
  _seed = seed >>> 0;
}

module.exports = {
  build,
  batch,
  sample,
  _internals: { pickTargetType, _resetSeed },
};