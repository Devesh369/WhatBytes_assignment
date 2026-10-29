import { useState, useCallback, useMemo, useTransition } from 'react';
import { useAuth } from './useAuth';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateTerms,
  getPasswordStrength,
  checkPasswordCriteria,
} from '../services/validators';
import { FormValidationErrors, SignupData } from '../types/auth';

interface UseSignupOptions {
  onSuccess?: () => void;
  onError?: (errorMsg: string) => void;
}

export function useSignup(options?: UseSignupOptions) {
  const { signup, error: authError, clearError } = useAuth();
  const [, startTransition] = useTransition();

  const [values, setValues] = useState<SignupData & { confirmPassword: string; agreeToTerms: boolean }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Real-time password metrics
  const passwordStrength = useMemo(() => getPasswordStrength(values.password), [values.password]);
  const passwordCriteria = useMemo(() => checkPasswordCriteria(values.password), [values.password]);

  /**
   * Validate individual field
   */
  const validateField = useCallback(
    (field: keyof (SignupData & { confirmPassword: string; agreeToTerms: boolean }), val: unknown): string | null => {
      switch (field) {
        case 'name':
          return validateName(typeof val === 'string' ? val : '');
        case 'email':
          return validateEmail(typeof val === 'string' ? val : '');
        case 'password':
          return validatePassword(typeof val === 'string' ? val : '', true);
        case 'confirmPassword':
          return validateConfirmPassword(values.password, typeof val === 'string' ? val : '');
        case 'agreeToTerms':
          return validateTerms(Boolean(val));
        default:
          return null;
      }
    },
    [values.password]
  );

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): boolean => {
    const nameErr = validateName(values.name);
    const emailErr = validateEmail(values.email);
    const passErr = validatePassword(values.password, true);
    const confirmErr = validateConfirmPassword(values.password, values.confirmPassword);
    const termsErr = validateTerms(values.agreeToTerms);

    const newErrors: FormValidationErrors = {};
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (confirmErr) newErrors.confirmPassword = confirmErr;
    if (termsErr) newErrors.agreeToTerms = termsErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  /**
   * Input change handler
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;

      setValues((prev) => {
        const next = { ...prev, [name]: fieldValue };
        return next;
      });

      if (submissionError) setSubmissionError(null);
      if (authError) clearError();

      // If already touched, validate live
      if (touched[name]) {
        const fieldErr = validateField(name as any, fieldValue);
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErr || undefined,
        }));
      }

      // If user typed in password and confirmPassword was already touched, revalidate confirmPassword
      if (name === 'password' && touched.confirmPassword) {
        const confirmErr = validateConfirmPassword(fieldValue as string, values.confirmPassword);
        setErrors((prev) => ({
          ...prev,
          confirmPassword: confirmErr || undefined,
        }));
      }
    },
    [touched, submissionError, authError, clearError, validateField, values.confirmPassword]
  );

  /**
   * Input blur handler
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const fieldErr = validateField(name as any, fieldValue);
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

      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        agreeToTerms: true,
      });

      const isValid = validateForm();
      if (!isValid) {
        return false;
      }

      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        await signup({
          name: values.name,
          email: values.email,
          password: values.password,
        });

        startTransition(() => {
          options?.onSuccess?.();
        });
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Signup failed. Please try again.';
        setSubmissionError(msg);
        options?.onError?.(msg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, signup, values, options]
  );

  const resetForm = useCallback(() => {
    setValues({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    });
    setTouched({});
    setErrors({});
    setSubmissionError(null);
  }, []);

  const isValid =
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.agreeToTerms &&
    !!values.name &&
    !!values.email &&
    !!values.password &&
    !!values.confirmPassword &&
    values.agreeToTerms;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    passwordStrength,
    passwordCriteria,
    submissionError: submissionError || authError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
}
