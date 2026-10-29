import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  value,
  error,
  touched,
  placeholder,
  autoComplete,
  disabled,
  required,
  helperText,
  onChange,
  onBlur,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  const hasError = touched && !!error;
  const isValid = touched && !error && value.length > 0;

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {isValid && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Valid
          </span>
        )}
      </div>

      <div className="relative rounded-lg shadow-2xs">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`block w-full text-sm rounded-lg transition-colors border py-2.5 ${
            icon ? 'pl-10' : 'pl-3'
          } ${isPasswordField ? 'pr-10' : 'pr-3'} ${
            hasError
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
              : isValid
              ? 'border-emerald-300 bg-emerald-50/10 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
              : 'border-slate-300 bg-white hover:border-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
          } outline-hidden disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {hasError ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
