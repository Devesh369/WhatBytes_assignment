export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'member';
  avatar?: string;
  bio?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: string;
  rememberMe: boolean;
  deviceId: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  signup: (data: SignupData) => Promise<AuthUser>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<AuthUser>) => Promise<AuthUser>;
  // Simulator configuration for reviewer testing
  simulatedDelay: number;
  setSimulatedDelay: (delay: number) => void;
  simulateError: SimulateErrorMode;
  setSimulateError: (mode: SimulateErrorMode) => void;
}

export type SimulateErrorMode = 
  | 'none'
  | 'invalid_credentials'
  | 'email_exists'
  | 'server_500'
  | 'rate_limited';

export interface FormValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

export interface PasswordCriteria {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}
