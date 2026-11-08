// mobile/src/shared/store/favoritesStore.ts
// Favorite products & farmers — client mirror.
// Server is source of truth; this store is an optimistic cache.
//
// SRS refs: §11.7 (mobile buyer convenience), not in §2.4 exclusion list.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteProduct {
  productId: string;
  productName: string;
  imageUrl?: string;
  priceEtb: number;
  unit: string;
  addedAt: number;
}

export interface FavoriteFarmer {
  farmerId: string;
  farmerName: string;
  avatarUrl?: string;
  region?: string;
  addedAt: number;
}

interface FavoritesState {
  products: FavoriteProduct[];
  farmers: FavoriteFarmer[];
}

interface FavoritesActions {
  // Products
  isFavoriteProduct: (productId: string) => boolean;
  addProduct: (product: Omit<FavoriteProduct, 'addedAt'>) => void;
  removeProduct: (productId: string) => void;
  toggleProduct: (product: Omit<FavoriteProduct, 'addedAt'>) => void;
  setProducts: (products: FavoriteProduct[]) => void;
  // Farmers
  isFavoriteFarmer: (farmerId: string) => boolean;
  addFarmer: (farmer: Omit<FavoriteFarmer, 'addedAt'>) => void;
  removeFarmer: (farmerId: string) => void;
  toggleFarmer: (farmer: Omit<FavoriteFarmer, 'addedAt'>) => void;
  setFarmers: (farmers: FavoriteFarmer[]) => void;
  // Reset
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
  persist(
    (set, get) => ({
      products: [],
      farmers: [],

      isFavoriteProduct: (productId) =>
        get().products.some((p) => p.productId === productId),

      addProduct: (product) =>
        set((state) => {
          if (state.products.some((p) => p.productId === product.productId)) return state;
          return { products: [{ ...product, addedAt: Date.now() }, ...state.products] };
        }),

      removeProduct: (productId) =>
        set((state) => ({ products: state.products.filter((p) => p.productId !== productId) })),

      toggleProduct: (product) => {
        if (get().isFavoriteProduct(product.productId)) {
          get().removeProduct(product.productId);
        } else {
          get().addProduct(product);
        }
      },

      setProducts: (products) => set({ products }),

      isFavoriteFarmer: (farmerId) =>
        get().farmers.some((f) => f.farmerId === farmerId),

      addFarmer: (farmer) =>
        set((state) => {
          if (state.farmers.some((f) => f.farmerId === farmer.farmerId)) return state;
          return { farmers: [{ ...farmer, addedAt: Date.now() }, ...state.farmers] };
        }),

      removeFarmer: (farmerId) =>
        set((state) => ({ farmers: state.farmers.filter((f) => f.farmerId !== farmerId) })),

      toggleFarmer: (farmer) => {
        if (get().isFavoriteFarmer(farmer.farmerId)) {
          get().removeFarmer(farmer.farmerId);
        } else {
          get().addFarmer(farmer);
        }
      },

      setFarmers: (farmers) => set({ farmers }),

      clear: () => set({ products: [], farmers: [] }),
    }),
    {
      name: '@agrolink/favorites-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);