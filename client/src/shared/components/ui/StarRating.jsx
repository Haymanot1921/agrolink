// client/src/shared/components/ui/StarRating.jsx
// Read-only or interactive star rating (1..5).
// SRS refs: §5.14, NFR-ACCESS-003 (icon + value, not color-only).

import React, { useState } from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function StarRating({ value = 0, max = 5, interactive = false, onChange, size = 20, showValue = false }) {
  const { t } = useTranslation('common');
  const [hover, setHover] = useState(0);
  const display = interactive ? hover || value : value;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <div role={interactive ? 'radiogroup' : 'img'} aria-label={t('rating.label', { value, max })} style={{ display: 'inline-flex', gap: 2 }}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < display;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? value === i + 1 : undefined}
              aria-label={interactive ? t('rating.select', { value: i + 1 }) : undefined}
              onMouseEnter={interactive ? () => setHover(i + 1) : undefined}
              onMouseLeave={interactive ? () => setHover(0) : undefined}
              onClick={interactive ? () => onChange?.(i + 1) : undefined}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: interactive ? 'pointer' : 'default',
                color: filled ? '#F59E0B' : 'var(--color-border, #E0E0E0)',
                fontSize: size,
                lineHeight: 1,
              }}
            >
              ★
            </button>
          );
        })}
      </div>
      {showValue && (
        <span style={{ fontSize: size * 0.7, color: 'var(--color-text-muted, #5F6368)', fontWeight: 600 }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;