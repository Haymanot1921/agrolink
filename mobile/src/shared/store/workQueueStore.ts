// mobile/src/shared/store/workQueueStore.ts
// Support Agent work queue — the tickets/requests currently being handled.
// This is UI state (filters, active tab), not the source-of-truth data
// (which comes from React Query).
//
// SRS refs: §4.1.4 (Support Agent), §5.13 FR-SUPPORT-001..009.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TicketStatus, TicketPriority } from '@constants/ticketStatuses';

export type WorkQueueTab = 'assigned' | 'unassigned' | 'escalated' | 'closed';

export interface WorkQueueFilters {
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  category: string | 'all';
  searchQuery: string;
}

interface WorkQueueState {
  activeTab: WorkQueueTab;
  filters: WorkQueueFilters;
  /** Whether the agent is currently on a "do not disturb" mode. */
  doNotDisturb: boolean;
}

interface WorkQueueActions {
  setActiveTab: (tab: WorkQueueTab) => void;
  setFilters: (patch: Partial<WorkQueueFilters>) => void;
  resetFilters: () => void;
  setDoNotDisturb: (on: boolean) => void;
  reset: () => void;
}

const DEFAULT_FILTERS: WorkQueueFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  searchQuery: '',
};

const initialState: WorkQueueState = {
  activeTab: 'assigned',
  filters: DEFAULT_FILTERS,
  doNotDisturb: false,
};

export const useWorkQueueStore = create<WorkQueueState & WorkQueueActions>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveTab: (activeTab) => set({ activeTab }),

      setFilters: (patch) =>
        set((state) => ({ filters: { ...state.filters, ...patch } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      setDoNotDisturb: (doNotDisturb) => set({ doNotDisturb }),

      reset: () => set(initialState),
    }),
    {
      name: '@agrolink/work-queue-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeTab: state.activeTab,
        doNotDisturb: state.doNotDisturb,
      }),
    },
  ),
);