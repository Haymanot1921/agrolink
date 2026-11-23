// server/src/shared/constants/consentStatuses.js
// Consent lifecycle for assisted actions (SRS §6.8 step 4, §7.1 BR-008).
// Every assisted action requires an ACTIVE consent record from the farmer.

'use strict';

const CONSENT_STATUSES = Object.freeze({
  PENDING: 'pending',                 // requested, awaiting farmer confirmation
  ACTIVE: 'active',                   // granted, usable
  REVOKED: 'revoked',                 // farmer revoked
  EXPIRED: 'expired',                 // passed expiresAt
  DECLINED: 'declined',               // farmer declined the request
});

const CONSENT_STATUS_LIST = Object.freeze(Object.values(CONSENT_STATUSES));

// Consent types — scoping what an agent may do.
const CONSENT_TYPES = Object.freeze({
  ASSISTED_MANAGEMENT: 'assisted_management',       // full assisted scope
  LISTING_MANAGEMENT: 'listing_management',         // create/update listings
  ORDER_MANAGEMENT: 'order_management',             // respond to orders
  MESSAGE_HANDLING: 'message_handling',             // reply to buyers
  PROFILE_MANAGEMENT: 'profile_management',         // update farmer profile
  MARKET_PRICE_PUBLISH: 'market_price_publish',     // rarely granted
});

const CONSENT_TYPE_LIST = Object.freeze(Object.values(CONSENT_TYPES));

// Transitions.
const CONSENT_TRANSITIONS = Object.freeze({
  pending: ['active', 'declined', 'expired'],
  active: ['revoked', 'expired'],
  revoked: [],
  expired: [],
  declined: [],
});

// Who may trigger each transition.
const CONSENT_TRANSITION_ACTORS = Object.freeze({
  'pending->active': ['farmer'],
  'pending->declined': ['farmer'],
  'pending->expired': ['system'],
  'active->revoked': ['farmer', 'admin'],
  'active->expired': ['system'],
});

// Defaults for new consent grants.
const CONSENT_DEFAULTS = Object.freeze({
  defaultValidityDays: 365,
  maxValidityDays: 730,
  warningBeforeExpiryDays: 30,
});

// Grant channels (how the farmer confirmed).
const CONSENT_GRANT_CHANNELS = Object.freeze({
  IN_PERSON: 'in_person',
  SMS: 'sms',
  IN_APP: 'in_app',
  PHONE_CALL: 'phone_call',
  WRITTEN_DOCUMENT: 'written_document',
});

const CONSENT_GRANT_CHANNEL_LIST = Object.freeze(Object.values(CONSENT_GRANT_CHANNELS));

function isValidConsentStatus(s) {
  return CONSENT_STATUS_LIST.includes(s);
}

function isValidConsentType(t) {
  return CONSENT_TYPE_LIST.includes(t);
}

function isValidGrantChannel(c) {
  return CONSENT_GRANT_CHANNEL_LIST.includes(c);
}

function canTransition(from, to) {
  if (!isValidConsentStatus(from) || !isValidConsentStatus(to)) return false;
  return (CONSENT_TRANSITIONS[from] || []).includes(to);
}

function canActorTransition(from, to, actorRole) {
  if (!canTransition(from, to)) return false;
  return (CONSENT_TRANSITION_ACTORS[`${from}->${to}`] || []).includes(actorRole);
}

function assertConsentTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal consent transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_CONSENT_TRANSITION';
    throw err;
  }
  if (actorRole && !canActorTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition consent ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'CONSENT_TRANSITION_FORBIDDEN';
    throw err;
  }
}

function isUsable(status) {
  return status === CONSENT_STATUSES.ACTIVE;
}

module.exports = {
  CONSENT_STATUSES,
  CONSENT_STATUS_LIST,
  CONSENT_TYPES,
  CONSENT_TYPE_LIST,
  CONSENT_TRANSITIONS,
  CONSENT_TRANSITION_ACTORS,
  CONSENT_DEFAULTS,
  CONSENT_GRANT_CHANNELS,
  CONSENT_GRANT_CHANNEL_LIST,
  isValidConsentStatus,
  isValidConsentType,
  isValidGrantChannel,
  canTransition,
  canActorTransition,
  assertConsentTransition,
  isUsable,
};