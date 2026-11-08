// mobile/src/layouts/common/ErrorBoundaryLayout.tsx
// Top-level error boundary. Catches React render errors and shows a
// friendly recovery screen. Uses expo-updates to allow reload.
// SRS refs: NFR-REL-004 (controlled errors), FR-AUTH-010 (safe messages).

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import * as Updates from 'expo-updates';
import { SafeAreaView } from 'react-native-safe-area-context';

import i18n from '@i18n/index';
import { Button } from '@components/ui/Button';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

interface Props {
  children: ReactNode;
  /** Optional fallback renderer. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundaryLayout extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Hook your crash reporting (Sentry) here.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  reloadApp = async (): Promise<void> => {
    try {
      await Updates.reloadAsync();
    } catch {
      // In dev or if updates unavailable, we do nothing.
    }
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;
    const t = i18n.t.bind(i18n);

    if (!hasError) return children;

    if (fallback) return fallback(error!, this.reset);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{t('messages.serverError', { ns: 'common' })}</Text>
          <Text style={styles.body}>
            {t('messages.tryAgain', { ns: 'common' })}
          </Text>
          {__DEV__ && error && (
            <View style={styles.devBox}>
              <Text style={styles.devTitle}>{error.name}</Text>
              <Text style={styles.devMessage}>{error.message}</Text>
            </View>
          )}

          <View style={styles.actions}>
            <Button title={t('actions.retry', { ns: 'common' })} onPress={this.reset} fullWidth />
            <Button
              title="Reload App"
              variant="outline"
              onPress={this.reloadApp}
              fullWidth
            />
            <Button
              title={t('labels.support', { ns: 'common' })}
              variant="ghost"
              onPress={() => Linking.openURL('mailto:support@agrolink.et')}
              fullWidth
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  devBox: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.dangerLight,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  devTitle: { fontWeight: '700', color: colors.danger, marginBottom: 4 },
  devMessage: { fontSize: 13, color: colors.danger, fontFamily: 'monospace' },
  actions: { width: '100%', gap: spacing.sm },
});