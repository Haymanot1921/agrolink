// client/src/layouts/common/AuthLayout.jsx
// Wrapper for all auth pages (login, register, OTP, reset).
// - Centered card
// - Brand panel on the left (desktop) — collapses on mobile
// - Language switcher (top-right)
// - Secure links to Terms / Privacy
// - Bilingual by design (all text via t())

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

export function AuthLayout() {
  const { t } = useTranslation('common');
  const { t: ta } = useTranslation('auth');
  const { t: tp } = useTranslation('public');
  const { language, direction } = useLanguage();
  const location = useLocation();

  // Redirect target after successful auth (used by LoginPage/RegisterPage)
  const from = location.state?.from || '/';

  return (
    <>
      <Helmet>
        <html lang={language} dir={direction} />
        <title>{`${t('appName')} · ${ta('login.title')}`}</title>
      </Helmet>

      <div
        className="auth-layout"
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          background: 'var(--color-background, #fff)',
        }}
      >
        {/* ─────────── Language switcher (top right) ─────────── */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <LanguageSwitcher variant="compact" />
        </div>

        {/* ─────────── Left panel — brand (desktop only) ─────────── */}
        <aside
          className="auth-layout__brand"
          aria-hidden="true"
          style={{
            display: 'none', // shown via CSS at >= 768px
            background:
              'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
            color: '#fff',
            padding: '48px 40px',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              color: '#fff',
              textDecoration: 'none',
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 40,
            }}
          >
            <img
              src="/images/branding/logo.svg"
              alt=""
              width={36}
              height={36}
            />
            {t('appName')}
          </Link>

          <h2
            style={{
              fontSize: 32,
              lineHeight: 1.2,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            {ta('welcome.title')}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.9 }}>
            {ta('welcome.subtitle')}
          </p>
        </aside>

        {/* ─────────── Right panel — the actual form ─────────── */}
        <section
          className="auth-layout__content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              background: 'var(--color-card, #fff)',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Mobile-only brand */}
            <Link
              to="/"
              className="auth-layout__brand-mobile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--color-primary, #2E7D32)',
                textDecoration: 'none',
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              <img src="/images/branding/logo.svg" alt="" width={28} height={28} />
              {t('appName')}
            </Link>

            <Outlet context={{ from }} />

            {/* Legal footer */}
            <p
              style={{
                fontSize: 12,
                color: 'var(--color-text-muted, #5F6368)',
                textAlign: 'center',
                marginTop: 32,
                lineHeight: 1.6,
              }}
            >
              {t('labels.terms')} · {t('labels.privacy')}{' '}
              <br />
              <Link to="/terms" style={{ color: 'inherit' }}>
                {tp('terms.title')}
              </Link>{' '}
              ·{' '}
              <Link to="/privacy" style={{ color: 'inherit' }}>
                {tp('privacy.title')}
              </Link>
            </p>
          </div>
        </section>
      </div>

      {/* Responsive: show brand panel + hide mobile logo on desktop */}
      <style>{`
        @media (min-width: 768px) {
          .auth-layout { grid-template-columns: 1fr 1fr !important; }
          .auth-layout__brand { display: flex !important; }
          .auth-layout__brand-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}