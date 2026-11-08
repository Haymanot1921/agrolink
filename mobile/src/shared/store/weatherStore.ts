// mobile/src/shared/store/weatherStore.ts
// Cached weather (30 min TTL) — supports offline display.
// SRS refs: §11.7 mobile farmer dashboard weather widget.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WeatherResponse } from '@services/weatherService';

interface WeatherState {
  cache: WeatherResponse | null;
  fetchedAt: number | null;
  /** Last known location used for fetch. */
  lastLocation: { latitude: number; longitude: number } | null;
}

interface WeatherActions {
  setWeather: (data: WeatherResponse, location: { latitude: number; longitude: number }) => void;
  clear: () => void;
  /** True if cache is still fresh (< 30 min). */
  isFresh: () => boolean;
}

const TTL_MS = 30 * 60 * 1000;

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set, get) => ({
      cache: null,
      fetchedAt: null,
      lastLocation: null,

      setWeather: (data, location) =>
        set({
          cache: data,
          fetchedAt: Date.now(),
          lastLocation: location,
        }),

      clear: () => set({ cache: null, fetchedAt: null, lastLocation: null }),

      isFresh: () => {
        const { fetchedAt } = get();
        if (!fetchedAt) return false;
        return Date.now() - fetchedAt < TTL_MS;
      },
    }),
    {
      name: '@agrolink/weather-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);