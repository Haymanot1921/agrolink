// mobile/src/shared/services/locationService.ts
// Foreground geolocation + reverse geocoding (display-only).
// SRS refs: §13.4 (maps display-only), FR-SEARCH-003 (nearby products).
// ⚠️ No background location (SRS §2.4 — no delivery tracking).

import * as Location from 'expo-location';

export interface SimpleCoords {
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodeResult {
  formattedAddress: string;
  region?: string;
  zone?: string;
  woreda?: string;
  country?: string;
}

export const locationService = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  },

  async hasPermission(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  },

  async getCurrent(): Promise<SimpleCoords | null> {
    try {
      if (!(await this.hasPermission()) && !(await this.requestPermission())) return null;
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    } catch {
      return null;
    }
  },

  async reverseGeocode(coords: SimpleCoords): Promise<ReverseGeocodeResult | null> {
    try {
      const results = await Location.reverseGeocodeAsync(coords);
      const r = results[0];
      if (!r) return null;
      const parts = [r.name, r.street, r.district, r.subregion, r.region, r.country].filter(Boolean);
      return {
        formattedAddress: parts.join(', '),
        region: r.region ?? undefined,
        zone: r.subregion ?? undefined,
        woreda: r.district ?? undefined,
        country: r.country ?? undefined,
      };
    } catch {
      return null;
    }
  },

  /** Distance in km between two coordinates (Haversine). */
  distanceKm(a: SimpleCoords, b: SimpleCoords): number {
    const R = 6371;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  },
};