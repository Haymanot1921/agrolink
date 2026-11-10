// client/src/pages/public/HowItWorksPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function HowItWorksPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  const actors = [
    { key: 'farmer', icon: '🌾', titleKey: 'howItWorks.farmerTitle', bodyKey: 'howItWorks.farmerBody' },
    { key: 'buyer', icon: '🛒', titleKey: 'howItWorks.buyerTitle', bodyKey: 'howItWorks.buyerBody' },
    { key: 'serviceProvider', icon: '🚜', titleKey: 'howItWorks.serviceProviderTitle', bodyKey: 'howItWorks.serviceProviderBody' },
    { key: 'supportAgent', icon: '🤝', titleKey: 'howItWorks.supportAgentTitle', bodyKey: 'howItWorks.supportAgentBody' },
    { key: 'administrator', icon: '🛡️', titleKey: 'howItWorks.administratorTitle', bodyKey: 'howItWorks.administratorBody' },
  ];

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('howItWorks.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}>
          {tp('howItWorks.title')}
        </h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {actors.map((a) => (
            <div
              key={a.key}
              style={{
                padding: 24,
                border: '1px solid var(--color-border, #E0E0E0)',
                borderRadius: 12,
                background: 'var(--color-card, #fff)',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }} aria-hidden>
                {a.icon}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                {tp(a.titleKey)}
              </h2>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
                {tp(a.bodyKey)}
              </p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}