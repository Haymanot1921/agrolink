// client/src/shared/services/websocketService.js
// Socket.io client — singleton, auto-reconnect, auth handshake.
// SRS refs: FR-NOTIFY-001..010, FR-MESSAGE-003, §12.1 realtime.

import { io } from 'socket.io-client';
import { apiClient } from './apiClient';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:5000';

let socket = null;
const listeners = new Map(); // eventName -> Set of handlers
let reconnectAttempts = 0;

function attachHandlers(s) {
  s.on('connect', () => {
    reconnectAttempts = 0;
    emitLocal('socket:connected', { id: s.id });
  });
  s.on('disconnect', (reason) => {
    emitLocal('socket:disconnected', { reason });
  });
  s.on('connect_error', (err) => {
    emitLocal('socket:error', { message: err.message });
  });
  s.on('reconnect_attempt', (attempt) => {
    reconnectAttempts = attempt;
    emitLocal('socket:reconnecting', { attempt });
  });

  // Domain events — bridge to local listeners
  ['notification:new', 'message:new', 'order:update', 'dispute:update', 'ticket:update', 'moderation:update'].forEach((evt) => {
    s.on(evt, (payload) => emitLocal(evt, payload));
  });
}

function emitLocal(event, payload) {
  const set = listeners.get(event);
  if (set) set.forEach((h) => {
    try {
      h(payload);
    } catch {
      /* listener errors are isolated */
    }
  });
}

export const websocketService = {
  /** Connect once (idempotent). Called from app providers on auth success. */
  connect() {
    if (socket?.connected) return socket;

    const token = apiClient.get?.('accessToken'); // may be undefined — use from sessionStorage
    const accessToken = (() => {
      try {
        return sessionStorage.getItem('access_token');
      } catch {
        return null;
      }
    })();

    if (!accessToken) return null;

    socket = io(WS_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
      timeout: 10000,
    });

    attachHandlers(socket);
    return socket;
  },

  /** Disconnect and clean up. Called on logout. */
  disconnect() {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }
    listeners.clear();
  },

  /** Subscribe to an event. Returns an unsubscribe function. */
  on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => {
      const set = listeners.get(event);
      if (set) {
        set.delete(handler);
        if (set.size === 0) listeners.delete(event);
      }
    };
  },

  /** Emit a client event (rare — used for typing indicators, etc.). */
  emit(event, payload) {
    if (socket?.connected) socket.emit(event, payload);
  },

  /** Check current connection state. */
  isConnected() {
    return Boolean(socket?.connected);
  },

  /** Force reconnect (used after manual network recovery). */
  reconnect() {
    if (socket) socket.connect();
    else this.connect();
  },
};

export default websocketService;