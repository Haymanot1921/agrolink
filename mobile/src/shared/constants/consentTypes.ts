// mobile/src/shared/constants/consentTypes.ts
// Assisted Farmer Service consent (SRS §5.3, §6.2, §9.5, BR-016..025).
// ⚠️ A consent record MUST exist before an agent performs any assisted action.

export const CONSENT_TYPES = {
  REGISTRATION: 'registration',
  LISTING_CREATE: 'listing_create',
  LISTING_UPDATE: 'listing_update',
  ORDER_ASSIST: 'order_assist',
  CONSULTATION_ASSIST: 'consultation_assist',
} as const;

export type ConsentType = typeof CONSENT_TYPES[keyof typeof CONSENT_TYPES];

export const CONSENT_TYPE_LIST: ConsentType[] = [
  CONSENT_TYPES.REGISTRATION,
  CONSENT_TYPES.LISTING_CREATE,
  CONSENT_TYPES.LISTING_UPDATE,
  CONSENT_TYPES.ORDER_ASSIST,
  CONSENT_TYPES.CONSULTATION_ASSIST,
];

export const CONSENT_METHODS = {
  IN_PERSON: 'in_person',
  PHONE: 'phone',
  WRITTEN: 'written',
  SMS: 'sms',
} as const;

export type ConsentMethod = typeof CONSENT_METHODS[keyof typeof CONSENT_METHODS];

export const CONSENT_METHOD_LIST: ConsentMethod[] = [
  CONSENT_METHODS.IN_PERSON,
  CONSENT_METHODS.PHONE,
  CONSENT_METHODS.WRITTEN,
  CONSENT_METHODS.SMS,
];

export const CONSENT_STATUSES = {
  ACTIVE: 'active',
  WITHDRAWN: 'withdrawn',
  EXPIRED: 'expired',
} as const;

export type ConsentStatus = typeof CONSENT_STATUSES[keyof typeof CONSENT_STATUSES];

export const CONSENT_STATUS_COLORS: Record<ConsentStatus, string> = {
  active: 'success',
  withdrawn: 'danger',
  expired: 'default',
};

/** Assisted action types (§9.5). */
export const ASSISTED_ACTION_TYPES = {
  REGISTER_FARMER: 'register_farmer',
  CREATE_LISTING: 'create_listing',
  UPDATE_LISTING: 'update_listing',
  CREATE_CONSULTATION_REQUEST: 'create_consultation_request',
  ASSIST_ORDER: 'assist_order',
  UPDATE_PROFILE: 'update_profile',
  SUBMIT_TICKET: 'submit_ticket',
} as const;

export type AssistedActionType =
  typeof ASSISTED_ACTION_TYPES[keyof typeof ASSISTED_ACTION_TYPES];

export function isConsentActive(status: ConsentStatus): boolean {
  return status === CONSENT_STATUSES.ACTIVE;
}