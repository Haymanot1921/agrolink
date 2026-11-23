// server/src/shared/constants/caseStatuses.js
// Generic "case" lifecycle used by disputes, support tickets, identity
// verification, and content reports — anywhere an admin investigates a matter.
// Module-specific constants (disputeStatuses, ticketStatuses) can alias or
// extend this base for their own workflows.

'use strict';

const CASE_STATUSES = Object.freeze({
  OPEN: 'open',                       // created, unassigned
  ASSIGNED: 'assigned',               // assigned to an agent/admin
  UNDER_REVIEW: 'under_review',       // actively being investigated
  AWAITING_INPUT: 'awaiting_input',   // waiting for reporter/parties
  ESCALATED: 'escalated',             // moved to higher tier
  RESOLVED: 'resolved',               // decision made
  DISMISSED: 'dismissed',             // no action needed
  CLOSED: 'closed',                   // final, no further changes
});

const CASE_STATUS_LIST = Object.freeze(Object.values(CASE_STATUSES));

// Cases still consuming reviewer attention.
const ACTIVE_CASE_STATUSES = Object.freeze([
  CASE_STATUSES.OPEN,
  CASE_STATUSES.ASSIGNED,
  CASE_STATUSES.UNDER_REVIEW,
  CASE_STATUSES.AWAITING_INPUT,
  CASE_STATUSES.ESCALATED,
]);

// Generic transitions. Module-specific constants may tighten these.
const CASE_TRANSITIONS = Object.freeze({
  open: ['assigned', 'under_review', 'dismissed', 'closed'],
  assigned: ['under_review', 'awaiting_input', 'escalated', 'resolved', 'dismissed', 'closed'],
  under_review: ['awaiting_input', 'escalated', 'resolved', 'dismissed', 'closed'],
  awaiting_input: ['under_review', 'escalated', 'resolved', 'dismissed', 'closed'],
  escalated: ['under_review', 'resolved', 'dismissed', 'closed'],
  resolved: ['closed', 'under_review'],   // reopen possible
  dismissed: ['closed', 'under_review'],
  closed: [],
});

function isValidCaseStatus(s) {
  return CASE_STATUS_LIST.includes(s);
}

function canTransition(from, to) {
  if (!isValidCaseStatus(from) || !isValidCaseStatus(to)) return false;
  return (CASE_TRANSITIONS[from] || []).includes(to);
}

function assertCaseTransition(from, to) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal case transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_CASE_TRANSITION';
    throw err;
  }
}

function isActive(s) {
  return ACTIVE_CASE_STATUSES.includes(s);
}

function isTerminal(s) {
  return s === CASE_STATUSES.CLOSED;
}

module.exports = {
  CASE_STATUSES,
  CASE_STATUS_LIST,
  ACTIVE_CASE_STATUSES,
  CASE_TRANSITIONS,
  isValidCaseStatus,
  canTransition,
  assertCaseTransition,
  isActive,
  isTerminal,
};