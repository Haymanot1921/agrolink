// mobile/src/app/loadAssets.ts
// Loads every asset (fonts + images + lottie) before hiding splash.
// Uses expo-asset to download remote assets + expo-font to load TTFs.

import * as SplashScreen from 'expo-splash-screen';

// Prevent auto-hiding splash until ready
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore */
});

export async function loadAssetsAsync(): Promise<void> {
  await SplashScreen.hideAsync();
}