// client/src/shared/components/charts/ChartWrapper.jsx
// Shared shell for every chart — title, empty, loading, error, responsive.
// SRS refs: §11.8, NFR-ACCESS-003 (chart must have text label).

import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';

export function ChartWrapper({
  title,
  subtitle,
  height = 300,
  loading = false,
  error = null,
  empty = false,
  emptyMessage,
  children,
  action,
}) {
  return (
    <section
      style={{
        background: 'var(--color-card, #fff)',
        border: '1px solid var(--color-border, #E0E0E0)',
        borderRadius: 12,
        padding: 20,
      }}
    >
      {(title || action) && (
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
            )}
            {subtitle && (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', margin: '4px 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      {!loading && !error && empty && (
        <EmptyState icon="📈" message={emptyMessage ?? 'No data available yet'} />
      )}

      {!loading && !error && !empty && (
        <div style={{ width: '100%', height }} role="img" aria-label={title ?? 'Chart'}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ChartWrapper;