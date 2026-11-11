// client/src/shared/components/ui/Button.jsx
// Primary UI primitive. Accessible, keyboard-focusable, variant-based.
// SRS refs: §11.8, NFR-USE-001, NFR-ACCESS-002.

import React, { forwardRef } from 'react';

const VARIANTS = {
  primary: {
    background: 'var(--color-primary, #2E7D32)',
    color: '#fff',
    border: '1px solid var(--color-primary, #2E7D32)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-primary, #2E7D32)',
    border: '2px solid var(--color-primary, #2E7D32)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text, #1B1B1B)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--color-danger, #DC2626)',
    color: '#fff',
    border: '1px solid var(--color-danger, #DC2626)',
  },
  subtle: {
    background: 'var(--color-surface, #F5F7FA)',
    color: 'var(--color-text, #1B1B1B)',
    border: '1px solid var(--color-border, #E0E0E0)',
  },
};

const SIZES = {
  sm: { padding: '6px 14px', fontSize: 13, borderRadius: 6, minHeight: 32 },
  md: { padding: '10px 20px', fontSize: 14, borderRadius: 8, minHeight: 40 },
  lg: { padding: '14px 28px', fontSize: 15, borderRadius: 10, minHeight: 48 },
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onClick,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size] ?? SIZES.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={disabled || loading ? undefined : onClick}
      className={className}
      style={{
        ...v,
        ...s,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        fontWeight: 700,
        fontFamily: 'inherit',
        transition: 'background-color 0.15s ease, opacity 0.15s ease',
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          style={{
            width: 14,
            height: 14,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default Button;