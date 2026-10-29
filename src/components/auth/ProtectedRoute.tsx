import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from '../../hooks/useRouter';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Guard
 * - Displays loading placeholder while auth status is being resolved.
 * - Automatically redirects unauthenticated visitors to `/login?redirect=<path>`.
 * - Renders children when authenticated.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { status, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectTarget = encodeURIComponent(router.pathname);
      router.replace(`/login?redirect=${redirectTarget}`);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || status === 'loading') {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Verifying Protected Session</h2>
          <p className="text-xs text-slate-500 mb-6">
            Validating security tokens and resolving permissions with AuthPulse...
          </p>

          <div className="w-full space-y-3">
            <div className="h-4 bg-slate-100 rounded-md animate-pulse w-3/4 mx-auto" />
            <div className="h-4 bg-slate-100 rounded-md animate-pulse w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">Redirecting to Login</h3>
        <p className="text-xs text-slate-500 mt-1">This route is protected. Redirecting to authentication page...</p>
      </div>
    );
  }

  return <>{children}</>;
};
