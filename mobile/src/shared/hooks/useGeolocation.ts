// mobile/src/shared/hooks/useGeolocation.ts
// One-time or watching geolocation (foreground only).
// SRS refs: §13.4 (display-only), FR-SEARCH-003 (location filter).
//
// ⚠️ NO background location — SRS §2.4 excludes delivery tracking.

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp: number;
}

export interface UseGeolocationResult {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
  permissionGranted: boolean | null;
  requestPermission: () => Promise<boolean>;
  getCurrent: (options?: Location.LocationOptions) => Promise<GeoPosition | null>;
  watch: () => Promise<void>;
  stopWatching: () => void;
  isWatching: boolean;
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
    return () => {
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    return granted;
  }, []);

  const mapPosition = (loc: Location.LocationObject): GeoPosition => ({
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    accuracy: loc.coords.accuracy,
    timestamp: loc.timestamp,
  });

  const getCurrent = useCallback(
    async (options: Location.LocationOptions = { accuracy: Location.Accuracy.Balanced }) => {
      setLoading(true);
      setError(null);
      try {
        if (permissionGranted !== true) {
          const ok = await requestPermission();
          if (!ok) {
            setError('Location permission not granted');
            return null;
          }
        }
        const loc = await Location.getCurrentPositionAsync(options);
        const pos = mapPosition(loc);
        setPosition(pos);
        return pos;
      } catch (e) {
        setError((e as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [permissionGranted, requestPermission],
  );

  const watch = useCallback(async () => {
    if (isWatching) return;
    if (permissionGranted !== true) {
      const ok = await requestPermission();
      if (!ok) return;
    }
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 20 },
      (loc) => setPosition(mapPosition(loc)),
    );
    setIsWatching(true);
  }, [isWatching, permissionGranted, requestPermission]);

  const stopWatching = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
    setIsWatching(false);
  }, []);

  return {
    position,
    error,
    loading,
    permissionGranted,
    requestPermission,
    getCurrent,
    watch,
    stopWatching,
    isWatching,
  };
}