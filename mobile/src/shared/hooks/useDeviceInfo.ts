// mobile/src/shared/hooks/useDeviceInfo.ts
// Stable, cached device info (platform, OS version, model, isTablet, etc.).
// SRS refs: §11.7 (mobile), NFR-COMP-002 (Android versions).

import { useMemo } from 'react';
import * as Device from 'expo-device';
import { Dimensions, Platform } from 'react-native';

export interface UseDeviceInfoResult {
  /** 'android' | 'ios' | 'web' */
  platform: string;
  /** Android version number or iOS version string */
  osVersion: string | null;
  /** Model name, e.g. "Pixel 6" or "iPhone 14 Pro" */
  modelName: string | null;
  manufacturer: string | null;
  brand: string | null;
  isDevice: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
}

export function useDeviceInfo(): UseDeviceInfoResult {
  return useMemo(() => {
    const { width, height } = Dimensions.get('window');
    const isTablet = Device.deviceType === Device.DeviceType.TABLET;

    return {
      platform: Platform.OS,
      osVersion: Device.osVersion,
      modelName: Device.modelName,
      manufacturer: Device.manufacturer,
      brand: Device.brand,
      isDevice: Device.isDevice,
      isTablet,
      screenWidth: width,
      screenHeight: height,
      isSmallScreen: width < 360,
      isLargeScreen: width >= 768,
    };
  }, []);
}