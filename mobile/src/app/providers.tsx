// mobile/src/app/providers.tsx
// Composes every provider the app needs: ErrorBoundary → SafeArea →
// GestureHandler → Query → i18n → Theme → Network → Auth →
// Notification → Socket → child (navigator).

import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';

import { queryClient } from '@services/queryClient';
import i18n from '@i18n/index';
import { ThemeProvider } from '@styles/ThemeProvider';
import { NetworkStatusProvider } from '@layouts/common/NetworkStatusProvider';
import { AuthProvider } from '@hooks/useAuth';
import { NotificationProvider } from '@hooks/usePushNotifications';
import { SocketProvider } from '@hooks/useRealtimeUpdates';
import { ErrorBoundary } from '@components/feedback/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): React.ReactElement {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <ThemeProvider>
                <NetworkStatusProvider>
                  <AuthProvider>
                    <NotificationProvider>
                      <SocketProvider>{children}</SocketProvider>
                    </NotificationProvider>
                  </AuthProvider>
                </NetworkStatusProvider>
              </ThemeProvider>
            </I18nextProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});