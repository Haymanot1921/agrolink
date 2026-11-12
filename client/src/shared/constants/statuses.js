// client/src/shared/constants/statuses.js
// Canonical domain status values — must match DB ENUMs.
// SRS refs: FR-MARKET-006, FR-ORDER-006, FR-CONSULT-007, FR-SUPPORT, FR-DISPUTE.

export const ACCOUNT_STATUS = Object.freeze({
  PENDING_VERIFICATION: 'pending_verification',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
});

export const LISTING_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  INACTIVE: 'inactive',
  SOLD_OUT: 'sold_out',
});

export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_DISPATCH: 'ready_for_dispatch',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  RECORDED: 'recorded',
  VERIFIED: 'verified',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

export const CONSULTATION_STATUS = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  RESCHEDULED: 'rescheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
});

export const TICKET_STATUS = Object.freeze({
  OPEN: 'open',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  ESCALATED: 'escalated',
});

export const TICKET_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});

export const VERIFICATION_STATUS = Object.freeze({
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  MORE_INFO_REQUIRED: 'more_info_required',
});

export const DISPUTE_STATUS = Object.freeze({
  OPEN: 'open',
  UNDER_REVIEW: 'under_review',
  AWAITING_EVIDENCE: 'awaiting_evidence',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  ESCALATED: 'escalated',
});

export const CONSENT_STATUS = Object.freeze({
  ACTIVE: 'active',
  WITHDRAWN: 'withdrawn',
  EXPIRED: 'expired',
});

export const CONSENT_TYPE = Object.freeze({
  REGISTRATION: 'registration',
  LISTING_CREATE: 'listing_create',
  LISTING_UPDATE: 'listing_update',
  ORDER_ASSIST: 'order_assist',
  CONSULTATION_ASSIST: 'consultation_assist',
});

export const ASSISTED_ACTION_TYPE = Object.freeze({
  REGISTER_FARMER: 'register_farmer',
  CREATE_LISTING: 'create_listing',
  UPDATE_LISTING: 'update_listing',
  CREATE_CONSULTATION_REQUEST: 'create_consultation_request',
  ASSIST_ORDER: 'assist_order',
  UPDATE_PROFILE: 'update_profile',
  SUBMIT_TICKET: 'submit_ticket',
});

export const LISTING_CREATION_METHOD = Object.freeze({
  DIRECT_FARMER: 'direct_farmer',
  ASSISTED_SUPPORT: 'assisted_support',
});

/**
 * Valid order-status transitions (mirrors backend `orderStatusTransition.js`).
 * Used to filter action buttons in UI — backend remains authority.
 */
export const ORDER_TRANSITIONS = Object.freeze({
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY_FOR_DISPATCH, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY_FOR_DISPATCH]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: [],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.DISPUTED]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
});

/**
 * Valid consultation-status transitions.
 */
export const CONSULTATION_TRANSITIONS = Object.freeze({
  [CONSULTATION_STATUS.PENDING]: [
    CONSULTATION_STATUS.ACCEPTED,
    CONSULTATION_STATUS.REJECTED,
    CONSULTATION_STATUS.RESCHEDULED,
  ],
  [CONSULTATION_STATUS.ACCEPTED]: [
    CONSULTATION_STATUS.IN_PROGRESS,
    CONSULTATION_STATUS.RESCHEDULED,
    CONSULTATION_STATUS.CANCELLED,
  ],
  [CONSULTATION_STATUS.RESCHEDULED]: [
    CONSULTATION_STATUS.ACCEPTED,
    CONSULTATION_STATUS.CANCELLED,
  ],
  [CONSULTATION_STATUS.IN_PROGRESS]: [CONSULTATION_STATUS.COMPLETED, CONSULTATION_STATUS.NO_SHOW],
  [CONSULTATION_STATUS.COMPLETED]: [],
  [CONSULTATION_STATUS.CANCELLED]: [],
  [CONSULTATION_STATUS.REJECTED]: [],
  [CONSULTATION_STATUS.NO_SHOW]: [],
});