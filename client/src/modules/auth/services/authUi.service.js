// client/src/modules/auth/services/authUi.service.js
// Thin adapter — all real auth lives in @shared/services/authService.
// This module only handles UI-specific concerns (role → i18n key mapping).
// SRS refs: §5.1.

import { api } from '@services/apiClient';

export const authUiService = {
  /** Maps backend role name → i18n key for display. */
  roleI18nKey(role) {
    const map = {
      farmer: 'roleSelection.farmer',
      buyer: 'roleSelection.buyer',
      service_provider: 'roleSelection.serviceProvider',
      support_agent: 'roleSelection.supportAgent',
      administrator: 'roleSelection.administrator',
    };
    return map[role] ?? role;
  },

  /** Maps provider_type → i18n key for display. */
  providerTypeI18nKey(providerType) {
    const map = {
      input_supplier: 'serviceProviderType.inputSupplier',
      agricultural_expert: 'serviceProviderType.agriculturalExpert',
    };
    return map[providerType] ?? providerType;
  },

  /** Default landing path per role — used after login/OTP verify. */
  defaultRouteFor(user) {
    if (!user?.role) return '/';
    const map = {
      farmer: '/farmer',
      buyer: '/buyer',
      support_agent: '/support-agent',
      administrator: '/admin',
      service_provider:
        user.provider_type === 'input_supplier'
          ? '/input-supplier'
          : user.provider_type === 'agricultural_expert'
          ? '/expert'
          : '/',
    };
    return map[user.role] ?? '/';
  },

  /** Idempotent duplicate-account check used before registration. */
  async isEmailOrPhoneTaken({ email, phone }) {
    try {
      const { taken } = await api.post('/auth/check-availability', { email, phone });
      return taken;
    } catch {
      return { email: false, phone: false };
    }
  },
};