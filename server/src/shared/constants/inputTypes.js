// server/src/shared/constants/inputTypes.js
// Agricultural inputs taxonomy for the marketplace (SRS §5.4). Used by
// product-category seed, listing validation, and marketplace filters.

'use strict';

const INPUT_TYPES = Object.freeze({
  // --- Seeds -------------------------------------------------------------
  SEED_CEREAL: 'seed.cereal',
  SEED_LEGUME: 'seed.legume',
  SEED_VEGETABLE: 'seed.vegetable',
  SEED_FRUIT: 'seed.fruit',
  SEED_OILSEED: 'seed.oilseed',
  SEED_ROOT: 'seed.root',
  SEED_FORAGE: 'seed.forage',
  SEED_HYBRID: 'seed.hybrid',

  // --- Fertilizer --------------------------------------------------------
  FERTILIZER_ORGANIC: 'fertilizer.organic',
  FERTILIZER_INORGANIC: 'fertilizer.inorganic',
  FERTILIZER_COMPOST: 'fertilizer.compost',

  // --- Crop protection ---------------------------------------------------
  PESTICIDE: 'protection.pesticide',
  HERBICIDE: 'protection.herbicide',
  FUNGICIDE: 'protection.fungicide',
  INSECTICIDE: 'protection.insecticide',

  // --- Livestock inputs --------------------------------------------------
  ANIMAL_FEED: 'livestock.feed',
  VETERINARY_MEDICINE: 'livestock.vet_medicine',
  VACCINE: 'livestock.vaccine',

  // --- Equipment & tools ------------------------------------------------
  HAND_TOOL: 'equipment.hand_tool',
  IRRIGATION_EQUIPMENT: 'equipment.irrigation',
  SPRAYER: 'equipment.sprayer',
  TRACTOR_ATTACHMENT: 'equipment.tractor_attachment',
  HARVEST_EQUIPMENT: 'equipment.harvest',
  STORAGE_EQUIPMENT: 'equipment.storage',
  PROCESSING_EQUIPMENT: 'equipment.processing',

  // --- Other -------------------------------------------------------------
  PACKAGING: 'other.packaging',
  OTHER: 'other',
});

const INPUT_TYPE_LIST = Object.freeze(Object.values(INPUT_TYPES));

// Grouping for menu/filter UI.
const INPUT_TYPE_GROUPS = Object.freeze({
  SEED: 'seed',
  FERTILIZER: 'fertilizer',
  CROP_PROTECTION: 'crop_protection',
  LIVESTOCK: 'livestock',
  EQUIPMENT: 'equipment',
  OTHER: 'other',
});

const INPUT_TYPE_GROUP_LIST = Object.freeze(Object.values(INPUT_TYPE_GROUPS));

// Mapping each type → group.
const INPUT_TYPE_TO_GROUP = Object.freeze({
  [INPUT_TYPES.SEED_CEREAL]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.SEED_LEGUME]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.SEED_VEGETABLE]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.SEED_FRUIT]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.SEED_OILSEED]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.SEED_ROOT]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.SEED_FORAGE]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.SEED_HYBRID]: INPUT_TYPE_GROUPS.SEED,
  [INPUT_TYPES.FERTILIZER_ORGANIC]: INPUT_TYPE_GROUPS.FERTILIZER,
  [INPUT_TYPES.FERTILIZER_INORGANIC]: INPUT_TYPE_GROUPS.FERTILIZER,
  [INPUT_TYPES.FERTILIZER_COMPOST]: INPUT_TYPE_GROUPS.FERTILIZER,
  [INPUT_TYPES.PESTICIDE]: INPUT_TYPE_GROUPS.CROP_PROTECTION,
  [INPUT_TYPES.HERBICIDE]: INPUT_TYPE_GROUPS.CROP_PROTECTION,
  [INPUT_TYPES.FUNGICIDE]: INPUT_TYPE_GROUPS.CROP_PROTECTION,
  [INPUT_TYPES.INSECTICIDE]: INPUT_TYPE_GROUPS.CROP_PROTECTION,
  [INPUT_TYPES.ANIMAL_FEED]: INPUT_TYPE_GROUPS.LIVESTOCK,
  [INPUT_TYPES.VETERINARY_MEDICINE]: INPUT_TYPE_GROUPS.LIVESTOCK,
  [INPUT_TYPES.VACCINE]: INPUT_TYPE_GROUPS.LIVESTOCK,
  [INPUT_TYPES.HAND_TOOL]: INPUT_TYPE_GROUPS.EQUIPMENT,
  [INPUT_TYPES.IRRIGATION_EQUIPMENT]: INPUT_TYPE_GROUPS.EQUIPMENT,
  [INPUT_TYPES.SPRAYER]: INPUT_TYPE_GROUPS.EQUIPMENT,
  [INPUT_TYPES.TRACTOR_ATTACHMENT]: INPUT_TYPE_GROUPS.EQUIPMENT,
  [INPUT_TYPES.HARVEST_EQUIPMENT]: INPUT_TYPE_GROUPS.EQUIPMENT,
  [INPUT_TYPES.STORAGE_EQUIPMENT]: INPUT_TYPE_GROUPS.EQUIPMENT,
  [INPUT_TYPES.PROCESSING_EQUIPMENT]: INPUT_TYPE_GROUPS.EQUIPMENT,
  [INPUT_TYPES.PACKAGING]: INPUT_TYPE_GROUPS.OTHER,
  [INPUT_TYPES.OTHER]: INPUT_TYPE_GROUPS.OTHER,
});

// Units of measure used with each group (for input listings).
const INPUT_UNITS = Object.freeze({
  seed: ['kg', 'g', 'quintal', 'packet'],
  fertilizer: ['kg', 'g', 'quintal', 'bag'],
  crop_protection: ['liter', 'ml', 'kg', 'g', 'bottle'],
  livestock: ['kg', 'g', 'liter', 'dose', 'vial'],
  equipment: ['piece', 'set', 'unit'],
  other: ['piece', 'kg', 'unit'],
});

// Flags: which inputs require a license / prescription (regulatory).
const RESTRICTED_INPUT_TYPES = Object.freeze([
  INPUT_TYPES.PESTICIDE,
  INPUT_TYPES.HERBICIDE,
  INPUT_TYPES.FUNGICIDE,
  INPUT_TYPES.INSECTICIDE,
  INPUT_TYPES.VETERINARY_MEDICINE,
  INPUT_TYPES.VACCINE,
]);

function isValidInputType(t) {
  return INPUT_TYPE_LIST.includes(t);
}

function groupFor(type) {
  return INPUT_TYPE_TO_GROUP[type] || INPUT_TYPE_GROUPS.OTHER;
}

function unitsFor(type) {
  const group = groupFor(type);
  return INPUT_UNITS[group] || INPUT_UNITS.other;
}

function isRestricted(type) {
  return RESTRICTED_INPUT_TYPES.includes(type);
}

module.exports = {
  INPUT_TYPES,
  INPUT_TYPE_LIST,
  INPUT_TYPE_GROUPS,
  INPUT_TYPE_GROUP_LIST,
  INPUT_TYPE_TO_GROUP,
  INPUT_UNITS,
  RESTRICTED_INPUT_TYPES,
  isValidInputType,
  groupFor,
  unitsFor,
  isRestricted,
};