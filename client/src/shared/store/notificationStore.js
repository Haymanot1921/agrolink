// client/src/shared/store/notificationStore.js
// In-memory + persisted notifications list. Backed by React Query fetches.
// SRS refs: FR-NOTIFY-001..010.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_CACHE = 100;

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ id, type, title, body, isRead, createdAt, relatedType, relatedId }]
      unreadCount: 0,
      lastFetchedAt: null,

      /** Replace full list (called after GET /notifications). */
      setItems: (items = []) => {
        const trimmed = items.slice(0, MAX_CACHE);
        set({
          items: trimmed,
          unreadCount: trimmed.filter((n) => !n.isRead).length,
          lastFetchedAt: Date.now(),
        });
      },

      /** Prepend a realtime-delivered notification. */
      addItem: (notification) =>
        set((s) => {
          const exists = s.items.some((n) => n.id === notification.id);
          if (exists) return s;
          const items = [notification, ...s.items].slice(0, MAX_CACHE);
          return {
            items,
            unreadCount: items.filter((n) => !n.isRead).length,
          };
        }),

      markRead: (id) =>
        set((s) => {
          const items = s.items.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          );
          return {
            items,
            unreadCount: items.filter((n) => !n.isRead).length,
          };
        }),

      markAllRead: () =>
        set((s) => ({
          items: s.items.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),

      removeItem: (id) =>
        set((s) => {
          const items = s.items.filter((n) => n.id !== id);
          return { items, unreadCount: items.filter((n) => !n.isRead).length };
        }),

      clear: () => set({ items: [], unreadCount: 0, lastFetchedAt: null }),

      getUnreadCount: () => get().unreadCount,
    }),
    {
      name: 'agrolink_notifications',
      version: 1,
      partialize: (state) => ({
        items: state.items.slice(0, 30), // keep last 30 in local cache
      }),
    },
  ),
);

export default useNotificationStore;