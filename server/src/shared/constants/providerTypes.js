// server/src/shared/constants/providerTypes.js
// Service-provider specialties + assisted-agent permission scopes.
// Used by service-provider module, expert directory, support-agent scope,
// and marketplace filters.

'use strict';

const PROVIDER_TYPES = Object.freeze({
  INPUT_SUPPLIER: 'input_supplier',            // seeds, fertilizer, pesticide
  EQUIPMENT_SUPPLIER: 'equipment_supplier',    // tools, machinery
  AGRONOMY_EXPERT: 'agronomy_expert',          // crop advisory
  VETERINARY_EXPERT: 'veterinary_expert',      // livestock advisory
  SOIL_SPECIALIST: 'soil_specialist',
  IRRIGATION_SPECIALIST: 'irrigation_specialist',
  LOGISTICS_AGGREGATOR: 'logistics_aggregator', // marketplace-only (no tracking)
});

const PROVIDER_TYPE_LIST = Object.freeze(Object.values(PROVIDER_TYPES));

// Sub-category used for input listings (SRS §5.4).
const INPUT_CATEGORIES = Object.freeze({
  SEEDS: 'seeds',
  FERTILIZER: 'fertilizer',
  PESTICIDE: 'pesticide',
  HERBICIDE: 'herbicide',
  FEED: 'feed',
  VETERINARY_MEDICINE: 'veterinary_medicine',
  TOOLS: 'tools',
  MACHINERY: 'machinery',
  IRRIGATION: 'irrigation',
  OTHER: 'other',
});

const INPUT_CATEGORY_LIST = Object.freeze(Object.values(INPUT_CATEGORIES));

// Scope permissions for support agents acting on behalf of farmers (SRS §6.8).
// These restrict which assisted actions an agent can perform.
const SUPPORT_AGENT_SCOPES = Object.freeze({
  CREATE_LISTING: 'assisted.listing.create',
  UPDATE_LISTING: 'assisted.listing.update',
  DELETE_LISTING: 'assisted.listing.delete',
  RESPOND_TO_ORDER: 'assisted.order.respond',
  RESPOND_TO_MESSAGE: 'assisted.message.respond',
  UPDATE_PROFILE: 'assisted.profile.update',
  PUBLISH_MARKET_PRICE: 'assisted.market_price.publish', // rarely granted
});

const SUPPORT_AGENT_SCOPE_LIST = Object.freeze(Object.values(SUPPORT_AGENT_SCOPES));

// A conservative default when an admin creates a new agent.
const DEFAULT_SUPPORT_AGENT_SCOPES = Object.freeze([
  SUPPORT_AGENT_SCOPES.CREATE_LISTING,
  SUPPORT_AGENT_SCOPES.UPDATE_LISTING,
  SUPPORT_AGENT_SCOPES.RESPOND_TO_ORDER,
  SUPPORT_AGENT_SCOPES.RESPOND_TO_MESSAGE,
  SUPPORT_AGENT_SCOPES.UPDATE_PROFILE,
]);

function isValidProviderType(t) {
  return PROVIDER_TYPE_LIST.includes(t);
}

function isValidInputCategory(c) {
  return INPUT_CATEGORY_LIST.includes(c);
}

function isValidAgentScope(s) {
  return SUPPORT_AGENT_SCOPE_LIST.includes(s);
}

function validateScopes(scopes = []) {
  const invalid = scopes.filter((s) => !isValidAgentScope(s));
  if (invalid.length) {
    const err = new Error(`Invalid support-agent scopes: ${invalid.join(', ')}`);
    err.statusCode = 400;
    err.code = 'INVALID_AGENT_SCOPE';
    throw err;
  }
  return scopes;
}

module.exports = {
  PROVIDER_TYPES,
  PROVIDER_TYPE_LIST,
  INPUT_CATEGORIES,
  INPUT_CATEGORY_LIST,
  SUPPORT_AGENT_SCOPES,
  SUPPORT_AGENT_SCOPE_LIST,
  DEFAULT_SUPPORT_AGENT_SCOPES,
  isValidProviderType,
  isValidInputCategory,
  isValidAgentScope,
  validateScopes,
};