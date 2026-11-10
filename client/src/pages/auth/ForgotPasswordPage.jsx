// client/src/pages/auth/ForgotPasswordPage.jsx
// Password reset — step 1: request code.
// SRS refs: §5.1, FR-AUTH-007.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';

export function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
  const { requestPasswordReset, isRequestingReset, error } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!identifier) {
      setLocalError(tc('validation.required', { field: t('forgotPassword.emailOrPhone') }));
      return;
    }
    try {
      await requestPasswordReset({ identifier });
      setSent(true);
    } catch {
      // error surfaces via useAuth
    }
  };

  const err = localError ?? error?.message;

  if (sent) {
    return (
      <>
        <Helmet>
          <title>{t('forgotPassword.title')}</title>
        </Helmet>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
            {t('otp.title')}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', marginBottom: 24 }}>
            {t('otp.subtitle', { identifier })}
          </p>
          <Link
            to="/auth/reset-password"
            state={{ identifier }}
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: 'var(--color-primary, #2E7D32)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {t('otp.submit')}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('forgotPassword.title')}</title>
      </Helmet>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
          {t('forgotPassword.title')}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('forgotPassword.subtitle')}
        </p>
      </header>

      {err && (
        <div role="alert" style={{ padding: 12, background: '#FEF2F2', color: '#991B1B', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('forgotPassword.emailOrPhone')}</span>
          <input
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={t('login.emailOrPhonePlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <button
          type="submit"
          disabled={isRequestingReset}
          style={{
            padding: 14,
            background: 'var(--color-primary, #2E7D32)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: isRequestingReset ? 'wait' : 'pointer',
            opacity: isRequestingReset ? 0.7 : 1,
          }}
        >
          {isRequestingReset ? t('forgotPassword.sending') : t('forgotPassword.submit')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/auth/login" style={{ fontSize: 14, color: 'var(--color-primary, #2E7D32)' }}>
          ← {t('forgotPassword.backToLogin')}
        </Link>
      </p>
    </>
  );
}