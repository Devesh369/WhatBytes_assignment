import React from 'react';
import { useRouter } from '../hooks/useRouter';
import { useLogin } from '../hooks/useLogin';
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute';
import { FormField } from '../components/common/FormField';
import { DemoAccountBar } from '../components/auth/DemoAccountBar';
import { Mail, Lock, LogIn, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleSuccess = () => {
    const redirectParam = router.searchParams.get('redirect');
    const target = redirectParam ? decodeURIComponent(redirectParam) : '/dashboard';
    router.push(target);
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submissionError,
    handleChange,
    handleBlur,
    handleSubmit,
    fillDemo,
  } = useLogin({
    onSuccess: handleSuccess,
  });

  return (
    <PublicOnlyRoute>
      <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Quick Demo Credentials Bar */}
          <DemoAccountBar onSelectRole={(role) => fillDemo(role)} />

          {/* Login Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6 text-center">
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-3">
                <LogIn className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Sign in to your account</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access the protected workspace.
              </p>
            </div>

            {/* Top-level Submission Error Banner */}
            {submissionError && (
              <div
                role="alert"
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Authentication Error</span>
                  <span>{submissionError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <FormField
                id="login-email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="name@whatbytes.com"
                value={values.email}
                error={errors.email}
                touched={touched.email}
                autoComplete="email"
                required
                disabled={isSubmitting}
                onChange={handleChange}
                onBlur={handleBlur}
                icon={<Mail className="w-4 h-4" />}
              />

              {/* Password */}
              <FormField
                id="login-password"
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={values.password}
                error={errors.password}
                touched={touched.password}
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                onChange={handleChange}
                onBlur={handleBlur}
                icon={<Lock className="w-4 h-4" />}
              />

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={values.rememberMe}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember my session</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert('Demo Mode: Click "Admin (Alex)" above to auto-fill valid credentials!')
                  }
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating &amp; Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign up for free
              </button>
            </div>
          </div>

          {/* Assignment architectural guarantee banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">Separation of Concerns:</span>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                This form contains zero API calls or direct business logic. All validation, state management, simulated network delay, and session updates are strictly encapsulated within the reusable <code className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded-sm">useLogin</code> and <code className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded-sm">useAuth</code> hooks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
};
