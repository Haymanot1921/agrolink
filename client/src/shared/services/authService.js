// client/src/shared/services/authService.js
// Raw auth API — the only place that touches /auth/* endpoints.
// SRS refs: §5.1 FR-AUTH-001..015.

import { apiClient } from './apiClient';

export const authService = {
  /** POST /auth/login — returns { user, accessToken, refreshToken } */
  async login({ identifier, password }) {
    const res = await apiClient.post('/auth/login', { identifier, password });
    if (res?.accessToken) {
      apiClient.setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  /** POST /auth/register — returns { user, accessToken, refreshToken } */
  async register({ fullName, email, phone, password, preferredLanguage, role, providerType }) {
    const res = await apiClient.post('/auth/register', {
      fullName,
      email,
      phone,
      password,
      preferredLanguage,
      role,
      providerType,
    });
    if (res?.accessToken) {
      apiClient.setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  /** POST /auth/logout — revokes refresh token server-side. */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      /* Network failure on logout is non-fatal */
    } finally {
      apiClient.clearTokens();
    }
  },

  /** GET /auth/me — used on app boot to rehydrate. */
  async me() {
    return apiClient.get('/auth/me');
  },

  /** POST /auth/request-password-reset */
  async requestPasswordReset({ identifier }) {
    return apiClient.post('/auth/request-password-reset', { identifier });
  },

  /** POST /auth/reset-password */
  async resetPassword({ token, newPassword }) {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  /** POST /auth/otp/verify */
  async verifyOtp({ identifier, code, purpose }) {
    const res = await apiClient.post('/auth/otp/verify', { identifier, code, purpose });
    if (res?.accessToken) {
      apiClient.setTokens(res.accessToken, res.refreshToken);
    }
    return res;
  },

  /** POST /auth/otp/resend */
  async resendOtp({ identifier, purpose }) {
    return apiClient.post('/auth/otp/resend', { identifier, purpose });
  },

  /** POST /auth/check-availability — used by registration form. */
  async checkAvailability({ email, phone }) {
    return apiClient.post('/auth/check-availability', { email, phone });
  },
};

export default authService;