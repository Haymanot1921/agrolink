// client/src/shared/components/feedback/Alert.jsx
// Inline alert for non-blocking messages.
// SRS refs: §15.2 error handling, NFR-USE-006.

import React from 'react';

const TONES = {
  info: { bg: '#E3F2FD', fg: '#1565C0', icon: 'ℹ️', role: 'status' },
  success: { bg: '#DCFCE7', fg: '#166534', icon: '✓', role: 'status' },
  warning: { bg: '#FEF3C7', fg: '#92400E', icon: '⚠', role: 'alert' },
  danger: { bg: '#FEE2E2', fg: '#991B1B', icon: '✕', role: 'alert' },
};

export function Alert({ tone = 'info', title, children, onDismiss, action }) {
  const t = TONES[tone] ?? TONES.info;

  return (
    <div
      role={t.role}
      style={{
        background: t.bg,
        color: t.fg,
        borderLeft: `4px solid ${t.fg}`,
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontSize: 14,
      }}
    >
      <span aria-hidden style={{ fontSize: 16, lineHeight: 1.4 }}>
        {t.icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <p style={{ fontWeight: 700, margin: 0, marginBottom: children ? 4 : 0 }}>{title}</p>
        )}
        {children && <div style={{ lineHeight: 1.5 }}>{children}</div>}
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            color: t.fg,
            fontSize: 16,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;