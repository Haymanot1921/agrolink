// mobile/src/shared/constants/platform.ts
// Platform-wide constants — brand, features, limits.
// SRS refs: §4.1 (roles), §13.1 (payments), §2.4 (excluded features).

import Constants from 'expo-constants';

export const APP_INFO = {
  NAME: 'AgroLink Ethiopia',
  VERSION: (Constants.expoConfig?.version as string) ?? '1.0.0',
  BUILD:
    (Constants.expoConfig?.ios?.buildNumber as string) ??
    String(Constants.expoConfig?.android?.versionCode ?? '1'),
  SUPPORT_EMAIL: 'support@agrolink.et',
  SUPPORT_PHONE: '+251900000000',
  PRIVACY_URL: 'https://agrolink.et/privacy',
  TERMS_URL: 'https://agrolink.et/terms',
  WEBSITE: 'https://agrolink.et',
} as const;

export const PLATFORM = {
  website: APP_INFO.WEBSITE,
  supportEmail: APP_INFO.SUPPORT_EMAIL,
  supportPhone: APP_INFO.SUPPORT_PHONE,
  appVersion: APP_INFO.VERSION,
} as const;

/** Feature flags — all disabled by default in v1; enable per release. */
export const FEATURES = {
  /** Live expert video consultations. */
  ENABLE_VIDEO_CONSULTATIONS: true,
  /** Voice messages in chat. */
  ENABLE_VOICE_MESSAGES: true,
  /** Biometric login (Face ID / fingerprint). */
  ENABLE_BIOMETRIC_LOGIN: true,
  /** In-app payments (record-only per §13.1). */
  ENABLE_PAYMENTS_RECORD_ONLY: true,
  /** Live external gateway (Telebirr/Chapa) — deferred to a later release. */
  ENABLE_LIVE_PAYMENT_GATEWAY: false,
  /** Push notifications. */
  ENABLE_PUSH_NOTIFICATIONS: true,
  /** Amharic UI (per §FR-ACCESS-006 — always on). */
  ENABLE_AMHARIC: true,
  /** Analytics (anonymous). */
  ENABLE_ANALYTICS: false,
  /** Crash reporting. */
  ENABLE_CRASH_REPORTING: false,
} as const;

/** Feature exclusions (per SRS §2.4). Do NOT add these as features. */
export const EXCLUDED_FEATURES = [
  'transportation',
  'delivery',
  'transporter',
  'vehicles',
  'drivers',
  'route_management',
  'live_tracking',
  'ai_chatbot',
  'ai_diagnosis',
  'ai_recommendation',
  'credit_scoring',
  'loan_approval',
  'automatic_negotiation',
] as const;

/** Global limits. */
export const LIMITS = {
  MAX_IMAGE_SIZE_MB: 5,
  MAX_DOCUMENT_SIZE_MB: 10,
  MAX_LISTING_IMAGES: 5,
  MAX_CASE_ATTACHMENTS: 10,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_VOICE_MESSAGE_SEC: 120,
  MAX_SEARCH_QUERY_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  MAX_REVIEW_LENGTH: 5000,
  MAX_DISPUTE_DESCRIPTION_LENGTH: 5000,
  DEFAULT_PAGE_SIZE: 20,
  REFRESH_INTERVAL_MS: 30000,
} as const;

/** Locale + language defaults. */
export const LANGUAGE_CONFIG = {
  SUPPORTED: ['en', 'am'] as const,
  DEFAULT: 'en' as const,
  STORAGE_KEY: '@agrolink/language',
} as const;

/** Common timing values. */
export const TIMING = {
  DEBOUNCE_SEARCH_MS: 300,
  TOAST_DURATION_MS: 3000,
  OTP_RESEND_COOLDOWN_SEC: 60,
  OTP_LENGTH: 6,
  WEATHER_CACHE_TTL_MS: 30 * 60 * 1000,
  SESSION_REFRESH_MS: 15 * 60 * 1000,
} as const;

/** Currency. */
export const CURRENCY = {
  CODE: 'ETB',
  SYMBOL_EN: 'ETB',
  SYMBOL_AM: 'ብር',
  DECIMALS: 2,
} as const;

/** Platform-wide regular expressions (usable in validators). */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
  ETHIOPIAN_PHONE: /^(\+251[79]\d{8}|0[79]\d{8})$/,
  URL: /^https?:\/\/.+/i,
  OTP: /^\d{6}$/,
} as const;