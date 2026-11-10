// client/src/pages/public/PrivacyPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { APP_INFO } from '@constants/platform';

export function PrivacyPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  const sections = [
    'intro', 'collect', 'use', 'share', 'assisted', 'rights', 'security',
  ];

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('privacy.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          {tp('privacy.heading')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {tp('privacy.lastUpdated', { date: 'January 2025' })}
        </p>

        {sections.map((s) => (
          <section key={s} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {tp(`privacy.${s}Title`)}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
              {tp(`privacy.${s}Body`)}
            </p>
          </section>
        ))}

        <section style={{ marginTop: 32, padding: 16, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 10 }}>
          <p style={{ fontSize: 14 }}>
            ✉ <a href={`mailto:${APP_INFO.SUPPORT_EMAIL}`}>{APP_INFO.SUPPORT_EMAIL}</a>
          </p>
        </section>
      </article>
    </>
  );
}