import React, { useState } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { FormField } from '../components/common/FormField';
import { User, Mail, CheckCircle2, ArrowLeft, Loader2, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [role, setRole] = useState<'admin' | 'developer' | 'member'>(user?.role || 'member');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        role,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
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

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
              alt={user?.name || 'User'}
              className="w-16 h-16 rounded-full border-2 border-indigo-100 bg-slate-50 object-cover"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900">Account Settings</h1>
              <p className="text-xs text-slate-500">
                Update your identity details. Session state updates reactively across all hooks.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile updated successfully! Stored session refreshed.</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="profile-name"
              name="name"
              label="Full Name"
              value={name}
              required
              disabled={isSaving}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />

            <FormField
              id="profile-email"
              name="email"
              label="Email Address (Immutable)"
              value={user?.email || ''}
              disabled
              helperText="Email cannot be modified in simulated mode."
              onChange={() => {}}
              icon={<Mail className="w-4 h-4" />}
            />

            <div>
              <label htmlFor="profile-bio" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bio / Title
              </label>
              <textarea
                id="profile-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isSaving}
                className="w-full text-xs rounded-lg border border-slate-300 p-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                placeholder="Brief summary of your responsibilities..."
              />
            </div>

            <div>
              <label htmlFor="profile-role" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Workspace Role
              </label>
              <select
                id="profile-role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                disabled={isSaving}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden"
              >
                <option value="member">Member</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};
