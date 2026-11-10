// client/src/i18n/hooks/useLanguage.ts
// Language state hook — reads the current language, exposes a setter,
// persists the choice, and (in future) handles RTL. Amharic is LTR today,
// but this hook is the single place to toggle `dir` when needed.
//
// SRS refs: FR-ACCESS-006 (English + Amharic), NFR-ACCESS-006.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  type SupportedLanguage,
} from '../config';

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useLanguage() {
  const { i18n } = useI18nTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>(
    isSupportedLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE,
  );

  // Keep local state in sync with i18next events
  useEffect(() => {
    const onChanged = (lng: string) => {
      if (isSupportedLanguage(lng)) setLanguageState(lng);
    };
    i18n.on('languageChanged', onChanged);
    return () => {
      i18n.off('languageChanged', onChanged);
    };
  }, [i18n]);

  // Change language (persists via i18next-browser-languagedetector)
  const setLanguage = useCallback(
    async (next: SupportedLanguage) => {
      if (!SUPPORTED_LANGUAGES.includes(next)) return;
      if (next === language) return;
      await i18n.changeLanguage(next);
      // i18next-browser-languagedetector caches to localStorage + cookie
    },
    [i18n, language],
  );

  // Toggle EN ↔ AM
  const toggleLanguage = useCallback(async () => {
    const next: SupportedLanguage = language === 'en' ? 'am' : 'en';
    await setLanguage(next);
  }, [language, setLanguage]);

  // Available languages with metadata for the switcher UI
  const availableLanguages = useMemo(
    () =>
      SUPPORTED_LANGUAGES.map((code) => ({
        code,
        ...LANGUAGE_LABELS[code],
      })),
    [],
  );

  return {
    /** Current language code: 'en' | 'am'. */
    language,
    /** True when current is English. */
    isEnglish: language === 'en',
    /** True when current is Amharic. */
    isAmharic: language === 'am',
    /** UI direction. Amharic is LTR; reserved for future RTL languages. */
    direction: 'ltr' as const,
    /** List of available languages with labels + flags. */
    availableLanguages,
    /** Set the language explicitly. */
    setLanguage,
    /** Toggle between EN and AM. */
    toggleLanguage,
  } as const;
}