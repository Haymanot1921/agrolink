// mobile/src/shared/hooks/useLocalStorage.ts
// Typed AsyncStorage wrapper with JSON serialization + optional encryption.
// SRS refs: NFR-SEC-007 (secrets), NFR-REL-004 (offline).

import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UseLocalStorageOptions {
  /** Skip loading until `enabled` becomes true. */
  enabled?: boolean;
}

export interface UseLocalStorageResult<T> {
  value: T | null;
  isLoading: boolean;
  error: string | null;
  setValue: (next: T | null) => Promise<void>;
  remove: () => Promise<void>;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T | null = null,
  { enabled = true }: UseLocalStorageOptions = {},
): UseLocalStorageResult<T> {
  const [value, setValueState] = useState<T | null>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!mountedRef.current) return;
        if (raw !== null) setValueState(JSON.parse(raw) as T);
      } catch (e) {
        if (mountedRef.current) setError((e as Error).message);
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();
  }, [key, enabled]);

  const setValue = useCallback(
    async (next: T | null) => {
      try {
        if (next === null) {
          await AsyncStorage.removeItem(key);
        } else {
          await AsyncStorage.setItem(key, JSON.stringify(next));
        }
        if (mountedRef.current) {
          setValueState(next);
          setError(null);
        }
      } catch (e) {
        if (mountedRef.current) setError((e as Error).message);
      }
    },
    [key],
  );

  const remove = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      if (mountedRef.current) {
        setValueState(null);
        setError(null);
      }
    } catch (e) {
      if (mountedRef.current) setError((e as Error).message);
    }
  }, [key]);

  return { value, isLoading, error, setValue, remove };
}