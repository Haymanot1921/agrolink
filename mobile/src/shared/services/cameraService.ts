// mobile/src/shared/services/cameraService.ts
// Camera permission + capture (used by useCamera hook).
// SRS refs: FR-MARKET-003, §5.8, §13.3.

import { CameraView, Camera } from 'expo-camera';

export const cameraService = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  },

  async hasPermission(): Promise<boolean> {
    const { status } = await Camera.getCameraPermissionsAsync();
    return status === 'granted';
  },

  async capture(ref: React.RefObject<CameraView>): Promise<{ uri: string } | null> {
    if (!ref.current) return null;
    try {
      const photo = await ref.current.takePictureAsync({ quality: 0.85 });
      return photo ? { uri: photo.uri } : null;
    } catch {
      return null;
    }
  },
};