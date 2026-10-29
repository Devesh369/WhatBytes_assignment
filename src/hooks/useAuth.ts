import { useAuthContext } from '../context/AuthContext';
import { AuthContextType } from '../types/auth';

/**
 * Custom hook `useAuth`
 * Encapsulates global authentication session state, status, and actions.
 */
export function useAuth(): AuthContextType {
  return useAuthContext();
}
