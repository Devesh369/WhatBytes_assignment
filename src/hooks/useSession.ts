import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useSession() {
  const { session, user, status, logout } = useAuth();
  const [timeLeftMs, setTimeLeftMs] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.expiresAt) {
      setTimeLeftMs(null);
      return;
    }

    const checkExpiration = () => {
      const remaining = new Date(session.expiresAt).getTime() - Date.now();
      if (remaining <= 0) {
        setTimeLeftMs(0);
        logout();
      } else {
        setTimeLeftMs(remaining);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [session, logout]);

  const formattedTimeRemaining = useMemo(() => {
    if (timeLeftMs === null) return 'N/A';
    if (timeLeftMs <= 0) return 'Expired';

    const totalSeconds = Math.floor(timeLeftMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [timeLeftMs]);

  const isExpiringSoon = useMemo(() => {
    return timeLeftMs !== null && timeLeftMs > 0 && timeLeftMs < 5 * 60 * 1000;
  }, [timeLeftMs]);

  const maskedToken = useMemo(() => {
    if (!session?.token) return 'None';
    return session.token.slice(0, 10) + '...' + session.token.slice(-6);
  }, [session?.token]);

  const refreshSession = useCallback(() => {
    if (!session) return;
    // Extend expiry
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    session.expiresAt = newExpiresAt;
    setTimeLeftMs(24 * 60 * 60 * 1000);
  }, [session]);

  return {
    session,
    user,
    status,
    isActive: !!session,
    maskedToken,
    deviceId: session?.deviceId || 'Unknown',
    rememberMe: session?.rememberMe ?? false,
    formattedTimeRemaining,
    timeLeftMs,
    isExpiringSoon,
    refreshSession,
  };
}
