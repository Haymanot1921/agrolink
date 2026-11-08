// mobile/src/shared/store/productDraftStore.ts
// Auto-save draft for "Add Product" / "Add Input" forms.
// Prevents data loss when the user backgrounds the app or navigates away.
//
// SRS refs: FR-MARKET-002 (required fields), §11.7 (mobile UX).

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProductDraftKind = 'farmer_product' | 'input_product';

export interface LocalImageDraft {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ProductDraft {
  kind: ProductDraftKind;
  name: string;
  nameAm?: string;
  description: string;
  descriptionAm?: string;
  categoryId: number | null;
  inputType?: string;
  quantity: string;
  unit: string;
  price: string;
  locationRegion: string;
  locationZone?: string;
  locationWoreda?: string;
  latitude?: number;
  longitude?: number;
  images: LocalImageDraft[];
  specifications?: Record<string, string>;
  lastEditedAt: number;
}

interface ProductDraftState {
  draft: ProductDraft | null;
}

interface ProductDraftActions {
  startDraft: (kind: ProductDraftKind) => void;
  patch: (patch: Partial<ProductDraft>) => void;
  setImages: (images: LocalImageDraft[]) => void;
  clearDraft: () => void;
  getDraft: () => ProductDraft | null;
}

const emptyDraft = (kind: ProductDraftKind): ProductDraft => ({
  kind,
  name: '',
  description: '',
  categoryId: null,
  quantity: '',
  unit: 'kg',
  price: '',
  locationRegion: '',
  images: [],
  lastEditedAt: Date.now(),
});

export const useProductDraftStore = create<ProductDraftState & ProductDraftActions>()(
  persist(
    (set, get) => ({
      draft: null,

      startDraft: (kind) => set({ draft: emptyDraft(kind) }),

      patch: (patch) =>
        set((state) => ({
          draft: state.draft
            ? { ...state.draft, ...patch, lastEditedAt: Date.now() }
            : null,
        })),

      setImages: (images) =>
        set((state) => ({
          draft: state.draft
            ? { ...state.draft, images, lastEditedAt: Date.now() }
            : null,
        })),

      clearDraft: () => set({ draft: null }),

      getDraft: () => get().draft,
    }),
    {
      name: '@agrolink/product-draft-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Drafts expire after 7 days
      partialize: (state) => {
        if (!state.draft) return { draft: null };
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - state.draft.lastEditedAt > SEVEN_DAYS_MS) {
          return { draft: null };
        }
        return { draft: state.draft };
      },
    },
  ),
);