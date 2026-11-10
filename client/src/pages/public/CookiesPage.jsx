// client/src/pages/public/CookiesPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function CookiesPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  const sections = ['intro', 'mobile', 'essential', 'analytics', 'manage', 'clear'];

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('cookies.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          {tp('cookies.heading')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {tp('cookies.lastUpdated', { date: 'January 2025' })}
        </p>

        {sections.map((s) => (
          <section key={s} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {tp(`cookies.${s}Title`)}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
              {tp(`cookies.${s}Body`)}
            </p>
          </section>
        ))}
      </article>
    </>
  );
}