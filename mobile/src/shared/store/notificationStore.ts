// mobile/src/shared/store/notificationStore.ts
// In-app notification cache — for the notification bell + list.
// Server state is fetched via React Query; this store holds:
//   - Unread count (from socket / push)
//   - Recent in-app notifications (optimistic)
//   - Mark-read state
//
// SRS refs: §5.12 FR-NOTIFY-001..010, FR-NOTIFY-007 (in-app).

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationType, NotificationCategory } from '@constants/notificationTypes';

export interface AppNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  relatedType?: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  /** Set when the notification was received via push while app was open. */
  receivedInApp?: boolean;
}

interface NotificationState {
  items: AppNotification[];
  unreadCount: number;
  /** Has loaded at least once. */
  hasLoaded: boolean;
}

interface NotificationActions {
  /** Append a new notification (socket or push). */
  add: (n: AppNotification) => void;
  /** Replace the full list (from initial fetch). */
  setAll: (items: AppNotification[]) => void;
  /** Mark one as read. */
  markRead: (id: string) => void;
  /** Mark all as read. */
  markAllRead: () => void;
  /** Remove one. */
  remove: (id: string) => void;
  /** Clear all (used on logout). */
  clear: () => void;
  /** Recompute unread count after any list change. */
  refreshUnread: () => void;
}

function computeUnread(items: AppNotification[]): number {
  return items.filter((n) => !n.isRead).length;
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  persist(
    (set, get) => ({
      items: [],
      unreadCount: 0,
      hasLoaded: false,

      add: (notification) =>
        set((state) => {
          // Prevent duplicates by id
          if (state.items.some((n) => n.id === notification.id)) return state;
          const items = [notification, ...state.items].slice(0, 200);
          return {
            items,
            unreadCount: computeUnread(items),
          };
        }),

      setAll: (items) =>
        set({
          items,
          unreadCount: computeUnread(items),
          hasLoaded: true,
        }),

      markRead: (id) =>
        set((state) => {
          const items = state.items.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          );
          return { items, unreadCount: computeUnread(items) };
        }),

      markAllRead: () =>
        set((state) => {
          const items = state.items.map((n) => ({ ...n, isRead: true }));
          return { items, unreadCount: 0 };
        }),

      remove: (id) =>
        set((state) => {
          const items = state.items.filter((n) => n.id !== id);
          return { items, unreadCount: computeUnread(items) };
        }),

      clear: () => set({ items: [], unreadCount: 0, hasLoaded: false }),

      refreshUnread: () => {
        const items = get().items;
        set({ unreadCount: computeUnread(items) });
      },
    }),
    {
      name: '@agrolink/notification-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        unreadCount: state.unreadCount,
      }),
    },
  ),
);