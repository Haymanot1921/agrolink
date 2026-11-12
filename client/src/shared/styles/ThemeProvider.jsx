
/**
 * =========================================================
 * AgroLink Ethiopia
 * File: client/src/shared/styles/ThemeProvider.jsx
 *
 * Purpose:
 * Global theme and language management.
 *
 * Features:
 * - Light theme
 * - Dark theme
 * - System theme preference
 * - English and Amharic language selection
 * - Local storage persistence
 * - Browser system preference synchronization
 * - Active JavaScript color palette
 * - Accessible document theme attributes
 *
 * SRS References:
 * - §11.8: User Interface Design
 * - NFR-ACCESS-006: English and Amharic support
 * - FR-ACCESS-006: Language accessibility
 * =========================================================
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';

import {
  colors as lightColors,
  darkColors,
} from './colors';


/* =========================================================
   1. CONTEXT AND CONFIGURATION
   ========================================================= */

const ThemeContext = createContext(null);

const STORAGE_KEY = 'agrolink_theme';
const LANG_STORAGE_KEY = 'agrolink_language';

const VALID_THEMES = ['light', 'dark', 'system'];
const VALID_LANGUAGES = ['en', 'am'];


/* =========================================================
   2. VALIDATION HELPERS
   ========================================================= */

function isValidTheme(value) {
  return VALID_THEMES.includes(value);
}

function isValidLanguage(value) {
  return VALID_LANGUAGES.includes(value);
}


/* =========================================================
   3. LOCAL STORAGE HELPERS
   ========================================================= */

function readStoredTheme() {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    return isValidTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}


function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);

    return isValidLanguage(stored) ? stored : 'en';
  } catch {
    return 'en';
  }
}


function saveToStorage(key, value) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable or restricted.
  }
}


/* =========================================================
   4. SYSTEM THEME DETECTION
   ========================================================= */

function getSystemPreference() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
  } catch {
    return false;
  }
}


/* =========================================================
   5. THEME PROVIDER
   ========================================================= */

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultLanguage = 'en',
}) {

  /* -----------------------------------------
     Theme preference
     ----------------------------------------- */

  const [themePreference, setThemePreference] = useState(() => {
    return isValidTheme(defaultTheme)
      ? defaultTheme
      : readStoredTheme();
  });


  /* -----------------------------------------
     System preference
     ----------------------------------------- */

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    getSystemPreference,
  );


  /* -----------------------------------------
     Language
     ----------------------------------------- */

  const [language, setLanguageState] = useState(() => {
    return isValidLanguage(defaultLanguage)
      ? defaultLanguage
      : readStoredLanguage();
  });


  /* =====================================================
     6. RESOLVE ACTIVE THEME
     ===================================================== */

  const mode = useMemo(() => {
    if (themePreference === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }

    return themePreference;
  }, [themePreference, systemPrefersDark]);


  const isDark = mode === 'dark';
  const isLight = mode === 'light';


  /* =====================================================
     7. ACTIVE COLOR PALETTE
     ===================================================== */

  const activeColors = useMemo(() => {
    return isDark ? darkColors : lightColors;
  }, [isDark]);


  /* =====================================================
     8. APPLY THEME AND LANGUAGE TO DOCUMENT
     ===================================================== */

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    root.setAttribute('data-theme', mode);
    root.setAttribute('lang', language);

    // Both supported languages use left-to-right direction.
    root.setAttribute('dir', 'ltr');

    // Helps browsers render native controls appropriately.
    root.style.colorScheme = mode;

    document.body?.setAttribute('data-lang', language);

  }, [mode, language]);


  /* =====================================================
     9. PERSIST THEME PREFERENCE
     ===================================================== */

  useEffect(() => {
    saveToStorage(STORAGE_KEY, themePreference);
  }, [themePreference]);


  /* =====================================================
     10. PERSIST LANGUAGE
     ===================================================== */

  useEffect(() => {
    saveToStorage(LANG_STORAGE_KEY, language);
  }, [language]);


  /* =====================================================
     11. LISTEN TO SYSTEM THEME CHANGES
     ===================================================== */

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    let mediaQuery;

    try {
      mediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );
    } catch {
      return undefined;
    }

    const handleChange = (event) => {
      setSystemPrefersDark(event.matches);
    };

    // Modern browser API.
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener(
          'change',
          handleChange,
        );
      };
    }

    // Older browser fallback.
    mediaQuery.addListener?.(handleChange);

    return () => {
      mediaQuery.removeListener?.(handleChange);
    };

  }, []);


  /* =====================================================
     12. SET THEME
     ===================================================== */

  const setMode = useCallback((nextMode) => {
    if (!isValidTheme(nextMode)) {
      console.warn(
        `Invalid AgroLink theme: ${nextMode}`,
      );

      return;
    }

    setThemePreference(nextMode);

  }, []);


  /* =====================================================
     13. TOGGLE LIGHT / DARK
     ===================================================== */

  const toggleMode = useCallback(() => {
    setThemePreference((previous) => {
      const currentMode =
        previous === 'system'
          ? getSystemPreference() ? 'dark' : 'light'
          : previous;

      return currentMode === 'dark'
        ? 'light'
        : 'dark';
    });
  }, []);


  /* =====================================================
     14. SET LANGUAGE
     ===================================================== */

  const setLanguage = useCallback((nextLanguage) => {
    if (!isValidLanguage(nextLanguage)) {
      console.warn(
        `Unsupported AgroLink language: ${nextLanguage}`,
      );

      return;
    }

    setLanguageState(nextLanguage);

  }, []);


  /* =====================================================
     15. CONTEXT VALUE
     ===================================================== */

  const value = useMemo(() => ({

    /* Theme state */

    mode,
    themePreference,

    isDark,
    isLight,

    /* Color palette */

    colors: activeColors,
    activeColors,

    /* Language state */

    language,

    isAmharic: language === 'am',
    isEnglish: language === 'en',

    direction: 'ltr',

    /* Actions */

    setMode,
    toggleMode,
    setLanguage,

  }), [
    mode,
    themePreference,
    isDark,
    isLight,
    activeColors,
    language,
    setMode,
    toggleMode,
    setLanguage,
  ]);


  /* =====================================================
     16. PROVIDER
     ===================================================== */

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}


/* =========================================================
   17. USE THEME HOOK
   ========================================================= */

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside <ThemeProvider>',
    );
  }

  return context;
}


export default ThemeProvider;
