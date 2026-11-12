// client/src/layouts/common/PublicHeader.jsx
// Top navigation for all public pages.
// Bilingual, responsive (hamburger on mobile), role-aware CTAs.

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { LanguageSwitcher } from './LanguageSwitcher';
import { defaultRouteFor } from '@app/routeGuards';

export function PublicHeader() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/marketplace', label: tp('tabs.market') },
    { to: '/articles', label: tp('tabs.articles') },
    { to: '/market-prices', label: tp('tabs.more') /* reused */ },
    { to: '/experts', label: tp('tabs.experts') },
    { to: '/help', label: t('labels.help') },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-card, #fff)',
        borderBottom: '1px solid var(--color-border, #E0E0E0)',
      }}
    >
      <nav
        aria-label="Main navigation"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: 'var(--color-primary, #2E7D32)',
            fontSize: 18,
            fontWeight: 800,
            marginRight: 8,
          }}
        >
          <img src="/images/branding/logo.svg" alt="" width={28} height={28} />
          <span>{t('appName')}</span>
        </Link>

        {/* Desktop nav links */}
        <ul
          className="public-header__nav"
          style={{
            display: 'none', // shown via CSS at >= 900px
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: 4,
            flex: 1,
          }}
        >
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '8px 12px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: isActive
                    ? 'var(--color-primary, #2E7D32)'
                    : 'var(--color-text, #1B1B1B)',
                  background: isActive
                    ? 'var(--color-primary-light, #E8F5E9)'
                    : 'transparent',
                  fontSize: 14,
                  fontWeight: 600,
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div style={{ flex: 1 }} />

        {/* Language switcher */}
        <LanguageSwitcher variant="compact" />

        {/* Auth CTAs */}
        {user ? (
          <Link
            to={defaultRouteFor(user)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--color-primary, #2E7D32)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {t('labels.profile')}
          </Link>
        ) : (
          <>
            <Link
              to="/auth/login"
              className="public-header__auth"
              style={{
                padding: '8px 14px',
                color: 'var(--color-text, #1B1B1B)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {t('actions.login')}
            </Link>
            <Link
              to="/auth/role"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: 'var(--color-primary, #2E7D32)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {t('actions.signUp')}
            </Link>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          type="button"
          className="public-header__burger"
          aria-expanded={menuOpen}
          aria-controls="public-mobile-menu"
          aria-label={menuOpen ? t('accessibility.closeDialog') : t('accessibility.openMenu')}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: 'inline-flex',
            padding: 8,
            background: 'transparent',
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 18,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <ul
          id="public-mobile-menu"
          style={{
            listStyle: 'none',
            padding: '8px 16px 16px',
            margin: 0,
            borderTop: '1px solid var(--color-border, #E0E0E0)',
          }}
        >
          {navLinks.map((link) => (
            <li key={link.to} style={{ marginBottom: 4 }}>
              <NavLink
                to={link.to}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '12px 8px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: isActive
                    ? 'var(--color-primary, #2E7D32)'
                    : 'var(--color-text, #1B1B1B)',
                  fontWeight: 600,
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}

      {/* Responsive rules */}
      <style>{`
        @media (min-width: 900px) {
          .public-header__nav { display: flex !important; }
          .public-header__burger { display: none !important; }
        }
        @media (max-width: 480px) {
          .public-header__auth { display: none !important; }
        }
      `}</style>
    </header>
  );
}