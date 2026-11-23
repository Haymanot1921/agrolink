// server/src/shared/constants/moderationStatuses.js
// Unified status vocabulary for listing/content/review moderation
// (SRS §5.10, FR-ADMIN-006, FR-REVIEW-004). Content types share the same
// state machine; only the target entity differs.

'use strict';

// State of a single moderation item (a listing, article, comment, review).
const MODERATION_STATUSES = Object.freeze({
  DRAFT: 'draft',                     // not submitted for review yet
  PENDING: 'pending',                 // submitted, in queue
  UNDER_REVIEW: 'under_review',       // moderator opened it
  APPROVED: 'approved',               // live
  PUBLISHED: 'published',             // live (articles)
  REJECTED: 'rejected',               // declined with reason
  CHANGES_REQUESTED: 'changes_requested', // returned to author/owner
  HIDDEN: 'hidden',                   // temporarily removed from public view
  REMOVED: 'removed',                 // permanently taken down (by moderator)
  ARCHIVED: 'archived',               // retained, not shown
});

const MODERATION_STATUS_LIST = Object.freeze(Object.values(MODERATION_STATUSES));

// Statuses considered "visible to the public".
const PUBLIC_VISIBLE_STATUSES = Object.freeze([
  MODERATION_STATUSES.APPROVED,
  MODERATION_STATUSES.PUBLISHED,
]);

// Statuses that occupy the moderator's active queue.
const IN_REVIEW_STATUSES = Object.freeze([
  MODERATION_STATUSES.PENDING,
  MODERATION_STATUSES.UNDER_REVIEW,
]);

// Transitions.
const MODERATION_TRANSITIONS = Object.freeze({
  draft: ['pending'],
  pending: ['under_review', 'approved', 'rejected', 'changes_requested', 'removed'],
  under_review: ['approved', 'published', 'rejected', 'changes_requested', 'hidden', 'removed'],
  approved: ['hidden', 'removed', 'archived'],
  published: ['hidden', 'removed', 'archived'],
  rejected: ['draft', 'pending', 'archived'],           // owner may revise
  changes_requested: ['draft', 'pending', 'removed'],   // owner may resubmit
  hidden: ['approved', 'published', 'removed'],
  removed: ['archived'],
  archived: [],
});

// Who may perform each transition. `owner` = the content author/farmer.
const MODERATION_TRANSITION_ACTORS = Object.freeze({
  'draft->pending': ['owner'],
  'pending->under_review': ['admin'],
  'pending->approved': ['admin'],
  'pending->rejected': ['admin'],
  'pending->changes_requested': ['admin'],
  'pending->removed': ['admin'],
  'under_review->approved': ['admin'],
  'under_review->published': ['admin'],
  'under_review->rejected': ['admin'],
  'under_review->changes_requested': ['admin'],
  'under_review->hidden': ['admin'],
  'under_review->removed': ['admin'],
  'approved->hidden': ['admin'],
  'approved->removed': ['admin'],
  'approved->archived': ['admin'],
  'published->hidden': ['admin'],
  'published->removed': ['admin'],
  'published->archived': ['admin'],
  'rejected->draft': ['owner'],
  'rejected->pending': ['owner'],
  'rejected->archived': ['admin'],
  'changes_requested->draft': ['owner'],
  'changes_requested->pending': ['owner'],
  'changes_requested->removed': ['admin'],
  'hidden->approved': ['admin'],
  'hidden->published': ['admin'],
  'hidden->removed': ['admin'],
  'removed->archived': ['admin'],
});

// Reason codes required for negative actions (used by validators + audit).
const MODERATION_REASON_CODES = Object.freeze({
  PROHIBITED_ITEM: 'prohibited_item',
  MISLEADING_INFO: 'misleading_info',
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  SPAM: 'spam',
  DUPLICATE: 'duplicate',
  FAKE_IDENTITY: 'fake_identity',
  OFF_PLATFORM: 'off_platform',
  OTHER: 'other',
});

const MODERATION_REASON_CODE_LIST = Object.freeze(Object.values(MODERATION_REASON_CODES));

function isValidModerationStatus(s) {
  return MODERATION_STATUS_LIST.includes(s);
}

function canTransition(from, to, actorRole) {
  if (!isValidModerationStatus(from) || !isValidModerationStatus(to)) return false;
  if (!(MODERATION_TRANSITIONS[from] || []).includes(to)) return false;
  if (!actorRole) return true;
  return (MODERATION_TRANSITION_ACTORS[`${from}->${to}`] || []).includes(actorRole);
}

function assertModerationTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal moderation transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_MODERATION_TRANSITION';
    throw err;
  }
  if (actorRole && !canTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'MODERATION_TRANSITION_FORBIDDEN';
    throw err;
  }
}

function isPubliclyVisible(s) {
  return PUBLIC_VISIBLE_STATUSES.includes(s);
}

function isInReview(s) {
  return IN_REVIEW_STATUSES.includes(s);
}

function isValidReasonCode(c) {
  return MODERATION_REASON_CODE_LIST.includes(c);
}

module.exports = {
  MODERATION_STATUSES,
  MODERATION_STATUS_LIST,
  PUBLIC_VISIBLE_STATUSES,
  IN_REVIEW_STATUSES,
  MODERATION_TRANSITIONS,
  MODERATION_TRANSITION_ACTORS,
  MODERATION_REASON_CODES,
  MODERATION_REASON_CODE_LIST,
  isValidModerationStatus,
  canTransition,
  assertModerationTransition,
  isPubliclyVisible,
  isInReview,
  isValidReasonCode,
};