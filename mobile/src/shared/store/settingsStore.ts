// mobile/src/shared/store/settingsStore.ts
// Persisted user settings — language, theme preference, notification preferences.
//
// SRS refs: FR-ACCESS-006 (EN + AM), §11.8 (consistent UX).

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'am';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface NotificationPreferences {
  // Channels
  inAppEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  // Categories (all default true)
  ordersEnabled: boolean;
  messagesEnabled: boolean;
  consultationsEnabled: boolean;
  supportEnabled: boolean;
  accountEnabled: boolean;
}

interface SettingsState {
  language: Language;
  themePreference: ThemePreference;
  notifications: NotificationPreferences;
  // UI
  hasSeenOnboarding: boolean;
  biometricLoginEnabled: boolean;
}

interface SettingsActions {
  setLanguage: (lang: Language) => void;
  setThemePreference: (pref: ThemePreference) => void;
  setNotificationPreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K],
  ) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  setBiometricLoginEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  inAppEnabled: true,
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  ordersEnabled: true,
  messagesEnabled: true,
  consultationsEnabled: true,
  supportEnabled: true,
  accountEnabled: true,
};

const initialState: SettingsState = {
  language: 'en',
  themePreference: 'system',
  notifications: DEFAULT_NOTIFICATIONS,
  hasSeenOnboarding: false,
  biometricLoginEnabled: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...initialState,

      setLanguage: (language) => set({ language }),

      setThemePreference: (themePreference) => set({ themePreference }),

      setNotificationPreference: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),

      setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),

      setBiometricLoginEnabled: (biometricLoginEnabled) =>
        set({ biometricLoginEnabled }),

      reset: () =>
        set({
          ...initialState,
          // Preserve onboarding-seen flag so the user doesn't have to re-watch
          hasSeenOnboarding: true,
        }),
    }),
    {
      name: '@agrolink/settings-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);