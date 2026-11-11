// client/src/modules/auth/hooks/usePasswordReset.js
// 2-step password reset flow.
// SRS refs: §5.1, FR-AUTH-007.

import { useState, useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { scorePassword } from './useRegister';

export function usePasswordReset() {
  const { t: tv } = useTranslation('validation');
  const { requestPasswordReset, resetPassword, isRequestingReset, isResettingPassword } =
    useAuth();

  // Step 1 — request
  const [identifier, setIdentifier] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState(null);

  // Step 2 — reset
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState(null);
  const [resetDone, setResetDone] = useState(false);

  const submitRequest = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setRequestError(null);
      if (!identifier.trim()) {
        setRequestError(tv('required', { field: 'Email or phone' }));
        return false;
      }
      try {
        await requestPasswordReset({ identifier: identifier.trim() });
        setRequestSent(true);
        return true;
      } catch (err) {
        setRequestError(err?.response?.data?.message ?? tv('auth.genericError'));
        return false;
      }
    },
    [identifier, requestPasswordReset, tv],
  );

  const submitReset = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setResetError(null);
      if (code.length !== 6) {
        setResetError(tv('otp.incomplete'));
        return false;
      }
      if (scorePassword(newPassword) < 2) {
        setResetError(tv('password.tooWeak'));
        return false;
      }
      if (newPassword !== confirmPassword) {
        setResetError(tv('password.match'));
        return false;
      }
      try {
        await resetPassword({
          token: `${identifier}:${code}`,
          newPassword,
        });
        setResetDone(true);
        return true;
      } catch (err) {
        setResetError(
          err?.response?.data?.code === 'OTP_EXPIRED'
            ? tv('otp.expired')
            : err?.response?.data?.message ?? tv('auth.genericError'),
        );
        return false;
      }
    },
    [code, newPassword, confirmPassword, identifier, resetPassword, tv],
  );

  return {
    // step 1
    identifier,
    setIdentifier,
    requestSent,
    requestError,
    isRequesting: isRequestingReset,
    submitRequest,
    // step 2
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    resetError,
    resetDone,
    isResetting: isResettingPassword,
    submitReset,
  };
}