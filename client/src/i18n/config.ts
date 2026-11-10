// client/src/i18n/config.ts
// Central i18n configuration: supported languages, namespaces, detection keys.
// SRS refs: FR-ACCESS-006 (English + Amharic), NFR-ACCESS-006.

export const SUPPORTED_LANGUAGES = ['en', 'am'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export const NAMESPACES = [
  'common',
  'auth',
  'validation',
  'public',
  'farmer',
  'buyer',
  'input-supplier',
  'agricultural-expert',
  'support-agent',
  'administrator',
] as const;
export type Namespace = (typeof NAMESPACES)[number];

export const DEFAULT_NAMESPACE: Namespace = 'common';

/** Human-readable labels used by `<LanguageSwitcher />`. */
export const LANGUAGE_LABELS: Record<
  SupportedLanguage,
  { native: string; english: string; flag: string }
> = {
  en: { native: 'English', english: 'English', flag: '🇬🇧' },
  am: { native: 'አማርኛ', english: 'Amharic', flag: '🇪🇹' },
};

/** Intl locales for date/number/currency formatting. */
export const INTL_LOCALE: Record<SupportedLanguage, string> = {
  en: 'en-ET',
  am: 'am-ET',
};

/** Where the user's preferred language is persisted. */
export const LANGUAGE_STORAGE_KEY = 'agrolink.language';
export const LANGUAGE_COOKIE_KEY = 'agrolink_lng';

/** Detection order — localStorage first (explicit choice wins over browser). */
export const LANGUAGE_DETECTION_ORDER = [
  'localStorage',
  'cookie',
  'navigator',
  'htmlTag',
  'path',
  'subdomain',
] as const;

export const LANGUAGE_DETECTION_LOOKUP_LOCAL_STORAGE =
  LANGUAGE_STORAGE_KEY;
export const LANGUAGE_DETECTION_LOOKUP_COOKIE = LANGUAGE_COOKIE_KEY;

/** Caches resolved language for one day. */
export const LANGUAGE_DETECTION_CACHES = ['localStorage', 'cookie'] as const;

/**
 * Detects a supported language from an arbitrary device locale string.
 * Example: "am-ET" → "am", "fr-FR" → "en" (fallback).
 */
export function detectLanguage(deviceLocale?: string | null): SupportedLanguage {
  if (!deviceLocale) return DEFAULT_LANGUAGE;
  const prefix = deviceLocale.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(prefix as SupportedLanguage)
    ? (prefix as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}

/** True if the given value is a supported language. */
export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  );
}