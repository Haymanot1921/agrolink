// client/src/pages/auth/RegisterPage.jsx
// Registration for all 5 actors. Role comes from URL state.
// SRS refs: §5.1, FR-AUTH-001, FR-AUTH-002, §4.1, §4.1.3.

import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { defaultRouteFor } from '@app/routeGuards';

export function RegisterPage() {
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
  const { t: tv } = useTranslation('validation');
  const { signUp, isSigningUp, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Role + providerType come from role selection page
  const role = location.state?.role ?? searchParams.get('role') ?? 'farmer';
  const providerType = location.state?.providerType ?? searchParams.get('providerType') ?? null;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setLocalError(tv('required', { field: 'All fields' }));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError(tv('password.match'));
      return;
    }
    if (!agreeTerms) {
      setLocalError(tv('agreeTerms'));
      return;
    }

    try {
      const { user } = await signUp({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
        providerType,
      });
      navigate(defaultRouteFor(user), { replace: true });
    } catch {
      // error surfaces via useAuth
    }
  };

  const err = localError ?? error?.message;

  return (
    <>
      <Helmet>
        <title>{t('register.title')}</title>
      </Helmet>

      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          {t('register.title')}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('register.subtitle')}
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-text-subtle, #9AA0A6)', marginTop: 8 }}>
          Signing up as: <strong>{t(`roleSelection.${role === 'service_provider' ? 'serviceProvider' : role}`)}</strong>
          {providerType && ` (${t(`serviceProviderType.${providerType === 'input_supplier' ? 'inputSupplier' : 'agriculturalExpert'}`)})`}
        </p>
      </header>

      {err && (
        <div role="alert" style={{ padding: 12, background: '#FEF2F2', color: '#991B1B', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('register.fullName')}</span>
          <input
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange('fullName')}
            placeholder={t('register.fullNamePlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('register.email')}</span>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder={t('register.emailPlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('register.phone')}</span>
          <input
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder={t('register.phonePlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('register.password')}</span>
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder={t('register.passwordPlaceholder')}
            required
            minLength={8}
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('register.confirmPassword')}</span>
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder={t('register.confirmPasswordPlaceholder')}
            required
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
        </label>

        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--color-text-muted, #5F6368)' }}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ marginTop: 3 }}
          />
          <span>{t('register.agreeToTerms')}</span>
        </label>

        <button
          type="submit"
          disabled={isSigningUp}
          style={{
            padding: 14,
            background: 'var(--color-primary, #2E7D32)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: isSigningUp ? 'wait' : 'pointer',
            opacity: isSigningUp ? 0.7 : 1,
            marginTop: 6,
          }}
        >
          {isSigningUp ? t('register.registering') : t('register.submit')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
        {t('register.haveAccount')}{' '}
        <Link to="/auth/login" style={{ color: 'var(--color-primary, #2E7D32)', fontWeight: 700 }}>
          {t('register.login')}
        </Link>
      </p>
    </>
  );
}