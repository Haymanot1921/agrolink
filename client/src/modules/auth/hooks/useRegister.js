// client/src/modules/auth/hooks/useRegister.js
// Registration state machine — validates role-specific fields + provider type.
// SRS refs: §5.1, FR-AUTH-001, FR-AUTH-002, §4.1.3 BR-026.

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { authUiService } from '../services/authUi.service';

const INITIAL = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  preferredLanguage: 'en',
};

// Simple password strength scorer used by PasswordStrengthMeter.
export function scorePassword(pw) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

export function useRegister({ role, providerType, onSuccess } = {}) {
  const { t: tv } = useTranslation('validation');
  const { signUp, isSigningUp } = useAuth();

  const [values, setValues] = useState(INITIAL);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const passwordScore = useMemo(() => scorePassword(values.password), [values.password]);

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError(null);
  }, []);

  const validate = useCallback(() => {
    const errors = {};

    if (!values.fullName.trim()) errors.fullName = tv('required', { field: 'Full name' });

    if (!values.email.trim()) errors.email = tv('required', { field: 'Email' });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errors.email = tv('email.invalid');

    if (!values.phone.trim()) errors.phone = tv('required', { field: 'Phone' });
    else if (!/^\+?251\d{9}$/.test(values.phone.replace(/\s/g, '')))
      errors.phone = tv('phone.invalidEthiopian');

    if (!values.password) errors.password = tv('required', { field: 'Password' });
    else if (passwordScore < 2) errors.password = tv('password.tooWeak');

    if (values.password !== values.confirmPassword)
      errors.confirmPassword = tv('password.match');

    if (!agreeTerms) errors.agreeTerms = tv('agreeTerms');

    if (role === 'service_provider' && !providerType)
      errors.providerType = tv('required', { field: 'Provider type' });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [values, agreeTerms, role, providerType, passwordScore, tv]);

  const submit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setSubmitError(null);
      if (!validate()) return null;

      try {
        const result = await signUp({
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          password: values.password,
          preferredLanguage: values.preferredLanguage,
          role,
          providerType: role === 'service_provider' ? providerType : null,
        });
        onSuccess?.(result.user);
        return result.user;
      } catch (err) {
        const code = err?.response?.data?.code;
        const msg =
          code === 'EMAIL_TAKEN'
            ? tv('auth.emailTaken')
            : code === 'PHONE_TAKEN'
            ? tv('auth.phoneTaken')
            : err?.response?.data?.message ?? tv('auth.genericError');
        setSubmitError(msg);
        return null;
      }
    },
    [values, validate, signUp, role, providerType, onSuccess, tv],
  );

  const reset = useCallback(() => {
    setValues(INITIAL);
    setAgreeTerms(false);
    setFieldErrors({});
    setSubmitError(null);
  }, []);

  return {
    values,
    agreeTerms,
    setAgreeTerms,
    fieldErrors,
    submitError,
    isSubmitting: isSigningUp,
    passwordScore,
    roleLabel: authUiService.roleI18nKey(role),
    providerTypeLabel: providerType ? authUiService.providerTypeI18nKey(providerType) : null,
    setField,
    submit,
    reset,
  };
}