// mobile/src/shared/constants/notificationTypes.ts
// Notification categories for filtering + deep-link routing (SRS §5.12).

export const NOTIFICATION_TYPES = {
  // Orders
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_CHANGED: 'order.status_changed',
  FARMER_ORDER_CREATED: 'farmer.order.created',
  // Messages
  MESSAGE_CREATED: 'message.created',
  // Consultations
  CONSULTATION_ASSIGNED: 'consultation.assigned',
  CONSULTATION_STATUS_CHANGED: 'consultation.status_changed',
  // Support
  TICKET_ASSIGNED: 'ticket.assigned',
  TICKET_STATUS_CHANGED: 'ticket.status_changed',
  // Assisted farmer
  ASSISTED_CONSENT_RECORDED: 'assisted.consent_recorded',
  ASSISTED_SUSPICIOUS_ACTIVITY: 'assisted.suspicious_activity',
  // Disputes
  DISPUTE_CREATED: 'dispute.created',
  DISPUTE_UPDATED: 'dispute.updated',
  // Account
  ACCOUNT_VERIFIED: 'account.verified',
  ACCOUNT_SUSPENDED: 'account.suspended',
  // System
  SYSTEM_ANNOUNCEMENT: 'system.announcement',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export const NOTIFICATION_CATEGORIES = {
  ORDERS: 'orders',
  MESSAGES: 'messages',
  CONSULTATIONS: 'consultations',
  SUPPORT: 'support',
  ACCOUNT: 'account',
  SYSTEM: 'system',
} as const;

export type NotificationCategory = typeof NOTIFICATION_CATEGORIES[keyof typeof NOTIFICATION_CATEGORIES];

export const NOTIFICATION_TYPE_CATEGORY: Record<NotificationType, NotificationCategory> = {
  'order.created': NOTIFICATION_CATEGORIES.ORDERS,
  'order.status_changed': NOTIFICATION_CATEGORIES.ORDERS,
  'farmer.order.created': NOTIFICATION_CATEGORIES.ORDERS,
  'message.created': NOTIFICATION_CATEGORIES.MESSAGES,
  'consultation.assigned': NOTIFICATION_CATEGORIES.CONSULTATIONS,
  'consultation.status_changed': NOTIFICATION_CATEGORIES.CONSULTATIONS,
  'ticket.assigned': NOTIFICATION_CATEGORIES.SUPPORT,
  'ticket.status_changed': NOTIFICATION_CATEGORIES.SUPPORT,
  'assisted.consent_recorded': NOTIFICATION_CATEGORIES.SUPPORT,
  'assisted.suspicious_activity': NOTIFICATION_CATEGORIES.SUPPORT,
  'dispute.created': NOTIFICATION_CATEGORIES.SUPPORT,
  'dispute.updated': NOTIFICATION_CATEGORIES.SUPPORT,
  'account.verified': NOTIFICATION_CATEGORIES.ACCOUNT,
  'account.suspended': NOTIFICATION_CATEGORIES.ACCOUNT,
  'system.announcement': NOTIFICATION_CATEGORIES.SYSTEM,
};

export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in_app',
  SMS: 'sms',
  EMAIL: 'email',
  PUSH: 'push',
} as const;

export type NotificationChannel = typeof NOTIFICATION_CHANNELS[keyof typeof NOTIFICATION_CHANNELS];

export function getNotificationCategory(type: NotificationType): NotificationCategory {
  return NOTIFICATION_TYPE_CATEGORY[type] ?? NOTIFICATION_CATEGORIES.SYSTEM;
}