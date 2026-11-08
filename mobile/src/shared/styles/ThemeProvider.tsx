// mobile/src/shared/styles/ThemeProvider.tsx
// App-wide theme state — light/dark/system + actor accent + persistence.
//
// Behavior:
//   1. Reads theme preference from AsyncStorage on mount
//   2. Defaults to system preference (via useColorScheme)
//   3. Picks up the current user's actor accent from useAuth
//   4. Persists user's manual selection
//
// SRS refs: §11.8 (consistent design), FR-ACCESS-006 (EN + AM), NFR-USE-007.

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '@hooks/useAuth';
import {
  buildTheme,
  actorAccentFor,
  type Theme,
  type ThemeMode,
  type ActorAccent,
} from './theme';

const THEME_MODE_KEY = '@agrolink/theme-mode';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => Promise<void>;
  toggleMode: () => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }): React.ReactElement {
  const systemScheme = useColorScheme();
  const { user } = useAuth();

  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isReady, setIsReady] = useState(false);

  // Load persisted preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      } catch {
        // fall through with default
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // Resolve actual mode
  const resolvedMode: ThemeMode = useMemo(() => {
    if (preference === 'light') return 'light';
    if (preference === 'dark') return 'dark';
    return systemScheme === 'dark' ? 'dark' : 'light';
  }, [preference, systemScheme]);

  // Resolve actor accent
  const actorAccent: ActorAccent | null = useMemo(
    () => actorAccentFor(user?.role, user?.providerType),
    [user?.role, user?.providerType],
  );

  // Build theme
  const theme = useMemo(
    () => buildTheme(resolvedMode, actorAccent),
    [resolvedMode, actorAccent],
  );

  const setPreference = useCallback(async (pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, pref);
    } catch {
      // ignore
    }
  }, []);

  const toggleMode = useCallback(async () => {
    const next: ThemePreference = resolvedMode === 'light' ? 'dark' : 'light';
    await setPreference(next);
  }, [resolvedMode, setPreference]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      mode: resolvedMode,
      preference,
      setPreference,
      toggleMode,
      isReady,
    }),
    [theme, resolvedMode, preference, setPreference, toggleMode, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Direct access to the context — prefer useTheme() in most code. */
export function useThemeContext(): ThemeContextValue {
  // Import is deferred to avoid circular import
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used inside ThemeProvider');
  }
  return ctx;
}

// Re-export context for useTheme
export { ThemeContext };