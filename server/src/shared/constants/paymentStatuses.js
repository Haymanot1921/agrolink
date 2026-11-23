// server/src/shared/constants/paymentStatuses.js
// SRS §13.1: FIRST RELEASE IS RECORD-ONLY. Statuses reflect recorded intent,
// not gateway state. Reused by buyer-payments, order-oversight, admin reports.

'use strict';

const PAYMENT_STATUSES = Object.freeze({
  RECORDED: 'recorded',                   // entry created, no gateway call
  REFUND_REQUESTED: 'refund_requested',   // buyer initiated
  REFUNDED: 'refunded',                   // admin confirmed refund record
  CANCELLED: 'cancelled',                 // buyer/farmer cancelled before settlement
});

const PAYMENT_STATUS_LIST = Object.freeze(Object.values(PAYMENT_STATUSES));

const PAYMENT_MODES = Object.freeze({
  RECORD_ONLY: 'record_only',             // first release — mandatory
  LIVE: 'live',                           // future only, gated by env
});

const PAYMENT_METHODS = Object.freeze({
  TELEBIRR: 'telebirr',
  CBE_BIRR: 'cbe_birr',
  CASH_ON_RECORD: 'cash_on_record',
});

const PAYMENT_METHOD_LIST = Object.freeze(Object.values(PAYMENT_METHODS));

// Only forward transitions allowed (matches shared/utils/paymentUtils.js).
const PAYMENT_TRANSITIONS = Object.freeze({
  recorded: ['refund_requested', 'cancelled'],
  refund_requested: ['refunded', 'cancelled'],
  refunded: [],
  cancelled: [],
});

// Who can trigger each transition (role-based).
const PAYMENT_TRANSITION_ACTORS = Object.freeze({
  'recorded->refund_requested': ['buyer'],
  'recorded->cancelled': ['buyer', 'admin'],
  'refund_requested->refunded': ['admin'],
  'refund_requested->cancelled': ['admin'],
});

function isValidPaymentStatus(s) {
  return PAYMENT_STATUS_LIST.includes(s);
}

function isValidPaymentMethod(m) {
  return PAYMENT_METHOD_LIST.includes(m);
}

function canTransition(from, to) {
  if (!isValidPaymentStatus(from) || !isValidPaymentStatus(to)) return false;
  return (PAYMENT_TRANSITIONS[from] || []).includes(to);
}

function canActorTransition(from, to, actorRole) {
  if (!canTransition(from, to)) return false;
  return (PAYMENT_TRANSITION_ACTORS[`${from}->${to}`] || []).includes(actorRole);
}

function assertPaymentTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal payment transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_PAYMENT_TRANSITION';
    throw err;
  }
  if (actorRole && !canActorTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition payment ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'PAYMENT_TRANSITION_FORBIDDEN';
    throw err;
  }
}

module.exports = {
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LIST,
  PAYMENT_MODES,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LIST,
  PAYMENT_TRANSITIONS,
  PAYMENT_TRANSITION_ACTORS,
  isValidPaymentStatus,
  isValidPaymentMethod,
  canTransition,
  canActorTransition,
  assertPaymentTransition,
};