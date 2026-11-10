// client/src/app/App.jsx
// Root React component. Wraps everything in providers + error boundary,
// then renders the router. i18n is initialized in main.jsx so `t()` is
// available immediately in any child component.
//
// SRS refs: §11.8 (consistent design), FR-ACCESS-006 (EN + AM).

import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { AppProviders } from './providers';
import { AppRouter } from './router';
import { AppErrorBoundary } from './errorBoundary';

export function App() {
  return (
    <HelmetProvider>
      <AppErrorBoundary>
        <AppProviders>
          <AppRouter />
        </AppProviders>
      </AppErrorBoundary>
    </HelmetProvider>
  );
}