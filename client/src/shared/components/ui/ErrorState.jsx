// client/src/shared/components/ui/ErrorState.jsx
// SRS refs: §15.2 error handling, NFR-USE-006.

import React from 'react';

export function ErrorState({ icon = '⚠️', title, message, action }) {
  return (
    <div role="alert" style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }} aria-hidden>
        {icon}
      </div>
      {title && (
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: '#991B1B' }}>{title}</h3>
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

export default ErrorState;