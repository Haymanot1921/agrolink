// client/src/shared/components/ui/Input.jsx
// Text input with label, helper text, and error state.
// SRS refs: §11.8, NFR-ACCESS-004 (clear labels).

import React, { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    required,
    leftIcon,
    rightIcon,
    type = 'text',
    id,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `input-${autoId}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const describedBy = [error ? errorId : null, helper ? helperId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 14, fontWeight: 600 }}>
          {label}
          {required && <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span style={{ position: 'absolute', left: 12, display: 'flex', color: 'var(--color-text-muted, #5F6368)' }}>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={className}
          style={{
            width: '100%',
            padding: leftIcon ? '10px 12px 10px 40px' : rightIcon ? '10px 40px 10px 12px' : '10px 12px',
            fontSize: 15,
            fontFamily: 'inherit',
            border: `1px solid ${error ? '#DC2626' : 'var(--color-border, #E0E0E0)'}`,
            borderRadius: 8,
            outline: 'none',
            background: 'var(--color-card, #fff)',
            color: 'var(--color-text, #1B1B1B)',
            ...style,
          }}
          {...rest}
        />
        {rightIcon && (
          <span style={{ position: 'absolute', right: 12, display: 'flex', color: 'var(--color-text-muted, #5F6368)' }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={helperId} style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', margin: 0 }}>
          {helper}
        </p>
      )}
    </div>
  );
});

export default Input;