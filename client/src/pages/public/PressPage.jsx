// client/src/pages/public/PressPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { APP_INFO } from '@constants/platform';

const ASSETS = [
  { key: 'logo', labelKey: 'press.assetLogo', href: `${APP_INFO.WEBSITE}/press/logo.zip` },
  { key: 'photos', labelKey: 'press.assetPhotos', href: `${APP_INFO.WEBSITE}/press/photos.zip` },
  { key: 'factsheet', labelKey: 'press.assetFactSheet', href: `${APP_INFO.WEBSITE}/press/fact-sheet.pdf` },
];

export function PressPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('press.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px', lineHeight: 1.7 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
          {tp('press.heading')}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {tp('press.intro')}
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {tp('press.aboutTitle')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
            {tp('press.aboutBody')}
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {tp('press.factsTitle')}
          </h2>
          <ul style={{ paddingLeft: 24 }}>
            {[1, 2, 3, 4].map((n) => (
              <li key={n} style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)', marginBottom: 6 }}>
                {tp(`press.fact${n}`)}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {tp('press.assetsTitle')}
          </h2>
          {ASSETS.map((a) => (
            <a
              key={a.key}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                border: '1px solid var(--color-border, #E0E0E0)',
                borderRadius: 10,
                textDecoration: 'none',
                marginBottom: 10,
                color: 'var(--color-text, #1B1B1B)',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600 }}>{tp(a.labelKey)}</span>
              <span style={{ color: 'var(--color-primary, #2E7D32)', fontWeight: 700 }}>
                {tp('press.download')} ⬇
              </span>
            </a>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {tp('press.contactTitle')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
            {tp('press.contactBody')}
          </p>
          <p style={{ fontSize: 15 }}>📧 press@agrolink.et</p>
        </section>
      </article>
    </>
  );
}