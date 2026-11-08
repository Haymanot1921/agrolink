// mobile/src/shared/hooks/useDeepLink.ts
// Unified deep-link handling for agrolink:// + https://agrolink.et/app.
// SRS refs: §11.7, FR-AUTH-007 (reset link), §5.3 (assisted farmer links).

import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import { getStateFromPath } from '@react-navigation/native';
import { linkingConfig } from '@app/linking';
import { navigationRef } from '@app/navigationRef';

export interface UseDeepLinkOptions {
  /** Called with the raw URL after navigation. */
  onHandled?: (url: string) => void;
  /** Return true to skip default navigation. */
  intercept?: (url: string) => boolean;
}

export function useDeepLink({ onHandled, intercept }: UseDeepLinkOptions = {}): void {
  const handledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Cold start link
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Warm links
    const sub = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => sub.remove();
  }, []);

  function handleUrl(url: string) {
    if (handledRef.current.has(url)) return;
    handledRef.current.add(url);

    if (intercept?.(url)) return;

    const state = getStateFromPath(
      Linking.parse(url).path ?? '',
      linkingConfig.config,
    );
    if (state && navigationRef.isReady()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigationRef.resetRoot(state as any);
    }
    onHandled?.(url);
  }
}