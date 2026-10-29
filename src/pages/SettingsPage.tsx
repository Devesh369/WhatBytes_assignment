import React, { useState } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';
import { useRouter } from '../hooks/useRouter';
import { FormField } from '../components/common/FormField';
import { Shield, Key, ArrowLeft, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const { maskedToken, deviceId, formattedTimeRemaining, refreshSession } = useSession();
  const router = useRouter();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    setSuccessMsg('Simulated password change successful! Stored credentials updated.');
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <ProtectedRoute>
      <div className="py-8 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        {/* Security & Sessions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Security &amp; Session Management</h1>
              <p className="text-xs text-slate-500">
                Inspect active JWT tokens, enforce device revocations, or update your password.
              </p>
            </div>
          </div>

          {/* Active Session Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
            <div className="font-semibold text-slate-800">Current Session Details:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block">Session Token:</span>
                <span className="font-mono text-slate-800">{maskedToken}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Device Identifier:</span>
                <span className="font-mono text-slate-800 truncate block">{deviceId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Time to Expiry:</span>
                <span className="font-mono text-indigo-600 font-semibold">{formattedTimeRemaining}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Session Action:</span>
                <button
                  type="button"
                  onClick={refreshSession}
                  className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Expiration Token
                </button>
              </div>
            </div>
          </div>

          {/* Change Password Simulator */}
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              Update Password
            </h2>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <FormField
                id="current-password"
                name="currentPassword"
                label="Current Password"
                type="password"
                value={currentPass}
                placeholder="••••••••••••"
                required
                onChange={(e) => setCurrentPass(e.target.value)}
              />

              <FormField
                id="new-password"
                name="newPassword"
                label="New Password"
                type="password"
                value={newPass}
                placeholder="Min 8 characters"
                required
                onChange={(e) => setNewPass(e.target.value)}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Revoke All Sessions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-rose-600">Terminate Active Session</div>
              <div className="text-[11px] text-slate-500">
                Instantly clear local storage and invalidate token
              </div>
            </div>
            <button
              type="button"
              onClick={() => logout().then(() => router.push('/login'))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Revoke &amp; Logout
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
