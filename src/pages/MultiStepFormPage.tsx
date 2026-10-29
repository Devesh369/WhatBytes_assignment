import React from 'react';
import { useMultiStepFormStore } from '../store/useMultiStepFormStore';
import { StepIndicator } from '../components/multi-step-form/StepIndicator';
import { Step1PersonalInfo } from '../components/multi-step-form/Step1PersonalInfo';
import { Step2AddressDetails } from '../components/multi-step-form/Step2AddressDetails';
import { Step3AccountCredentials } from '../components/multi-step-form/Step3AccountCredentials';
import { Step4Confirmation } from '../components/multi-step-form/Step4Confirmation';
import { SuccessModal } from '../components/multi-step-form/SuccessModal';
import { Card, CardContent } from '../components/ui/card';
import { ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MultiStepFormPage: React.FC = () => {
  const { currentStep, isSubmitted, setStep } = useMultiStepFormStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return <Step2AddressDetails />;
      case 3:
        return <Step3AccountCredentials />;
      case 4:
        return <Step4Confirmation />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
          <Layers className="w-3.5 h-3.5" />
          <span>React-Hook-Form &amp; Zustand Multi-Step Suite</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Multi-Step User Registration
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Centralized persistent state management across steps with granular field-level validation.
        </p>
      </div>

      {/* Main Form Container Card */}
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-8">
          {!isSubmitted ? (
            <>
              {/* Step Indicator & Progress */}
              <StepIndicator currentStep={currentStep} onStepClick={setStep} />

              {/* Form Step with Smooth Motion Transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderCurrentStep()}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <SuccessModal />
          )}
        </CardContent>
      </Card>

      {/* Architecture Highlights Note */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Zustand State Store</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            State persists in <code className="font-mono text-zinc-700 dark:text-zinc-300">localStorage</code>. Navigating backwards, forwards, or reloading the browser preserves every field seamlessly.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>React-Hook-Form Validation</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Per-step validation rules, regex pattern matching, and real-time password confirmation prevent advancing to the next step until all errors are resolved.
          </p>
        </div>
      </div>
    </div>
  );
};
