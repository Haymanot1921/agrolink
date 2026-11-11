// client/src/shared/components/ui/LoadingSpinner.jsx
// SRS refs: §11.8.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

const SIZES = { sm: 16, md: 24, lg: 40, xl: 64 };

export function LoadingSpinner({ size = 'md', label, inline = false }) {
  const { t } = useTranslation('common');
  const px = SIZES[size] ?? SIZES.md;
  const ariaLabel = label ?? t('messages.loading');

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: inline ? 0 : 24,
      }}
    >
      <span
        aria-hidden
        style={{
          width: px,
          height: px,
          border: `${Math.max(2, px / 10)}px solid var(--color-border, #E0E0E0)`,
          borderTopColor: 'var(--color-primary, #2E7D32)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export default LoadingSpinner;