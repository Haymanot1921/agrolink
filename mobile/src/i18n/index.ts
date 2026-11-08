// mobile/src/i18n/index.ts
// Initializes i18next with all namespaces × both languages + language detector.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  NAMESPACES,
  detectLanguage,
  type SupportedLanguage,
} from './config';

// English resources
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enValidation from './locales/en/validation.json';
import enMobile from './locales/en/mobile.json';
import enFarmer from './locales/en/farmer.json';
import enBuyer from './locales/en/buyer.json';
import enInputSupplier from './locales/en/input-supplier.json';
import enAgriculturalExpert from './locales/en/agricultural-expert.json';
import enSupportAgent from './locales/en/support-agent.json';
import enAdministrator from './locales/en/administrator.json';

// Amharic resources
import amCommon from './locales/am/common.json';
import amAuth from './locales/am/auth.json';
import amValidation from './locales/am/validation.json';
import amMobile from './locales/am/mobile.json';
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
    mobile: enMobile,
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
    mobile: amMobile,
    farmer: amFarmer,
    buyer: amBuyer,
    'input-supplier': amInputSupplier,
    'agricultural-expert': amAgriculturalExpert,
    'support-agent': amSupportAgent,
    administrator: amAdministrator,
  },
} as const;

const detectedLanguage = detectLanguage(Localization.getLocales()?.[0]?.languageTag);

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: detectedLanguage,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: 'common',
  ns: [...NAMESPACES],
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false, // React Native handles escaping
  },
  react: {
    useSuspense: false, // avoid Suspense in React Native
  },
});

export default i18n;

// Re-export public helpers
export type { SupportedLanguage } from './config';
export { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, INTL_LOCALE } from './config';
export type { Namespace } from './config';
export { DEFAULT_LANGUAGE } from './config';