// client/src/pages/legal/PrivacyPage.jsx
// Privacy Policy — special emphasis on Assisted Farmer Privacy (§14.3).
// SRS refs: §14.3 assisted farmer privacy, §14.5 data privacy.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function PrivacyPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${t('legal.privacy.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 800, margin: '0 auto', padding: '48px 16px', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          {t('legal.privacy.title')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {t('legal.lastUpdated')}: {t('legal.privacy.lastUpdated')}
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.collect.title')}</h2>
          <p>{t('legal.privacy.sections.collect.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.use.title')}</h2>
          <p>{t('legal.privacy.sections.use.body')}</p>
        </section>

        {/* Highlighted: assisted farmer privacy */}
        <section
          style={{
            marginBottom: 32,
            padding: 20,
            background: 'var(--color-primary-light, #E8F5E9)',
            borderRadius: 12,
            borderLeft: '4px solid var(--color-primary, #2E7D32)',
          }}
        >
          <h2 style={{ ...h2, color: 'var(--color-primary, #2E7D32)' }}>
            {t('legal.privacy.sections.assistedFarmer.title')}
          </h2>
          <p>{t('legal.privacy.sections.assistedFarmer.body')}</p>
          <ul style={{ paddingLeft: 20, marginTop: 12 }}>
            <li>{t('legal.privacy.sections.assistedFarmer.points.consent')}</li>
            <li>{t('legal.privacy.sections.assistedFarmer.points.ownership')}</li>
            <li>{t('legal.privacy.sections.assistedFarmer.points.agentRecord')}</li>
            <li>{t('legal.privacy.sections.assistedFarmer.points.noPassword')}</li>
            <li>{t('legal.privacy.sections.assistedFarmer.points.correction')}</li>
            <li>{t('legal.privacy.sections.assistedFarmer.points.withdrawal')}</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.sharing.title')}</h2>
          <p>{t('legal.privacy.sections.sharing.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.security.title')}</h2>
          <p>{t('legal.privacy.sections.security.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.retention.title')}</h2>
          <p>{t('legal.privacy.sections.retention.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.rights.title')}</h2>
          <p>{t('legal.privacy.sections.rights.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.children.title')}</h2>
          <p>{t('legal.privacy.sections.children.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.privacy.sections.contact.title')}</h2>
          <p>{t('legal.privacy.sections.contact.body')}</p>
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