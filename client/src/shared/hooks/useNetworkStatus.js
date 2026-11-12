// client/src/shared/hooks/useNetworkStatus.js
// Detects online/offline. Used to show "no internet" banner.
// SRS refs: NFR-REL-004, §21.3 risks.

import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [lastChange, setLastChange] = useState(() => Date.now());

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      setLastChange(Date.now());
    };
    const goOffline = () => {
      setOnline(false);
      setLastChange(Date.now());
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return { isOnline: online, isOffline: !online, lastChange };
}

export default useNetworkStatus;