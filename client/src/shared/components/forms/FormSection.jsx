// client/src/shared/components/forms/FormSection.jsx
// Group of fields with heading + optional description.
// SRS refs: NFR-USE-001.

import React from 'react';

export function FormSection({ title, description, children, actions }) {
  return (
    <section
      style={{
        padding: 20,
        border: '1px solid var(--color-border, #E0E0E0)',
        borderRadius: 12,
        background: 'var(--color-card, #fff)',
        marginBottom: 16,
      }}
    >
      {(title || description) && (
        <header style={{ marginBottom: 16 }}>
          {title && <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>}
          {description && (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', margin: '4px 0 0' }}>
              {description}
            </p>
          )}
        </header>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>

      {actions && (
        <footer
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid var(--color-border, #E0E0E0)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          {actions}
        </footer>
      )}
    </section>
  );
}

export default FormSection;