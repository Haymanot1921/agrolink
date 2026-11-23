// server/src/shared/constants/cropTypes.js
// Ethiopian crop taxonomy for product categories, listing filters, and
// market-price grouping (SRS §5.4, §5.9). EN + AM names are exported so
// the i18n layer and marketplace filters share one reference.

'use strict';

const CROP_TYPES = Object.freeze({
  // --- Cereals ----------------------------------------------------------
  TEFF: 'teff',
  WHEAT: 'wheat',
  BARLEY: 'barley',
  MAIZE: 'maize',
  SORGHUM: 'sorghum',
  MILLET: 'millet',
  RICE: 'rice',
  OATS: 'oats',

  // --- Legumes ----------------------------------------------------------
  CHICKPEA: 'chickpea',
  LENTIL: 'lentil',
  FABA_BEAN: 'faba_bean',
  FIELD_PEA: 'field_pea',
  HARICOT_BEAN: 'haricot_bean',
  SOYBEAN: 'soybean',
  GROUNDNUT: 'groundnut',

  // --- Oilseeds ---------------------------------------------------------
  SESAME: 'sesame',
  SUNFLOWER: 'sunflower',
  NIGER_SEED: 'niger_seed',
  LINSEED: 'linseed',
  RAPESEED: 'rapeseed',

  // --- Root & tuber -----------------------------------------------------
  POTATO: 'potato',
  SWEET_POTATO: 'sweet_potato',
  CASSAVA: 'cassava',
  TARO: 'taro',
  ENSET: 'enset',

  // --- Vegetables -------------------------------------------------------
  ONION: 'onion',
  TOMATO: 'tomato',
  PEPPER: 'pepper',
  CABBAGE: 'cabbage',
  CARROT: 'carrot',
  GARLIC: 'garlic',
  LETTUCE: 'lettuce',
  SPINACH: 'spinach',
  BEETROOT: 'beetroot',
  CUCUMBER: 'cucumber',
  PUMPKIN: 'pumpkin',
  OKRA: 'okra',

  // --- Fruits -----------------------------------------------------------
  BANANA: 'banana',
  MANGO: 'mango',
  AVOCADO: 'avocado',
  PAPAYA: 'papaya',
  ORANGE: 'orange',
  LEMON: 'lemon',
  GUAVA: 'guava',
  PINEAPPLE: 'pineapple',
  GRAPES: 'grapes',
  APPLE: 'apple',
  WATERMELON: 'watermelon',

  // --- Cash / stimulant -------------------------------------------------
  COFFEE: 'coffee',
  TEA: 'tea',
  CHAT: 'chat',
  TOBACCO: 'tobacco',
  COTTON: 'cotton',
  SUGARCANE: 'sugarcane',

  // --- Spices -----------------------------------------------------------
  GINGER: 'ginger',
  TURMERIC: 'turmeric',
  CARDAMOM: 'cardamom',
  CINNAMON: 'cinnamon',
  CLOVE: 'clove',
  BLACK_CUMIN: 'black_cumin',

  // --- Forage -----------------------------------------------------------
  ALFALFA: 'alfalfa',
  RHODES_GRASS: 'rhodes_grass',
  NAPIER_GRASS: 'napier_grass',

  // --- Other ------------------------------------------------------------
  OTHER: 'other',
});

const CROP_TYPE_LIST = Object.freeze(Object.values(CROP_TYPES));

// Coarse groups for filter UI.
const CROP_GROUPS = Object.freeze({
  CEREAL: 'cereal',
  LEGUME: 'legume',
  OILSEED: 'oilseed',
  ROOT: 'root',
  VEGETABLE: 'vegetable',
  FRUIT: 'fruit',
  CASH: 'cash',
  SPICE: 'spice',
  FORAGE: 'forage',
  OTHER: 'other',
});

const CROP_GROUP_LIST = Object.freeze(Object.values(CROP_GROUPS));

// Mapping type → group.
const CROP_TYPE_TO_GROUP = Object.freeze({
  [CROP_TYPES.TEFF]: CROP_GROUPS.CEREAL,
  [CROP_TYPES.WHEAT]: CROP_GROUPS.CEREAL,
  [CROP_TYPES.BARLEY]: CROP_GROUPS.CEREAL,
  [CROP_TYPES.MAIZE]: CROP_GROUPS.CEREAL,
  [CROP_TYPES.SORGHUM]: CROP_GROUPS.CEREAL,
  [CROP_TYPES.MILLET]: CROP_GROUPS.CEREAL,
  [CROP_TYPES.RICE]: CROP_GROUPS.CEREAL,
  [CROP_TYPES.OATS]: CROP_GROUPS.CEREAL,

  [CROP_TYPES.CHICKPEA]: CROP_GROUPS.LEGUME,
  [CROP_TYPES.LENTIL]: CROP_GROUPS.LEGUME,
  [CROP_TYPES.FABA_BEAN]: CROP_GROUPS.LEGUME,
  [CROP_TYPES.FIELD_PEA]: CROP_GROUPS.LEGUME,
  [CROP_TYPES.HARICOT_BEAN]: CROP_GROUPS.LEGUME,
  [CROP_TYPES.SOYBEAN]: CROP_GROUPS.LEGUME,
  [CROP_TYPES.GROUNDNUT]: CROP_GROUPS.LEGUME,

  [CROP_TYPES.SESAME]: CROP_GROUPS.OILSEED,
  [CROP_TYPES.SUNFLOWER]: CROP_GROUPS.OILSEED,
  [CROP_TYPES.NIGER_SEED]: CROP_GROUPS.OILSEED,
  [CROP_TYPES.LINSEED]: CROP_GROUPS.OILSEED,
  [CROP_TYPES.RAPESEED]: CROP_GROUPS.OILSEED,

  [CROP_TYPES.POTATO]: CROP_GROUPS.ROOT,
  [CROP_TYPES.SWEET_POTATO]: CROP_GROUPS.ROOT,
  [CROP_TYPES.CASSAVA]: CROP_GROUPS.ROOT,
  [CROP_TYPES.TARO]: CROP_GROUPS.ROOT,
  [CROP_TYPES.ENSET]: CROP_GROUPS.ROOT,

  [CROP_TYPES.ONION]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.TOMATO]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.PEPPER]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.CABBAGE]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.CARROT]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.GARLIC]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.LETTUCE]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.SPINACH]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.BEETROOT]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.CUCUMBER]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.PUMPKIN]: CROP_GROUPS.VEGETABLE,
  [CROP_TYPES.OKRA]: CROP_GROUPS.VEGETABLE,

  [CROP_TYPES.BANANA]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.MANGO]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.AVOCADO]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.PAPAYA]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.ORANGE]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.LEMON]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.GUAVA]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.PINEAPPLE]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.GRAPES]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.APPLE]: CROP_GROUPS.FRUIT,
  [CROP_TYPES.WATERMELON]: CROP_GROUPS.FRUIT,

  [CROP_TYPES.COFFEE]: CROP_GROUPS.CASH,
  [CROP_TYPES.TEA]: CROP_GROUPS.CASH,
  [CROP_TYPES.CHAT]: CROP_GROUPS.CASH,
  [CROP_TYPES.TOBACCO]: CROP_GROUPS.CASH,
  [CROP_TYPES.COTTON]: CROP_GROUPS.CASH,
  [CROP_TYPES.SUGARCANE]: CROP_GROUPS.CASH,

  [CROP_TYPES.GINGER]: CROP_GROUPS.SPICE,
  [CROP_TYPES.TURMERIC]: CROP_GROUPS.SPICE,
  [CROP_TYPES.CARDAMOM]: CROP_GROUPS.SPICE,
  [CROP_TYPES.CINNAMON]: CROP_GROUPS.SPICE,
  [CROP_TYPES.CLOVE]: CROP_GROUPS.SPICE,
  [CROP_TYPES.BLACK_CUMIN]: CROP_GROUPS.SPICE,

  [CROP_TYPES.ALFALFA]: CROP_GROUPS.FORAGE,
  [CROP_TYPES.RHODES_GRASS]: CROP_GROUPS.FORAGE,
  [CROP_TYPES.NAPIER_GRASS]: CROP_GROUPS.FORAGE,

  [CROP_TYPES.OTHER]: CROP_GROUPS.OTHER,
});

// Units commonly used per crop group.
const CROP_UNITS = Object.freeze({
  cereal: ['kg', 'quintal', 'ton'],
  legume: ['kg', 'quintal', 'ton'],
  oilseed: ['kg', 'quintal', 'liter'],
  root: ['kg', 'quintal', 'ton'],
  vegetable: ['kg', 'bunch', 'crate', 'quintal'],
  fruit: ['kg', 'bunch', 'crate', 'quintal', 'piece'],
  cash: ['kg', 'quintal', 'ton'],
  spice: ['kg', 'g'],
  forage: ['kg', 'bale', 'ton'],
  other: ['kg', 'quintal', 'unit'],
});

// Human-readable names (EN + AM). i18n can override but these are canonical.
const CROP_NAMES = Object.freeze({
  [CROP_TYPES.TEFF]: { en: 'Teff', am: 'ጤፍ' },
  [CROP_TYPES.WHEAT]: { en: 'Wheat', am: 'ስንዴ' },
  [CROP_TYPES.BARLEY]: { en: 'Barley', am: 'ገብስ' },
  [CROP_TYPES.MAIZE]: { en: 'Maize', am: 'በቆሎ' },
  [CROP_TYPES.SORGHUM]: { en: 'Sorghum', am: 'ማሽላ' },
  [CROP_TYPES.MILLET]: { en: 'Millet', am: 'ዳጉሳ' },
  [CROP_TYPES.RICE]: { en: 'Rice', am: 'ሩዝ' },
  [CROP_TYPES.OATS]: { en: 'Oats', am: 'አጃ' },
  [CROP_TYPES.CHICKPEA]: { en: 'Chickpea', am: 'ሽምብራ' },
  [CROP_TYPES.LENTIL]: { en: 'Lentil', am: 'ምስር' },
  [CROP_TYPES.FABA_BEAN]: { en: 'Faba bean', am: 'ባቄላ' },
  [CROP_TYPES.FIELD_PEA]: { en: 'Field pea', am: 'አተር' },
  [CROP_TYPES.HARICOT_BEAN]: { en: 'Haricot bean', am: 'ቦሎቄ' },
  [CROP_TYPES.SOYBEAN]: { en: 'Soybean', am: 'ሶያ' },
  [CROP_TYPES.GROUNDNUT]: { en: 'Groundnut', am: 'ለውዝ' },
  [CROP_TYPES.SESAME]: { en: 'Sesame', am: 'ሰሊጥ' },
  [CROP_TYPES.SUNFLOWER]: { en: 'Sunflower', am: 'ሱፍ' },
  [CROP_TYPES.NIGER_SEED]: { en: 'Niger seed', am: 'ኑግ' },
  [CROP_TYPES.LINSEED]: { en: 'Linseed', am: 'ተልባ' },
  [CROP_TYPES.RAPESEED]: { en: 'Rapeseed', am: 'የዘይት አተር' },
  [CROP_TYPES.POTATO]: { en: 'Potato', am: 'ድንች' },
  [CROP_TYPES.SWEET_POTATO]: { en: 'Sweet potato', am: 'ስኳር ድንች' },
  [CROP_TYPES.CASSAVA]: { en: 'Cassava', am: 'ካሳቫ' },
  [CROP_TYPES.TARO]: { en: 'Taro', am: 'ቦይና' },
  [CROP_TYPES.ENSET]: { en: 'Enset', am: 'እንሰት' },
  [CROP_TYPES.ONION]: { en: 'Onion', am: 'ቀይ ሽንኩርት' },
  [CROP_TYPES.TOMATO]: { en: 'Tomato', am: 'ቲማቲም' },
  [CROP_TYPES.PEPPER]: { en: 'Pepper', am: 'በርበሬ' },
  [CROP_TYPES.CABBAGE]: { en: 'Cabbage', am: 'ጎመን' },
  [CROP_TYPES.CARROT]: { en: 'Carrot', am: 'ካሮት' },
  [CROP_TYPES.GARLIC]: { en: 'Garlic', am: 'ነጭ ሽንኩርት' },
  [CROP_TYPES.LETTUCE]: { en: 'Lettuce', am: 'ሰላጣ' },
  [CROP_TYPES.SPINACH]: { en: 'Spinach', am: 'ቡና' },
  [CROP_TYPES.BEETROOT]: { en: 'Beetroot', am: 'ቀይ ስር' },
  [CROP_TYPES.CUCUMBER]: { en: 'Cucumber', am: 'ኪያር' },
  [CROP_TYPES.PUMPKIN]: { en: 'Pumpkin', am: 'ዱባ' },
  [CROP_TYPES.OKRA]: { en: 'Okra', am: 'ባሚያ' },
  [CROP_TYPES.BANANA]: { en: 'Banana', am: 'ሙዝ' },
  [CROP_TYPES.MANGO]: { en: 'Mango', am: 'ማንጎ' },
  [CROP_TYPES.AVOCADO]: { en: 'Avocado', am: 'አቮካዶ' },
  [CROP_TYPES.PAPAYA]: { en: 'Papaya', am: 'ፓፓያ' },
  [CROP_TYPES.ORANGE]: { en: 'Orange', am: 'ብርቱካን' },
  [CROP_TYPES.LEMON]: { en: 'Lemon', am: 'ሎሚ' },
  [CROP_TYPES.GUAVA]: { en: 'Guava', am: 'ዘይቱን' },
  [CROP_TYPES.PINEAPPLE]: { en: 'Pineapple', am: 'አናናስ' },
  [CROP_TYPES.GRAPES]: { en: 'Grapes', am: 'ወይን' },
  [CROP_TYPES.APPLE]: { en: 'Apple', am: 'ፖም' },
  [CROP_TYPES.WATERMELON]: { en: 'Watermelon', am: 'ሀብሀብ' },
  [CROP_TYPES.COFFEE]: { en: 'Coffee', am: 'ቡና' },
  [CROP_TYPES.TEA]: { en: 'Tea', am: 'ሻይ' },
  [CROP_TYPES.CHAT]: { en: 'Chat', am: 'ጫት' },
  [CROP_TYPES.TOBACCO]: { en: 'Tobacco', am: 'ትንባሆ' },
  [CROP_TYPES.COTTON]: { en: 'Cotton', am: 'ጥጥ' },
  [CROP_TYPES.SUGARCANE]: { en: 'Sugarcane', am: 'የሸንኮራ አገዳ' },
  [CROP_TYPES.GINGER]: { en: 'Ginger', am: 'ዝንጅብል' },
  [CROP_TYPES.TURMERIC]: { en: 'Turmeric', am: 'እርድ' },
  [CROP_TYPES.CARDAMOM]: { en: 'Cardamom', am: 'ኮረሪማ' },
  [CROP_TYPES.CINNAMON]: { en: 'Cinnamon', am: 'ቀረፋ' },
  [CROP_TYPES.CLOVE]: { en: 'Clove', am: 'ቅርንፉድ' },
  [CROP_TYPES.BLACK_CUMIN]: { en: 'Black cumin', am: 'ጥቁር አዝሙድ' },
  [CROP_TYPES.ALFALFA]: { en: 'Alfalfa', am: 'አልፋልፋ' },
  [CROP_TYPES.RHODES_GRASS]: { en: 'Rhodes grass', am: 'ሮድስ ገረብ' },
  [CROP_TYPES.NAPIER_GRASS]: { en: 'Napier grass', am: 'ናፒየር ገረብ' },
  [CROP_TYPES.OTHER]: { en: 'Other', am: 'ሌላ' },
});

function isValidCropType(t) {
  return CROP_TYPE_LIST.includes(t);
}

function groupFor(type) {
  return CROP_TYPE_TO_GROUP[type] || CROP_GROUPS.OTHER;
}

function unitsFor(type) {
  const group = groupFor(type);
  return CROP_UNITS[group] || CROP_UNITS.other;
}

function nameFor(type, language = 'en') {
  const entry = CROP_NAMES[type];
  if (!entry) return type;
  return entry[language] || entry.en;
}

module.exports = {
  CROP_TYPES,
  CROP_TYPE_LIST,
  CROP_GROUPS,
  CROP_GROUP_LIST,
  CROP_TYPE_TO_GROUP,
  CROP_UNITS,
  CROP_NAMES,
  isValidCropType,
  groupFor,
  unitsFor,
  nameFor,
};