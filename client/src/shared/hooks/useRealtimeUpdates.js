// client/src/shared/hooks/useRealtimeUpdates.js
// Subscribe to socket.io events with auto-cleanup + query invalidation.
// SRS refs: FR-NOTIFY, FR-MESSAGE, §12.1 realtime.

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { websocketService } from '../services/websocketService';

export function useRealtimeUpdates(event, handler, { enabled = true, invalidateKeys = [] } = {}) {
  const queryClient = useQueryClient();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return undefined;

    const unsubscribe = websocketService.on(event, (payload) => {
      try {
        handlerRef.current?.(payload);
      } catch {
        /* isolation */
      }
      if (invalidateKeys.length) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: typeof key === 'string' ? [key] : key });
        });
      }
    });

    return unsubscribe;
  }, [event, enabled, queryClient, invalidateKeys]);
}

/**
 * Subscribe to ALL realtime events with one handler.
 * Useful on notification centers.
 */
export function useAllRealtimeUpdates(handler, { enabled = true } = {}) {
  const queryClient = useQueryClient();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return undefined;

    const events = ['notification:new', 'message:new', 'order:update', 'dispute:update', 'ticket:update', 'moderation:update'];
    const unsubs = events.map((evt) =>
      websocketService.on(evt, (payload) => {
        handlerRef.current?.(evt, payload);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }),
    );

    return () => unsubs.forEach((u) => u());
  }, [enabled, queryClient]);
}

/**
 * Connection state — useful for "offline" banners.
 */
export function useRealtimeStatus() {
  return {
    isConnected: websocketService.isConnected(),
  };
}

export default useRealtimeUpdates;