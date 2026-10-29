import React from 'react';
import { useMultiStepFormStore } from '../../store/useMultiStepFormStore';
import { Button } from '../ui/button';
import { CheckCircle2, RotateCcw, ArrowRight, Terminal } from 'lucide-react';
import { useRouter } from '../../hooks/useRouter';

export const SuccessModal: React.FC = () => {
  const { submittedData, resetForm } = useMultiStepFormStore();
  const router = useRouter();

  if (!submittedData) return null;

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-sm">
      <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Registration Complete!
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          User data has been validated through React-Hook-Form and committed to the centralized Zustand store.
        </p>
      </div>

      {/* Payload JSON Inspector */}
      <div className="text-left bg-zinc-950 text-zinc-200 p-4 rounded-xl border border-zinc-800 text-xs font-mono overflow-x-auto max-h-60 space-y-2">
        <div className="flex items-center gap-2 text-zinc-400 text-[11px] pb-2 border-b border-zinc-800">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Console Output (Submitted Payload):</span>
        </div>
        <pre className="text-[11px] leading-relaxed">
          <code>
            {JSON.stringify(
              {
                personalInfo: {
                  fullName: submittedData.fullName,
                  email: submittedData.email,
                  phoneNumber: submittedData.phoneNumber || null,
                },
                address: {
                  streetAddress: submittedData.streetAddress,
                  city: submittedData.city,
                  zipCode: submittedData.zipCode,
                  country: submittedData.country,
                },
                credentials: {
                  username: submittedData.username,
                  passwordHash: '[PROTECTED_HASH]',
                },
                timestamp: new Date().toISOString(),
                managedBy: 'Zustand + React-Hook-Form',
              },
              null,
              2
            )}
          </code>
        </pre>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          className="w-full sm:w-auto gap-2 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form &amp; Register Another</span>
        </Button>

        <Button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="w-full sm:w-auto gap-2 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
