// client/src/pages/public/PricingPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { APP_INFO } from '@constants/platform';

export function PricingPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('pricing.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 700, margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          {tp('pricing.title')}
        </h1>
        <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, color: 'var(--color-primary, #2E7D32)' }}>
          {tp('pricing.headline')}
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          {tp('pricing.description')}
        </p>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            {tp('pricing.freeTitle')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
            {tp('pricing.freeBody')}
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            {tp('pricing.feesTitle')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
            {tp('pricing.feesBody')}
          </p>
        </section>

        <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', marginTop: 32 }}>
          {tp('pricing.note', { version: APP_INFO.VERSION })}
        </p>
      </article>
    </>
  );
}