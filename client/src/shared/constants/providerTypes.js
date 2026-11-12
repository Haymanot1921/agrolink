// client/src/shared/constants/providerTypes.js
// Service Provider subtype constants — enforces BR-026/BR-029.
// SRS refs: §4.1.3, BR-026..029.

export const PROVIDER_TYPES = Object.freeze({
  INPUT_SUPPLIER: 'input_supplier',
  AGRICULTURAL_EXPERT: 'agricultural_expert',
});

export const PROVIDER_TYPE_LIST = Object.freeze([
  PROVIDER_TYPES.INPUT_SUPPLIER,
  PROVIDER_TYPES.AGRICULTURAL_EXPERT,
]);

export const PROVIDER_TYPE_LABELS = Object.freeze({
  [PROVIDER_TYPES.INPUT_SUPPLIER]: { en: 'Input Supplier', am: 'የግብዓት አቅራቢ' },
  [PROVIDER_TYPES.AGRICULTURAL_EXPERT]: { en: 'Agricultural Expert', am: 'የግብርና ባለሙያ' },
});

export const PROVIDER_TYPE_HOME = Object.freeze({
  [PROVIDER_TYPES.INPUT_SUPPLIER]: '/input-supplier',
  [PROVIDER_TYPES.AGRICULTURAL_EXPERT]: '/expert',
});

/**
 * Only Input Supplier has inventory + B2B procurement.
 */
export const SUPPLIER_ONLY_MODULES = Object.freeze([
  'catalog',
  'categories',
  'inventory',
  'procurement',
  'pricing',
  'customers',
  'finance',
]);

/**
 * Only Agricultural Expert has scheduling + case management.
 */
export const EXPERT_ONLY_MODULES = Object.freeze([
  'specializations',
  'requests',
  'consultations',
  'schedule',
  'cases',
  'advice',
  'content',
  'resources',
  'earnings',
]);

export function providerTypeLabel(type, locale = 'en') {
  return PROVIDER_TYPE_LABELS[type]?.[locale] ?? type;
}