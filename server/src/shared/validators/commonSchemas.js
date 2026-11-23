// server/src/shared/validators/commonSchemas.js
// Reusable Joi primitives. Modules compose these into their own validators.
// Every primitive matches the platform's canonical rules:
//   - MySQL auto-increment IDs
//   - Ethiopia phone (+251 / 0-prefix)
//   - ETB amounts in integer minor units (santim)
//   - ISO dates / date ranges
//   - EN/AM bilingual strings
//   - Enum-per-constant imports

'use strict';

const Joi = require('joi');
const {
  ROLE_LIST,
} = require('../constants/roles');
const {
  ACCOUNT_STATUS_LIST,
  VERIFICATION_STATUS_LIST,
} = require('../constants/accountStatuses');
const {
  ORDER_STATUS_LIST,
} = require('../constants/orderStatuses');
const {
  PAYMENT_STATUS_LIST,
  PAYMENT_METHOD_LIST,
} = require('../constants/paymentStatuses');
const {
  TICKET_STATUS_LIST,
} = require('../constants/ticketStatuses');
const {
  TICKET_PRIORITY_LIST,
} = require('../constants/ticketPriorities');
const {
  CONSULTATION_STATUS_LIST,
} = require('../constants/consultationStatuses');
const {
  DISPUTE_STATUS_LIST,
} = require('../constants/disputeStatuses');
const {
  MODERATION_STATUS_LIST,
} = require('../constants/moderationStatuses');
const {
  LISTING_STATUS_LIST,
} = require('../constants/listingStatuses');
const {
  CROP_TYPE_LIST,
} = require('../constants/cropTypes');
const {
  INPUT_TYPE_LIST,
} = require('../constants/inputTypes');
const {
  PROVIDER_TYPE_LIST,
} = require('../constants/providerTypes');
const {
  CONSENT_STATUS_LIST,
  CONSENT_TYPE_LIST,
} = require('../constants/consentStatuses');
const {
  ASSISTED_ACTION_TYPE_LIST,
} = require('../constants/assistedActionTypes');
const {
  NOTIFICATION_TYPE_LIST,
  NOTIFICATION_CHANNEL_LIST,
} = require('../constants/notificationTypes');
const {
  AUDIT_EVENT_TYPE_LIST,
} = require('../constants/auditEventTypes');
const {
  VERIFICATION_DOCUMENT_TYPE_LIST,
  VERIFICATION_REJECTION_REASON_LIST,
} = require('../constants/verificationStatuses');

// --- Primitive schemas ------------------------------------------------------

// MySQL BIGINT UNSIGNED ID serialized as a decimal string.
const objectId = Joi.string()
  .pattern(/^[1-9]\d{0,19}$/)
  .message('Must be a valid MySQL ID');

// Simple alphanumeric slug (for categories, article slugs)
const slug = Joi.string()
  .min(2)
  .max(80)
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .message('Must be a lowercase slug');

// Email — normalized to lowercase
const email = Joi.string()
  .email({ tlds: { allow: false } })
  .max(254)
  .lowercase()
  .trim();

// Password — minimum configured in env.security.passwordMinLength
const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[a-z]/)
  .pattern(/[A-Z]/)
  .pattern(/[0-9]/)
  .message(
    'Password must include at least one uppercase, one lowercase, and one digit',
  );

// Ethiopian phone: +2519XXXXXXXX, +2517XXXXXXXX, or 0-prefix
const phone = Joi.string()
  .pattern(/^(\+251|0)(9|7)\d{8}$/)
  .message('Must be a valid Ethiopian phone (+2519... or 09...)');

// Human name — permits Latin + Amharic letters, spaces, apostrophes, hyphens.
// Uses Unicode property escapes so Amharic (Geʽez script) is accepted.
const humanName = Joi.string()
  .min(2)
  .max(120)
  .pattern(/^[\p{L}\p{M}'\-\s.]+$/u)
  .message('Must contain only letters, spaces, apostrophes, hyphens, or periods');

// Language code — restricted to supported set from env.
const language = Joi.string().valid('en', 'am').default('en');

// Bilingual text — either a plain string or { en, am } object.
// Consumer modules can prefer one shape; both accepted for flexibility.
const bilingualText = Joi.alternatives().try(
  Joi.string().min(1).max(5000),
  Joi.object({
    en: Joi.string().min(1).max(5000).required(),
    am: Joi.string().min(1).max(5000),
  }),
);

// ISO date string
const isoDate = Joi.date().iso();

// Date range — from/to with from <= to
const dateRange = Joi.object({
  from: isoDate.required(),
  to: isoDate
    .required()
    .custom((value, helpers) => {
      const { from } = helpers.state.ancestors[0] || {};
      if (from && new Date(value) < new Date(from)) {
        return helpers.error('any.invalid', { message: '`to` must be after `from`' });
      }
      return value;
    }),
});

// ETB amount in minor units (santim). Integer, non-negative, bounded.
const amountMinor = Joi.number()
  .integer()
  .min(0)
  .max(1_000_000_000_00) // 1 billion ETB ceiling
  .message('Amount must be a non-negative integer (minor units)');

// Percent (0..100)
const percent = Joi.number().min(0).max(100);

// URL (Cloudinary URLs, external links)
const url = Joi.string().uri({ allowRelative: false }).max(2048);

// Timezone-safe timestamp
const timestamp = Joi.date().iso();

// Boolean query-string coercion ("true"/"1" -> true)
const booleanQuery = Joi.boolean().truthy('true', '1', 'yes').falsy('false', '0', 'no');

// Geo point
const geoPoint = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

// Short reason text (used for suspensions, rejections, etc.)
const reasonText = Joi.string().min(3).max(500);

// Long-form text
const longText = Joi.string().min(1).max(20000);

// --- Enum wrappers ----------------------------------------------------------

const roleEnum = Joi.string().valid(...ROLE_LIST);
const accountStatusEnum = Joi.string().valid(...ACCOUNT_STATUS_LIST);
const verificationStatusEnum = Joi.string().valid(...VERIFICATION_STATUS_LIST);
const verificationDocumentTypeEnum = Joi.string().valid(...VERIFICATION_DOCUMENT_TYPE_LIST);
const verificationRejectionReasonEnum = Joi.string().valid(...VERIFICATION_REJECTION_REASON_LIST);
const orderStatusEnum = Joi.string().valid(...ORDER_STATUS_LIST);
const paymentStatusEnum = Joi.string().valid(...PAYMENT_STATUS_LIST);
const paymentMethodEnum = Joi.string().valid(...PAYMENT_METHOD_LIST);
const ticketStatusEnum = Joi.string().valid(...TICKET_STATUS_LIST);
const ticketPriorityEnum = Joi.string().valid(...TICKET_PRIORITY_LIST);
const consultationStatusEnum = Joi.string().valid(...CONSULTATION_STATUS_LIST);
const disputeStatusEnum = Joi.string().valid(...DISPUTE_STATUS_LIST);
const moderationStatusEnum = Joi.string().valid(...MODERATION_STATUS_LIST);
const listingStatusEnum = Joi.string().valid(...LISTING_STATUS_LIST);
const cropTypeEnum = Joi.string().valid(...CROP_TYPE_LIST);
const inputTypeEnum = Joi.string().valid(...INPUT_TYPE_LIST);
const providerTypeEnum = Joi.string().valid(...PROVIDER_TYPE_LIST);
const consentStatusEnum = Joi.string().valid(...CONSENT_STATUS_LIST);
const consentTypeEnum = Joi.string().valid(...CONSENT_TYPE_LIST);
const assistedActionTypeEnum = Joi.string().valid(...ASSISTED_ACTION_TYPE_LIST);
const notificationTypeEnum = Joi.string().valid(...NOTIFICATION_TYPE_LIST);
const notificationChannelEnum = Joi.string().valid(...NOTIFICATION_CHANNEL_LIST);
const auditEventTypeEnum = Joi.string().valid(...AUDIT_EVENT_TYPE_LIST);

// Multi-enum — array of one of the above, deduped
const multiEnum = (enumSchema) =>
  Joi.array().items(enumSchema).unique().min(1).max(50);

// --- Composite schemas ------------------------------------------------------

// MySQL ID path param (req.params.id)
const objectIdParam = Joi.object({
  id: objectId.required(),
});

// Contact block used by many profile forms
const contactBlock = Joi.object({
  email: email.required(),
  phone: phone.required(),
  alternatePhone: phone.optional(),
  language: language.optional(),
});

// Address block (delivery / farmer location)
const addressBlock = Joi.object({
  region: Joi.string().min(2).max(80).required(),
  zone: Joi.string().min(2).max(80).optional(),
  woreda: Joi.string().min(2).max(80).optional(),
  kebele: Joi.string().max(80).optional(),
  city: Joi.string().max(80).optional(),
  line1: Joi.string().min(3).max(200).required(),
  line2: Joi.string().max(200).optional(),
  postalCode: Joi.string().max(20).optional(),
  geo: geoPoint.optional(),
}).unknown(false);

// Monetary line item (order/refund payloads)
const lineItem = Joi.object({
  listingId: objectId.required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().min(1).max(20).required(),
  unitPriceMinor: amountMinor.required(),
  lineTotalMinor: amountMinor.required(),
  notes: Joi.string().max(500).optional(),
});

// Admin review note (used in assisted review, dispute resolution, moderation)
const adminReviewNote = Joi.object({
  decision: Joi.string().valid('approve', 'reject', 'request_info', 'flag', 'resolve').required(),
  reason: reasonText.required(),
  internalNotes: Joi.string().max(2000).optional(),
});

// Attachment reference (already-uploaded Cloudinary asset)
const attachment = Joi.object({
  url: url.required(),
  publicId: Joi.string().max(200).optional(),
  fileName: Joi.string().max(200).optional(),
  mimeType: Joi.string().max(120).optional(),
  size: Joi.number().integer().min(0).optional(),
});

// Common ID filter (single or array)
const idOrIds = Joi.alternatives().try(
  objectId,
  Joi.array().items(objectId).min(1).max(200).unique(),
);

module.exports = {
  // primitives
  objectId,
  slug,
  email,
  password,
  phone,
  humanName,
  language,
  bilingualText,
  isoDate,
  dateRange,
  amountMinor,
  percent,
  url,
  timestamp,
  booleanQuery,
  geoPoint,
  reasonText,
  longText,

  // enums
  roleEnum,
  accountStatusEnum,
  verificationStatusEnum,
  verificationDocumentTypeEnum,
  verificationRejectionReasonEnum,
  orderStatusEnum,
  paymentStatusEnum,
  paymentMethodEnum,
  ticketStatusEnum,
  ticketPriorityEnum,
  consultationStatusEnum,
  disputeStatusEnum,
  moderationStatusEnum,
  listingStatusEnum,
  cropTypeEnum,
  inputTypeEnum,
  providerTypeEnum,
  consentStatusEnum,
  consentTypeEnum,
  assistedActionTypeEnum,
  notificationTypeEnum,
  notificationChannelEnum,
  auditEventTypeEnum,
  multiEnum,

  // composites
  objectIdParam,
  contactBlock,
  addressBlock,
  lineItem,
  adminReviewNote,
  attachment,
  idOrIds,
};