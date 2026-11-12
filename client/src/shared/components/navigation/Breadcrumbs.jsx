// client/src/shared/components/navigation/Breadcrumbs.jsx
// Path trail for dashboard pages.
// SRS refs: §11.8 clear navigation.

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function Breadcrumbs({ items = [] }) {
  const { t } = useTranslation('common');

  if (items.length === 0) return null;

  return (
    <nav aria-label={t('navigation.breadcrumbs')} style={{ marginBottom: 16 }}>
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--color-text-muted, #5F6368)',
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  style={{ color: 'var(--color-primary, #2E7D32)', textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{ fontWeight: isLast ? 700 : 500, color: isLast ? 'var(--color-text, #1B1B1B)' : undefined }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;