// client/src/shared/hooks/usePermissions.js
// Client-side UX check only — backend remains the authority (§14.2).
// SRS refs: §4.3 access matrix, §14.2 authorization, BR-027..029.

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

const ROLE_PERMISSIONS = {
  farmer: [
    'product.create',
    'product.update.own',
    'product.deactivate.own',
    'product.read.published',
    'order.receive.own',
    'order.accept.own',
    'cart.manage',
    'review.create.own',
    'dispute.create.own',
    'profile.read.self',
    'profile.update.self',
  ],
  buyer: [
    'product.read.published',
    'order.create',
    'order.read.own',
    'order.cancel.own',
    'cart.manage',
    'review.create.own',
    'dispute.create.own',
    'profile.read.self',
    'profile.update.self',
  ],
  service_provider: [
    // Shared provider basics — per-type narrowed by providerType
    'profile.read.self',
    'profile.update.self',
  ],
  support_agent: [
    'assisted.farmer.search',
    'assisted.farmer.register',
    'assisted.consent.record',
    'assisted.listing.create',
    'assisted.listing.update',
    'ticket.respond.assigned',
    'ticket.escalate',
    'profile.read.self',
    'profile.update.self',
  ],
  administrator: ['*'],
};

const PROVIDER_TYPE_PERMISSIONS = {
  input_supplier: [
    'input.create',
    'input.update.own',
    'input.read',
    'inventory.manage.own',
  ],
  agricultural_expert: [
    'consultation.accept.own',
    'consultation.reschedule.own',
    'advice.create.own',
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) return new Set();
    const base = ROLE_PERMISSIONS[user.role] ?? [];
    const providerExtra =
      user.role === 'service_provider' && user.provider_type
        ? PROVIDER_TYPE_PERMISSIONS[user.provider_type] ?? []
        : [];
    return new Set([...base, ...providerExtra]);
  }, [user]);

  const has = useCallback(
    (perm) => {
      if (!perm) return false;
      if (permissions.has('*')) return true;
      if (Array.isArray(perm)) return perm.some((p) => permissions.has(p));
      return permissions.has(perm);
    },
    [permissions],
  );

  const hasAll = useCallback(
    (perms) => Array.isArray(perms) && perms.every((p) => permissions.has(p) || permissions.has('*')),
    [permissions],
  );

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      return Array.isArray(role) ? role.includes(user.role) : user.role === role;
    },
    [user],
  );

  const hasProviderType = useCallback(
    (type) => user?.role === 'service_provider' && user.provider_type === type,
    [user],
  );

  return { has, hasAll, hasRole, hasProviderType, permissions };
}

export default usePermissions;