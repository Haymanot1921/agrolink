// mobile/src/shared/store/cartStore.ts
// Buyer cart — item list, quantities, totals.
// SRS refs: §5.7 FR-ORDER-001..002, FR-ORDER-010 (no overselling).
//
// ⚠️ Prices are mirrored from the server, but the backend recomputes
//    totals on checkout. Client amounts are display-only.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  /** Composite: `${productType}:${productId}`. */
  key: string;
  productType: 'farmer_product' | 'input_product';
  productId: string;
  productName: string;
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
  /** Snapshot of price at add time (server recomputes on checkout). */
  unitPriceEtb: number;
  unit: string;
  quantity: number;
  /** Server-provided availability cap (FR-ORDER-010). */
  maxQuantity: number;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
}

interface CartActions {
  add: (item: Omit<CartItem, 'key' | 'addedAt'>) => void;
  updateQuantity: (key: string, quantity: number) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** Selectors (functional). */
  getSubtotal: () => number;
  getItemCount: () => number;
  getItem: (key: string) => CartItem | undefined;
}

function makeKey(productType: string, productId: string): string {
  return `${productType}:${productId}`;
}

function clampQuantity(qty: number, max: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(Math.floor(qty), max));
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const key = makeKey(item.productType, item.productId);
        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            const nextQty = clampQuantity(existing.quantity + item.quantity, existing.maxQuantity);
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: nextQty } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                key,
                quantity: clampQuantity(item.quantity, item.maxQuantity),
                addedAt: Date.now(),
              },
            ],
          };
        });
      },

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: clampQuantity(quantity, i.maxQuantity) } : i,
          ),
        })),

      increment: (key) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: clampQuantity(i.quantity + 1, i.maxQuantity) } : i,
          ),
        })),

      decrement: (key) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: clampQuantity(i.quantity - 1, i.maxQuantity) } : i,
          ),
        })),

      remove: (key) =>
        set((state) => ({
          items: state.items.filter((i) => i.key !== key),
        })),

      clear: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPriceEtb * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getItem: (key) => get().items.find((i) => i.key === key),
    }),
    {
      name: '@agrolink/cart-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);