/**
 * AuthService Tests
 * Comprehensive tests for authentication service
 */

import { authService } from '../authService';
import { secureStorage } from '../../../shared/utils/secureStorage';
import { mockUsers, getUserByEmail } from '../../persistence/mockData';

// Mock dependencies
jest.mock('../../utils/secureStorage');
jest.mock('../../utils/logger');
jest.mock('../mockData');
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        clubId: 'club1',
        isActive: true,
        isPaused: false,
        timezone: 'UTC',
        language: 'en',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (getUserByEmail as jest.Mock).mockReturnValue(mockUser);
      (secureStorage.saveTokens as jest.Mock).mockResolvedValue(undefined);
      (secureStorage.saveUserId as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.login('test@example.com', 'password123');

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
      expect(secureStorage.saveTokens).toHaveBeenCalled();
      expect(secureStorage.saveUserId).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw error with invalid credentials', async () => {
      (getUserByEmail as jest.Mock).mockReturnValue(null);

      await expect(authService.login('wrong@example.com', 'password123')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error when storage fails', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        clubId: 'club1',
        isActive: true,
        isPaused: false,
        timezone: 'UTC',
        language: 'en',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (getUserByEmail as jest.Mock).mockReturnValue(mockUser);
      (secureStorage.saveTokens as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      (getUserByEmail as jest.Mock).mockReturnValue(null);
      (secureStorage.saveTokens as jest.Mock).mockResolvedValue(undefined);
      (secureStorage.saveUserId as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.register(
        'new@example.com',
        'SecurePass123!',
        'New User',
        '+1234567890',
        'club1'
      );

      expect(result.user.email).toBe('new@example.com');
      expect(result.user.name).toBe('New User');
      expect(result.token).toBeDefined();
    });

    it('should throw error when user already exists', async () => {
      const existingUser = {
        id: '1',
        email: 'existing@example.com',
        name: 'Existing User',
        role: 'user' as const,
        clubId: 'club1',
        isActive: true,
        isPaused: false,
        timezone: 'UTC',
        language: 'en',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (getUserByEmail as jest.Mock).mockReturnValue(existingUser);

      await expect(
        authService.register(
          'existing@example.com',
          'password123',
          'New User',
          '+1234567890',
          'club1'
        )
      ).rejects.toThrow('User already exists');
    });
  });

  describe('logout', () => {
    it('should clear auth data successfully', async () => {
      (secureStorage.clearAuth as jest.Mock).mockResolvedValue(undefined);

      await authService.logout();

      expect(secureStorage.clearAuth).toHaveBeenCalled();
    });

    it('should not throw even if storage clear fails', async () => {
      (secureStorage.clearAuth as jest.Mock).mockRejectedValue(new Error('Storage error'));

      // Should not throw
      await expect(authService.logout()).resolves.not.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when logged in', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        clubId: 'club1',
        isActive: true,
        isPaused: false,
        timezone: 'UTC',
        language: 'en',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (secureStorage.getUserId as jest.Mock).mockResolvedValue('1');
      (secureStorage.getAccessToken as jest.Mock).mockResolvedValue('token');
      (mockUsers.find as jest.Mock) = jest.fn().mockReturnValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it('should return null when no user ID', async () => {
      (secureStorage.getUserId as jest.Mock).mockResolvedValue(null);
      (secureStorage.getAccessToken as jest.Mock).mockResolvedValue('token');

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null when no token', async () => {
      (secureStorage.getUserId as jest.Mock).mockResolvedValue('1');
      (secureStorage.getAccessToken as jest.Mock).mockResolvedValue(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
        clubId: 'club1',
        isActive: true,
        isPaused: false,
        timezone: 'UTC',
        language: 'en',
        whatsappNumber: '+1234567890',
        approvalStatus: 'approved' as const,
        classes: ['Friend'] as const,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (secureStorage.getUserId as jest.Mock).mockResolvedValue('1');
      (mockUsers.findIndex as jest.Mock) = jest.fn().mockReturnValue(0);
      mockUsers[0] = mockUser;

      const result = await authService.updateUser({ name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
    });

    it('should throw error when user not found', async () => {
      (secureStorage.getUserId as jest.Mock).mockResolvedValue(null);

      await expect(authService.updateUser({ name: 'Updated Name' })).rejects.toThrow(
        'User not found'
      );
    });
  });
});
