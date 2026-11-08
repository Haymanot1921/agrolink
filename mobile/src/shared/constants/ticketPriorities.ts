// mobile/src/shared/constants/ticketPriorities.ts
// Support ticket priorities (SRS §5.13).

export const TICKET_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type TicketPriority = typeof TICKET_PRIORITIES[keyof typeof TICKET_PRIORITIES];

export const TICKET_PRIORITY_LIST: TicketPriority[] = [
  TICKET_PRIORITIES.LOW,
  TICKET_PRIORITIES.MEDIUM,
  TICKET_PRIORITIES.HIGH,
  TICKET_PRIORITIES.URGENT,
];

export const TICKET_PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

/** Numeric ordering for sorting. */
export const TICKET_PRIORITY_ORDER: Record<TicketPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};