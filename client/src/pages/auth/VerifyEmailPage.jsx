// client/src/pages/auth/VerifyEmailPage.jsx
// Email/phone verification via 6-digit OTP.
// SRS refs: §5.1, FR-AUTH-001.

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { defaultRouteFor } from '@app/routeGuards';

export function VerifyEmailPage() {
  const { t } = useTranslation('auth');
  const { verifyOtp, resendOtp, isVerifying, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier ?? '';
  const purpose = location.state?.purpose ?? 'registration';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const setDigit = (idx, val) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = clean;
    setDigits(next);
    if (clean && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const code = digits.join('');
    if (code.length !== 6) {
      setLocalError(t('otp.verifying'));
      return;
    }
    try {
      const { user } = await verifyOtp({ identifier, code, purpose });
      navigate(defaultRouteFor(user), { replace: true });
    } catch {
      // error surfaces via useAuth
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await resendOtp({ identifier, purpose });
    setCooldown(60);
  };

  const err = localError ?? error?.message;

  return (
    <>
      <Helmet>
        <title>{t('otp.title')}</title>
      </Helmet>
      <header style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{t('otp.title')}</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('otp.subtitle', { identifier })}
        </p>
      </header>

      {err && (
        <div role="alert" style={{ padding: 12, background: '#FEF2F2', color: '#991B1B', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 48,
                height: 56,
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                border: '2px solid var(--color-border, #E0E0E0)',
                borderRadius: 8,
              }}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          style={{
            width: '100%',
            padding: 14,
            background: 'var(--color-primary, #2E7D32)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: isVerifying ? 'wait' : 'pointer',
            opacity: isVerifying ? 0.7 : 1,
          }}
        >
          {isVerifying ? t('otp.verifying') : t('otp.submit')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
        {t('otp.resend')}{' '}
        {cooldown > 0 ? (
          <span>{t('otp.resendIn', { seconds: cooldown })}</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary, #2E7D32)', fontWeight: 700, cursor: 'pointer' }}
          >
            {t('otp.resendAction')}
          </button>
        )}
      </p>
    </>
  );
}