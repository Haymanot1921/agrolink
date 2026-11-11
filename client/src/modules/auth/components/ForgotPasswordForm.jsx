// client/src/modules/auth/components/ForgotPasswordForm.jsx
// Step 1 of password reset — request code.
// SRS refs: §5.1, FR-AUTH-007.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function ForgotPasswordForm({ onSubmit, isSubmitting, error, identifier, setIdentifier }) {
  const { t } = useTranslation('auth');

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {error && (
        <div
          role="alert"
          style={{ padding: 12, background: '#FEF2F2', color: '#991B1B', borderRadius: 8, fontSize: 14 }}
        >
          {error}
        </div>
      )}

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {t('forgotPassword.emailOrPhone')}
        </span>
        <input
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={t('login.emailOrPhonePlaceholder')}
          required
          style={{
            padding: 12,
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 8,
            fontSize: 15,
          }}
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: 14,
          background: 'var(--color-primary, #2E7D32)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 700,
          cursor: isSubmitting ? 'wait' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? t('forgotPassword.sending') : t('forgotPassword.submit')}
      </button>
    </form>
  );
}