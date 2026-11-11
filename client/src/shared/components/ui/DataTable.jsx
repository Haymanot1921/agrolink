// client/src/shared/components/ui/DataTable.jsx
// Table with column definitions, empty state, loading skeleton, row actions.
// SRS refs: §11.8, FR-SEARCH-008 pagination.

import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

export function DataTable({
  columns = [],
  rows = [],
  loading = false,
  emptyTitle,
  emptyMessage,
  rowKey = 'id',
  onRowClick,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  striped = false,
}) {
  const allSelected = rows.length > 0 && selectedKeys.length === rows.length;
  const toggleAll = () => {
    onSelectionChange?.(allSelected ? [] : rows.map((r) => r[rowKey]));
  };
  const toggleOne = (key) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange?.(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange?.([...selectedKeys, key]);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--color-border, #E0E0E0)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
        <thead>
          <tr style={{ background: 'var(--color-surface, #F5F7FA)', textAlign: 'left' }}>
            {selectable && (
              <th style={thStyle}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all rows" />
              </th>
            )}
            {columns.map((c) => (
              <th key={c.key} style={{ ...thStyle, width: c.width, textAlign: c.align ?? 'left' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const key = row[rowKey] ?? idx;
            const isSelected = selectedKeys.includes(key);
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{
                  borderTop: '1px solid var(--color-border, #E0E0E0)',
                  background: isSelected
                    ? 'var(--color-primary-light, #E8F5E9)'
                    : striped && idx % 2 === 1
                    ? 'var(--color-surface, #F5F7FA)'
                    : undefined,
                  cursor: onRowClick ? 'pointer' : undefined,
                }}
              >
                {selectable && (
                  <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(key)}
                      aria-label={`Select row ${idx + 1}`}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} style={{ ...tdStyle, textAlign: c.align ?? 'left' }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '12px 16px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted, #5F6368)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: 14,
};

export default DataTable;