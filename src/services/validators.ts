import { PasswordCriteria } from '../types/auth';

/**
 * Standard email format validator
 */
export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Email address is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g., alex@whatbytes.com)';
  }
  return null;
}

/**
 * Name validator
 */
export function validateName(name: string): string | null {
  if (!name || !name.trim()) {
    return 'Full name is required';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters';
  }
  return null;
}

/**
 * Password criteria analysis
 */
export function checkPasswordCriteria(password: string): PasswordCriteria {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

/**
 * Password strength score (0 to 4)
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  color: string;
} {
  if (!password) {
    return { score: 0, label: 'Very Weak', color: 'bg-slate-200' };
  }

  const criteria = checkPasswordCriteria(password);
  let score = 0;
  if (criteria.minLength) score += 1;
  if (criteria.hasUpper && criteria.hasLower) score += 1;
  if (criteria.hasNumber) score += 1;
  if (criteria.hasSpecial) score += 1;

  switch (score) {
    case 0:
    case 1:
      return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    case 2:
      return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    case 3:
      return { score: 3, label: 'Strong', color: 'bg-blue-600' };
    case 4:
      return { score: 4, label: 'Excellent', color: 'bg-emerald-600' };
    default:
      return { score: 0, label: 'Very Weak', color: 'bg-slate-200' };
  }
}

/**
 * Password field validator
 */
export function validatePassword(password: string, isSignUp = false): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (isSignUp) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters for new accounts';
    }
    const hasNum = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasNum || !hasLetter) {
      return 'Password must contain both letters and numbers';
    }
  }
  return null;
}

/**
 * Confirm password validator
 */
export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

/**
 * Terms agreement validator
 */
export function validateTerms(agreed: boolean): string | null {
  if (!agreed) {
    return 'You must agree to the Terms of Service and Privacy Policy';
  }
  return null;
}
