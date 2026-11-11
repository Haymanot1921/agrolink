// client/src/pages/errors/MaintenancePage.jsx
// Shown when platform_settings.maintenance_mode.enabled = true.
// SRS refs: §17.2 configuration, FR-ADMIN-018.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function MaintenancePage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${t('errors.maintenance.title')}`}</title>
      </Helmet>
      <div
        style={{
          maxWidth: 540,
          margin: '0 auto',
          padding: '80px 16px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }} aria-hidden>
          🛠️
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
          {t('errors.maintenance.title')}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)', marginBottom: 24, lineHeight: 1.7 }}>
          {t('errors.maintenance.message')}
        </p>
        <div
          style={{
            padding: 16,
            background: 'var(--color-surface, #F5F7FA)',
            borderRadius: 8,
            fontSize: 13,
            color: 'var(--color-text-muted, #5F6368)',
          }}
        >
          {t('errors.maintenance.contactSupport')}
        </div>
      </div>
    </>
  );
}