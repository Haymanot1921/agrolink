// client/src/layouts/common/PublicLayout.jsx
// Wraps every public page (home, marketplace, articles, etc.).
// Provides:
//   - PublicHeader (with language switcher + login/register)
//   - Main content area
//   - PublicFooter
//   - Offline banner (top)
//
// SRS refs: §11.1, §11.7.

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { useNetworkStatus } from '@hooks/useNetworkStatus';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function PublicLayout() {
  const { isConnected } = useNetworkStatus();
  const { t } = useTranslation('common');
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
      }}
    >
      {/* Offline banner */}
      {!isConnected && (
        <div
          role="status"
          aria-live="polite"
          style={{
            background: 'var(--color-warning)',
            color: 'var(--color-text-on-accent)',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ⚠ {t('offline.banner')}
        </div>
      )}

      <PublicHeader />

      <main
        id="main-content"
        key={location.pathname}
        tabIndex={-1}
        style={{ flex: 1 }}
      >
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}