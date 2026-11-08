// mobile/src/app/loadAssets.ts
// Loads every asset (fonts + images + lottie) before hiding splash.
// Uses expo-asset to download remote assets + expo-font to load TTFs.

import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import {
  Fonts,
  Icons,
  ActorIcons,
  MarketplaceImages,
  ProductImages,
  FarmImages,
  CropIcons,
  WeatherIcons,
  AgriculturalInputImages,
  ConsultationImages,
  UserVerificationImages,
  AssistedFarmerImages,
  ModerationImages,
  ReportImages,
  EmptyStateImages,
  OnboardingImages,
} from '@assets/assets';

// Prevent auto-hiding splash until ready
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore */
});

export async function loadAssetsAsync(): Promise<void> {
  // 1) Local PNG/JPG images (fast — asset bundler)
  const imageAssets = [
    ...Object.values(Icons),
    ...Object.values(ActorIcons),
    ...Object.values(MarketplaceImages),
    ...Object.values(ProductImages),
    ...Object.values(FarmImages),
    ...Object.values(CropIcons),
    ...Object.values(WeatherIcons),
    ...Object.values(AgriculturalInputImages),
    ...Object.values(ConsultationImages),
    ...Object.values(UserVerificationImages),
    ...Object.values(AssistedFarmerImages),
    ...Object.values(ModerationImages),
    ...Object.values(ReportImages),
    ...Object.values(EmptyStateImages),
    ...Object.values(OnboardingImages),
  ];

  // 2) Fonts — must be loaded before any Text renders
  const fontAssets = { ...Fonts };

  // 3) Run both in parallel
  await Promise.all([
    Asset.loadAsync(imageAssets),
    Font.loadAsync(fontAssets),
  ]);

  // 4) Hide splash only after everything is ready
  await SplashScreen.hideAsync();
}