// mobile/src/shared/hooks/useCamera.ts
// Permission + capture orchestration for the camera.
// SRS refs: FR-MARKET-003 (product images), §5.8 (case attachments), §13.3.

import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraView } from 'expo-camera';

export interface UseCameraResult {
  ref: React.RefObject<CameraView>;
  permissionGranted: boolean | null;
  requestPermission: () => Promise<boolean>;
  capture: () => Promise<{ uri: string } | null>;
  facing: 'back' | 'front';
  toggleFacing: () => void;
  isCapturing: boolean;
  error: string | null;
}

export function useCamera(): UseCameraResult {
  const ref = useRef<CameraView>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { Camera } = await import('expo-camera');
      const { status } = await Camera.getCameraPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
  }, []);

  const requestPermission = useCallback(async () => {
    const { Camera } = await import('expo-camera');
    const { status } = await Camera.requestCameraPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    return granted;
  }, []);

  const capture = useCallback(async () => {
    if (!ref.current) return null;
    setIsCapturing(true);
    setError(null);
    try {
      const photo = await ref.current.takePictureAsync({ quality: 0.85 });
      return photo ? { uri: photo.uri } : null;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }, []);

  return {
    ref,
    permissionGranted,
    requestPermission,
    capture,
    facing,
    toggleFacing,
    isCapturing,
    error,
  };
}