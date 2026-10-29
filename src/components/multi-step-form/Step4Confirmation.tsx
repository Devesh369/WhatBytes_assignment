import React, { useState } from 'react';
import { useMultiStepFormStore } from '../../store/useMultiStepFormStore';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useToast } from '../ui/toast-provider';
import {
  User,
  MapPin,
  KeyRound,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export const Step4Confirmation: React.FC = () => {
  const { formData, prevStep, setStep, submitForm } = useMultiStepFormStore();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    // Simulate async network submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    submitForm(formData);
    setIsSubmitting(false);
    showToast('Registration complete!', 'All multi-step form data was validated and saved.', 'success');
  };

  const maskedPassword = '•'.repeat(Math.max(8, formData.password.length));

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800 text-left">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Step 4: Review &amp; Confirm
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Please review your information below before finalizing registration.
        </p>
      </div>

      {/* 3 Summary Review Cards */}
      <div className="space-y-4">
        {/* Card 1: Personal Info */}
        <Card className="text-left border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-zinc-50/60 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-xs font-semibold">1. Personal Information</CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              className="h-7 px-2 text-xs text-indigo-600 dark:text-indigo-400 gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-zinc-400 block text-[11px]">Full Name:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {formData.fullName || 'Not provided'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Email Address:</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                {formData.email || 'Not provided'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Phone Number:</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                {formData.phoneNumber || 'None'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Address Details */}
        <Card className="text-left border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-zinc-50/60 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-xs font-semibold">2. Address Details</CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(2)}
              className="h-7 px-2 text-xs text-indigo-600 dark:text-indigo-400 gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <span className="text-zinc-400 block text-[11px]">Street Address:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formData.streetAddress || 'Not provided'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">City, Zip:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formData.city}, {formData.zipCode}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Country:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formData.country}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Account Credentials */}
        <Card className="text-left border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-zinc-50/60 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-xs font-semibold">3. Account Credentials</CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(3)}
              className="h-7 px-2 text-xs text-indigo-600 dark:text-indigo-400 gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-zinc-400 block text-[11px]">Username:</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                @{formData.username}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[11px]">Password:</span>
              <span className="font-mono text-zinc-500">
                {maskedPassword} (Securely Encrypted)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State Persistence Callout */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2.5 text-left">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Zustand State Centralization:</span>
          <span>
            Every field is stored in the persistent Zustand store. Clicking any &ldquo;Edit&rdquo; button takes you back with all values preserved.
          </span>
        </div>
      </div>

      {/* Navigation & Submit Buttons */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={prevStep}
          disabled={isSubmitting}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Credentials</span>
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Finalizing Registration...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Registration</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
