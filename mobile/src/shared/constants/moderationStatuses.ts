// mobile/src/shared/constants/moderationStatuses.ts
// Shared moderation statuses across listings/content/reviews (SRS §5.14, §5.16).

export const MODERATION_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
  REMOVED: 'removed',
} as const;

export type ModerationStatus = typeof MODERATION_STATUSES[keyof typeof MODERATION_STATUSES];

export const MODERATION_STATUS_LIST: ModerationStatus[] = [
  MODERATION_STATUSES.PENDING,
  MODERATION_STATUSES.APPROVED,
  MODERATION_STATUSES.REJECTED,
  MODERATION_STATUSES.CHANGES_REQUESTED,
  MODERATION_STATUSES.REMOVED,
];

export const MODERATION_STATUS_COLORS: Record<ModerationStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  changes_requested: 'warning',
  removed: 'default',
};

/** Listing statuses (SRS §5.4 FR-MARKET-006). */
export const LISTING_STATUSES = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  INACTIVE: 'inactive',
  SOLD_OUT: 'sold_out',
} as const;

export type ListingStatus = typeof LISTING_STATUSES[keyof typeof LISTING_STATUSES];

export const LISTING_STATUS_LIST: ListingStatus[] = [
  LISTING_STATUSES.DRAFT,
  LISTING_STATUSES.PENDING_REVIEW,
  LISTING_STATUSES.PUBLISHED,
  LISTING_STATUSES.REJECTED,
  LISTING_STATUSES.INACTIVE,
  LISTING_STATUSES.SOLD_OUT,
];

export const LISTING_STATUS_COLORS: Record<ListingStatus, string> = {
  draft: 'default',
  pending_review: 'warning',
  published: 'success',
  rejected: 'danger',
  inactive: 'default',
  sold_out: 'default',
};

/** Content moderation for articles / comments / reviews. */
export const CONTENT_MODERATION_ACTIONS = {
  APPROVE: 'approve',
  REMOVE: 'remove',
  WARN: 'warn',
} as const;

export type ContentModerationAction =
  typeof CONTENT_MODERATION_ACTIONS[keyof typeof CONTENT_MODERATION_ACTIONS];