import { AuthSession, AuthUser, LoginCredentials, SignupData, SimulateErrorMode } from '../types/auth';
import { storage } from './storage';

// Default initial seeded mock users
const INITIAL_MOCK_USERS: Record<string, { user: AuthUser; passwordHash: string }> = {
  'alex@whatbytes.com': {
    user: {
      id: 'usr_alex_admin_01',
      name: 'Alex Rivers',
      email: 'alex@whatbytes.com',
      role: 'admin',
      bio: 'Lead Full-Stack Architect & Evaluator at WhatBytes.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivers',
      createdAt: '2026-01-15T09:00:00.000Z',
      lastLoginAt: '2026-10-28T14:32:00.000Z',
    },
    passwordHash: 'Password123!',
  },
  'sarah@whatbytes.com': {
    user: {
      id: 'usr_sarah_dev_02',
      name: 'Sarah Jenkins',
      email: 'sarah@whatbytes.com',
      role: 'developer',
      bio: 'Frontend Engineer passionate about custom React hooks.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJenkins',
      createdAt: '2026-03-10T11:20:00.000Z',
      lastLoginAt: '2026-10-27T08:15:00.000Z',
    },
    passwordHash: 'Welcome2026!',
  },
};

// Rate limit tracker: track failed attempts per email
const failedAttemptsMap: Record<string, { count: number; lockedUntil: number }> = {};

function getMockUsers(): Record<string, { user: AuthUser; passwordHash: string }> {
  const stored = storage.getStoredUsers();
  if (Object.keys(stored).length === 0) {
    storage.setStoredUsers(INITIAL_MOCK_USERS);
    return INITIAL_MOCK_USERS;
  }
  return { ...INITIAL_MOCK_USERS, ...stored };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockAuthApi = {
  /**
   * Simulated Login API call
   */
  async login(
    credentials: LoginCredentials,
    delayMs = 800,
    simulateError: SimulateErrorMode = 'none'
  ): Promise<AuthSession> {
    await delay(delayMs);

    // Simulated error overrides for reviewer manual testing
    if (simulateError === 'server_500') {
      throw new Error('Simulated 500: Internal server error. Please try again later.');
    }
    if (simulateError === 'rate_limited') {
      throw new Error('Simulated 429: Too many login attempts. Please wait 60 seconds.');
    }
    if (simulateError === 'invalid_credentials') {
      throw new Error('Simulated error: Invalid email or password provided.');
    }

    const emailKey = credentials.email.trim().toLowerCase();
    
    // Check rate limit lock
    const attemptRecord = failedAttemptsMap[emailKey];
    if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
      const remainingSec = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 1000);
      throw new Error(`Account temporarily locked due to 3 failed attempts. Try again in ${remainingSec} seconds.`);
    }

    const users = getMockUsers();
    const existing = users[emailKey];

    if (!existing || existing.passwordHash !== credentials.password) {
      // Record failed attempt
      const curr = failedAttemptsMap[emailKey] || { count: 0, lockedUntil: 0 };
      curr.count += 1;
      if (curr.count >= 3) {
        curr.lockedUntil = Date.now() + 30 * 1000; // 30 sec lock
        failedAttemptsMap[emailKey] = curr;
        throw new Error('Account locked for 30 seconds due to 3 consecutive failed login attempts.');
      } else {
        failedAttemptsMap[emailKey] = curr;
        throw new Error(`Invalid email or password. (${3 - curr.count} attempts remaining before temporary lock)`);
      }
    }

    // Reset failed count on success
    delete failedAttemptsMap[emailKey];

    // Update lastLoginAt
    const updatedUser: AuthUser = {
      ...existing.user,
      lastLoginAt: new Date().toISOString(),
    };

    const updatedUsers = {
      ...users,
      [emailKey]: {
        ...existing,
        user: updatedUser,
      },
    };
    storage.setStoredUsers(updatedUsers);

    // Create session token
    const token = `jwt_mock_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + (credentials.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString();

    const session: AuthSession = {
      token,
      user: updatedUser,
      expiresAt,
      rememberMe: !!credentials.rememberMe,
      deviceId: 'browser_session_' + Math.random().toString(36).substring(2, 8),
    };

    return session;
  },

  /**
   * Simulated Signup API call
   */
  async signup(
    data: SignupData,
    delayMs = 900,
    simulateError: SimulateErrorMode = 'none'
  ): Promise<AuthSession> {
    await delay(delayMs);

    // Simulated error overrides
    if (simulateError === 'server_500') {
      throw new Error('Simulated 500: Database transaction failed during signup.');
    }
    if (simulateError === 'email_exists') {
      throw new Error(`Simulated error: An account with email "${data.email}" already exists.`);
    }

    const emailKey = data.email.trim().toLowerCase();
    const users = getMockUsers();

    if (users[emailKey]) {
      throw new Error(`An account with email "${data.email}" already exists. Please log in instead.`);
    }

    const newUser: AuthUser = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: data.name.trim(),
      email: emailKey,
      role: 'member',
      bio: 'New AuthPulse member onboarded via custom React hooks.',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const newUsersStore = {
      ...users,
      [emailKey]: {
        user: newUser,
        passwordHash: data.password,
      },
    };
    storage.setStoredUsers(newUsersStore);

    const token = `jwt_mock_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const session: AuthSession = {
      token,
      user: newUser,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      rememberMe: true,
      deviceId: 'browser_session_' + Math.random().toString(36).substring(2, 8),
    };

    return session;
  },

  /**
   * Simulated Logout API
   */
  async logout(delayMs = 300): Promise<void> {
    await delay(delayMs);
    storage.clearSession();
  },

  /**
   * Simulated Profile Update API
   */
  async updateProfile(userId: string, updates: Partial<AuthUser>, delayMs = 500): Promise<AuthUser> {
    await delay(delayMs);
    const users = getMockUsers();
    let targetEmailKey: string | null = null;

    for (const [email, record] of Object.entries(users)) {
      if (record.user.id === userId) {
        targetEmailKey = email;
        break;
      }
    }

    if (!targetEmailKey) {
      throw new Error('User not found in mock store');
    }

    const existing = users[targetEmailKey];
    const updatedUser: AuthUser = {
      ...existing.user,
      ...updates,
      // Immutable identity fields
      id: existing.user.id,
      email: existing.user.email,
    };

    const updatedUsers = {
      ...users,
      [targetEmailKey]: {
        ...existing,
        user: updatedUser,
      },
    };
    storage.setStoredUsers(updatedUsers);

    return updatedUser;
  },

  /**
   * Reset mock store to initial demo users
   */
  resetToDefaults(): void {
    storage.setStoredUsers(INITIAL_MOCK_USERS);
    Object.keys(failedAttemptsMap).forEach((k) => delete failedAttemptsMap[k]);
  },

  /**
   * Get all registered users count
   */
  getRegisteredUsersList(): AuthUser[] {
    const users = getMockUsers();
    return Object.values(users).map((u) => u.user);
  },
};
