// client/src/modules/auth/components/RegisterForm.jsx
// Reusable registration form — role + provider type baked in via props.
// SRS refs: §5.1, FR-AUTH-001, FR-AUTH-002, §4.1.3 BR-026.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useRegister } from '../hooks/useRegister';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { authUiService } from '../services/authUi.service';

export function RegisterForm({ role, providerType, onSuccess }) {
  const { t } = useTranslation('auth');
  const {
    values,
    agreeTerms,
    setAgreeTerms,
    fieldErrors,
    submitError,
    isSubmitting,
    passwordScore,
    roleLabel,
    providerTypeLabel,
    setField,
    submit,
  } = useRegister({ role, providerType, onSuccess });

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Role banner */}
      <div
        style={{
          padding: 10,
          background: 'var(--color-primary-light, #E8F5E9)',
          color: 'var(--color-primary, #2E7D32)',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {t('register.signingUpAs')}: {t(roleLabel)}
        {providerTypeLabel && ` — ${t(providerTypeLabel)}`}
      </div>

      {submitError && (
        <div
          role="alert"
          style={{ padding: 12, background: '#FEF2F2', color: '#991B1B', borderRadius: 8, fontSize: 14 }}
        >
          {submitError}
        </div>
      )}

      <Field
        label={t('register.fullName')}
        error={fieldErrors.fullName}
        input={
          <input
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
            placeholder={t('register.fullNamePlaceholder')}
            style={inputStyle(fieldErrors.fullName)}
          />
        }
      />

      <Field
        label={t('register.email')}
        error={fieldErrors.email}
        input={
          <input
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder={t('register.emailPlaceholder')}
            style={inputStyle(fieldErrors.email)}
          />
        }
      />

      <Field
        label={t('register.phone')}
        error={fieldErrors.phone}
        input={
          <input
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder={t('register.phonePlaceholder')}
            style={inputStyle(fieldErrors.phone)}
          />
        }
      />

      <Field
        label={t('register.password')}
        error={fieldErrors.password}
        input={
          <>
            <input
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              style={inputStyle(fieldErrors.password)}
            />
            <PasswordStrengthMeter score={passwordScore} />
          </>
        }
      />

      <Field
        label={t('register.confirmPassword')}
        error={fieldErrors.confirmPassword}
        input={
          <input
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => setField('confirmPassword', e.target.value)}
            placeholder={t('register.confirmPasswordPlaceholder')}
            style={inputStyle(fieldErrors.confirmPassword)}
          />
        }
      />

      <label
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
          fontSize: 13,
          color: 'var(--color-text-muted, #5F6368)',
        }}
      >
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          style={{ marginTop: 3 }}
        />
        <span>{t('register.agreeToTerms')}</span>
      </label>
      {fieldErrors.agreeTerms && <span style={errorStyle}>{fieldErrors.agreeTerms}</span>}

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
          marginTop: 6,
        }}
      >
        {isSubmitting ? t('register.registering') : t('register.submit')}
      </button>
    </form>
  );
}

function Field({ label, error, input }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      {input}
      {error && <span style={errorStyle}>{error}</span>}
    </label>
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