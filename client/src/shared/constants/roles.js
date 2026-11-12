// client/src/shared/constants/roles.js
// Canonical role names — must match DB & backend.
// SRS refs: §4.1 primary actors.

export const ROLES = Object.freeze({
  FARMER: 'farmer',
  BUYER: 'buyer',
  SERVICE_PROVIDER: 'service_provider',
  SUPPORT_AGENT: 'support_agent',
  ADMINISTRATOR: 'administrator',
});

export const ROLE_LIST = Object.freeze([
  ROLES.FARMER,
  ROLES.BUYER,
  ROLES.SERVICE_PROVIDER,
  ROLES.SUPPORT_AGENT,
  ROLES.ADMINISTRATOR,
]);

export const ROLE_LABELS = Object.freeze({
  [ROLES.FARMER]: { en: 'Farmer', am: 'ገበሬ' },
  [ROLES.BUYER]: { en: 'Buyer', am: 'ገዢ' },
  [ROLES.SERVICE_PROVIDER]: { en: 'Service Provider', am: 'አገልግሎት አቅራቢ' },
  [ROLES.SUPPORT_AGENT]: { en: 'Support Agent', am: 'ድጋፍ ሰጪ' },
  [ROLES.ADMINISTRATOR]: { en: 'Administrator', am: 'አስተዳዳሪ' },
});

/**
 * Default landing path per role (after login).
 */
export const ROLE_HOME = Object.freeze({
  [ROLES.FARMER]: '/farmer',
  [ROLES.BUYER]: '/buyer',
  [ROLES.SERVICE_PROVIDER]: '/service-provider',
  [ROLES.SUPPORT_AGENT]: '/support-agent',
  [ROLES.ADMINISTRATOR]: '/admin',
});

/**
 * Human-readable role label with locale fallback.
 */
export function roleLabel(role, locale = 'en') {
  return ROLE_LABELS[role]?.[locale] ?? role;
}