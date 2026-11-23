// server/src/shared/utils/dateTime.js
// Ethiopia-aware date/time helpers (Africa/Addis_Ababa = UTC+3, no DST).
// Used by market prices, orders, reports, audit logs, disputes.

'use strict';

const env = require('../../config/environment');

const ETHIOPIA_OFFSET_MINUTES = 180; // +03:00
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function now() {
  return new Date();
}

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function addDays(date, days) {
  return new Date(new Date(date).getTime() + days * MS_PER_DAY);
}

function addMinutes(date, minutes) {
  return new Date(new Date(date).getTime() + minutes * 60 * 1000);
}

function diffDays(a, b) {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / MS_PER_DAY);
}

function isPast(date) {
  return new Date(date).getTime() < Date.now();
}

function isFuture(date) {
  return new Date(date).getTime() > Date.now();
}

function isBetween(date, start, end) {
  const t = new Date(date).getTime();
  return t >= new Date(start).getTime() && t <= new Date(end).getTime();
}

/**
 * Convert a UTC Date into Ethiopia local wall-clock components.
 * Useful for market price "observation_date" and report grouping.
 */
function toEthiopia(date = new Date()) {
  const shifted = new Date(new Date(date).getTime() + ETHIOPIA_OFFSET_MINUTES * 60 * 1000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
    seconds: shifted.getUTCSeconds(),
    iso: shifted.toISOString(),
  };
}

/**
 * Format a Date for display in the app's timezone.
 * Uses Intl with the configured TZ so AM/EN both render correctly.
 */
function formatDateTime(date = new Date(), options = {}) {
  const formatter = new Intl.DateTimeFormat(options.locale || 'en-GB', {
    timeZone: env.app.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  });
  return formatter.format(new Date(date));
}

function formatDate(date = new Date(), options = {}) {
  const formatter = new Intl.DateTimeFormat(options.locale || 'en-GB', {
    timeZone: env.app.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  });
  return formatter.format(new Date(date));
}

/**
 * Normalize a user-supplied date range from query params.
 * Accepts ISO strings or YYYY-MM-DD, enforces max window (SRS report range).
 * @returns {{ from: Date, to: Date }}
 */
function parseDateRange(fromInput, toInput, { maxDays = 366, defaultDays = 30 } = {}) {
  const to = toInput ? endOfDay(new Date(toInput)) : endOfDay(new Date());
  const from = fromInput
    ? startOfDay(new Date(fromInput))
    : startOfDay(addDays(to, -defaultDays));

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    const err = new Error('Invalid date range');
    err.statusCode = 400;
    err.code = 'INVALID_DATE_RANGE';
    throw err;
  }
  if (from.getTime() > to.getTime()) {
    const err = new Error('`from` must be before `to`');
    err.statusCode = 400;
    err.code = 'INVALID_DATE_RANGE';
    throw err;
  }
  const spanDays = Math.ceil((to.getTime() - from.getTime()) / MS_PER_DAY);
  if (spanDays > maxDays) {
    const err = new Error(`Date range exceeds max of ${maxDays} days`);
    err.statusCode = 400;
    err.code = 'DATE_RANGE_TOO_LARGE';
    throw err;
  }
  return { from, to };
}

module.exports = {
  now,
  startOfDay,
  endOfDay,
  addDays,
  addMinutes,
  diffDays,
  isPast,
  isFuture,
  isBetween,
  toEthiopia,
  formatDate,
  formatDateTime,
  parseDateRange,
};