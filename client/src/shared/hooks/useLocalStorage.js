// client/src/shared/hooks/useLocalStorage.js
// Typed localStorage with SSR safety + change sync across tabs.
// SRS refs: §11.8 (preferences).

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [stored, setStored] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        try {
          if (next === undefined || next === null) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch {
          /* quota exceeded */
        }
        return next;
      });
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    setStored(initialValue);
  }, [key, initialValue]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) return;
      setStored(e.newValue == null ? initialValue : JSON.parse(e.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initialValue]);

  return [stored, setValue, remove];
}

export default useLocalStorage;