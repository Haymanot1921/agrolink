// mobile/src/shared/hooks/useRealtimeUpdates.ts
// Socket.IO provider + subscription helpers.
// SRS refs: §5.11 (messaging), §5.12 (notifications), FR-MESSAGE-005 (read receipts),
//           FR-ORDER-012 (order status), FR-NOTIFY-007 (in-app).

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';

import { useAuth } from './useAuth';
import { secureStore } from '@services/secureStore';

// Canonical socket event names — keep aligned with the backend
export type SocketEvent =
  | 'message:new'
  | 'message:read'
  | 'message:typing'
  | 'notification:new'
  | 'order:status_changed'
  | 'consultation:status_changed'
  | 'ticket:status_changed'
  | 'consent:updated'
  | 'auth:session_revoked'
  | 'assisted_action:created'
  | 'suspicious_activity:detected';

interface RealtimeContextValue {
  socket: Socket | null;
  isConnected: boolean;
  /** Subscribe to an event. Returns unsubscribe. */
  on: <T = unknown>(event: SocketEvent, handler: (payload: T) => void) => () => void;
  /** Emit an event. */
  emit: (event: string, payload?: unknown) => void;
  /** Manually (re)connect. */
  connect: () => void;
  /** Manually disconnect. */
  disconnect: () => void;
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

const SOCKET_URL =
  (Constants.expoConfig?.extra?.socketUrl as string | undefined) ??
  'http://localhost:5000';

export function SocketProvider({ children }: { children: ReactNode }): React.ReactElement {
  const { user, isBootstrapping } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!user || socketRef.current) return;
    const tokens = await secureStore.getTokens();
    if (!tokens?.accessToken) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token: tokens.accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', () => setIsConnected(false));

    socketRef.current = socket;
  }, [user]);

  // Connect/disconnect on auth state change
  useEffect(() => {
    if (isBootstrapping) return;
    if (user) connect();
    else disconnect();
    return () => disconnect();
  }, [user, isBootstrapping, connect, disconnect]);

  // Handle server-initiated session revocation (FR-AUTH-011)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const handler = () => {
      disconnect();
      // RootNavigator switches to Auth stack automatically
    };
    socket.on('auth:session_revoked', handler);
    return () => {
      socket.off('auth:session_revoked', handler);
    };
  }, [isConnected, disconnect]);

  const on = useCallback(
    <T,>(event: SocketEvent, handler: (payload: T) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};
      const wrapped = (payload: T) => handler(payload);
      socket.on(event, wrapped);
      return () => {
        socket.off(event, wrapped);
      };
    },
    [],
  );

  const emit = useCallback((event: string, payload?: unknown) => {
    socketRef.current?.emit(event, payload);
  }, []);

  const value = useMemo<RealtimeContextValue>(
    () => ({
      socket: socketRef.current,
      isConnected,
      on,
      emit,
      connect,
      disconnect,
    }),
    [isConnected, on, emit, connect, disconnect],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtimeUpdates(): RealtimeContextValue {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error('useRealtimeUpdates must be used inside SocketProvider');
  return ctx;
}

/** Convenience hook — subscribe to a single event with cleanup. */
export function useRealtimeEvent<T = unknown>(
  event: SocketEvent,
  handler: (payload: T) => void,
  deps: React.DependencyList = [],
): void {
  const { on } = useRealtimeUpdates();
  useEffect(() => on(event, handler), [event, on, ...deps]);
}