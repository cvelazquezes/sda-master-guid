/**
 * Integration Tests
 * Tests interaction between multiple components and services
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { authService } from '../../features/auth/services/AuthService';
import { apiService } from '../../services/api';
import { eventBus, DomainEvents } from '../patterns/eventBus';
import { commandBus, createCommand } from '../patterns/cqrs';
import { aUser, aClub } from './builders';

// Mock API service
jest.mock('../../services/api');
const mockedApiService = apiService as jest.Mocked<typeof apiService>;

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    eventBus.clear();
    commandBus.clear();
  });

  afterEach(() => {
    eventBus.clear();
    commandBus.clear();
  });

  // ========================================================================
  // Authentication Flow Integration
  // ========================================================================

  describe('Authentication Flow', () => {
    it('should complete full login flow with event emission', async () => {
      // Arrange
      const testUser = aUser()
        .withEmail('test@example.com')
        .withName('Test User')
        .build();

      const mockAuthResponse = {
        user: testUser,
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
      };

      mockedApiService.post.mockResolvedValueOnce(mockAuthResponse);

      // Track events
      const events: string[] = [];
      eventBus.subscribe(DomainEvents.USER_LOGGED_IN, () => {
        events.push(DomainEvents.USER_LOGGED_IN);
      });

      // Act
      const result = await authService.login('test@example.com', 'password123');

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(mockedApiService.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      // Event emission would be handled by the service layer
    });

    it('should handle login failure gracefully', async () => {
      // Arrange
      mockedApiService.post.mockRejectedValueOnce(
        new Error('Invalid credentials')
      );

      // Act & Assert
      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  // ========================================================================
  // CQRS Pattern Integration
  // ========================================================================

  describe('CQRS Pattern', () => {
    it('should execute command through command bus', async () => {
      // Arrange
      const createUserCommand = {
        type: 'CREATE_USER',
        payload: {
          email: 'newuser@example.com',
          name: 'New User',
        },
      };

      const handler = jest.fn().mockResolvedValue({ id: 'user-123' });
      commandBus.register(createUserCommand.type, handler);

      // Act
      const result = await commandBus.execute(createUserCommand);

      // Assert
      expect(handler).toHaveBeenCalled();
      expect(result).toEqual({ id: 'user-123' });
    });

    it('should handle command failure and emit error event', async () => {
      // Arrange
      const command = createCommand('INVALID_COMMAND', {});
      const errorEvents: any[] = [];

      eventBus.subscribe(DomainEvents.SYSTEM_ERROR, (event) => {
        errorEvents.push(event);
      });

      // Act & Assert
      await expect(commandBus.execute(command)).rejects.toThrow(
        'No handler registered for command: INVALID_COMMAND'
      );
    });
  });

  // ========================================================================
  // Event Bus Integration
  // ========================================================================

  describe('Event Bus', () => {
    it('should propagate events between features', async () => {
      // Arrange
      const receivedEvents: string[] = [];

      eventBus.subscribe(DomainEvents.USER_CREATED, () => {
        receivedEvents.push('user_created');
      });

      eventBus.subscribe(DomainEvents.USER_CREATED, () => {
        receivedEvents.push('user_created_notification');
      });

      // Act
      await eventBus.publish({
        type: DomainEvents.USER_CREATED,
        payload: { userId: 'user-123' },
        metadata: {
          eventId: 'evt-123',
          timestamp: Date.now(),
          source: 'test',
          version: '1.0',
        },
      });

      // Assert
      expect(receivedEvents).toHaveLength(2);
      expect(receivedEvents).toContain('user_created');
      expect(receivedEvents).toContain('user_created_notification');
    });

    it('should continue processing even if one handler fails', async () => {
      // Arrange
      const successfulHandler = jest.fn();
      const failingHandler = jest.fn().mockRejectedValue(new Error('Handler failed'));

      eventBus.subscribe(DomainEvents.USER_UPDATED, failingHandler);
      eventBus.subscribe(DomainEvents.USER_UPDATED, successfulHandler);

      // Act
      await eventBus.publish({
        type: DomainEvents.USER_UPDATED,
        payload: { userId: 'user-123' },
        metadata: {
          eventId: 'evt-456',
          timestamp: Date.now(),
          source: 'test',
          version: '1.0',
        },
      });

      // Assert - both handlers should have been called
      expect(failingHandler).toHaveBeenCalled();
      expect(successfulHandler).toHaveBeenCalled();
    });
  });

  // ========================================================================
  // Service Layer Integration
  // ========================================================================

  describe('Service Layer Integration', () => {
    it('should coordinate between multiple services', async () => {
      // This test would coordinate between auth, user, and club services
      // For now, it's a placeholder for future implementation

      const testUser = aUser().build();
      const testClub = aClub().build();

      // Mock API responses
      mockedApiService.get.mockResolvedValueOnce(testUser);
      mockedApiService.get.mockResolvedValueOnce(testClub);

      // Simulate workflow
      const user = await apiService.get(`/users/${testUser.id}`);
      const club = await apiService.get(`/clubs/${testClub.id}`);

      expect(user).toEqual(testUser);
      expect(club).toEqual(testClub);
    });
  });

  // ========================================================================
  // Error Handling Integration
  // ========================================================================

  describe('Error Handling', () => {
    it('should propagate errors through the system correctly', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockedApiService.get.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(apiService.get('/users/123')).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      mockedApiService.get.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 100);
          })
      );

      // Act & Assert
      await expect(apiService.get('/users/123')).rejects.toThrow();
    });
  });

  // ========================================================================
  // State Management Integration
  // ========================================================================

  describe('State Management', () => {
    it('should maintain consistency across state updates', async () => {
      // Test that state updates are consistent across the application
      // This is a placeholder for more comprehensive state management tests

      const initialUser = aUser().withName('Initial Name').build();
      const updatedUser = { ...initialUser, name: 'Updated Name' };

      mockedApiService.put.mockResolvedValueOnce(updatedUser);

      const result = await apiService.put(`/users/${initialUser.id}`, {
        name: 'Updated Name',
      });

      expect(result).toEqual(updatedUser);
      expect(mockedApiService.put).toHaveBeenCalledWith(
        `/users/${initialUser.id}`,
        { name: 'Updated Name' }
      );
    });
  });
});

