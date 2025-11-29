import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      logger.error('Error loading user', error as Error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
    } catch (error) {
      logger.error('Login error', error as Error, { email });
      throw error; // Re-throw so LoginScreen can handle it
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    whatsappNumber: string,
    clubId: string,
    classes?: string[]
  ): Promise<void> => {
    try {
      const { user: registeredUser } = await authService.register(
        email,
        password,
        name,
        whatsappNumber,
        clubId,
        classes
      );
      setUser(registeredUser);
    } catch (error) {
      logger.error('Registration error', error as Error, { email });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      logger.info('Starting logout process');
      // Clear storage first
      await authService.logout();
      logger.info('Storage cleared');
      // Then clear user state to trigger navigation reset
      setUser(null);
      logger.info('User state cleared - logout complete');
    } catch (error) {
      logger.error('Logout error', error as Error);
      // Ensure user state is cleared even if storage clear fails
      setUser(null);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
    } catch (error) {
      logger.error('Update user error', error as Error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
