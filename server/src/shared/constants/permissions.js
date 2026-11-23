// server/src/shared/constants/permissions.js
// Fine-grained RBAC codes (FR-ADMIN-002, SRS §14.2 BR-008).
// Format: <module>.<resource>.<verb>
// These are seeded into permission.model.js at boot and referenced by
// authorizePermission() across the administrator module.

'use strict';

const PERMISSIONS = Object.freeze({
  // Superpermission — grants all (super_admin only)
  ADMIN_ALL: 'admin',

  // --- Access control ----------------------------------------------------
  ACCESS_READ: 'access_control.role.read',
  ACCESS_CREATE: 'access_control.role.create',
  ACCESS_UPDATE: 'access_control.role.update',
  ACCESS_DELETE: 'access_control.role.delete',
  ACCESS_ASSIGN: 'access_control.role.assign',
  ACCESS_PERMISSION_READ: 'access_control.permission.read',
  ACCESS_PERMISSION_UPDATE: 'access_control.permission.update',

  // --- User management ---------------------------------------------------
  USERS_READ: 'user.read',
  USERS_CREATE: 'user.create',
  USERS_UPDATE: 'user.update',
  USERS_SUSPEND: 'user.suspend',
  USERS_REACTIVATE: 'user.reactivate',
  USERS_DELETE: 'user.delete',
  USERS_ROLE_CHANGE: 'user.role.change',
  USERS_ACTIVITY_READ: 'user.activity.read',

  // --- Farmer management -------------------------------------------------
  FARMERS_READ: 'farmer.read',
  FARMERS_UPDATE: 'farmer.update',
  FARMERS_LISTINGS_READ: 'farmer.listings.read',

  // --- Support agent management -----------------------------------------
  SUPPORT_AGENTS_READ: 'support_agent.read',
  SUPPORT_AGENTS_CREATE: 'support_agent.create',
  SUPPORT_AGENTS_UPDATE: 'support_agent.update',
  SUPPORT_AGENTS_SUSPEND: 'support_agent.suspend',
  SUPPORT_AGENTS_SCOPE_UPDATE: 'support_agent.scope.update',

  // --- Assisted farmer monitoring (SRS §6.8) ----------------------------
  ASSISTED_READ: 'assisted.read',
  ASSISTED_REVIEW: 'assisted.review',
  ASSISTED_CONSENT_READ: 'assisted.consent.read',
  ASSISTED_REPORTS_READ: 'assisted.reports.read',
  ASSISTED_ACTION_FLAG: 'assisted.action.flag',

  // --- Identity verification --------------------------------------------
  VERIFICATION_READ: 'verification.read',
  VERIFICATION_APPROVE: 'verification.approve',
  VERIFICATION_REJECT: 'verification.reject',
  VERIFICATION_REQUEST_INFO: 'verification.request_info',

  // --- Listing moderation -----------------------------------------------
  LISTINGS_READ: 'listing.read',
  LISTINGS_APPROVE: 'listing.approve',
  LISTINGS_REJECT: 'listing.reject',
  LISTINGS_REQUEST_CHANGES: 'listing.request_changes',
  LISTINGS_REMOVE: 'listing.remove',
  LISTINGS_REPORTS_READ: 'listing.report.read',

  // --- Content moderation -----------------------------------------------
  CONTENT_READ: 'content.read',
  CONTENT_REMOVE: 'content.remove',
  CONTENT_REPORTS_READ: 'content.report.read',

  // --- Review moderation (FR-REVIEW-004) --------------------------------
  REVIEWS_READ: 'review.read',
  REVIEWS_REMOVE: 'review.remove',
  REVIEWS_REPORTS_READ: 'review.report.read',

  // --- Disputes (FR-DISPUTE-004..006) -----------------------------------
  DISPUTES_READ: 'dispute.read',
  DISPUTES_ASSIGN: 'dispute.assign',
  DISPUTES_REQUEST_EVIDENCE: 'dispute.request_evidence',
  DISPUTES_RESOLVE: 'dispute.resolve',
  DISPUTES_REFUND: 'dispute.refund',
  DISPUTES_ESCALATE: 'dispute.escalate',

  // --- Support ticket oversight -----------------------------------------
  TICKETS_READ: 'ticket.read',
  TICKETS_ASSIGN: 'ticket.assign',
  TICKETS_REASSIGN: 'ticket.reassign',
  TICKETS_CLOSE: 'ticket.close',

  // --- Order oversight (read-only) --------------------------------------
  ORDERS_READ: 'order.read',

  // --- Consultation oversight (read-only) -------------------------------
  CONSULTATIONS_READ: 'consultation.read',

  // --- Market info management -------------------------------------------
  MARKET_INFO_READ: 'market_info.read',
  MARKET_INFO_CREATE: 'market_info.create',
  MARKET_INFO_UPDATE: 'market_info.update',
  MARKET_INFO_DEACTIVATE: 'market_info.deactivate',
  MARKET_INFO_SOURCE_MANAGE: 'market_info.source.manage',

  // --- Educational articles ---------------------------------------------
  ARTICLES_READ: 'article.read',
  ARTICLES_CREATE: 'article.create',
  ARTICLES_UPDATE: 'article.update',
  ARTICLES_PUBLISH: 'article.publish',
  ARTICLES_DEACTIVATE: 'article.deactivate',
  ARTICLE_CATEGORY_MANAGE: 'article.category.manage',

  // --- Category management ----------------------------------------------
  CATEGORIES_READ: 'category.read',
  CATEGORIES_CREATE: 'category.create',
  CATEGORIES_UPDATE: 'category.update',
  CATEGORIES_DEACTIVATE: 'category.deactivate',

  // --- Reports & analytics ----------------------------------------------
  REPORTS_READ: 'report.read',
  REPORTS_EXPORT: 'report.export',
  REPORTS_BUILDER: 'report.builder',

  // --- Audit logs (BR-009, FR-ADMIN-014/015) ----------------------------
  AUDIT_READ: 'audit.read',
  AUDIT_EXPORT: 'audit.export',
  SECURITY_EVENTS_READ: 'audit.security.read',

  // --- Platform configuration -------------------------------------------
  CONFIG_READ: 'config.read',
  CONFIG_UPDATE: 'config.update',
  CONFIG_MAINTENANCE: 'config.maintenance',
  CONFIG_NOTIFICATIONS: 'config.notifications',

  // --- System health -----------------------------------------------------
  HEALTH_READ: 'system.health.read',
  JOBS_READ: 'system.jobs.read',
  JOBS_RETRY: 'system.jobs.retry',

  // --- Administrator's own notifications/profile ------------------------
  ADMIN_NOTIFICATIONS_READ: 'admin.notifications.read',
  ADMIN_NOTIFICATIONS_UPDATE: 'admin.notifications.update',
  ADMIN_PROFILE_READ: 'admin.profile.read',
  ADMIN_PROFILE_UPDATE: 'admin.profile.update',
});

const PERMISSION_LIST = Object.freeze(Object.values(PERMISSIONS));

// Default permission bundles per role. Seeder applies these at boot for
// roles that haven't been customized by a super_admin.
const DEFAULT_ROLE_PERMISSIONS = Object.freeze({
  super_admin: [PERMISSIONS.ADMIN_ALL],

  admin: [
    // Read everything admin-scope
    PERMISSIONS.ACCESS_READ,
    PERMISSIONS.ACCESS_PERMISSION_READ,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_SUSPEND,
    PERMISSIONS.USERS_REACTIVATE,
    PERMISSIONS.USERS_ROLE_CHANGE,
    PERMISSIONS.USERS_ACTIVITY_READ,
    PERMISSIONS.FARMERS_READ,
    PERMISSIONS.FARMERS_UPDATE,
    PERMISSIONS.FARMERS_LISTINGS_READ,
    PERMISSIONS.SUPPORT_AGENTS_READ,
    PERMISSIONS.SUPPORT_AGENTS_CREATE,
    PERMISSIONS.SUPPORT_AGENTS_UPDATE,
    PERMISSIONS.SUPPORT_AGENTS_SUSPEND,
    PERMISSIONS.SUPPORT_AGENTS_SCOPE_UPDATE,
    PERMISSIONS.ASSISTED_READ,
    PERMISSIONS.ASSISTED_REVIEW,
    PERMISSIONS.ASSISTED_CONSENT_READ,
    PERMISSIONS.ASSISTED_REPORTS_READ,
    PERMISSIONS.ASSISTED_ACTION_FLAG,
    PERMISSIONS.VERIFICATION_READ,
    PERMISSIONS.VERIFICATION_APPROVE,
    PERMISSIONS.VERIFICATION_REJECT,
    PERMISSIONS.VERIFICATION_REQUEST_INFO,
    PERMISSIONS.LISTINGS_READ,
    PERMISSIONS.LISTINGS_APPROVE,
    PERMISSIONS.LISTINGS_REJECT,
    PERMISSIONS.LISTINGS_REQUEST_CHANGES,
    PERMISSIONS.LISTINGS_REMOVE,
    PERMISSIONS.LISTINGS_REPORTS_READ,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_REMOVE,
    PERMISSIONS.CONTENT_REPORTS_READ,
    PERMISSIONS.REVIEWS_READ,
    PERMISSIONS.REVIEWS_REMOVE,
    PERMISSIONS.REVIEWS_REPORTS_READ,
    PERMISSIONS.DISPUTES_READ,
    PERMISSIONS.DISPUTES_ASSIGN,
    PERMISSIONS.DISPUTES_REQUEST_EVIDENCE,
    PERMISSIONS.DISPUTES_RESOLVE,
    PERMISSIONS.DISPUTES_REFUND,
    PERMISSIONS.DISPUTES_ESCALATE,
    PERMISSIONS.TICKETS_READ,
    PERMISSIONS.TICKETS_ASSIGN,
    PERMISSIONS.TICKETS_REASSIGN,
    PERMISSIONS.TICKETS_CLOSE,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.CONSULTATIONS_READ,
    PERMISSIONS.MARKET_INFO_READ,
    PERMISSIONS.MARKET_INFO_CREATE,
    PERMISSIONS.MARKET_INFO_UPDATE,
    PERMISSIONS.MARKET_INFO_DEACTIVATE,
    PERMISSIONS.MARKET_INFO_SOURCE_MANAGE,
    PERMISSIONS.ARTICLES_READ,
    PERMISSIONS.ARTICLES_CREATE,
    PERMISSIONS.ARTICLES_UPDATE,
    PERMISSIONS.ARTICLES_PUBLISH,
    PERMISSIONS.ARTICLES_DEACTIVATE,
    PERMISSIONS.ARTICLE_CATEGORY_MANAGE,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.CATEGORIES_CREATE,
    PERMISSIONS.CATEGORIES_UPDATE,
    PERMISSIONS.CATEGORIES_DEACTIVATE,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.REPORTS_BUILDER,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.SECURITY_EVENTS_READ,
    PERMISSIONS.CONFIG_READ,
    PERMISSIONS.CONFIG_UPDATE,
    PERMISSIONS.CONFIG_MAINTENANCE,
    PERMISSIONS.CONFIG_NOTIFICATIONS,
    PERMISSIONS.HEALTH_READ,
    PERMISSIONS.JOBS_READ,
    PERMISSIONS.JOBS_RETRY,
    PERMISSIONS.ADMIN_NOTIFICATIONS_READ,
    PERMISSIONS.ADMIN_NOTIFICATIONS_UPDATE,
    PERMISSIONS.ADMIN_PROFILE_READ,
    PERMISSIONS.ADMIN_PROFILE_UPDATE,
  ],

  support_agent: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.FARMERS_READ,
    PERMISSIONS.ASSISTED_READ,
    PERMISSIONS.ASSISTED_CONSENT_READ,
    PERMISSIONS.TICKETS_READ,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.CONSULTATIONS_READ,
    PERMISSIONS.ADMIN_NOTIFICATIONS_READ,
    PERMISSIONS.ADMIN_PROFILE_READ,
    PERMISSIONS.ADMIN_PROFILE_UPDATE,
  ],
});

function isValidPermission(perm) {
  return PERMISSION_LIST.includes(perm);
}

function assertValidPermission(perm) {
  if (!isValidPermission(perm)) {
    const err = new Error(`Invalid permission: ${perm}`);
    err.statusCode = 400;
    err.code = 'INVALID_PERMISSION';
    throw err;
  }
  return perm;
}

function getDefaultPermissionsForRole(role) {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
}

module.exports = {
  PERMISSIONS,
  PERMISSION_LIST,
  DEFAULT_ROLE_PERMISSIONS,
  isValidPermission,
  assertValidPermission,
  getDefaultPermissionsForRole,
};