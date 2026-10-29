import React from 'react';
import { useForm } from 'react-hook-form';
import { useMultiStepFormStore } from '../../store/useMultiStepFormStore';
import { PersonalInfo } from '../../types/multiStepForm';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { User, Mail, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const Step1PersonalInfo: React.FC = () => {
  const { formData, updateFormData, nextStep, fillSampleData } = useMultiStepFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PersonalInfo>({
    mode: 'onBlur',
    defaultValues: {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber || '',
    },
  });

  const onSubmit = (data: PersonalInfo) => {
    updateFormData(data);
    nextStep();
  };

  const handleQuickFill = () => {
    fillSampleData();
    reset({
      fullName: 'Alex Morgan Rivers',
      email: 'alex.rivers@whatbytes.com',
      phoneNumber: '+1 (555) 234-5678',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Step 1: Personal Information
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Please provide your legal full name and contact information.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleQuickFill}
          className="text-xs gap-1.5 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900"
          title="Autofill mock details for rapid evaluation"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fill Sample Data</span>
        </Button>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="fullName" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            id="fullName"
            placeholder="e.g. Alex Morgan Rivers"
            className="pl-9 h-10 text-xs"
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Full name must be at least 2 characters',
              },
            })}
          />
        </div>
        {errors.fullName && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.fullName.message}</span>
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            id="email"
            type="email"
            placeholder="alex.rivers@whatbytes.com"
            className="pl-9 h-10 text-xs"
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address (e.g., name@example.com)',
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.email.message}</span>
          </p>
        )}
      </div>

      {/* Phone Number (Optional) */}
      <div className="space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          <label htmlFor="phoneNumber" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Phone Number
          </label>
          <span className="text-[11px] text-zinc-400">Optional</span>
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+1 (555) 234-5678"
            className="pl-9 h-10 text-xs"
            {...register('phoneNumber', {
              pattern: {
                value: /^(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s-]{7,10}$/,
                message: 'Please enter a valid phone number or leave blank',
              },
            })}
          />
        </div>
        {errors.phoneNumber && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.phoneNumber.message}</span>
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
        <Button type="submit" size="lg" className="gap-2 text-xs font-semibold">
          <span>Continue to Address</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
