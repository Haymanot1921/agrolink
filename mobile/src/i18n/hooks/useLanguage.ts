// mobile/src/i18n/hooks/useLanguage.ts
// Persistent language state — reads/writes AsyncStorage + updates i18n.

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from '../index';
import {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../config';

export function useLanguage() {
  const [language, setLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) ?? 'en',
  );

  // Load persisted language on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
        if (stored !== i18n.language) {
          await i18n.changeLanguage(stored);
          setLanguage(stored as SupportedLanguage);
        }
      }
    })();
  }, []);

  const setLanguageSafe = useCallback(async (next: SupportedLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(next)) return;
    await i18n.changeLanguage(next);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setLanguage(next);
  }, []);

  const toggleLanguage = useCallback(async () => {
    const next: SupportedLanguage = language === 'en' ? 'am' : 'en';
    await setLanguageSafe(next);
  }, [language, setLanguageSafe]);

  return {
    language,
    isEnglish: language === 'en',
    isAmharic: language === 'am',
    setLanguage: setLanguageSafe,
    toggleLanguage,
  };
}