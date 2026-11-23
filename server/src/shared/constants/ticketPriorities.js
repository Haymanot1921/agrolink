// server/src/shared/constants/ticketPriorities.js
// Ticket priority levels + dispute priority (same scale used in admin triage).
// Also used by SLA config in support-ticket-oversight.

'use strict';

const TICKET_PRIORITIES = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});

const TICKET_PRIORITY_LIST = Object.freeze(Object.values(TICKET_PRIORITIES));

// Sort order used in queues (higher first).
const PRIORITY_WEIGHT = Object.freeze({
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
});

// SLA in hours for first-agent-response and final-resolution, per priority.
// Conservative defaults; overridable via platform-configuration.
const SLA_HOURS = Object.freeze({
  low: { firstResponse: 24, resolution: 120 },
  medium: { firstResponse: 8, resolution: 48 },
  high: { firstResponse: 2, resolution: 24 },
  urgent: { firstResponse: 1, resolution: 6 },
});

// Auto-escalation thresholds: if a ticket reaches these elapsed hours without
// first response, bump priority.
const AUTO_ESCALATE_AFTER_HOURS = Object.freeze({
  low: 24,       // low -> medium
  medium: 8,     // medium -> high
  high: 2,       // high -> urgent
  urgent: null,  // already max
});

function isValidPriority(p) {
  return TICKET_PRIORITY_LIST.includes(p);
}

function assertValidPriority(p) {
  if (!isValidPriority(p)) {
    const err = new Error(`Invalid ticket priority: ${p}`);
    err.statusCode = 400;
    err.code = 'INVALID_TICKET_PRIORITY';
    throw err;
  }
  return p;
}

function weight(p) {
  return PRIORITY_WEIGHT[p] || 0;
}

function nextPriority(p) {
  const order = [TICKET_PRIORITIES.LOW, TICKET_PRIORITIES.MEDIUM, TICKET_PRIORITIES.HIGH, TICKET_PRIORITIES.URGENT];
  const idx = order.indexOf(p);
  if (idx < 0 || idx === order.length - 1) return p;
  return order[idx + 1];
}

function getSlaFor(priority) {
  return SLA_HOURS[priority] || SLA_HOURS.medium;
}

module.exports = {
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LIST,
  PRIORITY_WEIGHT,
  SLA_HOURS,
  AUTO_ESCALATE_AFTER_HOURS,
  isValidPriority,
  assertValidPriority,
  weight,
  nextPriority,
  getSlaFor,
};