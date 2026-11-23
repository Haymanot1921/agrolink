// server/src/shared/utils/currency.js
// ETB is the only currency in scope (SRS). Amounts are stored as integers in
// minor units (cents/santim) — 1 ETB = 100 santim. Never store floats for money.

'use strict';

const env = require('../../config/environment');

const CURRENCY = env.app.currency || 'ETB';
const MINOR_UNITS = 100; // 1 ETB = 100 santim

/**
 * Convert a "human" amount (e.g. 125.50) into integer minor units (12550).
 * Uses round-half-up on the integer part of the scaled value to avoid
 * floating-point surprises.
 */
function toMinorUnits(amount) {
  if (amount === null || amount === undefined) return 0;
  const num = Number(amount);
  if (!Number.isFinite(num)) {
    const err = new Error('Invalid amount');
    err.statusCode = 400;
    err.code = 'INVALID_AMOUNT';
    throw err;
  }
  return Math.round(num * MINOR_UNITS);
}

/**
 * Convert integer minor units back to a decimal number (12550 -> 125.5).
 * Use only at the presentation boundary — persistence uses minor units.
 */
function fromMinorUnits(minor) {
  const n = Number(minor) || 0;
  return n / MINOR_UNITS;
}

/**
 * Format ETB for display in EN or AM.
 * @param {number} minor
 * @param {{ locale?: 'en'|'am', withSymbol?: boolean }} [opts]
 */
function formatETB(minor, opts = {}) {
  const { locale = 'en', withSymbol = true } = opts;
  const value = fromMinorUnits(minor);
  const intlLocale = locale === 'am' ? 'am-ET' : 'en-ET';
  const formatter = new Intl.NumberFormat(intlLocale, {
    style: withSymbol ? 'currency' : 'decimal',
    currency: withSymbol ? 'ETB' : undefined,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

/**
 * Sum minor-unit amounts safely (no float drift).
 * Accepts an array of numbers OR an array of objects + pick function.
 */
function sumMinor(amounts, pick = (x) => x) {
  return amounts.reduce((acc, item) => acc + Math.round(Number(pick(item)) || 0), 0);
}

/**
 * Apply a percentage (basis points or decimal) and round to minor units.
 * @param {number} minor
 * @param {number} percent — e.g. 15 for 15% or 0.15
 */
function percentOf(minor, percent) {
  const p = percent > 1 ? percent / 100 : percent;
  return Math.round(minor * p);
}

/**
 * Guard against negative or NaN in business logic (order totals, refunds).
 */
function assertNonNegative(minor, field = 'amount') {
  if (!Number.isFinite(minor) || minor < 0) {
    const err = new Error(`Invalid ${field}`);
    err.statusCode = 400;
    err.code = 'INVALID_AMOUNT';
    throw err;
  }
  return minor;
}

module.exports = {
  CURRENCY,
  MINOR_UNITS,
  toMinorUnits,
  fromMinorUnits,
  formatETB,
  sumMinor,
  percentOf,
  assertNonNegative,
};