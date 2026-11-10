// client/src/pages/auth/ResetPasswordPage.jsx
// Password reset — step 2: enter OTP + new password.
// SRS refs: §5.1, FR-AUTH-007.

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';

export function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const { t: tv } = useTranslation('validation');
  const { resetPassword, isResettingPassword, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier ?? '';

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (code.length !== 6) {
      setLocalError(tv('otp'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError(tv('password.match'));
      return;
    }
    try {
      await resetPassword({ token: `${identifier}:${code}`, newPassword });
      navigate('/auth/login', { replace: true });
    } catch {
      // error surfaces via useAuth
    }
  };

  const err = localError ?? error?.message;

  return (
    <>
      <Helmet>
        <title>{t('resetPassword.title')}</title>
      </Helmet>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
          {t('resetPassword.title')}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('resetPassword.subtitle')}
        </p>
      </header>

      {err && (
        <div role="alert" style={{ padding: 12, background: '#FEF2F2', color: '#991B1B', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('resetPassword.code')}</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{6}"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder={t('resetPassword.codePlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 20, letterSpacing: 8, textAlign: 'center' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('resetPassword.newPassword')}</span>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('resetPassword.confirmPassword')}</span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <button
          type="submit"
          disabled={isResettingPassword}
          style={{
            padding: 14,
            background: 'var(--color-primary, #2E7D32)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: isResettingPassword ? 'wait' : 'pointer',
            opacity: isResettingPassword ? 0.7 : 1,
          }}
        >
          {isResettingPassword ? t('resetPassword.resetting') : t('resetPassword.submit')}
        </button>
      </form>
    </>
  );
}