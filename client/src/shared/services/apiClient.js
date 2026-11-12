// client/src/shared/services/apiClient.js
// Central axios-based HTTP client — auth, error mapping, refresh, retry.
// SRS refs: §12.1 API architecture, §14.2 authorization, §15.2 error handling,
//           NFR-SEC-003 (auth enforced on backend, this only attaches tokens),
//           NFR-SEC-005 (input validation), NFR-SEC-007 (secrets in env).

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

let memoryAccessToken = null;
let memoryRefreshToken = null;
let onUnauthorized = null;
let isRefreshing = false;
let pendingQueue = [];

/** Token store — memory by default, falls back to sessionStorage for page reloads. */
const tokenStore = {
  get() {
    if (memoryAccessToken) return memoryAccessToken;
    try {
      return sessionStorage.getItem('access_token') ?? null;
    } catch {
      return null;
    }
  },
  set(accessToken, refreshToken) {
    memoryAccessToken = accessToken ?? null;
    memoryRefreshToken = refreshToken ?? null;
    try {
      if (accessToken) sessionStorage.setItem('access_token', accessToken);
      if (refreshToken) sessionStorage.setItem('refresh_token', refreshToken);
    } catch {
      /* sessionStorage may be unavailable in private mode — ignore */
    }
  },
  getRefresh() {
    if (memoryRefreshToken) return memoryRefreshToken;
    try {
      return sessionStorage.getItem('refresh_token') ?? null;
    } catch {
      return null;
    }
  },
  clear() {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    try {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
    } catch {
      /* noop */
    }
  },
};

/** Public axios instance. */
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ──────────────────────────────────────────────────────────
// Request interceptor — attach access token + trace id
// ──────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Trace id for log correlation — not sensitive
    config.headers = config.headers ?? {};
    config.headers['X-Request-ID'] = crypto?.randomUUID?.() ?? `req-${Date.now()}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ──────────────────────────────────────────────────────────
// Response interceptor — unwrap .data, map errors, refresh on 401
// ──────────────────────────────────────────────────────────
api.interceptors.response.use(
  // Unwrap standard response envelope { success, message, data, meta }
  (response) => {
    if (response?.data?.data !== undefined) {
      const meta = response.data.meta ?? null;
      return { ...response.data.data, _meta: meta };
    }
    return response.data;
  },

  async (error) => {
    const original = error.config;

    // 401 → try refresh once
    if (
      error.response?.status === 401 &&
      !original._retried &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      original._retried = true;
      return handleRefreshAndRetry(original);
    }

    // Normalize error surface for callers
    const normalized = {
      message:
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message ??
        'Something went wrong',
      code: error.response?.data?.code ?? error.code ?? 'UNKNOWN',
      status: error.response?.status ?? 0,
      details: error.response?.data?.details ?? null,
      response: error.response,
    };
    return Promise.reject(normalized);
  },
);

// ──────────────────────────────────────────────────────────
// Refresh token flow with request queue
// ──────────────────────────────────────────────────────────
async function handleRefreshAndRetry(originalConfig) {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) {
    hardSignOut();
    return Promise.reject({
      message: 'Session expired. Please sign in again.',
      code: 'NO_REFRESH',
      status: 401,
    });
  }

  if (isRefreshing) {
    // Queue the request until refresh completes
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject, config: originalConfig });
    });
  }

  isRefreshing = true;
  try {
    const { data } = await axios.post(
      `${API_BASE}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const newAccess = data?.data?.accessToken;
    const newRefresh = data?.data?.refreshToken ?? refreshToken;
    if (!newAccess) throw new Error('No access token returned from refresh');

    tokenStore.set(newAccess, newRefresh);

    // Flush pending queue
    pendingQueue.forEach(({ resolve, config }) => {
      config.headers.Authorization = `Bearer ${newAccess}`;
      resolve(api.request(config));
    });
    pendingQueue = [];

    originalConfig.headers.Authorization = `Bearer ${newAccess}`;
    return api.request(originalConfig);
  } catch (refreshErr) {
    pendingQueue.forEach(({ reject }) => reject(refreshErr));
    pendingQueue = [];
    hardSignOut();
    return Promise.reject({
      message: 'Session expired. Please sign in again.',
      code: 'REFRESH_FAILED',
      status: 401,
    });
  } finally {
    isRefreshing = false;
  }
}

function hardSignOut() {
  tokenStore.clear();
  if (typeof onUnauthorized === 'function') {
    onUnauthorized();
  } else if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
    window.location.href = '/auth/login';
  }
}

// ──────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────
export const apiClient = {
  /** Set tokens after login/register/refresh. */
  setTokens(accessToken, refreshToken) {
    tokenStore.set(accessToken, refreshToken);
  },

  /** Clear all auth state. */
  clearTokens() {
    tokenStore.clear();
  },

  /** Register a callback fired on session expiry (used by useAuth to reset zustand). */
  setUnauthorizedHandler(handler) {
    onUnauthorized = handler;
  },

  /** Convenience wrappers — return unwrapped payloads. */
  get: (url, config) => api.get(url, config),
  post: (url, body, config) => api.post(url, body, config),
  put: (url, body, config) => api.put(url, body, config),
  patch: (url, body, config) => api.patch(url, body, config),
  delete: (url, config) => api.delete(url, config),
};

export default apiClient;