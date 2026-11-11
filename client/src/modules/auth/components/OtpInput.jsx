// client/src/modules/auth/components/OtpInput.jsx
// Controlled 6-digit OTP input with paste, backspace, and arrow navigation.
// SRS refs: §5.1, FR-AUTH-001.

import React, { useRef } from 'react';

const LENGTH = 6;

export function OtpInput({ value = '', onChange, disabled = false, autoFocus = true }) {
  const inputsRef = useRef([]);
  const digits = String(value).padEnd(LENGTH, ' ').slice(0, LENGTH).split('');

  const setDigit = (index, raw) => {
    const clean = String(raw).replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean || ' ';
    onChange(next.join('').replace(/\s+$/, ''));
    if (clean && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    onChange(text);
    const focusIndex = Math.min(text.length, LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div
      onPaste={handlePaste}
      style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
      role="group"
      aria-label="One-time password"
    >
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i].trim()}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          style={{
            width: 48,
            height: 56,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            border: '2px solid var(--color-border, #E0E0E0)',
            borderRadius: 8,
            outlineColor: 'var(--color-primary, #2E7D32)',
          }}
        />
      ))}
    </div>
  );
}