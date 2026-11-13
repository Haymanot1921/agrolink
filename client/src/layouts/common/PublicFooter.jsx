// client/src/layouts/common/PublicFooter.jsx
// Footer for all public pages.
// 4-column layout — Explore / Company / Legal / Contact.
// Bilingual. SRS refs: §11.1, FR-ACCESS-006.

import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { APP_INFO } from '@constants/platform';

export function PublicFooter() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');
  const year = new Date().getFullYear();

  const groups = [
    {
      titleKey: 'more.aboutGroup',
      links: [
        { to: '/marketplace', label: tp('tabs.market') },
        { to: '/articles', label: tp('tabs.articles') },
        { to: '/experts', label: tp('tabs.experts') },
        { to: '/help', label: t('labels.help') },
      ],
    },
    {
      titleKey: 'more.companyGroup',
      links: [
        { to: '/about', label: tp('about.title') },
        { to: '/careers', label: tp('careers.title') },
        { to: '/press', label: tp('press.title') },
        { to: '/blog', label: tp('blog.title') },
      ],
    },
    {
      titleKey: 'more.legalGroup',
      links: [
        { to: '/terms', label: tp('terms.title') },
        { to: '/privacy', label: tp('privacy.title') },
        { to: '/cookies', label: tp('cookies.title') },
        { to: '/accessibility', label: tp('accessibility.title') },
      ],
    },
  ];

  return (
    <footer
      className="public-footer"
      style={{
        background: 'var(--color-background-alt, #F5F5F5)',
        borderTop: '1px solid var(--color-border, #E0E0E0)',
        marginTop: 48,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 16px 24px',
        }}
      >
        {/* ─────────── Top grid ─────────── */}
        <div
          className="public-footer__grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 32,
            marginBottom: 32,
          }}
        >
          {/* Brand column */}
          <div           className="public-footer__brand"
          <div style={{ gridColumn: 'span 2' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--color-primary, #2E7D32)',
                textDecoration: 'none',
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              <img src="/images/branding/logo.svg" alt="" width={28} height={28} />
              {t('appName')}
            </Link>
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-text-muted, #5F6368)',
                marginTop: 12,
                maxWidth: 360,
                lineHeight: 1.6,
              }}
            >
              {t('tagline')}
            </p>
          </div>

          {/* Link groups */}
          {groups.map((group) => (
            <div key={group.titleKey}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'var(--color-text-muted, #5F6368)',
                  marginBottom: 12,
                }}
              >
                {tp(group.titleKey)}
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      style={{
                        fontSize: 14,
                        color: 'var(--color-text, #1B1B1B)',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'var(--color-text-muted, #5F6368)',
                marginBottom: 12,
              }}
            >
              {t('labels.support')}
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 14,
              }}
            >
              {APP_INFO.SUPPORT_EMAIL && (
                <li>
                  <a
                    href={`mailto:${APP_INFO.SUPPORT_EMAIL}`}
                    style={{ color: 'var(--color-text, #1B1B1B)' }}
                  >
                    ✉ {APP_INFO.SUPPORT_EMAIL}
                  </a>
                </li>
              )}
              {APP_INFO.SUPPORT_PHONE && (
                <li>
                  <a
                    href={`tel:${APP_INFO.SUPPORT_PHONE}`}
                    style={{ color: 'var(--color-text, #1B1B1B)' }}
                  >
                    ☎ {APP_INFO.SUPPORT_PHONE}
                  </a>
                </li>
              )}
              <li>
                <Link
                  to="/contact"
                  style={{ color: 'var(--color-text, #1B1B1B)' }}
                >
                  → {tp('contact.title')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─────────── Bottom bar ─────────── */}
        <div
          className="public-footer__bottom"
          style={{
            borderTop: '1px solid var(--color-border, #E0E0E0)',
            paddingTop: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 12,
            color: 'var(--color-text-muted, #5F6368)',
            textAlign: 'center',
          }}
        >
          <span>
            © {year} {t('appName')} · {t('labels.version')} {APP_INFO.VERSION}
          </span>
          <span>
            <Link to="/terms" style={{ color: 'inherit', marginRight: 12 }}>
              {tp('terms.title')}
            </Link>
            <Link to="/privacy" style={{ color: 'inherit', marginRight: 12 }}>
              {tp('privacy.title')}
            </Link>
            <Link to="/cookies" style={{ color: 'inherit' }}>
              {tp('cookies.title')}
            </Link>
          </span>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .public-footer__grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .public-footer__grid > div:first-child {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </footer>
  );
}