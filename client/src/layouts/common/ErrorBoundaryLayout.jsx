// client/src/layouts/common/ErrorBoundaryLayout.jsx
// Fallback UI when the app crashes (render error, failed chunk load).
// Bilingual — uses i18n.t() directly so it works even if the i18n
// provider tree fails.
//
// SRS refs: §15.2 (safe error messages), NFR-REL-004, NFR-SEC-010.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import i18n from '@i18n/index';

export class ErrorBoundaryLayout extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[AgroLink ErrorBoundaryLayout]', error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const t = i18n.t.bind(i18n);
    const { error } = this.state;
    const isDev = import.meta.env.DEV;

    return (
      <div
        role="alert"
        aria-live="assertive"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'var(--color-background, #fff)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>⚠️</div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 8,
              color: 'var(--color-text, #1B1B1B)',
            }}
          >
            {t('messages.serverError', {
              ns: 'common',
              defaultValue: 'Something went wrong',
            })}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--color-text-muted, #5F6368)',
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            {t('messages.tryAgain', {
              ns: 'common',
              defaultValue: 'Please try again.',
            })}
          </p>

          {isDev && error && (
            <pre
              style={{
                textAlign: 'left',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 8,
                padding: 12,
                marginBottom: 24,
                color: '#991B1B',
                fontSize: 12,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              {error.name}: {error.message}
            </pre>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                padding: '12px 20px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--color-primary, #2E7D32)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {t('actions.refresh', { ns: 'common', defaultValue: 'Reload' })}
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              style={{
                padding: '12px 20px',
                borderRadius: 10,
                border: '1px solid var(--color-primary, #2E7D32)',
                background: 'transparent',
                color: 'var(--color-primary, #2E7D32)',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {t('notFound.goHome', {
                ns: 'common',
                defaultValue: 'Go to home',
              })}
            </button>
          </div>
        </div>
      </div>
    );
  }
}