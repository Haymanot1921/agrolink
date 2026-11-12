// client/src/shared/hooks/useAppState.js
// Detects visibility + focus — used to pause polling, refresh on return.
// SRS refs: NFR-PERF-005, FR-NOTIFY.

import { useEffect, useState } from 'react';

export function useAppState() {
  const [state, setState] = useState(
    typeof document !== 'undefined' && document.visibilityState === 'visible'
      ? 'active'
      : 'background',
  );

  useEffect(() => {
    const onChange = () => {
      setState(document.visibilityState === 'visible' ? 'active' : 'background');
    };
    document.addEventListener('visibilitychange', onChange);
    window.addEventListener('focus', () => setState('active'));
    window.addEventListener('blur', () => setState('background'));
    return () => {
      document.removeEventListener('visibilitychange', onChange);
    };
  }, []);

  return {
    appState: state,
    isActive: state === 'active',
    isBackground: state === 'background',
  };
}

export default useAppState;