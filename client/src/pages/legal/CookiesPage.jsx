// client/src/pages/legal/CookiesPage.jsx
// Cookie Policy — brief, practical.
// SRS refs: §14.5 data privacy.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

const COOKIE_TYPES = ['essential', 'functional', 'analytics', 'preferences'];

export function CookiesPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${t('legal.cookies.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 800, margin: '0 auto', padding: '48px 16px', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          {t('legal.cookies.title')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {t('legal.lastUpdated')}: {t('legal.cookies.lastUpdated')}
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.cookies.sections.what.title')}</h2>
          <p>{t('legal.cookies.sections.what.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.cookies.sections.types.title')}</h2>
          <div
            style={{
              display: 'grid',
              gap: 12,
              marginTop: 16,
            }}
          >
            {COOKIE_TYPES.map((key) => (
              <div
                key={key}
                style={{
                  padding: 16,
                  background: 'var(--color-surface, #F5F7FA)',
                  borderRadius: 8,
                }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                  {t(`legal.cookies.sections.types.${key}.title`)}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
                  {t(`legal.cookies.sections.types.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.cookies.sections.manage.title')}</h2>
          <p>{t('legal.cookies.sections.manage.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.cookies.sections.thirdParty.title')}</h2>
          <p>{t('legal.cookies.sections.thirdParty.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.cookies.sections.contact.title')}</h2>
          <p>{t('legal.cookies.sections.contact.body')}</p>
        </section>
      </article>
    </>
  );
}

const h2 = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 12,
};