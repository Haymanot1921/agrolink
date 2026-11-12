// client/src/shared/components/feedback/ErrorBoundary.jsx
// React error boundary — prevents whole-app crash from one widget.
// SRS refs: §15.2 error handling, NFR-REL-004.

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Dev only — never log to console in prod
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, info);
    }
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          textAlign: 'center',
          padding: '60px 24px',
          color: 'var(--color-text, #1B1B1B)',
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }} aria-hidden>
          ⚠️
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          {this.props.fallbackTitle ?? 'Something went wrong'}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', marginBottom: 20 }}>
          {this.props.fallbackMessage ?? 'This section could not load. Try refreshing the page.'}
        </p>
        <button
          type="button"
          onClick={this.handleReset}
          style={{
            padding: '10px 20px',
            background: 'var(--color-primary, #2E7D32)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;