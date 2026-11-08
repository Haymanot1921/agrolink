// mobile/src/shared/constants/ticketStatuses.ts
// Support ticket statuses (SRS §5.13 FR-SUPPORT-001..009).

export const TICKET_STATUSES = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  ESCALATED: 'escalated',
} as const;

export type TicketStatus = typeof TICKET_STATUSES[keyof typeof TICKET_STATUSES];

export const TICKET_STATUS_LIST: TicketStatus[] = [
  TICKET_STATUSES.OPEN,
  TICKET_STATUSES.ASSIGNED,
  TICKET_STATUSES.IN_PROGRESS,
  TICKET_STATUSES.RESOLVED,
  TICKET_STATUSES.CLOSED,
  TICKET_STATUSES.ESCALATED,
];

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  open: 'warning',
  assigned: 'info',
  in_progress: 'primary',
  resolved: 'success',
  closed: 'default',
  escalated: 'danger',
};

export const TICKET_CATEGORIES = {
  ACCOUNT: 'account',
  ORDER: 'order',
  PAYMENT: 'payment',
  PRODUCT: 'product',
  CONSULTATION: 'consultation',
  TECHNICAL: 'technical',
  COMPLAINT: 'complaint',
  OTHER: 'other',
} as const;

export type TicketCategory = typeof TICKET_CATEGORIES[keyof typeof TICKET_CATEGORIES];

export const TICKET_CATEGORY_LIST: TicketCategory[] = [
  TICKET_CATEGORIES.ACCOUNT,
  TICKET_CATEGORIES.ORDER,
  TICKET_CATEGORIES.PAYMENT,
  TICKET_CATEGORIES.PRODUCT,
  TICKET_CATEGORIES.CONSULTATION,
  TICKET_CATEGORIES.TECHNICAL,
  TICKET_CATEGORIES.COMPLAINT,
  TICKET_CATEGORIES.OTHER,
];

/** Terminal states — no more transitions. */
export function isTicketFinal(status: TicketStatus): boolean {
  return status === TICKET_STATUSES.RESOLVED || status === TICKET_STATUSES.CLOSED;
}