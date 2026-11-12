// client/src/shared/components/feedback/ProgressBar.jsx
// Linear progress — determinate or indeterminate.
// SRS refs: NFR-USE-006.

import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  tone = 'primary',
  showLabel = false,
  label,
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const heights = { sm: 4, md: 8, lg: 12 };
  const colors = {
    primary: 'var(--color-primary, #2E7D32)',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    info: '#1565C0',
  };

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--color-text-muted, #5F6368)',
            marginBottom: 4,
          }}
        >
          <span>{label ?? ''}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        style={{
          width: '100%',
          height: heights[size] ?? heights.md,
          background: 'var(--color-border, #E0E0E0)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: colors[tone] ?? colors.primary,
            transition: 'width 0.3s ease',
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;