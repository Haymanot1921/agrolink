// mobile/src/shared/hooks/useAppState.ts
// Track whether the app is foreground/background — for pausing sockets,
// timers, polling, and push-notification routing.
// SRS refs: NFR-REL, NFR-PERF.

import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface UseAppStateResult {
  appState: AppStateStatus;
  isForeground: boolean;
  isBackground: boolean;
}

export function useAppState(): UseAppStateResult {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  return {
    appState,
    isForeground: appState === 'active',
    isBackground: appState === 'background' || appState === 'inactive',
  };
}

/**
 * Fire a callback every time the app comes to the foreground
 * (useful to refresh data on resume).
 */
export function useOnForeground(callback: () => void): void {
  const prevState = useRef(AppState.currentState);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const wasBackground = prevState.current !== 'active';
      if (wasBackground && next === 'active') {
        callbackRef.current();
      }
      prevState.current = next;
    });
    return () => sub.remove();
  }, []);
}