// client/src/shared/components/ui/Textarea.jsx
// Multi-line text input with counter.
// SRS refs: §11.8.

import React, { forwardRef, useId } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helper,
    required,
    rows = 4,
    maxLength,
    showCount = false,
    value = '',
    id,
    style,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `textarea-${autoId}`;
  const errorId = `${inputId}-error`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 14, fontWeight: 600 }}>
          {label}
          {required && <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        value={value}
        maxLength={maxLength}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 15,
          fontFamily: 'inherit',
          border: `1px solid ${error ? '#DC2626' : 'var(--color-border, #E0E0E0)'}`,
          borderRadius: 8,
          outline: 'none',
          resize: 'vertical',
          background: 'var(--color-card, #fff)',
          color: 'var(--color-text, #1B1B1B)',
          ...style,
        }}
        {...rest}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: error ? '#DC2626' : 'var(--color-text-muted, #5F6368)' }}>
          {error || helper || ''}
        </span>
        {showCount && maxLength && (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)' }}>
            {String(value).length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

export default Textarea;