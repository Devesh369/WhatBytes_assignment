import React from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';
import { useRouter } from '../hooks/useRouter';
import {
  Shield,
  Key,
  Clock,
  Laptop,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    session,
    maskedToken,
    deviceId,
    formattedTimeRemaining,
    rememberMe,
    refreshSession,
  } = useSession();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
                alt={user?.name || 'User'}
                className="w-16 h-16 rounded-full border-2 border-indigo-100 bg-slate-50 object-cover"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{user?.name}</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <p className="text-xs text-slate-600 mt-1">{user?.bio || 'Authenticated team member'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => logout().then(() => router.push('/login'))}
              className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* 3-Column Session Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Session Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Session Status</span>
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Active &amp; Verified</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
              <span>Storage mode:</span>
              <span className="font-semibold text-slate-700 font-mono">
                {rememberMe ? 'localStorage (30d)' : 'sessionStorage (1d)'}
              </span>
            </div>
          </div>

          {/* Card 2: Expiration Timer */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Token Lifespan</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {formattedTimeRemaining}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Auto-refresh:</span>
              <button
                type="button"
                onClick={refreshSession}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
          </div>

          {/* Card 3: Security & Device */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Device Session</span>
              <Laptop className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-xs font-mono font-semibold text-slate-800 truncate">
              {deviceId}
            </div>
            <div className="text-xs text-slate-500 mt-2 truncate">
              Token: <span className="font-mono text-slate-700">{maskedToken}</span>
            </div>
          </div>
        </div>

        {/* Protected Resources Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Box 1: Protected API Access */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                Protected Resources &amp; Permissions
              </h2>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Guard Active
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Because this route is wrapped in <code className="text-indigo-600 font-mono">&lt;ProtectedRoute&gt;</code>,
              unauthenticated visitors are automatically intercepted and redirected to <code className="text-indigo-600 font-mono">/login?redirect=%2Fdashboard</code>.
            </p>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Access Level:</span>
                <span className="font-semibold text-slate-900 capitalize">{user?.role} Access</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Account Created:</span>
                <span className="font-mono text-slate-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Last Authentication:</span>
                <span className="font-mono text-slate-700">
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Next.js Hook Architecture Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Active Custom Hook Composition
              </h2>
              <button
                onClick={() => router.push('/nextjs-code')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Inspect Code <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Every piece of state in this dashboard is driven by pure custom hooks:
            </p>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-mono text-indigo-600 font-semibold shrink-0">useAuth()</span>
                <span>Exposes session status, user entity, and login/logout mutations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-indigo-600 font-semibold shrink-0">useSession()</span>
                <span>Tracks token lifespan, auto-refresh triggers, and device fingerprint.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-indigo-600 font-semibold shrink-0">useRouter()</span>
                <span>Provides Next.js-standard client navigation (<code className="font-mono">push</code>, <code className="font-mono">replace</code>).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
