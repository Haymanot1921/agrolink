// server/src/shared/utils/paymentUtils.js
// Payment-state helpers. SRS §13.1: first release is RECORD-ONLY. These
// helpers normalize state and produce stable references; they do NOT talk
// to any gateway (that lives in config/paymentGateway.js if ever enabled).

'use strict';

const crypto = require('crypto');

const PAYMENT_STATUSES = Object.freeze([
  'recorded',
  'refund_requested',
  'refunded',
  'cancelled',
]);

const PAYMENT_METHODS = Object.freeze([
  'telebirr',
  'cbe_birr',
  'cash_on_record',
]);

function isValidStatus(status) {
  return PAYMENT_STATUSES.includes(status);
}

function isValidMethod(method) {
  return PAYMENT_METHODS.includes(method);
}

/**
 * Generate a deterministic-but-unique transaction reference.
 * Format: <METHOD>-<YYYYMMDD>-<RANDOM8>
 */
function generateTransactionRef(method, date = new Date()) {
  const m = String(method || 'record').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${m}-${y}${mo}${d}-${rand}`;
}

/**
 * Only allow forward transitions. Used by payments.service before saving.
 */
const ALLOWED_TRANSITIONS = Object.freeze({
  recorded: ['refund_requested', 'cancelled'],
  refund_requested: ['refunded', 'cancelled'],
  refunded: [],
  cancelled: [],
});

function canTransition(from, to) {
  if (!isValidStatus(from) || !isValidStatus(to)) return false;
  return (ALLOWED_TRANSITIONS[from] || []).includes(to);
}

function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal payment status transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_PAYMENT_TRANSITION';
    throw err;
  }
}

/**
 * Reconcile order amount with recorded payments. Returns a summary object
 * used by payments.service and admin reports.
 * All amounts are integer minor units (santim).
 */
function reconcile({ order, payments = [] }) {
  const totalPaidMinor = payments
    .filter((p) => p.status === 'recorded' || p.status === 'refunded')
    .reduce((a, p) => a + (p.amountMinor || 0), 0);

  const totalRefundedMinor = payments
    .filter((p) => p.status === 'refunded')
    .reduce((a, p) => a + (p.refundMinor || p.amountMinor || 0), 0);

  const orderTotalMinor = order?.totalMinor || 0;
  const outstandingMinor = Math.max(0, orderTotalMinor - totalPaidMinor);

  let state = 'unpaid';
  if (totalPaidMinor >= orderTotalMinor && orderTotalMinor > 0) state = 'paid';
  else if (totalPaidMinor > 0) state = 'partial';
  if (totalRefundedMinor >= orderTotalMinor && orderTotalMinor > 0) state = 'refunded';

  return {
    orderId: order?._id ? String(order._id) : null,
    orderTotalMinor,
    totalPaidMinor,
    totalRefundedMinor,
    outstandingMinor,
    state,
    isFullyPaid: state === 'paid',
  };
}

module.exports = {
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  isValidStatus,
  isValidMethod,
  generateTransactionRef,
  ALLOWED_TRANSITIONS,
  canTransition,
  assertTransition,
  reconcile,
};