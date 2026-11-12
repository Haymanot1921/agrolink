// client/src/pages/public/NotFoundPage.jsx
// 404 — catches any unmatched route.
// Guest-accessible. Bilingual.

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function NotFoundPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${t('notFound.title')}`}</title>
      </Helmet>
      <section
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 16px',
          textAlign: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: 'var(--color-primary, #2E7D32)',
              lineHeight: 1,
              marginBottom: 8,
            }}
            aria-hidden
          >
            404
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 12,
              color: 'var(--color-text, #1B1B1B)',
            }}
          >
            {t('notFound.title')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--color-text-muted, #5F6368)',
              marginBottom: 32,
              maxWidth: 400,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {t('notFound.body')}
          </p>
          <Link
            to="/"
            style={{
              padding: '14px 28px',
              borderRadius: 10,
              background: 'var(--color-primary, #2E7D32)',
              color: 'var(--color-text-on-primary)',
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {t('notFound.goHome')}
          </Link>
        </div>
      </section>
    </>
  );
}