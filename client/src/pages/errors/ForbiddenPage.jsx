// client/src/pages/errors/ForbiddenPage.jsx
// 403 — user authenticated but lacks permission.
// SRS refs: §14.2 authorization, §15.2 error handling.

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { defaultRouteFor } from '@app/routeGuards';

export function ForbiddenPage() {
  const { t } = useTranslation('common');
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>{`403 · ${t('appName')}`}</title>
      </Helmet>
      <div
        style={{
          maxWidth: 500,
          margin: '0 auto',
          padding: '80px 16px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }} aria-hidden>
          🚫
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>403</h1>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          {t('errors.forbidden.title')}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32, lineHeight: 1.6 }}>
          {t('errors.forbidden.message')}
        </p>
        <Link
          to={user ? defaultRouteFor(user) : '/'}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'var(--color-primary, #2E7D32)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {user ? t('actions.goToDashboard') : t('actions.goHome')}
        </Link>
      </div>
    </>
  );
}