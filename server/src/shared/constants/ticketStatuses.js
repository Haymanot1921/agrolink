// server/src/shared/constants/ticketStatuses.js
// Support ticket lifecycle (SRS §5.13 FR-SUPPORT-001..009, §4.1.5 admin oversight).
// Same state machine used by buyer-support, farmer-support, and admin oversight.

'use strict';

const TICKET_STATUSES = Object.freeze({
  OPEN: 'open',                       // created, unassigned or just assigned
  IN_PROGRESS: 'in_progress',         // agent replied
  WAITING_FOR_USER: 'waiting_for_user', // agent asked question, awaiting reply
  ESCALATED: 'escalated',             // moved to admin oversight
  RESOLVED: 'resolved',               // agent marked resolved
  CLOSED: 'closed',                   // final
});

const TICKET_STATUS_LIST = Object.freeze(Object.values(TICKET_STATUSES));

// Statuses that still occupy the agent's active queue.
const ACTIVE_TICKET_STATUSES = Object.freeze([
  TICKET_STATUSES.OPEN,
  TICKET_STATUSES.IN_PROGRESS,
  TICKET_STATUSES.WAITING_FOR_USER,
  TICKET_STATUSES.ESCALATED,
]);

const TICKET_TRANSITIONS = Object.freeze({
  open: ['in_progress', 'escalated', 'closed'],
  in_progress: ['waiting_for_user', 'resolved', 'escalated', 'closed'],
  waiting_for_user: ['in_progress', 'resolved', 'escalated', 'closed'],
  escalated: ['in_progress', 'resolved', 'closed'],
  resolved: ['closed', 'in_progress'],   // reopen possible
  closed: [],
});

// Who may perform each transition (support_agent, admin, buyer/farmer = 'user').
const TICKET_TRANSITION_ACTORS = Object.freeze({
  'open->in_progress': ['support_agent', 'admin'],
  'open->escalated': ['support_agent', 'admin'],
  'open->closed': ['admin'],
  'in_progress->waiting_for_user': ['support_agent', 'admin'],
  'in_progress->resolved': ['support_agent', 'admin'],
  'in_progress->escalated': ['support_agent', 'admin'],
  'in_progress->closed': ['admin'],
  'waiting_for_user->in_progress': ['user', 'support_agent', 'admin'],
  'waiting_for_user->resolved': ['user', 'admin'],
  'waiting_for_user->escalated': ['user', 'support_agent', 'admin'],
  'waiting_for_user->closed': ['admin'],
  'escalated->in_progress': ['admin'],
  'escalated->resolved': ['admin'],
  'escalated->closed': ['admin'],
  'resolved->closed': ['user', 'support_agent', 'admin'],
  'resolved->in_progress': ['user', 'admin'],
});

function isValidTicketStatus(s) {
  return TICKET_STATUS_LIST.includes(s);
}

function canTransition(from, to) {
  if (!isValidTicketStatus(from) || !isValidTicketStatus(to)) return false;
  return (TICKET_TRANSITIONS[from] || []).includes(to);
}

function canActorTransition(from, to, actorRole) {
  if (!canTransition(from, to)) return false;
  return (TICKET_TRANSITION_ACTORS[`${from}->${to}`] || []).includes(actorRole);
}

function assertTicketTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal ticket transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_TICKET_TRANSITION';
    throw err;
  }
  if (actorRole && !canActorTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition ticket ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'TICKET_TRANSITION_FORBIDDEN';
    throw err;
  }
}

function isActive(s) {
  return ACTIVE_TICKET_STATUSES.includes(s);
}

function isClosed(s) {
  return s === TICKET_STATUSES.CLOSED;
}

module.exports = {
  TICKET_STATUSES,
  TICKET_STATUS_LIST,
  ACTIVE_TICKET_STATUSES,
  TICKET_TRANSITIONS,
  TICKET_TRANSITION_ACTORS,
  isValidTicketStatus,
  canTransition,
  canActorTransition,
  assertTicketTransition,
  isActive,
  isClosed,
};