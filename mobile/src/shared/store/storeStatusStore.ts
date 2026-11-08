// mobile/src/shared/store/storeStatusStore.ts
// Input-supplier storefront status (open/closed) + provider work availability.
// SRS refs: §4.1.3 (Service Provider), §11.4 supplier storefront.
// ⚠️ NOT delivery/tracking — store open/closed only.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WorkAvailability = 'online' | 'offline' | 'busy';

interface StoreStatusState {
  /** Input supplier — is the storefront open? */
  storeOpen: boolean;
  /** Agricultural expert / support agent — presence */
  availability: WorkAvailability;
  /** Last change timestamp. */
  updatedAt: number | null;
}

interface StoreStatusActions {
  setStoreOpen: (open: boolean) => void;
  toggleStoreOpen: () => void;
  setAvailability: (availability: WorkAvailability) => void;
  clear: () => void;
}

export const useStoreStatusStore = create<StoreStatusState & StoreStatusActions>()(
  persist(
    (set, get) => ({
      storeOpen: true,
      availability: 'offline',
      updatedAt: null,

      setStoreOpen: (storeOpen) => set({ storeOpen, updatedAt: Date.now() }),

      toggleStoreOpen: () => set({ storeOpen: !get().storeOpen, updatedAt: Date.now() }),

      setAvailability: (availability) => set({ availability, updatedAt: Date.now() }),

      clear: () => set({ storeOpen: true, availability: 'offline', updatedAt: null }),
    }),
    {
      name: '@agrolink/store-status-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);