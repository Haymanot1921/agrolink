// client/src/pages/auth/LoginPage.jsx
// Login — email/phone + password.
// SRS refs: §5.1, FR-AUTH-004, FR-AUTH-010.

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { defaultRouteFor } from '@app/routeGuards';

export function LoginPage() {
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
  const { signIn, isSigningIn, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!identifier || !password) {
      setLocalError(tc('validation.required', { field: tc('labels.password') }));
      return;
    }

    try {
      const { user } = await signIn({ identifier, password });
      const redirectTo =
        location.state?.from || defaultRouteFor(user);
      navigate(redirectTo, { replace: true });
    } catch {
      // error surfaces via useAuth
    }
  };

  const err = localError ?? error?.message;

  return (
    <>
      <Helmet>
        <title>{t('login.title')}</title>
      </Helmet>

      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          {t('login.title')}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('login.subtitle')}
        </p>
      </header>

      {err && (
        <div
          role="alert"
          style={{
            padding: 12,
            background: '#FEF2F2',
            color: '#991B1B',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('login.emailOrPhone')}</span>
          <input
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={t('login.emailOrPhonePlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('login.password')}</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.passwordPlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <div style={{ textAlign: 'right', marginTop: -8 }}>
          <Link
            to="/auth/forgot-password"
            style={{ fontSize: 13, color: 'var(--color-primary, #2E7D32)', fontWeight: 600 }}
          >
            {t('login.forgotPassword')}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSigningIn}
          style={{
            padding: 14,
            background: 'var(--color-primary, #2E7D32)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: isSigningIn ? 'wait' : 'pointer',
            opacity: isSigningIn ? 0.7 : 1,
          }}
        >
          {isSigningIn ? t('login.loggingIn') : t('login.submit')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
        {t('login.noAccount')}{' '}
        <Link to="/auth/role" style={{ color: 'var(--color-primary, #2E7D32)', fontWeight: 700 }}>
          {t('login.signUp')}
        </Link>
      </p>
    </>
  );
}