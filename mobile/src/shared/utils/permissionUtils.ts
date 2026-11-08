// mobile/src/shared/utils/permissionUtils.ts
// Static RBAC helpers (pure functions — no React).
// Used by usePermissions + navigation guards.
// SRS refs: §4.3, §14.2, FR-AUTH-008.

import type { AuthUser } from '@hooks/useAuth';
import { ROLE_PERMISSIONS } from '@constants/permissions';

export function getPermissionsForRole(user: AuthUser | null): string[] {
  if (!user) return [];
  if (user.permissions?.length) return user.permissions;
  // Fallback — static map from constants (used before /me returns permissions)
  return ROLE_PERMISSIONS[user.role] ?? [];
}

export function hasPermission(user: AuthUser | null, code: string): boolean {
  if (!user) return false;
  return getPermissionsForRole(user).includes(code);
}

export function hasAnyPermission(user: AuthUser | null, codes: string[]): boolean {
  const perms = getPermissionsForRole(user);
  return codes.some((c) => perms.includes(c));
}

export function hasAllPermissions(user: AuthUser | null, codes: string[]): boolean {
  const perms = getPermissionsForRole(user);
  return codes.every((c) => perms.includes(c));
}

export function hasRole(user: AuthUser | null, roles: AuthUser['role'][]): boolean {
  return Boolean(user && roles.includes(user.role));
}

export function hasProviderType(
  user: AuthUser | null,
  type: 'input_supplier' | 'agricultural_expert',
): boolean {
  return user?.role === 'service_provider' && user?.providerType === type;
}

/**
 * Check multiple permissions at once.
 * Example: can(user, { all: ['product.create'], any: ['admin.listing.moderate'] })
 */
export function can(
  user: AuthUser | null,
  checks: { all?: string[]; any?: string[]; role?: AuthUser['role'][] },
): boolean {
  if (checks.all && !hasAllPermissions(user, checks.all)) return false;
  if (checks.any && !hasAnyPermission(user, checks.any)) return false;
  if (checks.role && !hasRole(user, checks.role)) return false;
  return true;
}