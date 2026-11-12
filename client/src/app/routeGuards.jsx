// client/src/app/routeGuards.jsx
// Declarative route guards for the web app.
// ⚠️ These are UX-only. The BACKEND enforces authorization
//     (SRS §9.4, §14.2) — never trust the client.
//
// Supports 5 actors (SRS §4.1) + 2 provider types (SRS §4.1.3).
// Falls back to localized error pages (EN + AM).

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@hooks/useAuth';

// ─────────────────────────────────────────────────────────────
// RequireAuth — user must be logged in
// ─────────────────────────────────────────────────────────────

export function RequireAuth({ children, redirectTo = '/auth/login' }) {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <FullPageLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}

// ─────────────────────────────────────────────────────────────
// RequireRole — user must have one of the allowed roles
// ─────────────────────────────────────────────────────────────

export function RequireRole({ children, roles = [], providerType }) {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) return <FullPageLoader />;

  if (!user) return <Navigate to="/auth/login" replace />;

  if (!roles.includes(user.role)) {
    return <Navigate to="/error/403" replace />;
  }

  // Additional check for service_provider (SRS §4.1.3, BR-026)
  if (providerType && user.role === 'service_provider') {
    if (user.providerType !== providerType) {
      return <Navigate to="/error/403" replace />;
    }
  }

  return children;
}

// ─────────────────────────────────────────────────────────────
// GuestOnly — user must NOT be logged in (auth pages)
// ─────────────────────────────────────────────────────────────

export function GuestOnly({ children }) {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) return <FullPageLoader />;

  if (user) {
    return <Navigate to={defaultRouteFor(user)} replace />;
  }

  return children;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Resolve the default landing page for a user by role + providerType.
 * Used after login and after guest-only redirect.
 */
export function defaultRouteFor(user) {
  if (!user) return '/';
  switch (user.role) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'buyer':
      return '/buyer/dashboard';
    case 'service_provider':
      return user.providerType === 'agricultural_expert'
        ? '/expert/dashboard'
        : '/supplier/dashboard';
    case 'support_agent':
      return '/support-agent/dashboard';
    case 'administrator':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

// ─────────────────────────────────────────────────────────────
// Full-page bilingual loader
// ─────────────────────────────────────────────────────────────

function FullPageLoader() {
  const { t } = useTranslation('common');
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        flexDirection: 'column',
        gap: '12px',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="spinner"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid var(--color-border, #e0e0e0)',
          borderTopColor: 'var(--color-primary, #2E7D32)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: 'var(--color-text-muted, #5F6368)', fontSize: 14 }}>
        {t('messages.loading', 'Loading…')}
      </p>
    </div>
  );
}