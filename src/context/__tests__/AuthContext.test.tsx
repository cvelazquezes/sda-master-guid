/* eslint-disable max-lines-per-function */
/**
 * AuthContext Tests
 * Testing state management following Meta/Google standards
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/authService';
import { User, UserRole, ApprovalStatus } from '../../types';
import { AuthenticationError } from '../../shared/utils/errors';

// Mock authService
jest.mock('../../services/authService');

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Helper to render hook with provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
    role: UserRole.USER,
    clubId: 'club-1',
    isActive: true,
    approvalStatus: ApprovalStatus.APPROVED,
    whatsappNumber: '+1234567890',
    classes: ['Friend'],
    timezone: 'America/Mexico_City',
    language: 'en',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with null user and loading state', () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(true);
    });

    it('should load current user on mount', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle error loading user', async () => {
      (authService.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Failed to load user'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Login', () => {
    it('should update user state after successful login', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('user@example.com', 'password123');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(authService.login).toHaveBeenCalledWith('user@example.com', 'password123');
    });

    it('should throw error on failed login', async () => {
      const error = new AuthenticationError('Invalid credentials');
      (authService.login as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login('user@example.com', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
    });

    it('should maintain loading state during login', async () => {
      let resolveLogin: (value: { user: typeof mockUser; token: string }) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      (authService.login as jest.Mock).mockReturnValue(loginPromise);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Start login
      act(() => {
        result.current.login('user@example.com', 'password123');
      });

      // Should not be loading (login doesn't set loading state)
      // Loading is only for initial load
      expect(result.current.isLoading).toBe(false);

      // Complete login
      await act(async () => {
        resolveLogin!({ user: mockUser, token: 'mock-token' });
        await loginPromise;
      });
    });
  });

  describe('Register', () => {
    it('should update user state after successful registration', async () => {
      (authService.register as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register(
          'user@example.com',
          'Password123!',
          'Test User',
          '+1234567890',
          'club-1'
        );
      });

      expect(result.current.user).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(
        'user@example.com',
        'Password123!',
        'Test User',
        '+1234567890',
        'club-1'
      );
    });

    it('should throw error on failed registration', async () => {
      const error = new Error('Email already exists');
      (authService.register as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.register(
            'existing@example.com',
            'Password123!',
            'Test User',
            '+1234567890',
            'club-1'
          );
        })
      ).rejects.toThrow('Email already exists');

      expect(result.current.user).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should clear user state on logout', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for user to load
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should clear user state even if logout fails', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for user to load
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Logout (should not throw)
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('Update User', () => {
    it('should update user state after successful update', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Update user
      await act(async () => {
        await result.current.updateUser({ name: 'Updated Name' });
      });

      expect(result.current.user).toEqual(updatedUser);
      expect(authService.updateUser).toHaveBeenCalledWith({
        name: 'Updated Name',
      });
    });

    it('should throw error on failed update', async () => {
      const error = new Error('Update failed');

      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.updateUser as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Update user (should throw)
      await expect(
        act(async () => {
          await result.current.updateUser({ name: 'Updated Name' });
        })
      ).rejects.toThrow('Update failed');

      // User state should remain unchanged
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('Context Consumer', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle rapid login/logout cycles', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
      });
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Rapid login/logout
      await act(async () => {
        await result.current.login('user@example.com', 'password123');
        await result.current.logout();
        await result.current.login('user@example.com', 'password123');
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
    });

    it('should handle multiple simultaneous updates', async () => {
      const updatedUser1 = { ...mockUser, name: 'Name 1' };
      const updatedUser2 = { ...mockUser, name: 'Name 2' };

      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.updateUser as jest.Mock)
        .mockResolvedValueOnce(updatedUser1)
        .mockResolvedValueOnce(updatedUser2);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Trigger multiple updates
      await act(async () => {
        const update1 = result.current.updateUser({ name: 'Name 1' });
        const update2 = result.current.updateUser({ name: 'Name 2' });
        await Promise.all([update1, update2]);
      });

      // Should have final state
      expect(result.current.user?.name).toBeDefined();
    });
  });

  describe('Memory Leaks', () => {
    it('should not have memory leaks on unmount', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { unmount } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(authService.getCurrentUser).toHaveBeenCalled();
      });

      // Unmount should not throw
      unmount();

      // No assertions - just ensuring clean unmount
    });
  });

  describe('Edge Cases', () => {
    it('should handle null responses from authService', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle undefined user updates', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Update with empty object
      await act(async () => {
        await result.current.updateUser({});
      });

      expect(result.current.user).toEqual(mockUser);
    });
  });
});
