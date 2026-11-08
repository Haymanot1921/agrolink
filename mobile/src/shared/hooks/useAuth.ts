// mobile/src/shared/hooks/useAuth.ts
// Global authentication provider — session, user, role, provider_type, login/register/logout.
// SRS refs: §5.1, §4.1 (5 actors), §4.1.3 (2 provider types), FR-AUTH-001..015.
//
// Exports:
//   - AuthProvider (wrap the app)
//   - useAuth() hook (read state + call actions)

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';

import { authService } from '@services/authService';
import { secureStore } from '@services/secureStore';
import { resetTo } from '@app/navigationRef';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type UserRole =
  | 'farmer'
  | 'buyer'
  | 'service_provider'
  | 'support_agent'
  | 'administrator';

export type ProviderType = 'input_supplier' | 'agricultural_expert';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  providerType?: ProviderType;
  accountStatus: 'pending_verification' | 'active' | 'suspended' | 'deleted';
  emailVerified: boolean;
  phoneVerified: boolean;
  preferredLanguage: 'en' | 'am';
  permissions: string[];
  avatarUrl?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isBootstrapping: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isRequestingReset: boolean;
  isVerifying: boolean;
  isResettingPassword: boolean;
  error: { message: string; code?: string } | null;
}

type Action =
  | { type: 'BOOTSTRAP_START' }
  | { type: 'BOOTSTRAP_SUCCESS'; user: AuthUser | null }
  | { type: 'LOGIN_START' }
  | { type: 'SIGNUP_START' }
  | { type: 'REQUEST_RESET_START' }
  | { type: 'VERIFY_START' }
  | { type: 'RESET_PASSWORD_START' }
  | { type: 'AUTH_SUCCESS'; user: AuthUser }
  | { type: 'AUTH_FAILURE'; error: { message: string; code?: string } }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; patch: Partial<AuthUser> };

const initialState: AuthState = {
  user: null,
  isBootstrapping: true,
  isSigningIn: false,
  isSigningUp: false,
  isRequestingReset: false,
  isVerifying: false,
  isResettingPassword: false,
  error: null,
};

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'BOOTSTRAP_START':
      return { ...state, isBootstrapping: true };
    case 'BOOTSTRAP_SUCCESS':
      return { ...state, isBootstrapping: false, user: action.user };
    case 'LOGIN_START':
      return { ...state, isSigningIn: true, error: null };
    case 'SIGNUP_START':
      return { ...state, isSigningUp: true, error: null };
    case 'REQUEST_RESET_START':
      return { ...state, isRequestingReset: true, error: null };
    case 'VERIFY_START':
      return { ...state, isVerifying: true, error: null };
    case 'RESET_PASSWORD_START':
      return { ...state, isResettingPassword: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.user,
        isBootstrapping: false,
        isSigningIn: false,
        isSigningUp: false,
        isRequestingReset: false,
        isVerifying: false,
        isResettingPassword: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isSigningIn: false,
        isSigningUp: false,
        isRequestingReset: false,
        isVerifying: false,
        isResettingPassword: false,
        error: action.error,
      };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, isBootstrapping: false };
    case 'UPDATE_USER':
      return state.user
        ? { ...state, user: { ...state.user, ...action.patch } }
        : state;
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

export interface AuthContextValue extends AuthState {
  signIn: (input: { identifier: string; password: string }) => Promise<void>;
  signUp: (input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    providerType?: ProviderType;
  }) => Promise<void>;
  verifyOtp: (input: {
    identifier: string;
    code: string;
    purpose: 'registration' | 'reset';
  }) => Promise<void>;
  resendOtp: (input: { identifier: string; purpose: 'registration' | 'reset' }) => Promise<void>;
  requestPasswordReset: (input: { identifier: string }) => Promise<void>;
  resetPassword: (input: { token: string; newPassword: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Bootstrap on mount — restore session from secure storage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      dispatch({ type: 'BOOTSTRAP_START' });
      try {
        const session = await secureStore.getSession();
        if (session?.user && !cancelled) {
          dispatch({ type: 'BOOTSTRAP_SUCCESS', user: session.user });
        } else if (!cancelled) {
          dispatch({ type: 'BOOTSTRAP_SUCCESS', user: null });
        }
      } catch {
        if (!cancelled) dispatch({ type: 'BOOTSTRAP_SUCCESS', user: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(
    async ({ identifier, password }: { identifier: string; password: string }) => {
      dispatch({ type: 'LOGIN_START' });
      try {
        const { user, tokens } = await authService.signIn({ identifier, password });
        await secureStore.setSession({ user, tokens });
        dispatch({ type: 'AUTH_SUCCESS', user });
      } catch (e) {
        dispatch({
          type: 'AUTH_FAILURE',
          error: { message: (e as Error).message, code: (e as { code?: string }).code },
        });
        throw e;
      }
    },
    [],
  );

  const signUp = useCallback(
    async (input: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
      role: UserRole;
      providerType?: ProviderType;
    }) => {
      dispatch({ type: 'SIGNUP_START' });
      try {
        const { user, tokens } = await authService.signUp(input);
        await secureStore.setSession({ user, tokens });
        dispatch({ type: 'AUTH_SUCCESS', user });
      } catch (e) {
        dispatch({
          type: 'AUTH_FAILURE',
          error: { message: (e as Error).message, code: (e as { code?: string }).code },
        });
        throw e;
      }
    },
    [],
  );

  const verifyOtp = useCallback(
    async (input: { identifier: string; code: string; purpose: 'registration' | 'reset' }) => {
      dispatch({ type: 'VERIFY_START' });
      try {
        const { user, tokens } = await authService.verifyOtp(input);
        if (input.purpose === 'registration') {
          await secureStore.setSession({ user, tokens });
          dispatch({ type: 'AUTH_SUCCESS', user });
        } else {
          dispatch({ type: 'AUTH_SUCCESS', user: { ...state.user!, ...user } });
        }
      } catch (e) {
        dispatch({
          type: 'AUTH_FAILURE',
          error: { message: (e as Error).message, code: (e as { code?: string }).code },
        });
        throw e;
      }
    },
    [state.user],
  );

  const resendOtp = useCallback(
    async (input: { identifier: string; purpose: 'registration' | 'reset' }) => {
      await authService.resendOtp(input);
    },
    [],
  );

  const requestPasswordReset = useCallback(async (input: { identifier: string }) => {
    dispatch({ type: 'REQUEST_RESET_START' });
    try {
      await authService.requestPasswordReset(input);
    } catch (e) {
      dispatch({
        type: 'AUTH_FAILURE',
        error: { message: (e as Error).message, code: (e as { code?: string }).code },
      });
      throw e;
    }
  }, []);

  const resetPassword = useCallback(
    async (input: { token: string; newPassword: string }) => {
      dispatch({ type: 'RESET_PASSWORD_START' });
      try {
        await authService.resetPassword(input);
      } catch (e) {
        dispatch({
          type: 'AUTH_FAILURE',
          error: { message: (e as Error).message, code: (e as { code?: string }).code },
        });
        throw e;
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    await authService.signOut().catch(() => {});
    await secureStore.clearSession();
    dispatch({ type: 'LOGOUT' });
    resetTo('Auth');
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    dispatch({ type: 'UPDATE_USER', patch });
  }, []);

  const clearError = useCallback(() => dispatch({ type: 'AUTH_CLEAR_ERROR' }), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signUp,
      verifyOtp,
      resendOtp,
      requestPasswordReset,
      resetPassword,
      signOut,
      updateUser,
      clearError,
    }),
    [
      state,
      signIn,
      signUp,
      verifyOtp,
      resendOtp,
      requestPasswordReset,
      resetPassword,
      signOut,
      updateUser,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}