// mobile/src/shared/hooks/useWeather.ts
// Fetch + cache current weather + 5-day forecast for the farmer dashboard.
// SRS refs: §11.7 mobile farmer (weather widget).
//
// Cache: 30 min TTL, falls back to last cached data when offline.

import { useCallback, useEffect, useState } from 'react';
import { weatherService, WeatherResponse } from '@services/weatherService';
import { useLocalStorage } from './useLocalStorage';
import { useNetworkStatus } from './useNetworkStatus';

const CACHE_KEY = '@agrolink/weather-cache';
const CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry {
  data: WeatherResponse;
  fetchedAt: number;
}

export interface UseWeatherResult {
  data: WeatherResponse | null;
  isLoading: boolean;
  error: string | null;
  isStale: boolean;
  refresh: () => Promise<void>;
}

export function useWeather(
  location: { latitude: number; longitude: number } | null,
): UseWeatherResult {
  const { isConnected } = useNetworkStatus();
  const { value: cache, setValue: setCache } = useLocalStorage<CacheEntry>(CACHE_KEY);
  const [data, setData] = useState<WeatherResponse | null>(cache?.data ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  const refresh = useCallback(async () => {
    if (!location) return;
    setIsLoading(true);
    setError(null);
    try {
      const fresh = await weatherService.getWeather(location);
      setData(fresh);
      setIsStale(false);
      await setCache({ data: fresh, fetchedAt: Date.now() });
    } catch (e) {
      setError((e as Error).message);
      setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  }, [location, setCache]);

  useEffect(() => {
    if (!location) return;
    const fresh = cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS;
    if (fresh) {
      setData(cache!.data);
      setIsStale(false);
      return;
    }
    if (isConnected) refresh();
    else if (cache) {
      setData(cache.data);
      setIsStale(true);
    }
  }, [location, cache, isConnected, refresh]);

  return { data, isLoading, error, isStale, refresh };
}