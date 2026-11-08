// mobile/src/app/App.tsx
// App entry — boots asset loader, wires providers, and mounts RootNavigator.
// Wraps everything in StatusBar + error handling + splash control.

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, StyleSheet, LogBox } from 'react-native';

import { AppProviders } from './providers';
import { RootNavigator } from './RootNavigator';
import { loadAssetsAsync } from './loadAssets';

// Silence known noisy warnings from third-party libs in dev
if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Sending `onAnimatedValueUpdate` with no listeners registered',
    'Require cycle:',
  ]);
}

// Keep splash visible until we hide it manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore — race condition on fast reload */
});

export default function App(): React.ReactElement {
  const [assetsReady, setAssetsReady] = useState(false);
  const [bootError, setBootError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadAssetsAsync();
        if (!cancelled) setAssetsReady(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (!cancelled) setBootError(error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (bootError) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Startup Error</Text>
        <Text style={styles.body}>{bootError.message}</Text>
      </View>
    );
  }

  if (!assetsReady) {
    // Splash screen is still visible — render nothing.
    return <View style={styles.center} />;
  }

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <RootNavigator />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#2E7D32',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});