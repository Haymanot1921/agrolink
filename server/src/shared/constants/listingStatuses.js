// server/src/shared/constants/listingStatuses.js
// Listing lifecycle (FR-MARKET-016, FR-ADMIN-006). Kept separate from
// moderationStatuses because listings have marketplace-specific states
// (SOLD, RESERVED, OUT_OF_STOCK, etc.) beyond review status.

'use strict';

const LISTING_STATUSES = Object.freeze({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  OUT_OF_STOCK: 'out_of_stock',
  RESERVED: 'reserved',
  SOLD: 'sold',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
  HIDDEN: 'hidden',
  REMOVED: 'removed',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
});

const LISTING_STATUS_LIST = Object.freeze(Object.values(LISTING_STATUSES));

// Statuses visible in the public marketplace.
const PUBLIC_LISTING_STATUSES = Object.freeze([
  LISTING_STATUSES.PUBLISHED,
  LISTING_STATUSES.RESERVED,
  LISTING_STATUSES.OUT_OF_STOCK,
]);

// Statuses that can be added to cart.
const PURCHASABLE_STATUSES = Object.freeze([
  LISTING_STATUSES.PUBLISHED,
]);

// Listing creation method (SRS §6.8 — assisted listings must be identifiable).
const LISTING_CREATION_METHODS = Object.freeze({
  SELF: 'self',
  ASSISTED: 'assisted',
  IMPORTED: 'imported',
});

const LISTING_CREATION_METHOD_LIST = Object.freeze(Object.values(LISTING_CREATION_METHODS));

// Transitions.
const LISTING_TRANSITIONS = Object.freeze({
  draft: ['pending_review', 'archived'],
  pending_review: ['published', 'rejected', 'changes_requested', 'removed'],
  published: ['out_of_stock', 'reserved', 'sold', 'hidden', 'removed', 'expired'],
  out_of_stock: ['published', 'sold', 'hidden', 'removed', 'expired'],
  reserved: ['published', 'sold', 'hidden', 'removed'],
  sold: ['archived'],
  rejected: ['draft', 'archived'],
  changes_requested: ['draft', 'removed'],
  hidden: ['published', 'removed'],
  removed: ['archived'],
  expired: ['published', 'archived'],
  archived: [],
});

// Who may perform each transition (owner/farmer, admin, system).
const LISTING_TRANSITION_ACTORS = Object.freeze({
  'draft->pending_review': ['owner'],
  'draft->archived': ['owner', 'admin'],
  'pending_review->published': ['admin'],
  'pending_review->rejected': ['admin'],
  'pending_review->changes_requested': ['admin'],
  'pending_review->removed': ['admin'],
  'published->out_of_stock': ['owner', 'admin'],
  'published->reserved': ['owner', 'system'],
  'published->sold': ['owner', 'system'],
  'published->hidden': ['admin'],
  'published->removed': ['admin'],
  'published->expired': ['system', 'owner'],
  'out_of_stock->published': ['owner'],
  'out_of_stock->sold': ['owner'],
  'out_of_stock->hidden': ['admin'],
  'out_of_stock->removed': ['admin'],
  'out_of_stock->expired': ['system'],
  'reserved->published': ['owner', 'system'],
  'reserved->sold': ['owner', 'system'],
  'reserved->hidden': ['admin'],
  'reserved->removed': ['admin'],
  'sold->archived': ['owner', 'admin', 'system'],
  'rejected->draft': ['owner'],
  'rejected->archived': ['admin'],
  'changes_requested->draft': ['owner'],
  'changes_requested->removed': ['admin'],
  'hidden->published': ['admin'],
  'hidden->removed': ['admin'],
  'removed->archived': ['admin'],
  'expired->published': ['owner'],
  'expired->archived': ['admin'],
});

// Default expiry in days from publication.
const LISTING_EXPIRY_DAYS = 60;

// Marketplace category types (product vs input).
const LISTING_KINDS = Object.freeze({
  PRODUCT: 'product',
  INPUT: 'input',
});

const LISTING_KIND_LIST = Object.freeze(Object.values(LISTING_KINDS));

function isValidListingStatus(s) {
  return LISTING_STATUS_LIST.includes(s);
}

function canTransition(from, to) {
  if (!isValidListingStatus(from) || !isValidListingStatus(to)) return false;
  return (LISTING_TRANSITIONS[from] || []).includes(to);
}

function canActorTransition(from, to, actorRole) {
  if (!canTransition(from, to)) return false;
  return (LISTING_TRANSITION_ACTORS[`${from}->${to}`] || []).includes(actorRole);
}

function assertListingTransition(from, to, actorRole) {
  if (!canTransition(from, to)) {
    const err = new Error(`Illegal listing transition: ${from} -> ${to}`);
    err.statusCode = 409;
    err.code = 'INVALID_LISTING_TRANSITION';
    throw err;
  }
  if (actorRole && !canActorTransition(from, to, actorRole)) {
    const err = new Error(`Role '${actorRole}' cannot transition listing ${from} -> ${to}`);
    err.statusCode = 403;
    err.code = 'LISTING_TRANSITION_FORBIDDEN';
    throw err;
  }
}

function isPubliclyVisible(s) {
  return PUBLIC_LISTING_STATUSES.includes(s);
}

function isPurchasable(s) {
  return PURCHASABLE_STATUSES.includes(s);
}

module.exports = {
  LISTING_STATUSES,
  LISTING_STATUS_LIST,
  PUBLIC_LISTING_STATUSES,
  PURCHASABLE_STATUSES,
  LISTING_CREATION_METHODS,
  LISTING_CREATION_METHOD_LIST,
  LISTING_TRANSITIONS,
  LISTING_TRANSITION_ACTORS,
  LISTING_EXPIRY_DAYS,
  LISTING_KINDS,
  LISTING_KIND_LIST,
  isValidListingStatus,
  canTransition,
  canActorTransition,
  assertListingTransition,
  isPubliclyVisible,
  isPurchasable,
};