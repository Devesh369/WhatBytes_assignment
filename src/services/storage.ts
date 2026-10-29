import { AuthSession, AuthUser } from '../types/auth';

const SESSION_KEY = 'authpulse_session';
const USERS_KEY = 'authpulse_mock_users';

/**
 * In-memory fallback if browser storage is disabled or running in restricted sandbox
 */
const memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    const val = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (val) return val;
  } catch {
    // Storage access restricted
  }
  return memoryStore[key] || null;
}

function safeSet(key: string, value: string, rememberMe = true): void {
  try {
    if (rememberMe) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  } catch {
    // Storage access restricted
  }
  memoryStore[key] = value;
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch {
    // Storage access restricted
  }
  delete memoryStore[key];
}

export const storage = {
  getSession(): AuthSession | null {
    const raw = safeGet(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AuthSession;
      // Check expiration
      if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
        storage.clearSession();
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  setSession(session: AuthSession): void {
    safeSet(SESSION_KEY, JSON.stringify(session), session.rememberMe);
  },

  clearSession(): void {
    safeRemove(SESSION_KEY);
  },

  getStoredUsers(): Record<string, { user: AuthUser; passwordHash: string }> {
    const raw = safeGet(USERS_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  setStoredUsers(users: Record<string, { user: AuthUser; passwordHash: string }>): void {
    safeSet(USERS_KEY, JSON.stringify(users), true);
  },
};
