// client/src/shared/components/layout/PageHeader.jsx
// Page title + subtitle + action button.
// SRS refs: §11.8.

import React from 'react';
import { Link } from 'react-router-dom';

export function PageHeader({ title, subtitle, breadcrumbs, actions, backTo, backLabel }) {
  return (
    <header style={{ marginBottom: 24 }}>
      {(breadcrumbs || backTo) && (
        <div style={{ marginBottom: 12 }}>
          {backTo && (
            <Link
              to={backTo}
              style={{
                fontSize: 13,
                color: 'var(--color-primary, #2E7D32)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              ← {backLabel ?? 'Back'}
            </Link>
          )}
          {breadcrumbs}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', margin: '4px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
      </div>
    </header>
  );
}

export default PageHeader;