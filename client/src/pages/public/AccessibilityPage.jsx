// client/src/pages/public/AccessibilityPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function AccessibilityPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  const features = [1, 2, 3, 4, 5];
  const sections = ['commitment', 'language', 'assisted', 'limitations', 'feedback'];

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('accessibility.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          {tp('accessibility.heading')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {tp('accessibility.lastUpdated', { date: 'January 2025' })}
        </p>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            {tp('accessibility.commitmentTitle')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
            {tp('accessibility.commitmentBody')}
          </p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            {tp('accessibility.featuresTitle')}
          </h2>
          <ul style={{ paddingLeft: 24 }}>
            {features.map((n) => (
              <li key={n} style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)', marginBottom: 6 }}>
                {tp(`accessibility.feature${n}`)}
              </li>
            ))}
          </ul>
        </section>

        {sections.slice(1).map((s) => (
          <section key={s} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {tp(`accessibility.${s}Title`)}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
              {tp(`accessibility.${s}Body`)}
            </p>
          </section>
        ))}
      </article>
    </>
  );
}