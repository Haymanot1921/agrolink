// client/src/pages/public/AboutPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function AboutPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('about.title')}`}</title>
      </Helmet>
      <article
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '48px 16px',
          lineHeight: 1.7,
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>
          {tp('about.title')}
        </h1>

        {[
          { titleKey: 'about.missionTitle', bodyKey: 'about.missionBody' },
          { titleKey: 'about.storyTitle', bodyKey: 'about.storyBody' },
          { titleKey: 'about.teamTitle', bodyKey: 'about.teamBody' },
          { titleKey: 'about.contactTitle', bodyKey: 'about.contactBody' },
        ].map((s) => (
          <section key={s.titleKey} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              {tp(s.titleKey)}
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted, #5F6368)' }}>
              {tp(s.bodyKey)}
            </p>
          </section>
        ))}
      </article>
    </>
  );
}