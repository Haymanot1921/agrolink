// client/src/modules/auth/components/AuthCard.jsx
// Shared shell for all auth screens — logo, title, subtitle, optional error.
// SRS refs: §11.8 UI/UX design principles.

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function AuthCard({ title, subtitle, error, children, footer, showLogo = true }) {
  const { t } = useTranslation('common');

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 440,
        margin: '0 auto',
        padding: '32px 24px',
        background: 'var(--color-card, #fff)',
        borderRadius: 16,
        border: '1px solid var(--color-border, #E0E0E0)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      }}
    >
      {showLogo && (
        <Link
          to="/"
          aria-label={t('appName')}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 24,
            textDecoration: 'none',
          }}
        >
          <img
            src="/images/branding/logo.svg"
            alt={t('appName')}
            style={{ height: 44 }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--color-primary, #2E7D32)',
            }}
          >
            {t('appName')}
          </span>
        </Link>
      )}

      {(title || subtitle) && (
        <header style={{ textAlign: 'center', marginBottom: 24 }}>
          {title && (
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{title}</h1>
          )}
          {subtitle && (
            <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
              {subtitle}
            </p>
          )}
        </header>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: 12,
            background: '#FEF2F2',
            color: '#991B1B',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {children}

      {footer && <footer style={{ marginTop: 24, textAlign: 'center' }}>{footer}</footer>}
    </div>
  );
}