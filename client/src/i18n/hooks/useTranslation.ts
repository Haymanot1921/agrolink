// client/src/i18n/hooks/useTranslation.ts
// Typed wrapper around react-i18next's useTranslation.
// Gives IDE autocomplete for namespace names and a consistent API.
// SRS refs: FR-ACCESS-006.

import { useTranslation as useI18nTranslation, UseTranslationResponse } from 'react-i18next';
import { useCallback, useMemo } from 'react';

import {
  DEFAULT_NAMESPACE,
  SUPPORTED_LANGUAGES,
  type Namespace,
  type SupportedLanguage,
} from '../config';

// ─────────────────────────────────────────────────────────────
// Public hook
// ─────────────────────────────────────────────────────────────

export function useTranslation(namespace: Namespace = DEFAULT_NAMESPACE) {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      if (!SUPPORTED_LANGUAGES.includes(language)) return;
      await i18n.changeLanguage(language);
    },
    [i18n],
  );

  const language = (i18n.language as SupportedLanguage) ?? 'en';

  return {
    /** Translation function scoped to `namespace`. */
    t,
    /** i18next instance (advanced use). */
    i18n,
    /** Whether resources are loaded. Always true with static imports. */
    ready,
    /** Current active language. */
    language,
    /** True when UI is English. */
    isEnglish: language === 'en',
    /** True when UI is Amharic. */
    isAmharic: language === 'am',
    /** Switch language (persists via the detector). */
    changeLanguage,
  } as const;
}

// ─────────────────────────────────────────────────────────────
// Convenience helper: typed `t` for a namespace
// Use when you need to reuse `t` outside React (rare).
// ─────────────────────────────────────────────────────────────

import i18nInstance from '../index';

export function getT(namespace: Namespace = DEFAULT_NAMESPACE) {
  return i18nInstance.getFixedT(i18nInstance.language, namespace);
}