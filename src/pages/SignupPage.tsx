import React from 'react';
import { useRouter } from '../hooks/useRouter';
import { useSignup } from '../hooks/useSignup';
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute';
import { FormField } from '../components/common/FormField';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter';
import { DemoAccountBar } from '../components/auth/DemoAccountBar';
import { User, Mail, Lock, UserPlus, Loader2, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    passwordStrength,
    passwordCriteria,
    submissionError,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useSignup({
    onSuccess: handleSuccess,
  });

  const passwordsMatch =
    values.password && values.confirmPassword && values.password === values.confirmPassword;

  return (
    <PublicOnlyRoute>
      <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Simulator Bar */}
          <DemoAccountBar />

          {/* Signup Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6 text-center">
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-3">
                <UserPlus className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Create your account</h1>
              <p className="text-xs text-slate-500 mt-1">
                Join AuthPulse with simulated local authentication &amp; secure session hooks.
              </p>
            </div>

            {/* Top Submission Error */}
            {submissionError && (
              <div
                role="alert"
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Registration Error</span>
                  <span>{submissionError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <FormField
                id="signup-name"
                name="name"
                label="Full Name"
                type="text"
                placeholder="e.g. Jordan Miller"
                value={values.name}
                error={errors.name}
                touched={touched.name}
                autoComplete="name"
                required
                disabled={isSubmitting}
                onChange={handleChange}
                onBlur={handleBlur}
                icon={<User className="w-4 h-4" />}
              />

              {/* Email Address */}
              <FormField
                id="signup-email"
                name="email"
                label="Work Email"
                type="email"
                placeholder="jordan@example.com"
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
              <div>
                <FormField
                  id="signup-password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={values.password}
                  error={errors.password}
                  touched={touched.password}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon={<Lock className="w-4 h-4" />}
                />

                {/* Password Strength Meter */}
                {values.password.length > 0 && (
                  <PasswordStrengthMeter
                    strength={passwordStrength}
                    criteria={passwordCriteria}
                    showCriteria={true}
                  />
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <FormField
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat your password"
                  value={values.confirmPassword}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon={<Lock className="w-4 h-4" />}
                />
                {passwordsMatch && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passwords match perfectly</span>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={values.agreeToTerms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className="mt-0.5 w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I agree to the <span className="text-indigo-600 font-medium hover:underline">Terms of Service</span> and{' '}
                    <span className="text-indigo-600 font-medium hover:underline">Privacy Policy</span>.
                  </span>
                </label>
                {touched.agreeToTerms && errors.agreeToTerms && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.agreeToTerms}</span>
                  </p>
                )}
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
                    <span>Creating Account &amp; Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in here
              </button>
            </div>
          </div>

          {/* Validation Architecture Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">Abstracted Logic:</span>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Password strength scoring, criteria tracking, input validation on blur, and instant match checking are purely driven by the custom <code className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded-sm">useSignup</code> hook.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
};
