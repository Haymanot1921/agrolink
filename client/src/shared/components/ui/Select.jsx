// client/src/shared/components/ui/Select.jsx
// Native select with the same label/error API as Input.
// SRS refs: §11.8, NFR-ACCESS-004.

import React, { forwardRef, useId } from 'react';

export const Select = forwardRef(function Select(
  { label, error, helper, required, options = [], placeholder, id, style, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? `select-${autoId}`;
  const errorId = `${selectId}-error`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: 14, fontWeight: 600 }}>
          {label}
          {required && <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 15,
          fontFamily: 'inherit',
          border: `1px solid ${error ? '#DC2626' : 'var(--color-border, #E0E0E0)'}`,
          borderRadius: 8,
          background: 'var(--color-card, #fff)',
          color: 'var(--color-text, #1B1B1B)',
          ...style,
        }}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>
          {error}
        </p>
      )}
      {helper && !error && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', margin: 0 }}>
          {helper}
        </p>
      )}
    </div>
  );
});

export default Select;