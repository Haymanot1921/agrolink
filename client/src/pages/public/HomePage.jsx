// client/src/pages/public/HomePage.jsx
// Landing page — hero, features, stats, CTA.
// Guest-accessible. SRS §11.1, §11.7.

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { defaultRouteFor } from '@app/routeGuards';

export function HomePage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');
  const { user } = useAuth();
  const ctaHref = user ? defaultRouteFor(user) : '/auth/role';

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('home.heroTitle')}`}</title>
        <meta name="description" content={tp('home.heroSubtitle')} />
      </Helmet>

      {/* ─────────── HERO ─────────── */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)',
          padding: '64px 16px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              lineHeight: 1.15,
              fontWeight: 800,
              color: 'var(--color-text, #1B1B1B)',
              marginBottom: 16,
            }}
          >
            {tp('home.heroTitle')}
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.5,
              color: 'var(--color-text-muted, #5F6368)',
              marginBottom: 32,
            }}
          >
            {tp('home.heroSubtitle')}
          </p>
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/marketplace"
              style={{
                padding: '14px 28px',
                borderRadius: 10,
                background: 'var(--color-primary, #2E7D32)',
                color: 'var(--color-text-on-primary)',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {tp('home.ctaBrowse')}
            </Link>
            <Link
              to={ctaHref}
              style={{
                padding: '14px 28px',
                borderRadius: 10,
                border: '2px solid var(--color-primary, #2E7D32)',
                color: 'var(--color-primary, #2E7D32)',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                background: '#fff',
              }}
            >
              {tp('home.ctaSignUp')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section style={{ padding: '64px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: 40,
              color: 'var(--color-text, #1B1B1B)',
            }}
          >
            {tp('home.featuresTitle')}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            {[
              { icon: '🌾', titleKey: 'home.featureSell', bodyKey: 'home.featureSellBody' },
              { icon: '🛒', titleKey: 'home.featureBuy', bodyKey: 'home.featureBuyBody' },
              { icon: '👨‍🌾', titleKey: 'home.featureAdvice', bodyKey: 'home.featureAdviceBody' },
            ].map((f) => (
              <div
                key={f.titleKey}
                style={{
                  padding: 24,
                  background: 'var(--color-card, #fff)',
                  border: '1px solid var(--color-border, #E0E0E0)',
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }} aria-hidden>
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: 'var(--color-text, #1B1B1B)',
                  }}
                >
                  {tp(f.titleKey)}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: 'var(--color-text-muted, #5F6368)',
                  }}
                >
                  {tp(f.bodyKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section
        style={{ background: 'var(--color-surface-2)', padding: '64px 16px' }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
            {tp('home.howItWorksTitle')}
          </h2>
          <Link
            to="/how-it-works"
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: 'var(--color-primary, #2E7D32)',
              color: 'var(--color-text-on-primary)',
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 700,
              display: 'inline-block',
            }}
          >
            {t('actions.learnMore')}
          </Link>
        </div>
      </section>
    </>
  );
}