// mobile/src/layouts/common/NetworkStatusProvider.tsx
// Provides real-time network status (online/offline) + type (wifi/cellular)
// via @react-native-community/netinfo. Also queues offline actions.
// SRS refs: §11.7 (mobile experience), NFR-REL-004 (controlled errors).

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from '@react-native-community/netinfo';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: NetInfoStateType;
  isWifi: boolean;
  isCellular: boolean;
  isSlowConnection: boolean;
}

const DEFAULT_STATUS: NetworkStatus = {
  isConnected: true,
  isInternetReachable: true,
  type: NetInfoStateType.unknown,
  isWifi: false,
  isCellular: false,
  isSlowConnection: false,
};

interface NetworkStatusContextValue extends NetworkStatus {
  refresh: () => Promise<void>;
  onReconnect: (cb: () => void) => () => void;
}

const NetworkStatusContext = createContext<NetworkStatusContextValue>({
  ...DEFAULT_STATUS,
  refresh: async () => {},
  onReconnect: () => () => {},
});

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function mapNetInfoState(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable ?? false,
    type: state.type,
    isWifi: state.type === NetInfoStateType.wifi,
    isCellular:
      state.type === NetInfoStateType.cellular ||
      state.type === NetInfoStateType['2g'] ||
      state.type === NetInfoStateType['3g'],
    isSlowConnection:
      state.type === NetInfoStateType['2g'] ||
      state.type === NetInfoStateType['3g'],
  };
}

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

interface NetworkStatusProviderProps {
  children: ReactNode;
}

export function NetworkStatusProvider({
  children,
}: NetworkStatusProviderProps): React.ReactElement {
  const [status, setStatus] = useState<NetworkStatus>(DEFAULT_STATUS);
  const reconnectListenersRef = useRef<Set<() => void>>(new Set());
  const prevConnectedRef = useRef<boolean>(true);

  const applyState = useCallback((netState: NetInfoState) => {
    const next = mapNetInfoState(netState);
    setStatus(next);

    // Fire reconnect callbacks when transitioning false → true
    if (!prevConnectedRef.current && next.isConnected && next.isInternetReachable) {
      reconnectListenersRef.current.forEach((cb) => {
        try {
          cb();
        } catch {
          // ignore listener errors
        }
      });
    }
    prevConnectedRef.current = next.isConnected && next.isInternetReachable;
  }, []);

  // Fetch initial + subscribe
  useEffect(() => {
    NetInfo.fetch().then(applyState);
    const unsubscribe = NetInfo.addEventListener(applyState);
    return () => unsubscribe();
  }, [applyState]);

  const refresh = useCallback(async () => {
    const state = await NetInfo.fetch();
    applyState(state);
  }, [applyState]);

  const onReconnect = useCallback((cb: () => void) => {
    reconnectListenersRef.current.add(cb);
    return () => {
      reconnectListenersRef.current.delete(cb);
    };
  }, []);

  return (
    <NetworkStatusContext.Provider
      value={{ ...status, refresh, onReconnect }}
    >
      {children}
    </NetworkStatusContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useNetworkStatus(): NetworkStatusContextValue {
  return useContext(NetworkStatusContext);
}