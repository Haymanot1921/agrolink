// mobile/src/i18n/config.ts
// Central i18n configuration: languages, namespaces, fallbacks, types.

export const SUPPORTED_LANGUAGES = ['en', 'am'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export const NAMESPACES = [
  'common',
  'auth',
  'validation',
  'mobile',
  'farmer',
  'buyer',
  'input-supplier',
  'agricultural-expert',
  'support-agent',
  'administrator',
] as const;
export type Namespace = (typeof NAMESPACES)[number];

export const DEFAULT_NAMESPACE: Namespace = 'common';

/** Human-readable language labels for the UI. */
export const LANGUAGE_LABELS: Record<SupportedLanguage, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  am: { native: 'አማርኛ', english: 'Amharic' },
};

/** Map for date/number formatting via Intl. */
export const INTL_LOCALE: Record<SupportedLanguage, string> = {
  en: 'en-ET',
  am: 'am-ET',
};

/** AsyncStorage key for persisted language. */
export const LANGUAGE_STORAGE_KEY = '@agrolink/language';

/** Detect language from a device locale string (e.g., "am-ET" → "am"). */
export function detectLanguage(deviceLocale?: string | null): SupportedLanguage {
  if (!deviceLocale) return DEFAULT_LANGUAGE;
  const prefix = deviceLocale.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(prefix as SupportedLanguage)
    ? (prefix as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}