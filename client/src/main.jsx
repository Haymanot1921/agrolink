// client/src/main.jsx
// App bootstrap — the single entry point for the React web app.
// Order matters:
//   1) CSS (fast, before any React render)
//   2) i18n init (before providers so `t()` works synchronously)
//   3) QueryClient
//   4) ReactDOM.render → <App />
//
// SRS refs: §3.3, §9.2, §11.1, FR-ACCESS-006.

import React from 'react';
import ReactDOM from 'react-dom/client';

// ─────────────────────────────────────────────────────────────
// Styles (must load first to avoid FOUC)
// ─────────────────────────────────────────────────────────────
import '@styles/globals.css';
import '@styles/variables.css';
import '@styles/dashboard.css';
import '@styles/responsive.css';
import '@styles/ati-theme.css';

// ─────────────────────────────────────────────────────────────
// i18n — initialize BEFORE rendering so translations are ready
// ─────────────────────────────────────────────────────────────
import '@i18n/index';

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
import { App } from './app/App';

// ─────────────────────────────────────────────────────────────
// Mount
// ─────────────────────────────────────────────────────────────
const rootElement = document.getElementById('root');

if (!rootElement) {
  // eslint-disable-next-line no-console
  console.error('[AgroLink] Fatal: #root element not found in index.html');
  throw new Error('Root element #root is missing');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// ─────────────────────────────────────────────────────────────
// Optional: disable right-click context menu in production
// (uncomment if you want to prevent casual copying of images)
// ─────────────────────────────────────────────────────────────
// if (!import.meta.env.DEV) {
//   document.addEventListener('contextmenu', (e) => e.preventDefault());
// }