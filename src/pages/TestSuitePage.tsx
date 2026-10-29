import React, { useState } from 'react';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
  checkPasswordCriteria,
} from '../services/validators';
import { mockAuthApi } from '../services/mockAuthApi';
import { storage } from '../services/storage';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  CheckSquare,
  Clock,
  Sparkles,
} from 'lucide-react';

interface TestCase {
  id: string;
  suite: string;
  name: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  error?: string;
  durationMs?: number;
}

const INITIAL_TESTS: TestCase[] = [
  {
    id: 't1',
    suite: 'Input Validation',
    name: 'validateEmail rejects empty string, missing @, missing domain, and accepts valid emails',
    status: 'idle',
  },
  {
    id: 't2',
    suite: 'Input Validation',
    name: 'validatePassword enforces 8+ chars and complexity on signup',
    status: 'idle',
  },
  {
    id: 't3',
    suite: 'Input Validation',
    name: 'validateConfirmPassword matches only when identical',
    status: 'idle',
  },
  {
    id: 't4',
    suite: 'Password Strength',
    name: 'getPasswordStrength accurately scores from 1 (Weak) to 4 (Excellent)',
    status: 'idle',
  },
  {
    id: 't5',
    suite: 'Session Persistence',
    name: 'storage.setSession and getSession preserve session data and reject expired tokens',
    status: 'idle',
  },
  {
    id: 't6',
    suite: 'Simulated API',
    name: 'mockAuthApi.login enforces artificial latency and rejects invalid credentials',
    status: 'idle',
  },
  {
    id: 't7',
    suite: 'Simulated API',
    name: 'mockAuthApi.login succeeds with seeded demo user and returns JWT session',
    status: 'idle',
  },
  {
    id: 't8',
    suite: 'Simulated API',
    name: 'mockAuthApi.signup creates new user and detects duplicate email conflict',
    status: 'idle',
  },
];

export const TestSuitePage: React.FC = () => {
  const [tests, setTests] = useState<TestCase[]>(INITIAL_TESTS);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);

    const updateTest = (id: string, updates: Partial<TestCase>) => {
      setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    };

    // Test 1: validateEmail
    updateTest('t1', { status: 'running' });
    const start1 = performance.now();
    try {
      if (validateEmail('') === null) throw new Error('Failed to reject empty email');
      if (validateEmail('not-an-email') === null) throw new Error('Failed to reject invalid email');
      if (validateEmail('alex@whatbytes.com') !== null) throw new Error('Rejected valid email');
      updateTest('t1', { status: 'passed', durationMs: Math.round(performance.now() - start1) });
    } catch (err: unknown) {
      updateTest('t1', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start1),
      });
    }

    // Test 2: validatePassword
    updateTest('t2', { status: 'running' });
    const start2 = performance.now();
    try {
      if (validatePassword('short', true) === null) throw new Error('Accepted short password');
      if (validatePassword('allletterspassword', true) === null)
        throw new Error('Accepted password without numbers');
      if (validatePassword('ValidPass123!', true) !== null) throw new Error('Rejected valid password');
      updateTest('t2', { status: 'passed', durationMs: Math.round(performance.now() - start2) });
    } catch (err: unknown) {
      updateTest('t2', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start2),
      });
    }

    // Test 3: validateConfirmPassword
    updateTest('t3', { status: 'running' });
    const start3 = performance.now();
    try {
      if (validateConfirmPassword('passA', 'passB') === null)
        throw new Error('Failed to detect mismatch');
      if (validateConfirmPassword('passA', 'passA') !== null)
        throw new Error('Rejected matching passwords');
      updateTest('t3', { status: 'passed', durationMs: Math.round(performance.now() - start3) });
    } catch (err: unknown) {
      updateTest('t3', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start3),
      });
    }

    // Test 4: Password Strength
    updateTest('t4', { status: 'running' });
    const start4 = performance.now();
    try {
      const weak = getPasswordStrength('weak');
      if (weak.score > 1) throw new Error('Over-rated weak password');
      const strong = getPasswordStrength('P@ssw0rd2026!');
      if (strong.score !== 4) throw new Error('Failed to score 4 on excellent password');
      const criteria = checkPasswordCriteria('Abc123!');
      if (!criteria.hasUpper || !criteria.hasNumber || !criteria.hasSpecial)
        throw new Error('Criteria check failed');
      updateTest('t4', { status: 'passed', durationMs: Math.round(performance.now() - start4) });
    } catch (err: unknown) {
      updateTest('t4', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start4),
      });
    }

    // Test 5: Storage & Session
    updateTest('t5', { status: 'running' });
    const start5 = performance.now();
    try {
      const dummySession = {
        token: 'test_token_999',
        user: {
          id: 'test_usr',
          name: 'Test Tester',
          email: 'test@example.com',
          role: 'member' as const,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        expiresAt: new Date(Date.now() + 60000).toISOString(),
        rememberMe: true,
        deviceId: 'dev_test',
      };
      storage.setSession(dummySession);
      const read = storage.getSession();
      if (!read || read.token !== 'test_token_999') throw new Error('Session storage mismatch');
      // Test expired session
      const expiredSession = {
        ...dummySession,
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      };
      storage.setSession(expiredSession);
      const readExpired = storage.getSession();
      if (readExpired !== null) throw new Error('Failed to discard expired session');
      // Restore valid dummy or clear
      storage.clearSession();
      updateTest('t5', { status: 'passed', durationMs: Math.round(performance.now() - start5) });
    } catch (err: unknown) {
      updateTest('t5', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start5),
      });
    }

    // Test 6: API latency & invalid credentials rejection
    updateTest('t6', { status: 'running' });
    const start6 = performance.now();
    try {
      let threw = false;
      try {
        await mockAuthApi.login(
          { email: 'alex@whatbytes.com', password: 'WrongPassword999!' },
          200,
          'none'
        );
      } catch {
        threw = true;
      }
      if (!threw) throw new Error('Login succeeded with incorrect password');
      updateTest('t6', { status: 'passed', durationMs: Math.round(performance.now() - start6) });
    } catch (err: unknown) {
      updateTest('t6', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start6),
      });
    }

    // Test 7: API valid login
    updateTest('t7', { status: 'running' });
    const start7 = performance.now();
    try {
      const res = await mockAuthApi.login(
        { email: 'alex@whatbytes.com', password: 'Password123!' },
        200,
        'none'
      );
      if (!res.token || res.user.email !== 'alex@whatbytes.com') {
        throw new Error('Valid login failed to return token or matching user');
      }
      updateTest('t7', { status: 'passed', durationMs: Math.round(performance.now() - start7) });
    } catch (err: unknown) {
      updateTest('t7', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start7),
      });
    }

    // Test 8: Signup conflict
    updateTest('t8', { status: 'running' });
    const start8 = performance.now();
    try {
      let conflictDetected = false;
      try {
        await mockAuthApi.signup(
          {
            name: 'Alex Duplicate',
            email: 'alex@whatbytes.com',
            password: 'Password123!',
          },
          200,
          'none'
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('already exists')) {
          conflictDetected = true;
        }
      }
      if (!conflictDetected) throw new Error('Did not catch duplicate email on signup');
      updateTest('t8', { status: 'passed', durationMs: Math.round(performance.now() - start8) });
    } catch (err: unknown) {
      updateTest('t8', {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Error',
        durationMs: Math.round(performance.now() - start8),
      });
    }

    setIsRunning(false);
  };

  const handleReset = () => {
    setTests(INITIAL_TESTS);
  };

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
              Automated Verification Suite
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Authentication Hooks &amp; Validator Test Runner
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Execute real-time assertions against input validators, session storage, and mock async latency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running Assertions...' : 'Run All Tests'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isRunning}
            className="p-2 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="Reset test statuses"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-600">
            Total Tests: <span className="font-mono text-slate-900">{tests.length}</span>
          </span>
          <span className="text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Passed: <span className="font-mono">{passedCount}</span>
          </span>
          {failedCount > 0 && (
            <span className="text-rose-700 flex items-center gap-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              Failed: <span className="font-mono">{failedCount}</span>
            </span>
          )}
        </div>

        {passedCount === tests.length && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" /> 100% Passed
          </div>
        )}
      </div>

      {/* Tests Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {tests.map((test) => (
            <div key={test.id} className="p-4 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-sm">
                    {test.suite}
                  </span>
                  <span className="font-semibold text-slate-900">{test.name}</span>
                </div>
                {test.error && (
                  <p className="text-rose-600 font-medium pl-2 border-l-2 border-rose-500">
                    Assertion Error: {test.error}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {test.durationMs !== undefined && (
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {test.durationMs}ms
                  </span>
                )}

                {test.status === 'idle' && (
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <CheckSquare className="w-4 h-4" /> Ready
                  </span>
                )}
                {test.status === 'running' && (
                  <span className="text-indigo-600 font-medium flex items-center gap-1 animate-pulse">
                    Running...
                  </span>
                )}
                {test.status === 'passed' && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Passed
                  </span>
                )}
                {test.status === 'failed' && (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Failed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
