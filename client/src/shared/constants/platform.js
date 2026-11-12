// client/src/shared/constants/platform.js
// Platform-level constants — name, languages, currencies, exclusions.
// SRS refs: §1.1, §2.4 exclusions, §5.9, §5.10, NFR-ACCESS-006.

export const PLATFORM = Object.freeze({
  NAME: 'AgroLink Ethiopia',
  SHORT_NAME: 'AgroLink',
  VERSION: '2.0',
  SRS_VERSION: '2.0',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'am'],
  DEFAULT_CURRENCY: 'ETB',
  CURRENCY_SYMBOL: 'ETB',
  TIMEZONE: 'Africa/Addis_Ababa',
  COUNTRY: 'Ethiopia',
  COUNTRY_CODE: 'ET',
  PHONE_PREFIX: '+251',
});

export const APP_INFO = Object.freeze({
  VERSION: PLATFORM.VERSION,
  WEBSITE: import.meta.env.VITE_APP_WEBSITE || 'https://agrolink.et',
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || '',
  SUPPORT_PHONE: import.meta.env.VITE_SUPPORT_PHONE || '',
});

export const LANGUAGES = Object.freeze({
  en: { code: 'en', label: 'English', labelAm: 'እንግሊዝኛ', dir: 'ltr' },
  am: { code: 'am', label: 'Amharic', labelAm: 'አማርኛ', dir: 'ltr' },
});

/**
 * Explicit SRS §2.4 exclusions — used to gate features and show notices.
 * IMPORTANT: never remove or override these; they are hard constraints.
 */
export const EXCLUDED_FEATURES = Object.freeze([
  'transportation-provider-registration',
  'transporter-dashboards',
  'transport-booking',
  'delivery-assignment',
  'delivery-tracking',
  'vehicle-management',
  'driver-management',
  'delivery-fee-calculation',
  'artificial-intelligence',
  'ai-chatbots',
  'automated-crop-disease-diagnosis',
  'automated-market-price-prediction',
  'ai-generated-agricultural-recommendations',
  'automated-credit-scoring',
  'loan-approval',
  'unapproved-banking-mobile-money-integrations',
  'guaranteed-physical-product-inspection',
  'automatic-government-registration',
  'automated-negotiation',
]);

/**
 * Page size options — used by Pagination component.
 */
export const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50, 100]);

/** Default pagination per page. */
export const DEFAULT_PAGE_SIZE = 20;

/** Image upload limits. */
export const IMAGE_LIMITS = Object.freeze({
  MAX_SIZE_MB: 5,
  MAX_LISTING_IMAGES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
});

/** Document upload limits (verification, disputes). */
export const DOCUMENT_LIMITS = Object.freeze({
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
});

/** Ethiopian regions — used in address filters, market locations. */
export const ETHIOPIAN_REGIONS = Object.freeze([
  { value: 'addis_ababa', en: 'Addis Ababa', am: 'አዲስ አበባ' },
  { value: 'oromia', en: 'Oromia', am: 'ኦሮሚያ' },
  { value: 'amhara', en: 'Amhara', am: 'አማራ' },
  { value: 'sidama', en: 'Sidama', am: 'ሲዳማ' },
  { value: 'tigray', en: 'Tigray', am: 'ትግራይ' },
  { value: 'somali', en: 'Somali', am: 'ሶማሌ' },
  { value: 'afar', en: 'Afar', am: 'አፋር' },
  { value: 'benishangul_gumuz', en: 'Benishangul-Gumuz', am: 'ቤንሻንጉል-ጉሙዝ' },
  { value: 'gambela', en: 'Gambela', am: 'ጋምቤላ' },
  { value: 'harari', en: 'Harari', am: 'ሐረሪ' },
  { value: 'snnpr', en: 'South Nations', am: 'ደቡብ ብሔሮች' },
  { value: 'central_ethiopia', en: 'Central Ethiopia', am: 'መካከለኛው ኢትዮጵያ' },
  { value: 'south_ethiopia', en: 'South Ethiopia', am: 'ደቡብ ኢትዮጵያ' },
  { value: 'southwest_ethiopia', en: 'South West Ethiopia', am: 'ደቡብ ምዕራብ ኢትዮጵያ' },
]);

/**
 * Product categories — matches DB `product_categories` seed.
 */
export const PRODUCT_CATEGORIES = Object.freeze([
  { slug: 'cereals', en: 'Cereals', am: 'እህል' },
  { slug: 'vegetables', en: 'Vegetables', am: 'አትክልት' },
  { slug: 'fruits', en: 'Fruits', am: 'ፍራፍሬ' },
  { slug: 'pulses', en: 'Pulses', am: 'ጥራጥሬ' },
  { slug: 'oilseeds', en: 'Oilseeds', am: 'ቅባት እህል' },
  { slug: 'livestock', en: 'Livestock', am: 'እንስሳት' },
]);

/**
 * Input categories — matches DB `input_categories` seed.
 */
export const INPUT_CATEGORIES = Object.freeze([
  { slug: 'seeds', en: 'Seeds', am: 'ዘር', type: 'seed' },
  { slug: 'fertilizers', en: 'Fertilizers', am: 'ማዳበሪያ', type: 'fertilizer' },
  { slug: 'pesticides', en: 'Pesticides', am: 'ፀረ-ተባይ', type: 'pesticide' },
  { slug: 'tools', en: 'Tools', am: 'መሳሪያዎች', type: 'tool' },
  { slug: 'equipment', en: 'Equipment', am: 'ውቅር', type: 'equipment' },
]);

/**
 * Currencies allowed in the UI — only ETB in release 1.
 */
export const CURRENCIES = Object.freeze([{ code: 'ETB', symbol: 'ETB', label: 'Ethiopian Birr' }]);

/**
 * Payment methods supported in record-only mode (§13.1).
 */
export const PAYMENT_METHODS = Object.freeze([
  { value: 'cash', en: 'Cash', am: 'ጥሬ ገንዘብ' },
  { value: 'bank_transfer', en: 'Bank Transfer', am: 'የባንክ ዝውውር' },
  { value: 'telebirr', en: 'Telebirr', am: 'ቴሌብር' },
  { value: 'chapa', en: 'Chapa', am: 'ቻፓ' },
  { value: 'other', en: 'Other', am: 'ሌላ' },
]);

/**
 * Feature flags — release 1 defaults. Toggle server-side per environment.
 */
export const FEATURES = Object.freeze({
  LIVE_PAYMENT_GATEWAY: false,
  SMS_NOTIFICATIONS: false,
  EMAIL_NOTIFICATIONS: true,
  PUSH_NOTIFICATIONS: true,
  ASSISTED_FARMER_SERVICE: true,
  EXPERT_CONSULTATIONS: true,
  MARKET_PRICES: true,
  EDUCATIONAL_ARTICLES: true,
  IN_PLATFORM_MESSAGING: true,
});

export default PLATFORM;