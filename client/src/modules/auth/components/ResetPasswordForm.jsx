// client/src/modules/auth/components/ResetPasswordForm.jsx
// Step 2 of password reset — enter OTP + new password.
// SRS refs: §5.1, FR-AUTH-007.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { OtpInput } from './OtpInput';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { scorePassword } from '../hooks/useRegister';

export function ResetPasswordForm({
  code,
  setCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  isSubmitting,
  error,
}) {
  const { t } = useTranslation('auth');
  const score = scorePassword(newPassword);

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

      <div>
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          {t('resetPassword.code')}
        </p>
        <OtpInput value={code} onChange={setCode} />
      </div>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{t('resetPassword.newPassword')}</span>
        <input
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          style={{
            padding: 12,
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 8,
            fontSize: 15,
          }}
        />
        <PasswordStrengthMeter score={score} />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {t('resetPassword.confirmPassword')}
        </span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {isSubmitting ? t('resetPassword.resetting') : t('resetPassword.submit')}
      </button>
    </form>
  );
}