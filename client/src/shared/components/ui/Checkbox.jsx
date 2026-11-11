// client/src/shared/components/ui/Checkbox.jsx
// Accessible checkbox with label + error.
// SRS refs: §11.8, NFR-ACCESS-003.

import React, { forwardRef, useId } from 'react';

export const Checkbox = forwardRef(function Checkbox(
  { label, error, disabled, id, style, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `checkbox-${autoId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
          fontSize: 14,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--color-primary, #2E7D32)', ...style }}
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && <p style={{ fontSize: 12, color: '#DC2626', margin: 0, paddingLeft: 24 }}>{error}</p>}
    </div>
  );
});

export default Checkbox;