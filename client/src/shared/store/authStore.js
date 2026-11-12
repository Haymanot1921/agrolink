// client/src/shared/store/authStore.js
// Zustand store — low-level auth state. `useAuth` (in hooks) is the public API.
// SRS refs: §5.1 FR-AUTH, §14.1.

import { create } from 'zustand';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  error: null,
  lastRefreshAt: null,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,

  setSession: ({ user, accessToken, refreshToken }) =>
    set({
      user,
      accessToken: accessToken ?? get().accessToken,
      refreshToken: refreshToken ?? get().refreshToken,
      status: user ? 'authenticated' : 'unauthenticated',
      error: null,
      lastRefreshAt: Date.now(),
    }),

  setUser: (user) =>
    set({ user, status: user ? 'authenticated' : 'unauthenticated' }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error }),

  clear: () => set({ ...initialState, status: 'unauthenticated' }),

  /** Read a token directly — used by apiClient interceptor. */
  getAccessToken: () => get().accessToken,
  getRefreshToken: () => get().refreshToken,
}));

export default useAuthStore;