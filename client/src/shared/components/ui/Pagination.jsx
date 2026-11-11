// client/src/shared/components/ui/Pagination.jsx
// Page navigation with size selector.
// SRS refs: FR-SEARCH-008 pagination.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function Pagination({ page = 1, perPage = 20, total = 0, onPageChange, onPerPageChange, perPageOptions = [10, 20, 50, 100] }) {
  const { t } = useTranslation('common');
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages = [];
  const maxButtons = 5;
  let startBtn = Math.max(1, page - Math.floor(maxButtons / 2));
  let endBtn = Math.min(totalPages, startBtn + maxButtons - 1);
  if (endBtn - startBtn < maxButtons - 1) startBtn = Math.max(1, endBtn - maxButtons + 1);
  for (let i = startBtn; i <= endBtn; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted, #5F6368)' }}>
        <span>{t('pagination.showing', { start, end, total })}</span>
        {onPerPageChange && (
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            style={{ padding: '4px 8px', fontSize: 13, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 6 }}
            aria-label={t('pagination.perPage')}
          >
            {perPageOptions.map((n) => (
              <option key={n} value={n}>{n} / {t('pagination.page')}</option>
            ))}
          </select>
        )}
      </div>

      <nav aria-label={t('pagination.label')} style={{ display: 'flex', gap: 4 }}>
        <PageBtn disabled={page <= 1} onClick={() => onPageChange?.(page - 1)} aria-label={t('pagination.previous')}>
          ‹
        </PageBtn>
        {startBtn > 1 && (
          <>
            <PageBtn onClick={() => onPageChange?.(1)}>1</PageBtn>
            {startBtn > 2 && <span style={{ padding: '0 8px', alignSelf: 'center' }}>…</span>}
          </>
        )}
        {pages.map((p) => (
          <PageBtn key={p} active={p === page} onClick={() => onPageChange?.(p)}>
            {p}
          </PageBtn>
        ))}
        {endBtn < totalPages && (
          <>
            {endBtn < totalPages - 1 && <span style={{ padding: '0 8px', alignSelf: 'center' }}>…</span>}
            <PageBtn onClick={() => onPageChange?.(totalPages)}>{totalPages}</PageBtn>
          </>
        )}
        <PageBtn disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)} aria-label={t('pagination.next')}>
          ›
        </PageBtn>
      </nav>
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      style={{
        minWidth: 32,
        height: 32,
        padding: '0 8px',
        borderRadius: 6,
        border: active ? '1px solid var(--color-primary, #2E7D32)' : '1px solid var(--color-border, #E0E0E0)',
        background: active ? 'var(--color-primary, #2E7D32)' : 'transparent',
        color: active ? '#fff' : 'var(--color-text, #1B1B1B)',
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Pagination;