import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useNetworkStatus } from '@hooks/useNetworkStatus';

export function NetworkStatusProvider({ children }) {
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();
  const wasOnline = useRef(isOnline);

  useEffect(() => {
    if (isOnline && !wasOnline.current) {
      void queryClient.invalidateQueries();
    }
    wasOnline.current = isOnline;
  }, [isOnline, queryClient]);

  return children;
}
