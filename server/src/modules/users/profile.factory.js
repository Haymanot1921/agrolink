// server/src/modules/users/profile.factory.js
// Composes the role-specific "profile view" for a user.
// The base user object is the same everywhere; this factory adds the fields
// each role cares about and strips anything that role shouldn't see.
//
// Two entry points:
//   buildSelfProfile(user, deps)      — full view for the owner
//   buildPublicProfile(user, deps)    — redacted view for other users
//
// `deps` injects optional data sources (listings, orders, ratings) so this
// file has zero direct dependencies on other modules — keeps cycles away.

'use strict';

const { ROLES } = require('../../shared/constants/roles');

/**
 * Base shape common to every role.
 */
function baseFields(user) {
  return {
    id: String(user._id || user.id),
    fullName: user.fullName,
    role: user.role,
    roles: user.roles || [user.role],
    language: user.language,
    avatarUrl: user.avatarUrl || null,
    businessName: user.businessName || null,
    bio: user.bio || null,
    createdAt: user.createdAt,
  };
}

/**
 * Self-service profile for the authenticated user.
 * Includes verification + contact details the user already owns.
 *
 * @param {Object} user — plain row mapped by the users repository
 * @param {Object} [deps]
 * @param {Function} [deps.getListingStats]       — (userId) => { total, published, pending }
 * @param {Function} [deps.getOrderStats]         — (userId) => { total, completed }
 * @param {Function} [deps.getConsultationStats]  — (userId) => { total, upcoming }
 * @param {Function} [deps.getReviewSummary]      — (userId) => { averageRating, count }
 * @param {Function} [deps.getConsentSummary]     — (farmerId) => { active, expiring }
 */
async function buildSelfProfile(user, deps = {}) {
  const base = baseFields(user);

  const profile = {
    ...base,
    email: user.email,
    phone: user.phone,
    isEmailVerified: Boolean(user.isEmailVerified),
    isPhoneVerified: Boolean(user.isPhoneVerified),
    status: user.status,
    verificationStatus: user.verificationStatus || 'unverified',
    address: user.address || null,
    notificationPreferences: user.notificationPreferences || null,
    lastLoginAt: user.lastLoginAt || null,
  };

  // Role-specific extensions
  switch (user.role) {
    case ROLES.FARMER:
      profile.primaryCrops = user.primaryCrops || [];
      profile.farmingExperienceYears = user.farmingExperienceYears || null;
      if (deps.getListingStats) {
        profile.listingStats = await safeCall(deps.getListingStats, base.id);
      }
      if (deps.getOrderStats) {
        profile.orderStats = await safeCall(deps.getOrderStats, base.id);
      }
      if (deps.getReviewSummary) {
        profile.reviewSummary = await safeCall(deps.getReviewSummary, base.id);
      }
      if (deps.getConsentSummary) {
        profile.consentSummary = await safeCall(deps.getConsentSummary, base.id);
      }
      break;

    case ROLES.BUYER:
      if (deps.getOrderStats) {
        profile.orderStats = await safeCall(deps.getOrderStats, base.id);
      }
      break;

    case ROLES.EXPERT:
    case ROLES.SERVICE_PROVIDER:
      profile.providerType = user.providerType || null;
      profile.specialties = user.specialties || [];
      profile.yearsOfExperience = user.yearsOfExperience || null;
      if (deps.getConsultationStats) {
        profile.consultationStats = await safeCall(deps.getConsultationStats, base.id);
      }
      if (deps.getReviewSummary) {
        profile.reviewSummary = await safeCall(deps.getReviewSummary, base.id);
      }
      break;

    case ROLES.SUPPORT_AGENT:
      // Support agents get minimal self-view + operational scope
      profile.agentScopes = user.agentScopes || [];
      break;

    case ROLES.ADMIN:
    case ROLES.SUPER_ADMIN:
      // Admin self-view exposes permissions for UI gating
      profile.permissions = user.permissions || [];
      break;

    default:
      break;
  }

  return profile;
}

/**
 * Public profile for other users to view.
 * Never exposes email, phone (unless user has made them public),
 * verification internals, or login metadata.
 *
 * @param {Object} user
 * @param {Object} [deps] — same optional data fetchers as above
 */
async function buildPublicProfile(user, deps = {}) {
  const base = baseFields(user);

  const profile = {
    ...base,
    verificationStatus: user.verificationStatus || 'unverified',
    // Location is public — buyers need to know where produce comes from
    address: user.address
      ? {
          region: user.address.region,
          zone: user.address.zone,
          woreda: user.address.woreda,
          city: user.address.city,
          // exact line1/kebele omitted for privacy
        }
      : null,
  };

  switch (user.role) {
    case ROLES.FARMER:
      profile.primaryCrops = user.primaryCrops || [];
      if (deps.getListingStats) {
        profile.listingStats = await safeCall(deps.getListingStats, base.id);
      }
      if (deps.getReviewSummary) {
        profile.reviewSummary = await safeCall(deps.getReviewSummary, base.id);
      }
      break;

    case ROLES.EXPERT:
    case ROLES.SERVICE_PROVIDER:
      profile.providerType = user.providerType || null;
      profile.specialties = user.specialties || [];
      profile.yearsOfExperience = user.yearsOfExperience || null;
      if (deps.getReviewSummary) {
        profile.reviewSummary = await safeCall(deps.getReviewSummary, base.id);
      }
      break;

    default:
      // Buyers and internal roles have minimal public profiles.
      break;
  }

  return profile;
}

/**
 * Defer to a caller-supplied async function. Swallow errors so a single
 * missing downstream service cannot break profile rendering.
 */
async function safeCall(fn, ...args) {
  try {
    return (await fn(...args)) || null;
  } catch {
    return null;
  }
}

module.exports = { buildSelfProfile, buildPublicProfile };