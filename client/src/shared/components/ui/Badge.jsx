// client/src/shared/components/ui/Badge.jsx
// Generic pill badge — non-interactive.
// SRS refs: §11.8.

import React from 'react';

const TONES = {
  neutral: { background: 'var(--color-surface, #F5F7FA)', color: 'var(--color-text, #1B1B1B)' },
  primary: { background: 'var(--color-primary-light, #E8F5E9)', color: 'var(--color-primary, #2E7D32)' },
  success: { background: '#DCFCE7', color: '#166534' },
  warning: { background: '#FEF3C7', color: '#92400E' },
  danger: { background: '#FEE2E2', color: '#991B1B' },
  info: { background: '#E3F2FD', color: '#1565C0' },
};

export function Badge({ children, tone = 'neutral', size = 'sm', dot = false }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span
      style={{
        ...t,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius: 999,
        fontSize: size === 'sm' ? 11 : 13,
        fontWeight: 700,
        lineHeight: 1.4,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}

export default Badge;