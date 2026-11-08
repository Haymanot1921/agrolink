// mobile/src/shared/services/apiClient.ts
// Axios client with:
//   - Base URL from env
//   - Bearer auth from secureStore
//   - Automatic 401 → refresh → retry (single-flight)
//   - Standard error normalization
// SRS refs: §5.1, §14.1, §14.4, NFR-SEC-001..013.

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Constants from 'expo-constants';
import { secureStore } from './secureStore';

const BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:5000/api/v1';

export interface ApiErrorBody {
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export class ApiError extends Error {
  code?: string;
  status: number;
  fields?: Record<string, string[]>;

  constructor(message: string, status = 500, code?: string, fields?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

// ─────────────────────────────────────────────────────────────
// Refresh single-flight
// ─────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const tokens = await secureStore.getTokens();
      if (!tokens?.refreshToken) return null;
      const res = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${BASE_URL}/auth/refresh`,
        { refreshToken: tokens.refreshToken },
        { timeout: 15000 },
      );
      await secureStore.setTokens(res.data);
      return res.data.accessToken;
    } catch {
      await secureStore.clearSession();
      onSessionExpired?.();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

// ─────────────────────────────────────────────────────────────
// Client
// ─────────────────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const tokens = await secureStore.getTokens();
    if (tokens?.accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 → refresh → retry
apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
    }

    const body = error.response?.data;
    throw new ApiError(
      body?.message ?? error.message ?? 'Network error',
      error.response?.status ?? 0,
      body?.code,
      body?.errors,
    );
  },
);

// ─────────────────────────────────────────────────────────────
// Thin typed helpers
// ─────────────────────────────────────────────────────────────

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((r) => r.data),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((r) => r.data),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((r) => r.data),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((r) => r.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((r) => r.data),
};