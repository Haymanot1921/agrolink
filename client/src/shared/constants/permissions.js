// client/src/shared/constants/permissions.js
// Canonical permission codes — must match DB `permissions.code` column.
// SRS refs: §4.3, §14.2, DB SECTION 1.

export const PERMISSIONS = Object.freeze({
  // Auth / profile
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  PROFILE_READ_SELF: 'profile.read.self',
  PROFILE_UPDATE_SELF: 'profile.update.self',

  // Farmer
  PRODUCT_CREATE: 'product.create',
  PRODUCT_UPDATE_OWN: 'product.update.own',
  PRODUCT_DEACTIVATE_OWN: 'product.deactivate.own',
  PRODUCT_READ_PUBLISHED: 'product.read.published',
  ORDER_RECEIVE_OWN: 'order.receive.own',
  ORDER_ACCEPT_OWN: 'order.accept.own',

  // Buyer
  ORDER_CREATE: 'order.create',
  ORDER_READ_OWN: 'order.read.own',
  ORDER_CANCEL_OWN: 'order.cancel.own',
  CART_MANAGE: 'cart.manage',
  REVIEW_CREATE_OWN: 'review.create.own',
  DISPUTE_CREATE_OWN: 'dispute.create.own',

  // Input Supplier
  INPUT_CREATE: 'input.create',
  INPUT_UPDATE_OWN: 'input.update.own',
  INPUT_READ: 'input.read',
  INVENTORY_MANAGE_OWN: 'inventory.manage.own',

  // Expert
  CONSULTATION_ACCEPT_OWN: 'consultation.accept.own',
  CONSULTATION_RESCHEDULE_OWN: 'consultation.reschedule.own',
  ADVICE_CREATE_OWN: 'advice.create.own',

  // Support Agent
  ASSISTED_FARMER_SEARCH: 'assisted.farmer.search',
  ASSISTED_FARMER_REGISTER: 'assisted.farmer.register',
  ASSISTED_CONSENT_RECORD: 'assisted.consent.record',
  ASSISTED_LISTING_CREATE: 'assisted.listing.create',
  ASSISTED_LISTING_UPDATE: 'assisted.listing.update',
  TICKET_RESPOND_ASSIGNED: 'ticket.respond.assigned',
  TICKET_ESCALATE: 'ticket.escalate',

  // Administrator
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
});

/** Group permissions by module for UI permission matrices. */
export const PERMISSIONS_BY_MODULE = Object.freeze({
  auth: ['auth.login', 'auth.logout'],
  profile: ['profile.read.self', 'profile.update.self'],
  marketplace: ['product.create', 'product.update.own', 'product.deactivate.own', 'product.read.published'],
  orders: ['order.receive.own', 'order.accept.own', 'order.create', 'order.read.own', 'order.cancel.own'],
  cart: ['cart.manage'],
  reviews: ['review.create.own'],
  disputes: ['dispute.create.own'],
  inputs: ['input.create', 'input.update.own', 'input.read'],
  inventory: ['inventory.manage.own'],
  consultation: ['consultation.accept.own', 'consultation.reschedule.own', 'advice.create.own'],
  assisted: [
    'assisted.farmer.search',
    'assisted.farmer.register',
    'assisted.consent.record',
    'assisted.listing.create',
    'assisted.listing.update',
  ],
  tickets: ['ticket.respond.assigned', 'ticket.escalate'],
  admin: [
    'admin.users.manage',
    'admin.roles.assign',
    'admin.verification.review',
    'admin.support_agents.manage',
    'admin.assisted.review',
    'admin.listing.moderate',
    'admin.content.moderate',
    'admin.review.moderate',
    'admin.dispute.resolve',
    'admin.ticket.manage',
    'admin.market_price.manage',
    'admin.article.manage',
    'admin.category.manage',
    'admin.reports.view',
    'admin.audit_logs.view',
    'admin.platform.configure',
  ],
});