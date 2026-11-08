// mobile/src/shared/constants/orderStatuses.ts
// Canonical order lifecycle (SRS §5.7 FR-ORDER-006/007).
// §2.4 exclusion: no delivery status — physical transport is arranged off-platform.

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_DISPATCH: 'ready_for_dispatch',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LIST: OrderStatus[] = [
  ORDER_STATUSES.PENDING,
  ORDER_STATUSES.CONFIRMED,
  ORDER_STATUSES.PREPARING,
  ORDER_STATUSES.READY_FOR_DISPATCH,
  ORDER_STATUSES.COMPLETED,
  ORDER_STATUSES.CANCELLED,
  ORDER_STATUSES.DISPUTED,
];

export type StatusColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export const ORDER_STATUS_COLORS: Record<OrderStatus, StatusColor> = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'info',
  ready_for_dispatch: 'primary',
  completed: 'success',
  cancelled: 'danger',
  disputed: 'danger',
};

/** Legal state transitions — enforced by backend, mirrored here for UI. */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.CANCELLED],
  confirmed: [ORDER_STATUSES.PREPARING, ORDER_STATUSES.CANCELLED],
  preparing: [ORDER_STATUSES.READY_FOR_DISPATCH, ORDER_STATUSES.CANCELLED],
  ready_for_dispatch: [ORDER_STATUSES.COMPLETED],
  completed: [],
  cancelled: [],
  disputed: [ORDER_STATUSES.CANCELLED, ORDER_STATUSES.COMPLETED],
};

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isOrderFinal(status: OrderStatus): boolean {
  return status === ORDER_STATUSES.COMPLETED || status === ORDER_STATUSES.CANCELLED;
}