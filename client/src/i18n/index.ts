// client/src/i18n/index.ts
// Initializes i18next for the web app with all 10 namespaces × 2 languages.
// Detects language from localStorage → cookie → browser, updates <html lang>,
// syncs `document.title` from `common.appName`.
// SRS refs: FR-ACCESS-006, NFR-ACCESS-006.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  NAMESPACES,
  SUPPORTED_LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_DETECTION_ORDER,
  LANGUAGE_DETECTION_LOOKUP_LOCAL_STORAGE,
  LANGUAGE_DETECTION_LOOKUP_COOKIE,
  LANGUAGE_DETECTION_CACHES,
  isSupportedLanguage,
  type SupportedLanguage,
} from './config';

// ─── English resources ───
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enValidation from './locales/en/validation.json';
import enPublic from './locales/en/public.json';
import enFarmer from './locales/en/farmer.json';
import enBuyer from './locales/en/buyer.json';
import enInputSupplier from './locales/en/input-supplier.json';
import enAgriculturalExpert from './locales/en/agricultural-expert.json';
import enSupportAgent from './locales/en/support-agent.json';
import enAdministrator from './locales/en/administrator.json';

// ─── Amharic resources ───
import amCommon from './locales/am/common.json';
import amAuth from './locales/am/auth.json';
import amValidation from './locales/am/validation.json';
import amPublic from './locales/am/public.json';
import amFarmer from './locales/am/farmer.json';
import amBuyer from './locales/am/buyer.json';
import amInputSupplier from './locales/am/input-supplier.json';
import amAgriculturalExpert from './locales/am/agricultural-expert.json';
import amSupportAgent from './locales/am/support-agent.json';
import amAdministrator from './locales/am/administrator.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    validation: enValidation,
    public: enPublic,
    farmer: enFarmer,
    buyer: enBuyer,
    'input-supplier': enInputSupplier,
    'agricultural-expert': enAgriculturalExpert,
    'support-agent': enSupportAgent,
    administrator: enAdministrator,
  },
  am: {
    common: amCommon,
    auth: amAuth,
    validation: amValidation,
    public: amPublic,
    farmer: amFarmer,
    buyer: amBuyer,
    'input-supplier': amInputSupplier,
    'agricultural-expert': amAgriculturalExpert,
    'support-agent': amSupportAgent,
    administrator: amAdministrator,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    fallbackLng: FALLBACK_LANGUAGE,
    lng: undefined, // let detector decide
    defaultNS: 'common',
    ns: NAMESPACES as unknown as string[],
    interpolation: {
      escapeValue: false, // React escapes by default
    },
    detection: {
      order: [...LANGUAGE_DETECTION_ORDER],
      lookupLocalStorage: LANGUAGE_DETECTION_LOOKUP_LOCAL_STORAGE,
      lookupCookie: LANGUAGE_DETECTION_LOOKUP_COOKIE,
      caches: [...LANGUAGE_DETECTION_CACHES],
    },
    react: {
      useSuspense: false, // we handle Suspense at the router level
    },
    returnNull: false,
    debug: false,
  });

// ─────────────────────────────────────────────────────────────
// Side-effects: <html lang>, <html dir>, document.title
// ─────────────────────────────────────────────────────────────

function applyLanguageToDocument(lang: string) {
  const validLang: SupportedLanguage = isSupportedLanguage(lang)
    ? lang
    : DEFAULT_LANGUAGE;

  // <html lang="en|am"> — WCAG 3.1.1 (NFR-ACCESS-001)
  document.documentElement.setAttribute('lang', validLang);

  // Both English and Amharic are LTR — no RTL needed for Amharic.
  document.documentElement.setAttribute('dir', 'ltr');

  // Update title from common.appName (if i18n is ready)
  if (i18n.isInitialized) {
    const appName = i18n.t('appName', { ns: 'common', defaultValue: 'AgroLink Ethiopia' });
    document.title = String(appName);
  }
}

// Fire on initial load and any language change
i18n.on('languageChanged', applyLanguageToDocument);
applyLanguageToDocument(i18n.language || DEFAULT_LANGUAGE);

// ─────────────────────────────────────────────────────────────
// Public helpers
// ─────────────────────────────────────────────────────────────

export { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, INTL_LOCALE, DEFAULT_LANGUAGE } from './config';
export type { SupportedLanguage } from './config';
export type { Namespace } from './config';
export { LANGUAGE_STORAGE_KEY, LANGUAGE_COOKIE_KEY } from './config';
export { detectLanguage, isSupportedLanguage } from './config';

export default i18n;