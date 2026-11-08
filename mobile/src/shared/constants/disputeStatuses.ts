// mobile/src/shared/constants/disputeStatuses.ts
// Dispute lifecycle (SRS §5.15 FR-DISPUTE-001..007).

export const DISPUTE_STATUSES = {
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  AWAITING_EVIDENCE: 'awaiting_evidence',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  ESCALATED: 'escalated',
} as const;

export type DisputeStatus = typeof DISPUTE_STATUSES[keyof typeof DISPUTE_STATUSES];

export const DISPUTE_STATUS_LIST: DisputeStatus[] = [
  DISPUTE_STATUSES.OPEN,
  DISPUTE_STATUSES.UNDER_REVIEW,
  DISPUTE_STATUSES.AWAITING_EVIDENCE,
  DISPUTE_STATUSES.RESOLVED,
  DISPUTE_STATUSES.CLOSED,
  DISPUTE_STATUSES.ESCALATED,
];

export const DISPUTE_STATUS_COLORS: Record<DisputeStatus, string> = {
  open: 'warning',
  under_review: 'info',
  awaiting_evidence: 'warning',
  resolved: 'success',
  closed: 'default',
  escalated: 'danger',
};

export const DISPUTE_REASONS = {
  PRODUCT_QUALITY: 'product_quality',
  WRONG_ITEM: 'wrong_item',
  NOT_RECEIVED: 'not_received',
  PAYMENT_ISSUE: 'payment_issue',
  OTHER: 'other',
} as const;

export type DisputeReason = typeof DISPUTE_REASONS[keyof typeof DISPUTE_REASONS];

export const DISPUTE_REASON_LIST: DisputeReason[] = [
  DISPUTE_REASONS.PRODUCT_QUALITY,
  DISPUTE_REASONS.WRONG_ITEM,
  DISPUTE_REASONS.NOT_RECEIVED,
  DISPUTE_REASONS.PAYMENT_ISSUE,
  DISPUTE_REASONS.OTHER,
];

export const DISPUTE_OUTCOMES = {
  BUYER_FAVOR: 'buyer_favor',
  SELLER_FAVOR: 'seller_favor',
  MUTUAL: 'mutual',
  NO_ACTION: 'no_action',
} as const;

export type DisputeOutcome = typeof DISPUTE_OUTCOMES[keyof typeof DISPUTE_OUTCOMES];

export function isDisputeFinal(status: DisputeStatus): boolean {
  return status === DISPUTE_STATUSES.RESOLVED || status === DISPUTE_STATUSES.CLOSED;
}