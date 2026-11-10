// client/src/app/providers.jsx
// Composes every global provider used by the app:
//   - React Query (server state)
//   - AuthProvider (session, role, providerType)
//   - I18nextProvider (EN + AM)
//   - ThemeProvider (light/dark + actor accent)
//   - SocketProvider (realtime — SRS §5.11, §5.12)
//   - NotificationProvider (toasts + push)
//   - NetworkStatusProvider (offline awareness)
//
// Order is deliberate:
//   Query → Auth → i18n → Theme → Socket → Notification → Network
// (Network status is innermost so it can trigger Query refetches.)

import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';

import i18n from '@i18n/index';
import { AuthProvider } from '@hooks/useAuth';
import { ThemeProvider } from '@styles/ThemeProvider';
import { SocketProvider } from '@hooks/useRealtimeUpdates';
import { NotificationProvider } from '@hooks/usePushNotifications';
import { NetworkStatusProvider } from '@layouts/common/NetworkStatusProvider';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';

// ─────────────────────────────────────────────────────────────
// React Query client — sensible defaults for a marketplace app
// ─────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute — marketplace data changes often
      gcTime: 5 * 60_000, // 5 minutes cache
      retry: 1,
      refetchOnWindowFocus: false, // avoid surprises on alt-tab
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// ─────────────────────────────────────────────────────────────
// Suspense fallback — shown while lazy routes load
// ─────────────────────────────────────────────────────────────

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background, #fff)',
      }}
    >
      <LoadingSpinner size="lg" caption="Loading…" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Provider tree
// ─────────────────────────────────────────────────────────────

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <NetworkStatusProvider>
              <NotificationProvider>
                <SocketProvider>
                  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
                </SocketProvider>
              </NotificationProvider>
            </NetworkStatusProvider>
          </ThemeProvider>
        </I18nextProvider>
      </AuthProvider>

      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}