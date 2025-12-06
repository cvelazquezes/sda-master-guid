import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { User, AuthContextType } from '../types';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth operations type for the factory function
interface AuthOperations {
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
}

// Extracted auth operations to reduce component complexity
const createAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): AuthOperations => ({
  login: async (email: string, password: string): Promise<void> => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
    } catch (error) {
      logger.error('Login error', error as Error, { email });
      throw error;
    }
  },

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
      logger.error('Registration error', error as Error, { email });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      logger.info('Starting logout process');
      await authService.logout();
      logger.info('Storage cleared');
      setUser(null);
      logger.info('User state cleared - logout complete');
    } catch (error) {
      logger.error('Logout error', error as Error);
      setUser(null);
    }
  },

  updateUser: async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
    } catch (error) {
      logger.error('Update user error', error as Error);
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
      logger.error('Error loading user', error as Error);
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
    <AuthContext.Provider value={{ user, isLoading, ...authOps }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
