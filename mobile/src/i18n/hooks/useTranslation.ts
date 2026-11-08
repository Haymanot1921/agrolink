// mobile/src/i18n/hooks/useTranslation.ts
// Typed wrapper around react-i18next's useTranslation with sensible defaults.

import { useCallback } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

import { DEFAULT_NAMESPACE, type Namespace } from '../config';

export function useTranslation(namespace: Namespace = DEFAULT_NAMESPACE) {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  const changeLanguage = useCallback(
    async (language: string) => {
      await i18n.changeLanguage(language);
    },
    [i18n],
  );

  return {
    t,
    i18n,
    ready,
    language: i18n.language,
    changeLanguage,
  };
}