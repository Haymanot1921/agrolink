// client/src/layouts/common/BaseLayout.jsx
// Root layout for the entire web app.
// Provides:
//   - Skip-to-content link (WCAG 2.4.1, NFR-ACCESS-001)
//   - <html lang> + <html dir> via Helmet (per route)
//   - Global scroll reset on route change
//   - Focus management for accessibility
//
// Do NOT render public headers/footers here — those go in PublicLayout.
// Actor layouts (FarmerLayout, BuyerLayout, etc.) wrap BaseLayout too.

import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';

export function BaseLayout() {
  const { t } = useTranslation('common');
  const { language, direction } = useLanguage();
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Move focus to the main landmark after navigation (accessibility)
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <html lang={language} dir={direction} />
        <title>{t('appName')}</title>
      </Helmet>

      {/* Skip link — WCAG 2.4.1 (Bypass Blocks) */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: -40,
          left: 8,
          padding: '8px 16px',
          background: 'var(--color-primary, #2E7D32)',
          color: '#fff',
          zIndex: 9999,
          textDecoration: 'none',
          borderRadius: 4,
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = '8px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-40px';
        }}
      >
        {t('accessibility.skipToContent', 'Skip to main content')}
      </a>

      {/* Main landmark — receives focus after navigation */}
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}