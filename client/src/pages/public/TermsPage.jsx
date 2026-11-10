// client/src/pages/public/TermsPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function TermsPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('terms.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>
          {tp('terms.heading')}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
          {tp('terms.body')}
        </p>
      </article>
    </>
  );
}