// mobile/src/shared/services/websocketService.ts
// Legacy singleton for socket access outside React (e.g. from services).
// The React provider in useRealtimeUpdates wraps this.
// SRS refs: §5.11, §5.12.

import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { secureStore } from './secureStore';

const SOCKET_URL =
  (Constants.expoConfig?.extra?.socketUrl as string | undefined) ??
  'http://localhost:5000';

let socket: Socket | null = null;

export const websocketService = {
  async connect(): Promise<Socket> {
    if (socket?.connected) return socket;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    const tokens = await secureStore.getTokens();
    if (!tokens?.accessToken) throw new Error('No access token');
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token: tokens.accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });
    return socket;
  },

  disconnect(): void {
    socket?.removeAllListeners();
    socket?.disconnect();
    socket = null;
  },

  getSocket(): Socket | null {
    return socket;
  },

  emit(event: string, payload?: unknown): void {
    socket?.emit(event, payload);
  },

  on<T>(event: string, handler: (payload: T) => void): () => void {
    if (!socket) return () => {};
    const wrapped = (payload: T) => handler(payload);
    socket.on(event, wrapped);
    return () => socket?.off(event, wrapped);
  },
};