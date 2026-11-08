// mobile/src/shared/services/authService.ts
// Backend auth endpoints — consumed by useAuth.
// SRS refs: §5.1, FR-AUTH-001..015, §4.1 (5 actors), §4.1.3 (2 provider types).

import { api, ApiError } from './apiClient';
import type { AuthUser, UserRole, ProviderType } from '@hooks/useAuth';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: Tokens;
}

export const authService = {
  async signIn(input: { identifier: string; password: string }): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', {
      identifier: input.identifier.trim(),
      password: input.password,
    });
  },

  async signUp(input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    providerType?: ProviderType;
  }): Promise<AuthResponse> {
    if (input.role === 'service_provider' && !input.providerType) {
      throw new ApiError('providerType is required for service providers', 400, 'INVALID_PROVIDER_TYPE');
    }
    return api.post<AuthResponse>('/auth/register', {
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      password: input.password,
      role: input.role,
      providerType: input.providerType,
    });
  },

  async verifyOtp(input: {
    identifier: string;
    code: string;
    purpose: 'registration' | 'reset';
  }): Promise<AuthResponse & { resetToken?: string }> {
    return api.post('/auth/verify-otp', input);
  },

  async resendOtp(input: {
    identifier: string;
    purpose: 'registration' | 'reset';
  }): Promise<{ success: boolean }> {
    return api.post('/auth/resend-otp', input);
  },

  async requestPasswordReset(input: { identifier: string }): Promise<{ success: boolean }> {
    return api.post('/auth/forgot-password', input);
  },

  async resetPassword(input: { token: string; newPassword: string }): Promise<{ success: boolean }> {
    return api.post('/auth/reset-password', input);
  },

  async signOut(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore — token is deleted client-side anyway
    }
  },

  async me(): Promise<AuthUser> {
    return api.get<AuthUser>('/auth/me');
  },
};