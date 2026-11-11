// client/src/pages/errors/ServerErrorPage.jsx
// 500 — unexpected server error.
// SRS refs: §15.2 error handling.

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function ServerErrorPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{`500 · ${t('appName')}`}</title>
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
          ⚠️
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>500</h1>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          {t('errors.serverError.title')}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32, lineHeight: 1.6 }}>
          {t('errors.serverError.message')}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              background: 'var(--color-primary, #2E7D32)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t('actions.retry')}
          </button>
          <Link
            to="/"
            style={{
              padding: '12px 28px',
              background: 'transparent',
              color: 'var(--color-primary, #2E7D32)',
              textDecoration: 'none',
              border: '2px solid var(--color-primary, #2E7D32)',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {t('actions.goHome')}
          </Link>
        </div>
      </div>
    </>
  );
}