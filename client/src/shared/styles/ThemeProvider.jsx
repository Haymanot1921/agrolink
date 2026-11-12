// client/src/shared/styles/ThemeProvider.jsx
// Light/dark theme + language direction. Persists to localStorage.
// SRS refs: §11.8, NFR-ACCESS-006 (EN + AM), FR-ACCESS-006.

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'agrolink_theme';
const LANG_STORAGE_KEY = 'agrolink_language';

function readStoredTheme() {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
    if (v === 'system' || v == null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return v;
  } catch {
    return 'light';
  }
}

function readStoredLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) ?? 'en';
  } catch {
    return 'en';
  }
}

export function ThemeProvider({ children, defaultTheme, defaultLanguage }) {
  const [mode, setModeState] = useState(() => defaultTheme ?? readStoredTheme() ?? 'light');
  const [language, setLanguageState] = useState(() => defaultLanguage ?? readStoredLanguage());

  // Apply theme + language to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.setAttribute('lang', language);
    root.setAttribute('dir', 'ltr'); // EN and AM are both LTR
    document.body?.setAttribute('data-lang', language);
  }, [mode, language]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* quota */
    }
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      /* quota */
    }
  }, [language]);

  // React to system preference changes if user chose "system"
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'system' || stored == null) {
        setModeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener?.('change', listener);
    return () => mq.removeEventListener?.('change', listener);
  }, []);

  const setMode = useCallback((next) => {
    if (next === 'system') {
      const prefersDark =
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModeState(prefersDark ? 'dark' : 'light');
      try {
        localStorage.setItem(STORAGE_KEY, 'system');
      } catch {
        /* noop */
      }
    } else {
      setModeState(next);
    }
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setLanguage = useCallback((next) => {
    if (!['en', 'am'].includes(next)) return;
    setLanguageState(next);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      isLight: mode === 'light',
      language,
      isAmharic: language === 'am',
      isEnglish: language === 'en',
      setMode,
      toggleMode,
      setLanguage,
    }),
    [mode, language, setMode, toggleMode, setLanguage],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

export default ThemeProvider;