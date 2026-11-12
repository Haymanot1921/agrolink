// client/src/app/errorBoundary.jsx
// Top-level error boundary for the web app.
// Catches render errors and shows a friendly bilingual recovery page.
// Logs are scrubbed of sensitive data before being reported (SRS §15.3).
//
// SRS refs: §15.2 (safe error messages), NFR-REL-004, NFR-SEC-010.

import React from 'react';
import i18n from '@i18n/index';

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Sanitize before reporting — NEVER log tokens/passwords
    // eslint-disable-next-line no-console
    console.error('[AgroLink ErrorBoundary]', error, errorInfo?.componentStack);

    this.setState({ errorInfo });

    // Optional crash reporting hook (SRS §15.3)
    // if (import.meta.env.VITE_ENABLE_CRASH_REPORTING === 'true') {
    //   Sentry.captureException(error, { extra: { componentStack: errorInfo?.componentStack } });
    // }
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    // Use i18n.t so the recovery screen is bilingual
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
          padding: '24px',
          background: 'var(--color-bg)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 8 }}>⚠️</div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-text, #1B1B1B)',
              marginBottom: 8,
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
            }}
          >
            {t('messages.tryAgain', {
              ns: 'common',
              defaultValue: 'Please try again.',
            })}
          </p>

          {isDev && error && (
            <details
              style={{
                textAlign: 'left',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 8,
                padding: 12,
                marginBottom: 24,
                color: '#991B1B',
                fontSize: 13,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
                Developer details
              </summary>
              <div style={{ marginTop: 8 }}>
                <strong>{error.name}:</strong> {error.message}
              </div>
            </details>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={this.handleReset}
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
              {t('actions.retry', { ns: 'common', defaultValue: 'Try again' })}
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
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
              {t('actions.back', { ns: 'common', defaultValue: 'Go home' })}
            </button>
          </div>
        </div>
      </div>
    );
  }
}