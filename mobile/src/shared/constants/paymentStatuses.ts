// mobile/src/shared/constants/paymentStatuses.ts
// Payment lifecycle for record-only mode (SRS §13.1).
// ⚠️ The platform does not auto-verify payments. All status changes
//     are reconciled server-side via provider webhooks.

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  RECORDED: 'recorded',
  VERIFIED: 'verified',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];

export const PAYMENT_STATUS_LIST: PaymentStatus[] = [
  PAYMENT_STATUSES.PENDING,
  PAYMENT_STATUSES.RECORDED,
  PAYMENT_STATUSES.VERIFIED,
  PAYMENT_STATUSES.FAILED,
  PAYMENT_STATUSES.REFUNDED,
];

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'warning',
  recorded: 'info',
  verified: 'success',
  failed: 'danger',
  refunded: 'default',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  TELEBIRR: 'telebirr',
  CHAPA: 'chapa',
  OTHER: 'other',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_METHOD_LIST: PaymentMethod[] = [
  PAYMENT_METHODS.CASH,
  PAYMENT_METHODS.BANK_TRANSFER,
  PAYMENT_METHODS.TELEBIRR,
  PAYMENT_METHODS.CHAPA,
  PAYMENT_METHODS.OTHER,
];

export const REFUND_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSED: 'processed',
} as const;

export type RefundStatus = typeof REFUND_STATUSES[keyof typeof REFUND_STATUSES];