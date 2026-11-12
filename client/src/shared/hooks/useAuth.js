// client/src/shared/hooks/useAuth.js
// Global auth state (zustand) + service bridge + socket lifecycle.
// SRS refs: §5.1 FR-AUTH-004..011, §14.1 authentication.

import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';
import { websocketService } from '../services/websocketService';

const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
};

const useAuthStore = create((set, get) => ({
  user: null,
  status: AUTH_STATUS.IDLE,
  error: null,
  isSigningIn: false,
  isSigningUp: false,
  isVerifying: false,
  isRequestingReset: false,
  isResettingPassword: false,

  setUser: (user) => {
    set({ user, status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED, error: null });
    if (user) websocketService.connect();
    else websocketService.disconnect();
  },

  clear: () => {
    set({ user: null, status: AUTH_STATUS.UNAUTHENTICATED, error: null });
    websocketService.disconnect();
  },

  signIn: async ({ identifier, password }) => {
    set({ isSigningIn: true, error: null });
    try {
      const { user } = await authService.login({ identifier, password });
      get().setUser(user);
      return { user };
    } catch (err) {
      set({ error: { message: err.message, code: err.code } });
      throw err;
    } finally {
      set({ isSigningIn: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true, error: null });
    try {
      const { user } = await authService.register(data);
      get().setUser(user);
      return { user };
    } catch (err) {
      set({ error: { message: err.message, code: err.code } });
      throw err;
    } finally {
      set({ isSigningUp: false });
    }
  },

  signOut: async () => {
    await authService.logout();
    get().clear();
  },

  refreshMe: async () => {
    set({ status: AUTH_STATUS.LOADING });
    try {
      const { user } = await authService.me();
      get().setUser(user);
      return user;
    } catch {
      get().clear();
      return null;
    }
  },

  verifyOtp: async (payload) => {
    set({ isVerifying: true, error: null });
    try {
      const { user } = await authService.verifyOtp(payload);
      get().setUser(user);
      return { user };
    } catch (err) {
      set({ error: { message: err.message, code: err.code } });
      throw err;
    } finally {
      set({ isVerifying: false });
    }
  },

  resendOtp: async (payload) => authService.resendOtp(payload),

  requestPasswordReset: async (payload) => {
    set({ isRequestingReset: true, error: null });
    try {
      return await authService.requestPasswordReset(payload);
    } catch (err) {
      set({ error: { message: err.message, code: err.code } });
      throw err;
    } finally {
      set({ isRequestingReset: false });
    }
  },

  resetPassword: async (payload) => {
    set({ isResettingPassword: true, error: null });
    try {
      return await authService.resetPassword(payload);
    } catch (err) {
      set({ error: { message: err.message, code: err.code } });
      throw err;
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));

// Wire session expiry → store reset
apiClient.setUnauthorizedHandler(() => {
  useAuthStore.getState().clear();
});

/**
 * Public hook. Components use this — never touch the store directly.
 */
export function useAuth() {
  const store = useAuthStore();
  return {
    user: store.user,
    status: store.status,
    isBootstrapping:
      store.status === AUTH_STATUS.IDLE || store.status === AUTH_STATUS.LOADING,
    error: store.error,
    isAuthenticated: store.status === AUTH_STATUS.AUTHENTICATED,
    isSigningIn: store.isSigningIn,
    isSigningUp: store.isSigningUp,
    isVerifying: store.isVerifying,
    isRequestingReset: store.isRequestingReset,
    isResettingPassword: store.isResettingPassword,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    refreshMe: store.refreshMe,
    verifyOtp: store.verifyOtp,
    resendOtp: store.resendOtp,
    requestPasswordReset: store.requestPasswordReset,
    resetPassword: store.resetPassword,
  };
}

export function AuthProvider({ children }) {
  const started = useRef(false);
  const refreshMe = useAuth().refreshMe;

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void refreshMe();
  }, [refreshMe]);

  return children;
}

export { AUTH_STATUS };