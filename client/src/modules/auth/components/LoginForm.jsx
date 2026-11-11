// client/src/modules/auth/components/LoginForm.jsx
// Reusable login form — used by /auth/login and modal flows.
// SRS refs: §5.1, FR-AUTH-004.

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLogin } from '../hooks/useLogin';

export function LoginForm({ onSuccess, showForgotLink = true }) {
  const { t } = useTranslation('auth');
  const { values, fieldErrors, submitError, isSubmitting, setField, submit } = useLogin({
    onSuccess,
  });

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {submitError && (
        <div
          role="alert"
          style={{ padding: 12, background: '#FEF2F2', color: '#991B1B', borderRadius: 8, fontSize: 14 }}
        >
          {submitError}
        </div>
      )}

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{t('login.emailOrPhone')}</span>
        <input
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          value={values.identifier}
          onChange={(e) => setField('identifier', e.target.value)}
          placeholder={t('login.emailOrPhonePlaceholder')}
          aria-invalid={Boolean(fieldErrors.identifier)}
          style={inputStyle(fieldErrors.identifier)}
        />
        {fieldErrors.identifier && <span style={errorStyle}>{fieldErrors.identifier}</span>}
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{t('login.password')}</span>
        <input
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => setField('password', e.target.value)}
          placeholder={t('login.passwordPlaceholder')}
          aria-invalid={Boolean(fieldErrors.password)}
          style={inputStyle(fieldErrors.password)}
        />
        {fieldErrors.password && <span style={errorStyle}>{fieldErrors.password}</span>}
      </label>

      {showForgotLink && (
        <div style={{ textAlign: 'right', marginTop: -8 }}>
          <Link
            to="/auth/forgot-password"
            style={{ fontSize: 13, color: 'var(--color-primary, #2E7D32)', fontWeight: 600 }}
          >
            {t('login.forgotPassword')}
          </Link>
        </div>
      )}

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
        {isSubmitting ? t('login.loggingIn') : t('login.submit')}
      </button>
    </form>
  );
}

function inputStyle(hasError) {
  return {
    padding: 12,
    border: `1px solid ${hasError ? '#DC2626' : 'var(--color-border, #E0E0E0)'}`,
    borderRadius: 8,
    fontSize: 15,
  };
}

const errorStyle = { fontSize: 12, color: '#DC2626' };