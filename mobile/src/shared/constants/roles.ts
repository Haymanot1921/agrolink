// mobile/src/shared/constants/roles.ts
// Canonical actor roles (SRS §4.1 — 5 actors).

import type { AuthUser } from '@hooks/useAuth';

export const ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  SERVICE_PROVIDER: 'service_provider',
  SUPPORT_AGENT: 'support_agent',
  ADMINISTRATOR: 'administrator',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LIST: Role[] = [
  ROLES.FARMER,
  ROLES.BUYER,
  ROLES.SERVICE_PROVIDER,
  ROLES.SUPPORT_AGENT,
  ROLES.ADMINISTRATOR,
];

export const ROLE_LABELS: Record<Role, string> = {
  farmer: 'Farmer',
  buyer: 'Buyer',
  service_provider: 'Service Provider',
  support_agent: 'Support Agent',
  administrator: 'Administrator',
};

/** Icon keys used in role selection & drawers. */
export const ROLE_ICONS: Record<Role, 'farmer' | 'buyer' | 'input-supplier' | 'agricultural-expert' | 'support-agent' | 'administrator'> = {
  farmer: 'farmer',
  buyer: 'buyer',
  service_provider: 'input-supplier', // resolved further by providerType
  support_agent: 'support-agent',
  administrator: 'administrator',
};

export function isFarmer(user: AuthUser | null): boolean {
  return user?.role === ROLES.FARMER;
}

export function isBuyer(user: AuthUser | null): boolean {
  return user?.role === ROLES.BUYER;
}

export function isServiceProvider(user: AuthUser | null): boolean {
  return user?.role === ROLES.SERVICE_PROVIDER;
}

export function isSupportAgent(user: AuthUser | null): boolean {
  return user?.role === ROLES.SUPPORT_AGENT;
}

export function isAdministrator(user: AuthUser | null): boolean {
  return user?.role === ROLES.ADMINISTRATOR;
}

/** Roles that can be self-registered directly (SRS §5.1 + §4.1). */
export const SELF_REGISTERABLE_ROLES: Role[] = [
  ROLES.FARMER,
  ROLES.BUYER,
  ROLES.SERVICE_PROVIDER,
];

/** Roles that must be provisioned by an administrator. */
export const ADMIN_PROVISIONED_ROLES: Role[] = [
  ROLES.SUPPORT_AGENT,
  ROLES.ADMINISTRATOR,
];