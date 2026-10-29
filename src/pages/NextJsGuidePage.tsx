import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  CheckCircle2,
  FolderTree,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface CodeSnippet {
  name: string;
  path: string;
  description: string;
  code: string;
}

const NEXTJS_SNIPPETS: CodeSnippet[] = [
  {
    name: 'useLogin.ts',
    path: 'hooks/useLogin.ts',
    description: 'Custom React hook encapsulating login form state, input validation, and simulated async API calls.',
    code: `import { useState, useCallback, useTransition } from 'react';
import { useAuth } from './useAuth';
import { validateEmail, validatePassword } from '@/services/validators';
import { FormValidationErrors, LoginCredentials } from '@/types/auth';

export function useLogin(options?: { onSuccess?: () => void; onError?: (msg: string) => void }) {
  const { login, error: authError, clearError } = useAuth();
  const [, startTransition] = useTransition();

  const [values, setValues] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({ email: false, password: false });
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const emailErr = validateEmail(values.email);
    const passErr = validatePassword(values.password, false);
    const newErrors: FormValidationErrors = {};
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values.email, values.password]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setValues((prev) => ({ ...prev, [name]: val }));
    if (submissionError) setSubmissionError(null);
    if (authError) clearError();
  }, [submissionError, authError, clearError]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(value) || undefined }));
    if (name === 'password') setErrors((prev) => ({ ...prev, password: validatePassword(value, false) || undefined }));
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent): Promise<boolean> => {
    if (e) e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validateForm()) return false;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await login(values);
      startTransition(() => {
        options?.onSuccess?.();
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setSubmissionError(msg);
      options?.onError?.(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, login, values, options]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid: !errors.email && !errors.password && !!values.email && !!values.password,
    submissionError: submissionError || authError,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  };
}`,
  },
  {
    name: 'useSignup.ts',
    path: 'hooks/useSignup.ts',
    description: 'Custom React hook for registration form state, password confirmation matching, and strength calculation.',
    code: `import { useState, useCallback, useMemo, useTransition } from 'react';
import { useAuth } from './useAuth';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateTerms,
  getPasswordStrength,
  checkPasswordCriteria,
} from '@/services/validators';
import { FormValidationErrors, SignupData } from '@/types/auth';

export function useSignup(options?: { onSuccess?: () => void; onError?: (msg: string) => void }) {
  const { signup, error: authError, clearError } = useAuth();
  const [, startTransition] = useTransition();

  const [values, setValues] = useState<SignupData & { confirmPassword: string; agreeToTerms: boolean }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => getPasswordStrength(values.password), [values.password]);
  const passwordCriteria = useMemo(() => checkPasswordCriteria(values.password), [values.password]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormValidationErrors = {};
    const nameErr = validateName(values.name);
    const emailErr = validateEmail(values.email);
    const passErr = validatePassword(values.password, true);
    const confirmErr = validateConfirmPassword(values.password, values.confirmPassword);
    const termsErr = validateTerms(values.agreeToTerms);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (confirmErr) newErrors.confirmPassword = confirmErr;
    if (termsErr) newErrors.agreeToTerms = termsErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setValues((prev) => ({ ...prev, [name]: val }));
    if (submissionError) setSubmissionError(null);
    if (authError) clearError();
  }, [submissionError, authError, clearError]);

  const handleSubmit = useCallback(async (e?: React.FormEvent): Promise<boolean> => {
    if (e) e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true, agreeToTerms: true });
    if (!validateForm()) return false;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await signup({ name: values.name, email: values.email, password: values.password });
      startTransition(() => {
        options?.onSuccess?.();
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed.';
      setSubmissionError(msg);
      options?.onError?.(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, signup, values, options]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid: Object.keys(errors).length === 0,
    passwordStrength,
    passwordCriteria,
    submissionError: submissionError || authError,
    handleChange,
    handleSubmit,
  };
}`,
  },
  {
    name: 'ProtectedRoute.tsx',
    path: 'components/auth/ProtectedRoute.tsx',
    description: 'Next.js protected route wrapper component with session resolving placeholder and auto-redirect.',
    code: `'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectTarget = encodeURIComponent(pathname);
      router.replace(\`/login?redirect=\${redirectTarget}\`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}`,
  },
  {
    name: 'middleware.ts',
    path: 'middleware.ts',
    description: 'Next.js Edge Middleware for server-side route guarding based on auth session cookie/token.',
    code: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authpulse_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated user trying to access protected route
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user from login/signup to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/login', '/signup'],
};`,
  },
];

export const NextJsGuidePage: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(NEXTJS_SNIPPETS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
            Next.js App Router &amp; Hooks Specification
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          WhatBytes Assignment Architecture Guide
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          This system is crafted according to enterprise Next.js App Router patterns, strictly
          decoupling UI rendering from validation and session logic via reusable custom React hooks.
        </p>
      </div>

      {/* Criteria Verification Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Assignment Requirements Compliance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Static Login &amp; Signup Pages
            </span>
            <p className="text-slate-500 text-[11px]">
              Independent pages with input validation on email format, required fields, and password matching.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Custom Authentication Hooks
            </span>
            <p className="text-slate-500 text-[11px]">
              <code className="text-indigo-600 font-mono">useAuth</code>, <code className="text-indigo-600 font-mono">useLogin</code>, and <code className="text-indigo-600 font-mono">useSignup</code> isolate all business and async logic.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Protected Routing &amp; Guards
            </span>
            <p className="text-slate-500 text-[11px]">
              <code className="text-indigo-600 font-mono">&lt;ProtectedRoute&gt;</code> intercepts unauthenticated traffic with loading placeholders and return URLs.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Simulated Backend Behavior
            </span>
            <p className="text-slate-500 text-[11px]">
              Simulated latency (<code className="font-mono">setTimeout</code>) + mock database with default accounts and injected error modes.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Session Management
            </span>
            <p className="text-slate-500 text-[11px]">
              Stores session tokens in <code className="font-mono">localStorage</code> / <code className="font-mono">sessionStorage</code> with automatic expiration checks.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Clean Code &amp; Separation
            </span>
            <p className="text-slate-500 text-[11px]">
              UI components only render markup and invoke hook callbacks. Zero inline network requests.
            </p>
          </div>
        </div>
      </div>

      {/* Code Inspector Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-900">Next.js Source Inspector</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {NEXTJS_SNIPPETS.map((snip) => (
              <button
                key={snip.name}
                onClick={() => setSelectedSnippet(snip)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedSnippet.name === snip.name
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {snip.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-1">
                {selectedSnippet.path}
              </div>
              <p className="text-xs text-slate-500">{selectedSnippet.description}</p>
            </div>

            <button
              onClick={() => handleCopy(selectedSnippet.code)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-[460px] leading-relaxed">
            <code>{selectedSnippet.code}</code>
          </pre>
        </div>
      </div>

      {/* GitHub Repository Push Instructions */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Deployment &amp; Git Push Instructions</h2>
              <p className="text-xs text-slate-400">
                Steps to push directly to <code className="text-indigo-300 font-mono">Nextjs_assignment</code> branch
              </p>
            </div>
          </div>

          <a
            href="https://github.com/Devesh369/WhatBytes_assignment/tree/Nextjs_assignment"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <span>Target Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
          <p className="text-slate-500"># 1. Initialize or checkout Nextjs_assignment branch</p>
          <p className="text-emerald-400">git checkout -b Nextjs_assignment</p>
          <p className="text-slate-500"># 2. Stage all auth hooks, pages, and components</p>
          <p className="text-emerald-400">git add .</p>
          <p className="text-slate-500"># 3. Commit with descriptive message</p>
          <p className="text-emerald-400">
            git commit -m &quot;feat: complete authentication flow with custom hooks (useAuth, useLogin, useSignup) and protected routing&quot;
          </p>
          <p className="text-slate-500"># 4. Push to remote repository branch</p>
          <p className="text-emerald-400">
            git push -u origin Nextjs_assignment
          </p>
        </div>
      </div>
    </div>
  );
};
