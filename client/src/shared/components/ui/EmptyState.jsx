// client/src/shared/components/ui/EmptyState.jsx
// SRS refs: §11.8.

import React from 'react';

export function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }} aria-hidden>
        {icon}
      </div>
      {title && (
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
      )}
      {message && (
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', maxWidth: 400, margin: '0 auto 20px' }}>
          {message}
        </p>
      )}
      {action}
    </div>
  );
}

export default EmptyState;