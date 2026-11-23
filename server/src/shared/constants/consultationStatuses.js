// server/src/shared/constants/consultationStatuses.js
// Consultation lifecycle (SRS §5.8 FR-CONSULT-003..011, §6.6).
// Buyer requests; expert accepts/schedules; both join video; either may
// cancel before start; expert marks complete.

'use strict';

const CONSULTATION_STATUSES = Object.freeze({
  REQUESTED: 'requested',               // buyer created request
  ACCEPTED: 'accepted',                 // expert accepted, awaiting schedule
  SCHEDULED: 'scheduled',               // date/time confirmed
  IN_PROGRESS: 'in_progress',           // video session active
  COMPLETED: 'completed',               // expert marked done
  CANCELLED: 'cancelled',               // either party cancelled
  DECLINED: 'declined',                 // expert declined
  NO_SHOW: 'no_show',                   // scheduled but neither joined
});

const CONSULTATION_STATUS_LIST = Object.freeze(Object.values(CONSULTATION_STATUSES));

const TERMINAL_CONSULTATION_STATUSES = Object.freeze([
  CONSULTATION_STATUSES.COMPLETED,
  CONSULTATION_STATUSES.CANCELLED,
  CONSULTATION_STATUSES.DECLINED,
  CONSULTATION_STATUSES.NO_SHOW,
]);

// Transition map.
const CONSULTATION_TRANSITIONS = Object.freeze({
  requested: ['accepted', 'declined', 'cancelled'],
  accepted: ['scheduled', 'cancelled'],
  scheduled: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  declined: [],
  no_show: [],
});

// Who may perform each transition (buyer, expert, admin).
const CONSULTATION_TRANSITION_ACTORS = Object.freeze({
  'requested->accepted': ['expert'],
  'requested->declined': ['expert'],
  'requested->cancelled': ['buyer'],
  'accepted->scheduled': ['expert', 'buyer'],
  'accepted->cancelled': ['buyer', 'expert'],
  'scheduled->in_progress': ['expert', 'buyer'],
  'scheduled->cancelled': ['buyer', 'expert', 'admin'],
  'scheduled->no_show': ['expert', 'admin'],
  'in_progress->completed': ['expert', 'admin'],
  'in_progress->cancelled': ['admin'],
});

// Default video session length (minutes) and pre-session join window.
const SESSION_DEFAULTS = Object.freeze({
  durationMinutes: 30,
  joinWindowBeforeMinutes: 10,
  joinWindowAfterMinutes: 10,
});

// Cancellation cutoffs: hours before scheduled start.
const CANCELLATION_RULES = Object.freeze({
  freeCancellationHours: 24,      // no penalty/refund record in first release
  lateCancellationHours: 1,       // still allowed, but flagged in reports
});

function isValidConsultationStatus(s) {
  return CONSULTATION_STATUS_LIST.includes(s);
}

function canTransition(from, to) {
  if (!isValidConsultationStatus(from) || !isValidConsultationStatus(to)) return false;
  return (CONSULTATION_TRANSITIONS[from] || []).includes(to);
}

function canActorTransition(from, to, actorRole) {
  if (!canTransition(from, to)) return false;
  return (CONSULTATION_TRANSITION_ACTORS[`${from}->${to}`] || []).includes(actorRole);
}

function assertConsultationTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal consultation transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_CONSULTATION_TRANSITION';
    throw err;
  }
  if (actorRole && !canActorTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition consultation ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'CONSULTATION_TRANSITION_FORBIDDEN';
    throw err;
  }
}

function isTerminal(s) {
  return TERMINAL_CONSULTATION_STATUSES.includes(s);
}

module.exports = {
  CONSULTATION_STATUSES,
  CONSULTATION_STATUS_LIST,
  TERMINAL_CONSULTATION_STATUSES,
  CONSULTATION_TRANSITIONS,
  CONSULTATION_TRANSITION_ACTORS,
  SESSION_DEFAULTS,
  CANCELLATION_RULES,
  isValidConsultationStatus,
  canTransition,
  canActorTransition,
  assertConsultationTransition,
  isTerminal,
};