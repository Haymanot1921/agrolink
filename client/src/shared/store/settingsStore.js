// client/src/shared/store/settingsStore.js
// User preferences — language, theme, notification channels, table density.
// Persists via localStorage middleware. SRS refs: NFR-ACCESS-006, FR-ACCESS-006.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Language + theme
      language: 'en', // 'en' | 'am'
      theme: 'light', // 'light' | 'dark' | 'system'

      // Notification preferences (mirrored server-side too)
      notifications: {
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },

      // Table density
      density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'

      // Per-module UI state (collapsed sidebars, dismissed banners)
      ui: {
        sidebarCollapsed: false,
        dismissedBanners: [], // array of banner IDs
      },

      // Saved filters (per module)
      savedFilters: {}, // { [moduleKey]: {...} }

      // ───── Mutators ─────
      setLanguage: (language) => {
        if (!['en', 'am'].includes(language)) return;
        set({ language });
      },

      setTheme: (theme) => {
        if (!['light', 'dark', 'system'].includes(theme)) return;
        set({ theme });
      },

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      setNotification: (channel, enabled) =>
        set((s) => ({
          notifications: { ...s.notifications, [channel]: Boolean(enabled) },
        })),

      setDensity: (density) => {
        if (!['compact', 'comfortable', 'spacious'].includes(density)) return;
        set({ density });
      },

      setSidebarCollapsed: (collapsed) =>
        set((s) => ({ ui: { ...s.ui, sidebarCollapsed: Boolean(collapsed) } })),

      dismissBanner: (id) =>
        set((s) => {
          if (s.ui.dismissedBanners.includes(id)) return s;
          return {
            ui: { ...s.ui, dismissedBanners: [...s.ui.dismissedBanners, id] },
          };
        }),

      saveFilter: (moduleKey, filters) =>
        set((s) => ({
          savedFilters: { ...s.savedFilters, [moduleKey]: filters },
        })),

      clearFilters: (moduleKey) =>
        set((s) => {
          const next = { ...s.savedFilters };
          delete next[moduleKey];
          return { savedFilters: next };
        }),

      reset: () =>
        set({
          language: 'en',
          theme: 'light',
          notifications: { email: true, sms: false, push: true, inApp: true },
          density: 'comfortable',
          ui: { sidebarCollapsed: false, dismissedBanners: [] },
          savedFilters: {},
        }),
    }),
    {
      name: 'agrolink_settings',
      version: 1,
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        notifications: state.notifications,
        density: state.density,
        ui: state.ui,
        savedFilters: state.savedFilters,
      }),
    },
  ),
);

export default useSettingsStore;