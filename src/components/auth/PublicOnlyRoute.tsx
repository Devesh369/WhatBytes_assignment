import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from '../../hooks/useRouter';
import { Loader2 } from 'lucide-react';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

/**
 * PublicOnlyRoute Guard
 * - Prevents already logged-in users from viewing /login or /signup.
 * - Redirects to /dashboard or return target.
 */
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectParam = router.searchParams.get('redirect');
      const target = redirectParam ? decodeURIComponent(redirectParam) : '/dashboard';
      router.replace(target);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
