/**
 * MatchService Tests
 * Comprehensive tests for match management service
 */

import { matchService } from '../matchService';
import { secureStorage } from '../../utils/secureStorage';
import {
  mockMatches,
  mockMatchRounds,
  mockUsers,
  mockClubs,
  getMatchesByClub,
  getMatchesForUser,
  getUsersByClub,
} from '../mockData';
import { MatchStatus } from '../../types';

// Mock dependencies
jest.mock('../../utils/secureStorage');
jest.mock('../../utils/logger');
jest.mock('../mockData');
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

describe('MatchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMatches', () => {
    it('should return matches for a club', async () => {
      const mockMatchesData = [
        {
          id: '1',
          clubId: 'club1',
          participants: ['user1', 'user2'],
          status: MatchStatus.PENDING,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      (getMatchesByClub as jest.Mock).mockReturnValue(mockMatchesData);

      const result = await matchService.getMatches('club1');

      expect(result).toEqual(mockMatchesData);
      expect(getMatchesByClub).toHaveBeenCalledWith('club1');
    });
  });

  describe('getMyMatches', () => {
    it('should return user matches when logged in', async () => {
      const mockMatchesData = [
        {
          id: '1',
          clubId: 'club1',
          participants: ['user1', 'user2'],
          status: MatchStatus.PENDING,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      (secureStorage.getUserId as jest.Mock).mockResolvedValue('user1');
      (getMatchesForUser as jest.Mock).mockReturnValue(mockMatchesData);

      const result = await matchService.getMyMatches();

      expect(result).toEqual(mockMatchesData);
      expect(getMatchesForUser).toHaveBeenCalledWith('user1');
    });

    it('should return empty array when not logged in', async () => {
      (secureStorage.getUserId as jest.Mock).mockResolvedValue(null);

      const result = await matchService.getMyMatches();

      expect(result).toEqual([]);
    });
  });

  describe('getMatch', () => {
    it('should return match by ID', async () => {
      const mockMatch = {
        id: '1',
        clubId: 'club1',
        participants: ['user1', 'user2'],
        status: MatchStatus.PENDING,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (mockMatches.find as jest.Mock) = jest.fn().mockReturnValue(mockMatch);

      const result = await matchService.getMatch('1');

      expect(result).toEqual(mockMatch);
    });

    it('should throw error when match not found', async () => {
      (mockMatches.find as jest.Mock) = jest.fn().mockReturnValue(undefined);

      await expect(matchService.getMatch('999')).rejects.toThrow(
        'Match not found'
      );
    });
  });

  describe('updateMatchStatus', () => {
    it('should update match status successfully', async () => {
      const mockMatch = {
        id: '1',
        clubId: 'club1',
        participants: ['user1', 'user2'],
        status: MatchStatus.PENDING,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (mockMatches.findIndex as jest.Mock) = jest.fn().mockReturnValue(0);
      mockMatches[0] = mockMatch;

      const result = await matchService.updateMatchStatus(
        '1',
        MatchStatus.COMPLETED
      );

      expect(result.status).toBe(MatchStatus.COMPLETED);
    });

    it('should throw error when match not found', async () => {
      (mockMatches.findIndex as jest.Mock) = jest.fn().mockReturnValue(-1);

      await expect(
        matchService.updateMatchStatus('999', MatchStatus.COMPLETED)
      ).rejects.toThrow('Match not found');
    });
  });

  describe('scheduleMatch', () => {
    it('should schedule match successfully', async () => {
      const mockMatch = {
        id: '1',
        clubId: 'club1',
        participants: ['user1', 'user2'],
        status: MatchStatus.PENDING,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (mockMatches.findIndex as jest.Mock) = jest.fn().mockReturnValue(0);
      mockMatches[0] = mockMatch;

      const scheduledDate = '2024-02-01T10:00:00';
      const result = await matchService.scheduleMatch('1', scheduledDate);

      expect(result.scheduledDate).toBe(scheduledDate);
      expect(result.status).toBe(MatchStatus.SCHEDULED);
    });
  });

  describe('skipMatch', () => {
    it('should skip match successfully', async () => {
      const mockMatch = {
        id: '1',
        clubId: 'club1',
        participants: ['user1', 'user2'],
        status: MatchStatus.PENDING,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      (mockMatches.findIndex as jest.Mock) = jest.fn().mockReturnValue(0);
      mockMatches[0] = mockMatch;

      const result = await matchService.skipMatch('1');

      expect(result.status).toBe(MatchStatus.SKIPPED);
    });
  });

  describe('generateMatches', () => {
    it('should generate matches successfully', async () => {
      const mockClub = {
        id: 'club1',
        name: 'Test Club',
        description: 'Test',
        adminId: 'admin1',
        isActive: true,
        matchFrequency: 'weekly' as const,
        groupSize: 2,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      const mockMembers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User 1',
          role: 'user' as const,
          clubId: 'club1',
          isActive: true,
          isPaused: false,
          timezone: 'UTC',
          language: 'en',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: 'user2',
          email: 'user2@example.com',
          name: 'User 2',
          role: 'user' as const,
          clubId: 'club1',
          isActive: true,
          isPaused: false,
          timezone: 'UTC',
          language: 'en',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      (mockClubs.find as jest.Mock) = jest.fn().mockReturnValue(mockClub);
      (getUsersByClub as jest.Mock).mockReturnValue(mockMembers);

      const result = await matchService.generateMatches('club1');

      expect(result.clubId).toBe('club1');
      expect(result.matches).toBeDefined();
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('should throw error when club not found', async () => {
      (mockClubs.find as jest.Mock) = jest.fn().mockReturnValue(undefined);

      await expect(matchService.generateMatches('999')).rejects.toThrow(
        'Club not found'
      );
    });

    it('should throw error when not enough members', async () => {
      const mockClub = {
        id: 'club1',
        name: 'Test Club',
        description: 'Test',
        adminId: 'admin1',
        isActive: true,
        matchFrequency: 'weekly' as const,
        groupSize: 3,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      const mockMembers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User 1',
          role: 'user' as const,
          clubId: 'club1',
          isActive: true,
          isPaused: false,
          timezone: 'UTC',
          language: 'en',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      (mockClubs.find as jest.Mock) = jest.fn().mockReturnValue(mockClub);
      (getUsersByClub as jest.Mock).mockReturnValue(mockMembers);

      await expect(matchService.generateMatches('club1')).rejects.toThrow(
        'Not enough active members'
      );
    });
  });

  describe('getMatchRounds', () => {
    it('should return match rounds for a club', async () => {
      const mockRounds = [
        {
          id: '1',
          clubId: 'club1',
          matches: [],
          scheduledDate: '2024-01-01',
          status: 'active' as const,
          createdAt: '2024-01-01',
        },
      ];

      (getMatchesByClub as jest.Mock) = jest.fn().mockReturnValue(mockRounds);

      const result = await matchService.getMatchRounds('club1');

      expect(result).toEqual(mockRounds);
    });
  });
});

