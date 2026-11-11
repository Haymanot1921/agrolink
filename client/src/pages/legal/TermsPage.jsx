// client/src/pages/legal/TermsPage.jsx
// Terms of Service — static bilingual legal content.
// SRS refs: §11.1, §14.5 data privacy.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function TermsPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${t('legal.terms.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 800, margin: '0 auto', padding: '48px 16px', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          {t('legal.terms.title')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {t('legal.lastUpdated')}: {t('legal.terms.lastUpdated')}
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.acceptance.title')}</h2>
          <p>{t('legal.terms.sections.acceptance.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.accounts.title')}</h2>
          <p>{t('legal.terms.sections.accounts.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.assistedAccess.title')}</h2>
          <p>{t('legal.terms.sections.assistedAccess.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.marketplace.title')}</h2>
          <p>{t('legal.terms.sections.marketplace.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.orders.title')}</h2>
          <p>{t('legal.terms.sections.orders.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.excluded.title')}</h2>
          <p>{t('legal.terms.sections.excluded.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.prohibited.title')}</h2>
          <p>{t('legal.terms.sections.prohibited.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.liability.title')}</h2>
          <p>{t('legal.terms.sections.liability.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.changes.title')}</h2>
          <p>{t('legal.terms.sections.changes.body')}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2}>{t('legal.terms.sections.contact.title')}</h2>
          <p>{t('legal.terms.sections.contact.body')}</p>
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