// mobile/src/shared/store/index.ts
// Central barrel for all Zustand stores.
//
// Usage:
//   import { useCartStore, useNotificationStore } from '@store';
//
// All stores are client-state only. Server state lives in React Query.

export { useAuthStore, getAuthUser, isAuthenticated } from './authStore';
export { useSettingsStore } from './settingsStore';
export type { Language, ThemePreference, NotificationPreferences } from './settingsStore';

export { useNotificationStore } from './notificationStore';
export type { AppNotification } from './notificationStore';

export { useCartStore } from './cartStore';
export type { CartItem } from './cartStore';

export { useCheckoutStore } from './checkoutStore';
export type { CheckoutAddress, CheckoutStep } from './checkoutStore';

export { useFavoritesStore } from './favoritesStore';
export type { FavoriteProduct, FavoriteFarmer } from './favoritesStore';

export { useProductDraftStore } from './productDraftStore';
export type { ProductDraft, ProductDraftKind, LocalImageDraft } from './productDraftStore';

export { useWeatherStore } from './weatherStore';

export { useStoreStatusStore } from './storeStatusStore';
export type { WorkAvailability } from './storeStatusStore';

export { useCallStore } from './callStore';
export type { ActiveCall, CallStatus } from './callStore';

export { useWorkQueueStore } from './workQueueStore';
export type { WorkQueueTab, WorkQueueFilters } from './workQueueStore';

// ─────────────────────────────────────────────────────────────
// Global reset — call on logout
// ─────────────────────────────────────────────────────────────

import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';
import { useNotificationStore } from './notificationStore';
import { useCartStore } from './cartStore';
import { useCheckoutStore } from './checkoutStore';
import { useFavoritesStore } from './favoritesStore';
import { useProductDraftStore } from './productDraftStore';
import { useWeatherStore } from './weatherStore';
import { useStoreStatusStore } from './storeStatusStore';
import { useCallStore } from './callStore';
import { useWorkQueueStore } from './workQueueStore';

/**
 * Reset all user-scoped stores (except settings which should persist).
 * Called by `useAuth.signOut()`.
 */
export function resetAllStores(): void {
  useAuthStore.getState().reset();
  useNotificationStore.getState().clear();
  useCartStore.getState().clear();
  useCheckoutStore.getState().reset();
  useFavoritesStore.getState().clear();
  useProductDraftStore.getState().clearDraft();
  useWeatherStore.getState().clear();
  useStoreStatusStore.getState().clear();
  useCallStore.getState().reset();
  useWorkQueueStore.getState().reset();
  // NOTE: settingsStore intentionally not reset — preserves language/theme
  // preferences across sessions and after logout, per UX best practice.
}