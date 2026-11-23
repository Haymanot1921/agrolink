// server/src/shared/constants/disputeStatuses.js
// Dispute lifecycle (SRS §5.15, FR-DISPUTE-001..007). Both buyer-side
// dispute creation and admin resolution reference this file.

'use strict';

const DISPUTE_STATUSES = Object.freeze({
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  AWAITING_EVIDENCE: 'awaiting_evidence',
  AWAITING_RESPONSE: 'awaiting_response',       // awaiting other party
  ESCALATED: 'escalated',                       // to super_admin
  RESOLVED_BUYER: 'resolved_buyer',             // favor buyer (refund/return)
  RESOLVED_SELLER: 'resolved_seller',           // favor farmer
  RESOLVED_MUTUAL: 'resolved_mutual',           // partial/split resolution
  WITHDRAWN: 'withdrawn',                       // buyer withdrew
  CLOSED: 'closed',                             // final archival
});

const DISPUTE_STATUS_LIST = Object.freeze(Object.values(DISPUTE_STATUSES));

const TERMINAL_DISPUTE_STATUSES = Object.freeze([
  DISPUTE_STATUSES.RESOLVED_BUYER,
  DISPUTE_STATUSES.RESOLVED_SELLER,
  DISPUTE_STATUSES.RESOLVED_MUTUAL,
  DISPUTE_STATUSES.WITHDRAWN,
  DISPUTE_STATUSES.CLOSED,
]);

// Transitions.
const DISPUTE_TRANSITIONS = Object.freeze({
  open: ['under_review', 'withdrawn', 'closed'],
  under_review: ['awaiting_evidence', 'awaiting_response', 'escalated',
                 'resolved_buyer', 'resolved_seller', 'resolved_mutual', 'closed'],
  awaiting_evidence: ['under_review', 'escalated', 'closed'],
  awaiting_response: ['under_review', 'escalated', 'closed'],
  escalated: ['under_review', 'resolved_buyer', 'resolved_seller', 'resolved_mutual', 'closed'],
  resolved_buyer: ['closed'],
  resolved_seller: ['closed'],
  resolved_mutual: ['closed'],
  withdrawn: ['closed'],
  closed: [],
});

// Who may perform each transition.
const DISPUTE_TRANSITION_ACTORS = Object.freeze({
  'open->under_review': ['admin'],
  'open->withdrawn': ['buyer'],
  'open->closed': ['admin'],
  'under_review->awaiting_evidence': ['admin'],
  'under_review->awaiting_response': ['admin'],
  'under_review->escalated': ['admin'],
  'under_review->resolved_buyer': ['admin'],
  'under_review->resolved_seller': ['admin'],
  'under_review->resolved_mutual': ['admin'],
  'under_review->closed': ['admin'],
  'awaiting_evidence->under_review': ['buyer', 'admin'],
  'awaiting_evidence->escalated': ['admin'],
  'awaiting_evidence->closed': ['admin'],
  'awaiting_response->under_review': ['farmer', 'admin'],
  'awaiting_response->escalated': ['admin'],
  'awaiting_response->closed': ['admin'],
  'escalated->under_review': ['super_admin'],
  'escalated->resolved_buyer': ['super_admin'],
  'escalated->resolved_seller': ['super_admin'],
  'escalated->resolved_mutual': ['super_admin'],
  'escalated->closed': ['super_admin'],
  'resolved_buyer->closed': ['admin', 'super_admin'],
  'resolved_seller->closed': ['admin', 'super_admin'],
  'resolved_mutual->closed': ['admin', 'super_admin'],
  'withdrawn->closed': ['buyer', 'admin'],
});

// Resolution types recorded by admin (used by DisputeResolutionForm).
const DISPUTE_RESOLUTION_TYPES = Object.freeze({
  FULL_REFUND: 'full_refund',
  PARTIAL_REFUND: 'partial_refund',
  NO_REFUND: 'no_refund',
  REPLACEMENT: 'replacement',
  MUTUAL_AGREEMENT: 'mutual_agreement',
  NO_ACTION: 'no_action',
});

const DISPUTE_RESOLUTION_TYPE_LIST = Object.freeze(Object.values(DISPUTE_RESOLUTION_TYPES));

// Dispute categories (buyer selects when opening).
const DISPUTE_CATEGORIES = Object.freeze({
  ITEM_NOT_RECEIVED: 'item_not_received',
  ITEM_NOT_AS_DESCRIBED: 'item_not_as_described',
  QUALITY_ISSUE: 'quality_issue',
  QUANTITY_MISMATCH: 'quantity_mismatch',
  FRAUD: 'fraud',
  OTHER: 'other',
});

const DISPUTE_CATEGORY_LIST = Object.freeze(Object.values(DISPUTE_CATEGORIES));

// SLA for admin first response.
const DISPUTE_SLA_HOURS = Object.freeze({
  firstResponse: 24,
  resolution: 120, // 5 days
});

function isValidDisputeStatus(s) {
  return DISPUTE_STATUS_LIST.includes(s);
}

function isValidResolutionType(t) {
  return DISPUTE_RESOLUTION_TYPE_LIST.includes(t);
}

function isValidCategory(c) {
  return DISPUTE_CATEGORY_LIST.includes(c);
}

function canTransition(from, to) {
  if (!isValidDisputeStatus(from) || !isValidDisputeStatus(to)) return false;
  return (DISPUTE_TRANSITIONS[from] || []).includes(to);
}

function canActorTransition(from, to, actorRole) {
  if (!canTransition(from, to)) return false;
  return (DISPUTE_TRANSITION_ACTORS[`${from}->${to}`] || []).includes(actorRole);
}

function assertDisputeTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal dispute transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_DISPUTE_TRANSITION';
    throw err;
  }
  if (actorRole && !canActorTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition dispute ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'DISPUTE_TRANSITION_FORBIDDEN';
    throw err;
  }
}

function isTerminal(s) {
  return TERMINAL_DISPUTE_STATUSES.includes(s);
}

module.exports = {
  DISPUTE_STATUSES,
  DISPUTE_STATUS_LIST,
  TERMINAL_DISPUTE_STATUSES,
  DISPUTE_TRANSITIONS,
  DISPUTE_TRANSITION_ACTORS,
  DISPUTE_RESOLUTION_TYPES,
  DISPUTE_RESOLUTION_TYPE_LIST,
  DISPUTE_CATEGORIES,
  DISPUTE_CATEGORY_LIST,
  DISPUTE_SLA_HOURS,
  isValidDisputeStatus,
  isValidResolutionType,
  isValidCategory,
  canTransition,
  canActorTransition,
  assertDisputeTransition,
  isTerminal,
};