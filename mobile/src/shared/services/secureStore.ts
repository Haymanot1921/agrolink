// mobile/src/shared/services/secureStore.ts
// Secure persistence for tokens + session (uses expo-secure-store).
// SRS refs: NFR-SEC-007 (secrets), FR-AUTH-011 (session expiry).

import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from '@hooks/useAuth';

const KEYS = {
  accessToken: 'agrolink.accessToken',
  refreshToken: 'agrolink.refreshToken',
  user: 'agrolink.user',
} as const;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Session {
  user: AuthUser;
  tokens: Tokens;
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    // Fail silently — caller decides UX
  }
}

async function getItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function deleteItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // ignore
  }
}

export const secureStore = {
  async getTokens(): Promise<Tokens | null> {
    const [access, refresh] = await Promise.all([
      getItem(KEYS.accessToken),
      getItem(KEYS.refreshToken),
    ]);
    if (!access || !refresh) return null;
    return { accessToken: access, refreshToken: refresh };
  },

  async setTokens(tokens: Tokens): Promise<void> {
    await Promise.all([
      setItem(KEYS.accessToken, tokens.accessToken),
      setItem(KEYS.refreshToken, tokens.refreshToken),
    ]);
  },

  async getSession(): Promise<Session | null> {
    const tokens = await this.getTokens();
    const userRaw = await getItem(KEYS.user);
    if (!tokens || !userRaw) return null;
    try {
      const user = JSON.parse(userRaw) as AuthUser;
      return { user, tokens };
    } catch {
      return null;
    }
  },

  async setSession(session: Session): Promise<void> {
    await Promise.all([
      this.setTokens(session.tokens),
      setItem(KEYS.user, JSON.stringify(session.user)),
    ]);
  },

  async updateUser(patch: Partial<AuthUser>): Promise<void> {
    const raw = await getItem(KEYS.user);
    if (!raw) return;
    try {
      const user = JSON.parse(raw) as AuthUser;
      await setItem(KEYS.user, JSON.stringify({ ...user, ...patch }));
    } catch {
      // ignore
    }
  },

  async clearSession(): Promise<void> {
    await Promise.all([
      deleteItem(KEYS.accessToken),
      deleteItem(KEYS.refreshToken),
      deleteItem(KEYS.user),
    ]);
  },
};