// mobile/src/shared/store/authStore.ts
// Auth *cache* store — synchronised with the AuthProvider context.
// useAuth owns the actual auth state; this store mirrors it so non-React code
// and Zustand selectors can read it synchronously.
//
// SRS refs: §5.1, FR-AUTH-001..015.

import { create } from 'zustand';
import type { AuthUser, ProviderType, UserRole } from '@hooks/useAuth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  lastUpdatedAt: number | null;
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  patchUser: (patch: Partial<AuthUser>) => void;
  reset: () => void;
  // Quick selectors (avoid function-in-selector issue)
  hasRole: (role: UserRole) => boolean;
  hasProviderType: (type: ProviderType) => boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  lastUpdatedAt: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      lastUpdatedAt: Date.now(),
    }),

  patchUser: (patch) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...patch } : null,
      lastUpdatedAt: Date.now(),
    })),

  reset: () => set(initialState),

  hasRole: (role) => get().user?.role === role,

  hasProviderType: (type) =>
    get().user?.role === 'service_provider' && get().user?.providerType === type,
}));

// ─────────────────────────────────────────────────────────────
// Non-React accessors — useful in services & guards
// ─────────────────────────────────────────────────────────────

export function getAuthUser(): AuthUser | null {
  return useAuthStore.getState().user;
}

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}