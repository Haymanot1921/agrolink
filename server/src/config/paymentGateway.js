// server/src/config/paymentGateway.js
// SRS §13.1: FIRST RELEASE is RECORD-ONLY.
// No real charge calls are issued. This module stores references and
// returns a normalized record payload so buyer-payments and admin reports work.

'use strict';

const { randomUUID } = require('crypto');
const env = require('./environment');
const logger = require('./logger');

function assertProvider(provider) {
  if (!env.payment.providers.includes(provider)) {
    const err = new Error(`Unsupported payment provider: ${provider}`);
    err.statusCode = 400;
    throw err;
  }
}

/**
 * Record a payment intent without contacting a live gateway.
 * Returns a normalized payload persisted by buyer-payments/payment.model.js.
 */
async function createRecordOnlyPayment({ provider, amount, currency, orderId, buyerId, metadata }) {
  assertProvider(provider);

  if (!env.payment.recordOnly) {
    // Defensive: if a future release flips recordOnly=false, this must be
    // replaced with a real gateway integration before shipping.
    const err = new Error('Live payment gateway not configured for this release');
    err.statusCode = 501;
    throw err;
  }

  const transactionRef = `${provider.toUpperCase()}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const record = {
    provider,
    transactionRef,
    amount,
    currency: currency || env.app.currency,
    orderId,
    buyerId,
    status: 'recorded', // recorded | refunded | cancelled
    mode: 'record_only',
    metadata: metadata || {},
    createdAt: new Date(),
  };

  logger.info('[payment] record-only entry created', {
    provider,
    transactionRef,
    orderId,
  });

  return record;
}

async function markRefundRecord({ transactionRef, amount, reason, actorId }) {
  // Record-only: no gateway call, just normalized bookkeeping payload.
  return {
    transactionRef,
    refundAmount: amount,
    reason: reason || null,
    actorId: actorId || null,
    mode: 'record_only',
    status: 'refund_recorded',
    recordedAt: new Date(),
  };
}

function listSupportedProviders() {
  return [...env.payment.providers];
}

module.exports = {
  createRecordOnlyPayment,
  markRefundRecord,
  listSupportedProviders,
};