// client/src/shared/components/ui/RadioGroup.jsx
// Native radio group with fieldset semantics.
// SRS refs: §11.8, NFR-ACCESS-004.

import React, { forwardRef, useId } from 'react';

export const RadioGroup = forwardRef(function RadioGroup(
  { label, name, options = [], value, onChange, error, disabled, style },
  ref,
) {
  const autoId = useId();
  const groupId = `radio-${autoId}`;

  return (
    <fieldset
      style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, ...style }}
      aria-invalid={Boolean(error)}
    >
      {label && (
        <legend style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{label}</legend>
      )}
      {options.map((opt) => (
        <label
          key={opt.value}
          htmlFor={`${groupId}-${opt.value}`}
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            fontSize: 14,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <input
            ref={ref}
            id={`${groupId}-${opt.value}`}
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            disabled={disabled || opt.disabled}
            style={{ width: 16, height: 16, accentColor: 'var(--color-primary, #2E7D32)' }}
          />
          <span>{opt.label}</span>
        </label>
      ))}
      {error && <p style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>{error}</p>}
    </fieldset>
  );
});

export default RadioGroup;