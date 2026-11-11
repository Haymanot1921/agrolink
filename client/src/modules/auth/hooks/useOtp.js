// client/src/modules/auth/hooks/useOtp.js
// 6-digit OTP entry + resend cooldown.
// SRS refs: §5.1, FR-AUTH-001 (verification), FR-AUTH-007 (reset).

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useTranslation } from '@i18n/hooks/useTranslation';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function useOtp({ identifier, purpose = 'registration', onSuccess } = {}) {
  const { t: tv } = useTranslation('validation');
  const { verifyOtp, resendOtp, isVerifying } = useAuth();

  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(''));
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(null);
  const inputRefs = useRef([]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const setDigit = useCallback(
    (index, raw) => {
      const clean = String(raw).replace(/\D/g, '').slice(-1);
      setDigits((prev) => {
        const next = [...prev];
        next[index] = clean;
        return next;
      });
      setError(null);
      if (clean && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
      if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    },
    [digits],
  );

  const pasteCode = useCallback((text) => {
    const clean = String(text).replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH)
      .fill('')
      .map((_, i) => clean[i] ?? '');
    setDigits(next);
    const focusIndex = Math.min(clean.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const submit = useCallback(async () => {
    setError(null);
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setError(tv('otp.incomplete'));
      return null;
    }
    try {
      const result = await verifyOtp({ identifier, code, purpose });
      onSuccess?.(result.user);
      return result.user;
    } catch (err) {
      setError(
        err?.response?.data?.code === 'OTP_EXPIRED'
          ? tv('otp.expired')
          : err?.response?.data?.message ?? tv('otp.invalid'),
      );
      return null;
    }
  }, [digits, identifier, purpose, verifyOtp, onSuccess, tv]);

  const resend = useCallback(async () => {
    if (cooldown > 0) return;
    try {
      await resendOtp({ identifier, purpose });
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message ?? tv('otp.resendFailed'));
    }
  }, [cooldown, identifier, purpose, resendOtp, tv]);

  return {
    digits,
    error,
    cooldown,
    isVerifying,
    inputRefs,
    setDigit,
    handleKeyDown,
    pasteCode,
    submit,
    resend,
  };
}