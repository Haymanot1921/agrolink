// server/src/shared/constants/orderStatuses.js
// Order state machine (SRS §5.7, §7.4). No delivery tracking — only
// in-platform fulfillment states. Both buyer and farmer transitions
// are enforced here.

'use strict';

const ORDER_STATUSES = Object.freeze({
  PENDING: 'pending',                 // buyer placed, awaiting farmer confirmation
  CONFIRMED: 'confirmed',             // farmer accepted
  REJECTED: 'rejected',               // farmer declined
  PREPARING: 'preparing',             // farmer preparing for handover
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',             // buyer confirms receipt
  CANCELLED: 'cancelled',             // buyer/farmer cancelled before completion
  DISPUTED: 'disputed',               // dispute opened against order
  REFUNDED: 'refunded',               // record-only refund recorded
});

const ORDER_STATUS_LIST = Object.freeze(Object.values(ORDER_STATUSES));

// Statuses considered "terminal" (no further transitions except dispute/refund path)
const TERMINAL_ORDER_STATUSES = Object.freeze([
  ORDER_STATUSES.COMPLETED,
  ORDER_STATUSES.REJECTED,
  ORDER_STATUSES.CANCELLED,
  ORDER_STATUSES.REFUNDED,
]);

// Transition rules. Keys = current status; values = array of allowed next.
const ORDER_TRANSITIONS = Object.freeze({
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['preparing', 'cancelled', 'disputed'],
  preparing: ['ready_for_pickup', 'cancelled', 'disputed'],
  ready_for_pickup: ['completed', 'disputed'],
  completed: ['disputed'],           // buyers may dispute completed orders within window
  rejected: [],
  cancelled: [],
  disputed: ['refunded', 'completed'], // resolved by admin
  refunded: [],
});

// Who may perform which transition (used by orders.service authorization).
// Roles: 'buyer', 'farmer', 'admin'
const TRANSITION_ACTORS = Object.freeze({
  'pending->confirmed': ['farmer'],
  'pending->rejected': ['farmer'],
  'pending->cancelled': ['buyer', 'farmer'],
  'confirmed->preparing': ['farmer'],
  'confirmed->cancelled': ['buyer', 'farmer'],
  'confirmed->disputed': ['buyer'],
  'preparing->ready_for_pickup': ['farmer'],
  'preparing->cancelled': ['farmer'],
  'preparing->disputed': ['buyer'],
  'ready_for_pickup->completed': ['buyer'],
  'ready_for_pickup->disputed': ['buyer'],
  'completed->disputed': ['buyer'],
  'disputed->refunded': ['admin'],
  'disputed->completed': ['admin'],
});

// Days after completion that a buyer may open a dispute.
const DISPUTE_WINDOW_DAYS = 7;

function isValidOrderStatus(s) {
  return ORDER_STATUS_LIST.includes(s);
}

function canTransition(from, to) {
  if (!isValidOrderStatus(from) || !isValidOrderStatus(to)) return false;
  return (ORDER_TRANSITIONS[from] || []).includes(to);
}

function canActorTransition(from, to, actorRole) {
  if (!canTransition(from, to)) return false;
  const allowed = TRANSITION_ACTORS[`${from}->${to}`] || [];
  return allowed.includes(actorRole);
}

function assertOrderTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal order transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_ORDER_TRANSITION';
    throw err;
  }
  if (actorRole && !canActorTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'ORDER_TRANSITION_FORBIDDEN';
    throw err;
  }
}

function isTerminal(s) {
  return TERMINAL_ORDER_STATUSES.includes(s);
}

module.exports = {
  ORDER_STATUSES,
  ORDER_STATUS_LIST,
  TERMINAL_ORDER_STATUSES,
  ORDER_TRANSITIONS,
  TRANSITION_ACTORS,
  DISPUTE_WINDOW_DAYS,
  isValidOrderStatus,
  canTransition,
  canActorTransition,
  assertOrderTransition,
  isTerminal,
};