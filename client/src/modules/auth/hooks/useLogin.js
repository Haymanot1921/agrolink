// client/src/modules/auth/hooks/useLogin.js
// Login form state machine — validation, submission, error mapping.
// SRS refs: §5.1, FR-AUTH-004, FR-AUTH-010.

import { useState, useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useTranslation } from '@i18n/hooks/useTranslation';

const INITIAL = { identifier: '', password: '' };

export function useLogin({ onSuccess } = {}) {
  const { t: tv } = useTranslation('validation');
  const { signIn, isSigningIn } = useAuth();

  const [values, setValues] = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError(null);
  }, []);

  const validate = useCallback(() => {
    const errors = {};
    if (!values.identifier.trim()) {
      errors.identifier = tv('required', { field: 'Email or phone' });
    }
    if (!values.password) {
      errors.password = tv('required', { field: 'Password' });
    } else if (values.password.length < 8) {
      errors.password = tv('password.minLength', { min: 8 });
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [values, tv]);

  const submit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setSubmitError(null);
      if (!validate()) return null;

      try {
        const result = await signIn({
          identifier: values.identifier.trim(),
          password: values.password,
        });
        onSuccess?.(result.user);
        return result.user;
      } catch (err) {
        setSubmitError(
          err?.response?.data?.message ?? tv('auth.invalidCredentials'),
        );
        return null;
      }
    },
    [values, validate, signIn, onSuccess, tv],
  );

  const reset = useCallback(() => {
    setValues(INITIAL);
    setFieldErrors({});
    setSubmitError(null);
  }, []);

  return {
    values,
    fieldErrors,
    submitError,
    isSubmitting: isSigningIn,
    setField,
    submit,
    reset,
  };
}