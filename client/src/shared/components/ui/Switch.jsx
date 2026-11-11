// client/src/shared/components/ui/Switch.jsx
// Toggle switch with proper ARIA role="switch".
// SRS refs: §11.8, NFR-ACCESS-003 (not color-only).

import React, { forwardRef, useId } from 'react';

export const Switch = forwardRef(function Switch(
  { label, checked, onChange, disabled, id, style },
  ref,
) {
  const autoId = useId();
  const switchId = id ?? `switch-${autoId}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}>
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        style={{
          width: 44,
          height: 24,
          padding: 2,
          borderRadius: 999,
          border: 'none',
          background: checked ? 'var(--color-primary, #2E7D32)' : 'var(--color-border, #E0E0E0)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'background-color 0.15s ease',
          position: 'relative',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.15s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </button>
      {label && (
        <label htmlFor={switchId} style={{ fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {label}
        </label>
      )}
    </div>
  );
});

export default Switch;