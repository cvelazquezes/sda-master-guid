/**
 * Auth Context
 *
 * Provides authentication state and operations throughout the app.
 * Moved from src/context/ to consolidate all contexts in one folder.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { authService } from '../../infrastructure/repositories/authService';
import { LOG_MESSAGES } from '../../shared/constants';
import { logger } from '../../shared/utils/logger';
import type { User, AuthContextType } from '../../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth operations type for the factory function
type AuthOperations = {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    whatsappNumber: string,
    clubId: string,
    classes?: string[],
    isClubAdmin?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

// Extracted auth operations to reduce component complexity
const createAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): AuthOperations => ({
  login: async (email: string, password: string): Promise<void> => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.LOGIN_ERROR, error as Error, { email });
      throw error;
    }
  },

  // eslint-disable-next-line max-params -- Registration requires all user data
  register: async (
    email: string,
    password: string,
    name: string,
    whatsappNumber: string,
    clubId: string,
    classes?: string[],
    isClubAdmin?: boolean
  ): Promise<void> => {
    try {
      const { user: registeredUser } = await authService.register(
        email,
        password,
        name,
        whatsappNumber,
        clubId,
        classes,
        isClubAdmin
      );
      setUser(registeredUser);
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.REGISTRATION_ERROR, error as Error, { email });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      logger.info(LOG_MESSAGES.AUTH.LOGOUT_STARTED);
      await authService.logout();
      logger.info(LOG_MESSAGES.AUTH.LOGOUT_STORAGE_CLEARED);
      setUser(null);
      logger.info(LOG_MESSAGES.AUTH.LOGOUT_COMPLETE);
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.LOGOUT_ERROR, error as Error);
      setUser(null);
    }
  },

  updateUser: async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.UPDATE_USER_ERROR, error as Error);
      throw error;
    }
  },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.USER_LOAD_ERROR, error as Error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const authOps = useMemo(() => createAuthOperations(setUser), []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values -- authOps is memoized
    <AuthContext.Provider value={{ user, isLoading, ...authOps }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(LOG_MESSAGES.CONTEXTS.AUTH.USE_OUTSIDE_PROVIDER);
  }
  return context;
};
