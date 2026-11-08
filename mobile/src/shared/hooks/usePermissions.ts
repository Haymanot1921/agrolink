// mobile/src/shared/hooks/usePermissions.ts
// Client-side permission checks — mirrors backend RBAC.
// SRS refs: §4.3, §14.2, FR-AUTH-008 (RBAC).
//
// ⚠️ Backend STILL enforces authorization (SRS §9.4). These checks are for
// UX only — they hide/disable UI that would fail server-side anyway.

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

export interface UsePermissionsResult {
  /** Current user's permissions (empty array if not logged in). */
  permissions: string[];
  /** Current user's role. */
  role: string | null;
  /** Current provider type (only for service_provider). */
  providerType: string | null;
  /** Has a specific permission code (e.g. 'product.create'). */
  hasPermission: (code: string) => boolean;
  /** Has ALL provided permissions. */
  hasAllPermissions: (codes: string[]) => boolean;
  /** Has ANY of the provided permissions. */
  hasAnyPermission: (codes: string[]) => boolean;
  /** Is one of the given roles. */
  hasRole: (roles: string[]) => boolean;
  /** Is a specific provider type (only for service_provider). */
  hasProviderType: (type: 'input_supplier' | 'agricultural_expert') => boolean;
}

export function usePermissions(): UsePermissionsResult {
  const { user } = useAuth();

  const permissions = useMemo(() => user?.permissions ?? [], [user?.permissions]);

  const hasPermission = useCallback(
    (code: string) => permissions.includes(code),
    [permissions],
  );

  const hasAllPermissions = useCallback(
    (codes: string[]) => codes.every((c) => permissions.includes(c)),
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (codes: string[]) => codes.some((c) => permissions.includes(c)),
    [permissions],
  );

  const hasRole = useCallback(
    (roles: string[]) => Boolean(user?.role && roles.includes(user.role)),
    [user?.role],
  );

  const hasProviderType = useCallback(
    (type: 'input_supplier' | 'agricultural_expert') =>
      user?.role === 'service_provider' && user?.providerType === type,
    [user?.role, user?.providerType],
  );

  return {
    permissions,
    role: user?.role ?? null,
    providerType: user?.providerType ?? null,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasProviderType,
  };
}