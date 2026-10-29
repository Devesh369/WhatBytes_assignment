import React from 'react';
import { useRouter } from '../../hooks/useRouter';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, LayoutDashboard, UserCheck, Shield, BookOpen, CheckSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleNav = (path: string) => {
    router.push(path);
  };

  const currentPath = router.pathname;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => handleNav(isAuthenticated ? '/dashboard' : '/login')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
            A
          </div>
          <span>AuthPulse</span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNav('/dashboard')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              currentPath === '/dashboard' || currentPath === '/'
                ? 'text-indigo-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Shadcn Dashboard
          </button>
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('/login')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  currentPath === '/login' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('/signup')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  currentPath === '/signup' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('/auth-portal')}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  currentPath === '/auth-portal' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                Auth Session
              </button>
              <button
                onClick={() => handleNav('/profile')}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  currentPath === '/profile' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Profile
              </button>
            </>
          )}

          <button
            onClick={() => handleNav('/nextjs-code')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              currentPath === '/nextjs-code' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Next.js Architecture
          </button>

          <button
            onClick={() => handleNav('/test-suite')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              currentPath === '/test-suite' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Hook Test Suite
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                {user?.name}
              </span>
              <button
                onClick={() => logout().then(() => router.push('/login'))}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('/login')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
