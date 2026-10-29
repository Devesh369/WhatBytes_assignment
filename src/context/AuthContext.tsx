import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  AuthContextType,
  AuthSession,
  AuthStatus,
  AuthUser,
  LoginCredentials,
  SignupData,
  SimulateErrorMode,
} from '../types/auth';
import { mockAuthApi } from '../services/mockAuthApi';
import { storage } from '../services/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [simulatedDelay, setSimulatedDelay] = useState<number>(800);
  const [simulateError, setSimulateError] = useState<SimulateErrorMode>('none');

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const stored = storage.getSession();
        if (stored) {
          // Verify user hasn't expired
          if (new Date(stored.expiresAt).getTime() > Date.now()) {
            if (isMounted) {
              setSession(stored);
              setStatus('authenticated');
            }
            return;
          } else {
            storage.clearSession();
          }
        }
        if (isMounted) {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        if (isMounted) {
          setSession(null);
          setStatus('unauthenticated');
        }
      }
    };

    // Small initial resolving delay to demonstrate graceful skeleton transition
    const timer = setTimeout(restoreSession, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthUser> => {
      setError(null);
      try {
        const newSession = await mockAuthApi.login(credentials, simulatedDelay, simulateError);
        storage.setSession(newSession);
        setSession(newSession);
        setStatus('authenticated');
        return newSession.user;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
        setError(message);
        throw err;
      }
    },
    [simulatedDelay, simulateError]
  );

  const signup = useCallback(
    async (data: SignupData): Promise<AuthUser> => {
      setError(null);
      try {
        const newSession = await mockAuthApi.signup(data, simulatedDelay, simulateError);
        storage.setSession(newSession);
        setSession(newSession);
        setStatus('authenticated');
        return newSession.user;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(message);
        throw err;
      }
    },
    [simulatedDelay, simulateError]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await mockAuthApi.logout(300);
    } finally {
      storage.clearSession();
      setSession(null);
      setStatus('unauthenticated');
      setError(null);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<AuthUser>): Promise<AuthUser> => {
      if (!session) throw new Error('No active session');
      const updatedUser = await mockAuthApi.updateProfile(session.user.id, updates);
      const updatedSession: AuthSession = {
        ...session,
        user: updatedUser,
      };
      storage.setSession(updatedSession);
      setSession(updatedSession);
      return updatedUser;
    },
    [session]
  );

  const user = session?.user ?? null;
  const isAuthenticated = status === 'authenticated' && !!session;
  const isLoading = status === 'loading';

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      status,
      isAuthenticated,
      isLoading,
      error,
      login,
      signup,
      logout,
      clearError,
      updateProfile,
      simulatedDelay,
      setSimulatedDelay,
      simulateError,
      setSimulateError,
    }),
    [
      user,
      session,
      status,
      isAuthenticated,
      isLoading,
      error,
      login,
      signup,
      logout,
      clearError,
      updateProfile,
      simulatedDelay,
      simulateError,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
