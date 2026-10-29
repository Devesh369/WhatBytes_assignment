import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMultiStepFormStore } from '../../store/useMultiStepFormStore';
import { AccountCredentials } from '../../types/multiStepForm';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getPasswordStrength, checkPasswordCriteria } from '../../services/validators';
import { PasswordStrengthMeter } from '../auth/PasswordStrengthMeter';
import { UserCheck, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Step3AccountCredentials: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useMultiStepFormStore();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountCredentials>({
    mode: 'onBlur',
    defaultValues: {
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
  });

  const passwordVal = watch('password') || '';
  const confirmVal = watch('confirmPassword') || '';
  const strength = getPasswordStrength(passwordVal);
  const criteria = checkPasswordCriteria(passwordVal);

  const onSubmit = (data: AccountCredentials) => {
    updateFormData(data);
    nextStep();
  };

  const passwordsMatch = passwordVal && confirmVal && passwordVal === confirmVal;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800 text-left">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Step 3: Account Credentials
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Create your login credentials for secure platform access.
        </p>
      </div>

      {/* Username */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="username" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Username <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <UserCheck className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            id="username"
            placeholder="e.g. alex_rivers26"
            className="pl-9 h-10 text-xs"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores',
              },
            })}
          />
        </div>
        {errors.username && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.username.message}</span>
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="password" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            id="password"
            type={showPass ? 'text' : 'password'}
            placeholder="Minimum 8 characters"
            className="pl-9 pr-10 h-10 text-xs"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            tabIndex={-1}
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.password.message}</span>
          </p>
        )}

        {/* Real-time Password Strength feedback */}
        {passwordVal.length > 0 && (
          <PasswordStrengthMeter strength={strength} criteria={criteria} showCriteria={true} />
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Confirm Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter your password"
            className="pl-9 pr-10 h-10 text-xs"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === watch('password') || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.confirmPassword.message}</span>
          </p>
        )}
        {passwordsMatch && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Passwords match</span>
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={prevStep}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Address</span>
        </Button>

        <Button type="submit" size="lg" className="gap-2 text-xs font-semibold">
          <span>Review Confirmation</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
