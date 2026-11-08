// mobile/src/shared/constants/permissions.ts
// Permission codes mirror the backend's permission catalog (SRS §4.3, §14.2).
// ⚠️ Backend enforces authorization. These constants power UX checks only.

import type { Role } from './roles';

export const PERMISSIONS = {
  // Auth
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  // Profile
  PROFILE_READ_SELF: 'profile.read.self',
  PROFILE_UPDATE_SELF: 'profile.update.self',
  // Farmer products
  PRODUCT_CREATE: 'product.create',
  PRODUCT_UPDATE_OWN: 'product.update.own',
  PRODUCT_DEACTIVATE_OWN: 'product.deactivate.own',
  PRODUCT_READ_PUBLISHED: 'product.read.published',
  // Farmer orders (receiving)
  ORDER_RECEIVE_OWN: 'order.receive.own',
  ORDER_ACCEPT_OWN: 'order.accept.own',
  // Buyer orders (placing)
  ORDER_CREATE: 'order.create',
  ORDER_READ_OWN: 'order.read.own',
  ORDER_CANCEL_OWN: 'order.cancel.own',
  // Cart
  CART_MANAGE: 'cart.manage',
  // Reviews / disputes
  REVIEW_CREATE_OWN: 'review.create.own',
  DISPUTE_CREATE_OWN: 'dispute.create.own',
  // Inputs
  INPUT_CREATE: 'input.create',
  INPUT_UPDATE_OWN: 'input.update.own',
  INPUT_READ: 'input.read',
  INVENTORY_MANAGE_OWN: 'inventory.manage.own',
  // Consultations
  CONSULTATION_ACCEPT_OWN: 'consultation.accept.own',
  CONSULTATION_RESCHEDULE_OWN: 'consultation.reschedule.own',
  ADVICE_CREATE_OWN: 'advice.create.own',
  // Assisted farmer (Support Agent)
  ASSISTED_FARMER_SEARCH: 'assisted.farmer.search',
  ASSISTED_FARMER_REGISTER: 'assisted.farmer.register',
  ASSISTED_CONSENT_RECORD: 'assisted.consent.record',
  ASSISTED_LISTING_CREATE: 'assisted.listing.create',
  ASSISTED_LISTING_UPDATE: 'assisted.listing.update',
  // Tickets
  TICKET_RESPOND_ASSIGNED: 'ticket.respond.assigned',
  TICKET_ESCALATE: 'ticket.escalate',
  // Admin
  ADMIN_USERS_MANAGE: 'admin.users.manage',
  ADMIN_ROLES_ASSIGN: 'admin.roles.assign',
  ADMIN_VERIFICATION_REVIEW: 'admin.verification.review',
  ADMIN_SUPPORT_AGENTS_MANAGE: 'admin.support_agents.manage',
  ADMIN_ASSISTED_REVIEW: 'admin.assisted.review',
  ADMIN_LISTING_MODERATE: 'admin.listing.moderate',
  ADMIN_CONTENT_MODERATE: 'admin.content.moderate',
  ADMIN_REVIEW_MODERATE: 'admin.review.moderate',
  ADMIN_DISPUTE_RESOLVE: 'admin.dispute.resolve',
  ADMIN_TICKET_MANAGE: 'admin.ticket.manage',
  ADMIN_MARKET_PRICE_MANAGE: 'admin.market_price.manage',
  ADMIN_ARTICLE_MANAGE: 'admin.article.manage',
  ADMIN_CATEGORY_MANAGE: 'admin.category.manage',
  ADMIN_REPORTS_VIEW: 'admin.reports.view',
  ADMIN_AUDIT_LOGS_VIEW: 'admin.audit_logs.view',
  ADMIN_PLATFORM_CONFIGURE: 'admin.platform.configure',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Static role → permission map — fallback for UI checks before the
 * `/auth/me` endpoint returns the user's actual permissions.
 * Must stay aligned with backend `role_permissions` table.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  farmer: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_LOGOUT,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE_OWN,
    PERMISSIONS.PRODUCT_DEACTIVATE_OWN,
    PERMISSIONS.PRODUCT_READ_PUBLISHED,
    PERMISSIONS.ORDER_RECEIVE_OWN,
    PERMISSIONS.ORDER_ACCEPT_OWN,
    PERMISSIONS.CART_MANAGE,
    PERMISSIONS.REVIEW_CREATE_OWN,
    PERMISSIONS.DISPUTE_CREATE_OWN,
  ],
  buyer: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_LOGOUT,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.PRODUCT_READ_PUBLISHED,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_READ_OWN,
    PERMISSIONS.ORDER_CANCEL_OWN,
    PERMISSIONS.CART_MANAGE,
    PERMISSIONS.REVIEW_CREATE_OWN,
    PERMISSIONS.DISPUTE_CREATE_OWN,
  ],
  service_provider: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_LOGOUT,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.INPUT_CREATE,
    PERMISSIONS.INPUT_UPDATE_OWN,
    PERMISSIONS.INPUT_READ,
    PERMISSIONS.INVENTORY_MANAGE_OWN,
    PERMISSIONS.CONSULTATION_ACCEPT_OWN,
    PERMISSIONS.CONSULTATION_RESCHEDULE_OWN,
    PERMISSIONS.ADVICE_CREATE_OWN,
  ],
  support_agent: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_LOGOUT,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.ASSISTED_FARMER_SEARCH,
    PERMISSIONS.ASSISTED_FARMER_REGISTER,
    PERMISSIONS.ASSISTED_CONSENT_RECORD,
    PERMISSIONS.ASSISTED_LISTING_CREATE,
    PERMISSIONS.ASSISTED_LISTING_UPDATE,
    PERMISSIONS.TICKET_RESPOND_ASSIGNED,
    PERMISSIONS.TICKET_ESCALATE,
  ],
  administrator: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.AUTH_LOGOUT,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.ADMIN_USERS_MANAGE,
    PERMISSIONS.ADMIN_ROLES_ASSIGN,
    PERMISSIONS.ADMIN_VERIFICATION_REVIEW,
    PERMISSIONS.ADMIN_SUPPORT_AGENTS_MANAGE,
    PERMISSIONS.ADMIN_ASSISTED_REVIEW,
    PERMISSIONS.ADMIN_LISTING_MODERATE,
    PERMISSIONS.ADMIN_CONTENT_MODERATE,
    PERMISSIONS.ADMIN_REVIEW_MODERATE,
    PERMISSIONS.ADMIN_DISPUTE_RESOLVE,
    PERMISSIONS.ADMIN_TICKET_MANAGE,
    PERMISSIONS.ADMIN_MARKET_PRICE_MANAGE,
    PERMISSIONS.ADMIN_ARTICLE_MANAGE,
    PERMISSIONS.ADMIN_CATEGORY_MANAGE,
    PERMISSIONS.ADMIN_REPORTS_VIEW,
    PERMISSIONS.ADMIN_AUDIT_LOGS_VIEW,
    PERMISSIONS.ADMIN_PLATFORM_CONFIGURE,
  ],
};