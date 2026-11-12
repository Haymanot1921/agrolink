// client/src/shared/utils/permissionUtils.js
// Pure permission helpers — NO React. usePermissions wraps these.
// SRS refs: §4.3, §14.2, BR-027..029.

export const ROLE_PERMISSIONS = {
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
  service_provider: ['profile.read.self', 'profile.update.self'],
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

export const PROVIDER_TYPE_PERMISSIONS = {
  input_supplier: ['input.create', 'input.update.own', 'input.read', 'inventory.manage.own'],
  agricultural_expert: [
    'consultation.accept.own',
    'consultation.reschedule.own',
    'advice.create.own',
  ],
};

/**
 * Build permission set from a user object.
 * @param {{ role: string, provider_type?: string }} user
 * @returns {Set<string>}
 */
export function buildPermissionSet(user) {
  if (!user) return new Set();
  const base = ROLE_PERMISSIONS[user.role] ?? [];
  const extra =
    user.role === 'service_provider' && user.provider_type
      ? PROVIDER_TYPE_PERMISSIONS[user.provider_type] ?? []
      : [];
  return new Set([...base, ...extra]);
}

/**
 * Check if a user has a permission (or wildcard, or any in a list).
 */
export function can(user, permission) {
  const perms = buildPermissionSet(user);
  if (perms.has('*')) return true;
  if (Array.isArray(permission)) return permission.some((p) => perms.has(p));
  return perms.has(permission);
}

/**
 * Check if a user belongs to a role (or any role in list).
 */
export function hasRole(user, role) {
  if (!user) return false;
  return Array.isArray(role) ? role.includes(user.role) : user.role === role;
}

/**
 * Provider-type check — only true when role is service_provider.
 */
export function hasProviderType(user, type) {
  return user?.role === 'service_provider' && user.provider_type === type;
}

/**
 * Assert multiple permissions (all required).
 */
export function canAll(user, permissions = []) {
  return permissions.every((p) => can(user, p));
}