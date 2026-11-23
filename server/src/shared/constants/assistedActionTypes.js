// server/src/shared/constants/assistedActionTypes.js
// Every assistable action a support agent may perform on behalf of a farmer
// (SRS §6.8). Each action requires an ACTIVE consent of the matching type.

'use strict';

const ASSISTED_ACTION_TYPES = Object.freeze({
  CREATE_LISTING: 'assisted.listing.create',
  UPDATE_LISTING: 'assisted.listing.update',
  DELETE_LISTING: 'assisted.listing.delete',
  UPDATE_PROFILE: 'assisted.profile.update',
  RESPOND_TO_ORDER: 'assisted.order.respond',
  RESPOND_TO_MESSAGE: 'assisted.message.respond',
  ACCEPT_CONSULTATION: 'assisted.consultation.accept',
  PUBLISH_MARKET_PRICE: 'assisted.market_price.publish',
  UPLOAD_DOCUMENT: 'assisted.document.upload',
  UPDATE_BANK_DETAILS: 'assisted.bank.update',       // high-risk, MFA required
});

const ASSISTED_ACTION_TYPE_LIST = Object.freeze(Object.values(ASSISTED_ACTION_TYPES));

// Each action -> required consent type.
const ACTION_CONSENT_MAP = Object.freeze({
  [ASSISTED_ACTION_TYPES.CREATE_LISTING]: 'listing_management',
  [ASSISTED_ACTION_TYPES.UPDATE_LISTING]: 'listing_management',
  [ASSISTED_ACTION_TYPES.DELETE_LISTING]: 'listing_management',
  [ASSISTED_ACTION_TYPES.UPDATE_PROFILE]: 'profile_management',
  [ASSISTED_ACTION_TYPES.RESPOND_TO_ORDER]: 'order_management',
  [ASSISTED_ACTION_TYPES.RESPOND_TO_MESSAGE]: 'message_handling',
  [ASSISTED_ACTION_TYPES.ACCEPT_CONSULTATION]: 'assisted_management',
  [ASSISTED_ACTION_TYPES.PUBLISH_MARKET_PRICE]: 'market_price_publish',
  [ASSISTED_ACTION_TYPES.UPLOAD_DOCUMENT]: 'assisted_management',
  [ASSISTED_ACTION_TYPES.UPDATE_BANK_DETAILS]: 'assisted_management',
});

// Which actions require step-up MFA (BR-008).
const ACTION_MFA_REQUIRED = Object.freeze([
  ASSISTED_ACTION_TYPES.UPDATE_BANK_DETAILS,
]);

// Risk tiers used by suspicious-activity detection (SRS §6.8 step 6).
const ACTION_RISK_LEVEL = Object.freeze({
  [ASSISTED_ACTION_TYPES.CREATE_LISTING]: 'low',
  [ASSISTED_ACTION_TYPES.UPDATE_LISTING]: 'low',
  [ASSISTED_ACTION_TYPES.DELETE_LISTING]: 'medium',
  [ASSISTED_ACTION_TYPES.UPDATE_PROFILE]: 'low',
  [ASSISTED_ACTION_TYPES.RESPOND_TO_ORDER]: 'low',
  [ASSISTED_ACTION_TYPES.RESPOND_TO_MESSAGE]: 'low',
  [ASSISTED_ACTION_TYPES.ACCEPT_CONSULTATION]: 'low',
  [ASSISTED_ACTION_TYPES.PUBLISH_MARKET_PRICE]: 'high',
  [ASSISTED_ACTION_TYPES.UPLOAD_DOCUMENT]: 'medium',
  [ASSISTED_ACTION_TYPES.UPDATE_BANK_DETAILS]: 'high',
});

// Human-readable labels for the admin review UI (EN/AM keys live in i18n).
const ACTION_LABELS = Object.freeze({
  [ASSISTED_ACTION_TYPES.CREATE_LISTING]: 'Create listing',
  [ASSISTED_ACTION_TYPES.UPDATE_LISTING]: 'Update listing',
  [ASSISTED_ACTION_TYPES.DELETE_LISTING]: 'Delete listing',
  [ASSISTED_ACTION_TYPES.UPDATE_PROFILE]: 'Update farmer profile',
  [ASSISTED_ACTION_TYPES.RESPOND_TO_ORDER]: 'Respond to order',
  [ASSISTED_ACTION_TYPES.RESPOND_TO_MESSAGE]: 'Reply to message',
  [ASSISTED_ACTION_TYPES.ACCEPT_CONSULTATION]: 'Accept consultation',
  [ASSISTED_ACTION_TYPES.PUBLISH_MARKET_PRICE]: 'Publish market price',
  [ASSISTED_ACTION_TYPES.UPLOAD_DOCUMENT]: 'Upload document',
  [ASSISTED_ACTION_TYPES.UPDATE_BANK_DETAILS]: 'Update bank details',
});

function isValidActionType(t) {
  return ASSISTED_ACTION_TYPE_LIST.includes(t);
}

function requiredConsentType(actionType) {
  return ACTION_CONSENT_MAP[actionType] || null;
}

function requiresMfa(actionType) {
  return ACTION_MFA_REQUIRED.includes(actionType);
}

function riskLevel(actionType) {
  return ACTION_RISK_LEVEL[actionType] || 'low';
}

function labelFor(actionType) {
  return ACTION_LABELS[actionType] || actionType;
}

module.exports = {
  ASSISTED_ACTION_TYPES,
  ASSISTED_ACTION_TYPE_LIST,
  ACTION_CONSENT_MAP,
  ACTION_MFA_REQUIRED,
  ACTION_RISK_LEVEL,
  ACTION_LABELS,
  isValidActionType,
  requiredConsentType,
  requiresMfa,
  riskLevel,
  labelFor,
};