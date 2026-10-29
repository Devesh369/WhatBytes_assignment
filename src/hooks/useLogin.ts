import { useState, useCallback, useTransition } from 'react';
import { useAuth } from './useAuth';
import { validateEmail, validatePassword } from '../services/validators';
import { FormValidationErrors, LoginCredentials } from '../types/auth';

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (errorMsg: string) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const { login, error: authError, clearError } = useAuth();
  const [, startTransition] = useTransition();

  const [values, setValues] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  /**
   * Validate individual field
   */
  const validateField = useCallback((field: keyof LoginCredentials, val: string | boolean | undefined): string | null => {
    if (field === 'email') {
      return validateEmail(typeof val === 'string' ? val : '');
    }
    if (field === 'password') {
      return validatePassword(typeof val === 'string' ? val : '', false);
    }
    return null;
  }, []);

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): boolean => {
    const emailErr = validateEmail(values.email);
    const passErr = validatePassword(values.password, false);

    const newErrors: FormValidationErrors = {};
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values.email, values.password]);

  /**
   * Input change handler
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Clear general error when user starts re-typing
      if (submissionError) setSubmissionError(null);
      if (authError) clearError();

      // If already touched, validate live
      if (touched[name]) {
        const fieldErr = validateField(name as keyof LoginCredentials, fieldValue);
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErr || undefined,
        }));
      }
    },
    [touched, submissionError, authError, clearError, validateField]
  );

  /**
   * Input blur handler
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const fieldErr = validateField(name as keyof LoginCredentials, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErr || undefined,
      }));
    },
    [validateField]
  );

  /**
   * Form submission
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent): Promise<boolean> => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields touched
      setTouched({
        email: true,
        password: true,
      });

      const isValid = validateForm();
      if (!isValid) {
        return false;
      }

      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        await login(values);
        startTransition(() => {
          options?.onSuccess?.();
        });
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
        setSubmissionError(msg);
        options?.onError?.(msg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, login, values, options]
  );

  /**
   * Fill demo credentials for testing
   */
  const fillDemo = useCallback((role: 'admin' | 'dev') => {
    if (role === 'admin') {
      setValues({
        email: 'alex@whatbytes.com',
        password: 'Password123!',
        rememberMe: true,
      });
    } else {
      setValues({
        email: 'sarah@whatbytes.com',
        password: 'Welcome2026!',
        rememberMe: true,
      });
    }
    setTouched({ email: true, password: true });
    setErrors({});
    setSubmissionError(null);
  }, []);

  const resetForm = useCallback(() => {
    setValues({ email: '', password: '', rememberMe: true });
    setTouched({});
    setErrors({});
    setSubmissionError(null);
  }, []);

  const isValid = !errors.email && !errors.password && !!values.email && !!values.password;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submissionError: submissionError || authError,
    handleChange,
    handleBlur,
    handleSubmit,
    fillDemo,
    resetForm,
    setValues,
  };
}
