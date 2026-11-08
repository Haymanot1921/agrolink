// mobile/src/shared/styles/useTheme.ts
// The primary hook — every screen and component uses this.
// Also exposes convenience helpers for actor accents and text.

import { useMemo } from 'react';
import { useThemeContext } from './ThemeProvider';
import type { Theme, ThemeMode } from './theme';

export interface UseThemeResult {
  /** Full theme object. */
  theme: Theme;
  /** Colors sub-object (shortcut). */
  colors: Theme['colors'];
  /** Spacing shortcut. */
  spacing: Theme['spacing'];
  /** Typography shortcut. */
  typography: Theme['typography'];
  /** Shadows shortcut. */
  shadows: Theme['shadows'];
  /** Layout constants shortcut. */
  layout: Theme['layout'];
  /** Z-index shortcut. */
  zIndex: Theme['zIndex'];
  /** Is dark mode active? */
  isDark: boolean;
  /** Current mode. */
  mode: ThemeMode;
  /** Current actor accent. */
  actorAccent: string;
  /** Text style picker — returns a style for a named preset. */
  text: (preset: keyof Theme['typography']['textStyles']) => Theme['typography']['textStyles'][keyof Theme['typography']['textStyles']];
  /** Font family picker based on current language. */
  fontFamily: (language: 'en' | 'am', weight?: 'regular' | 'bold') => string;
  /** Toggle light/dark. */
  toggleMode: () => Promise<void>;
  /** Set explicit preference. */
  setPreference: ReturnType<typeof useThemeContext>['setPreference'];
  /** Current preference (light/dark/system). */
  preference: ReturnType<typeof useThemeContext>['preference'];
}

export function useTheme(): UseThemeResult {
  const ctx = useThemeContext();
  const { theme, mode, isDark, toggleMode, setPreference, preference } = ctx;

  return useMemo<UseThemeResult>(
    () => ({
      theme,
      colors: theme.colors,
      spacing: theme.spacing,
      typography: theme.typography,
      shadows: theme.shadows,
      layout: theme.layout,
      zIndex: theme.zIndex,
      isDark,
      mode,
      actorAccent: theme.actorAccent,
      text: (preset) => theme.typography.textStyles[preset],
      fontFamily: (language, weight = 'regular') =>
        theme.typography.pickFontFamily(language, weight),
      toggleMode,
      setPreference,
      preference,
    }),
    [theme, mode, isDark, toggleMode, setPreference, preference],
  );
}

// ─────────────────────────────────────────────────────────────
// Convenience hooks — small projections of useTheme
// ─────────────────────────────────────────────────────────────

/** Only colors — useful in components that don't need spacing. */
export function useColors(): Theme['colors'] {
  return useThemeContext().theme.colors;
}

/** Only spacing. */
export function useSpacing(): Theme['spacing'] {
  return useThemeContext().theme.spacing;
}

/** Only typography. */
export function useTypography(): Theme['typography'] {
  return useThemeContext().theme.typography;
}

/** Only shadows. */
export function useShadows(): Theme['shadows'] {
  return useThemeContext().theme.shadows;
}

/** Only actor accent color. */
export function useActorAccent(): string {
  return useThemeContext().theme.actorAccent;
}

/** True if dark mode is active. */
export function useIsDark(): boolean {
  return useThemeContext().theme.isDark;
}