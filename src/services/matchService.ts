/**
 * Match Service
 * Handles match generation and management with mock/backend toggle
 */

import { apiService } from './api';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';
import { secureStorage } from '../utils/secureStorage';
import { Match, MatchRound, MatchStatus } from '../types';
import {
  mockMatches,
  mockMatchRounds,
  mockClubs,
  getMatchesForUser,
  getMatchesByClub,
  getMatchRoundsByClub,
  getUsersByClub,
} from './mockData';
import { NotFoundError, ValidationError } from '../utils/errors';

// Constants
const MOCK_API_DELAY_MS = 300;
const MOCK_GENERATE_DELAY_MS = 1000;

class MatchService {
  private useMockData = environment.useMockData;

  /**
   * Get matches for a club
   */
  async getMatches(clubId: string): Promise<Match[]> {
    logger.debug('Fetching matches', { clubId });

    if (this.useMockData) {
      return this.mockGetMatches(clubId);
    }

    try {
      const matches = await apiService.get<Match[]>(`/matches?clubId=${clubId}`);
      logger.debug('Matches fetched', { clubId, count: matches.length });
      return matches;
    } catch (error) {
      logger.error('Failed to fetch matches', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get matches implementation
   */
  private async mockGetMatches(clubId: string): Promise<Match[]> {
    const matches = getMatchesByClub(clubId);
    logger.debug('Mock: Matches fetched', { clubId, count: matches.length });
    return matches;
  }

  /**
   * Get current user's matches
   */
  async getMyMatches(): Promise<Match[]> {
    logger.debug('Fetching my matches');

    if (this.useMockData) {
      return this.mockGetMyMatches();
    }

    try {
      const matches = await apiService.get<Match[]>('/matches/me');
      logger.debug('My matches fetched', { count: matches.length });
      return matches;
    } catch (error) {
      logger.error('Failed to fetch my matches', error as Error);
      throw error;
    }
  }

  /**
   * Mock get my matches implementation
   */
  private async mockGetMyMatches(): Promise<Match[]> {
    const userId = await secureStorage.getUserId();
    if (!userId) {
      logger.warn('Mock: No user ID found');
      return [];
    }

    const matches = getMatchesForUser(userId);
    logger.debug('Mock: My matches fetched', { userId, count: matches.length });
    return matches;
  }

  /**
   * Get single match by ID
   */
  async getMatch(matchId: string): Promise<Match> {
    logger.debug('Fetching match', { matchId });

    if (this.useMockData) {
      return this.mockGetMatch(matchId);
    }

    try {
      const match = await apiService.get<Match>(`/matches/${matchId}`);
      logger.debug('Match fetched', { matchId });
      return match;
    } catch (error) {
      logger.error('Failed to fetch match', error as Error, { matchId });
      throw error;
    }
  }

  /**
   * Mock get match implementation
   */
  private async mockGetMatch(matchId: string): Promise<Match> {
    await this.sleep(MOCK_API_DELAY_MS);

    const match = mockMatches.find((m) => m.id === matchId);
    if (!match) {
      logger.warn('Mock: Match not found', { matchId });
      throw new NotFoundError('Match not found');
    }

    logger.debug('Mock: Match fetched', { matchId });
    return match;
  }

  /**
   * Update match status
   */
  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<Match> {
    logger.info('Updating match status', { matchId, status });

    if (this.useMockData) {
      return this.mockUpdateMatchStatus(matchId, status);
    }

    try {
      const updatedMatch = await apiService.patch<Match>(`/matches/${matchId}/status`, {
        status,
      });
      logger.info('Match status updated', { matchId, status });
      return updatedMatch;
    } catch (error) {
      logger.error('Failed to update match status', error as Error, { matchId, status });
      throw error;
    }
  }

  /**
   * Mock update match status implementation
   */
  private async mockUpdateMatchStatus(matchId: string, status: MatchStatus): Promise<Match> {
    await this.sleep(MOCK_API_DELAY_MS);

    const matchIndex = mockMatches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) {
      logger.warn('Mock: Match not found for status update', { matchId });
      throw new NotFoundError('Match not found');
    }

    mockMatches[matchIndex] = {
      ...mockMatches[matchIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    logger.info('Mock: Match status updated', { matchId, status });
    return mockMatches[matchIndex];
  }

  /**
   * Schedule a match
   */
  async scheduleMatch(matchId: string, scheduledDate: string): Promise<Match> {
    logger.info('Scheduling match', { matchId, scheduledDate });

    if (this.useMockData) {
      return this.mockScheduleMatch(matchId, scheduledDate);
    }

    try {
      const updatedMatch = await apiService.patch<Match>(`/matches/${matchId}`, {
        scheduledDate,
      });
      logger.info('Match scheduled', { matchId, scheduledDate });
      return updatedMatch;
    } catch (error) {
      logger.error('Failed to schedule match', error as Error, { matchId });
      throw error;
    }
  }

  /**
   * Mock schedule match implementation
   */
  private async mockScheduleMatch(matchId: string, scheduledDate: string): Promise<Match> {
    await this.sleep(MOCK_API_DELAY_MS);

    const matchIndex = mockMatches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) {
      logger.warn('Mock: Match not found for scheduling', { matchId });
      throw new NotFoundError('Match not found');
    }

    mockMatches[matchIndex] = {
      ...mockMatches[matchIndex],
      scheduledDate,
      status: MatchStatus.SCHEDULED,
      updatedAt: new Date().toISOString(),
    };

    logger.info('Mock: Match scheduled', { matchId, scheduledDate });
    return mockMatches[matchIndex];
  }

  /**
   * Skip a match
   */
  async skipMatch(matchId: string): Promise<Match> {
    logger.info('Skipping match', { matchId });
    return this.updateMatchStatus(matchId, MatchStatus.SKIPPED);
  }

  /**
   * Generate matches for a club
   */
  async generateMatches(clubId: string): Promise<MatchRound> {
    logger.info('Generating matches', { clubId });

    if (this.useMockData) {
      return this.mockGenerateMatches(clubId);
    }

    try {
      const matchRound = await apiService.post<MatchRound>('/matches/generate', { clubId });
      logger.info('Matches generated', { clubId, matchCount: matchRound.matches.length });
      return matchRound;
    } catch (error) {
      logger.error('Failed to generate matches', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock generate matches implementation
   */
  private async mockGenerateMatches(clubId: string): Promise<MatchRound> {
    await this.sleep(MOCK_GENERATE_DELAY_MS);

    const club = mockClubs.find((c) => c.id === clubId);
    if (!club) {
      logger.warn('Mock: Club not found for match generation', { clubId });
      throw new NotFoundError('Club not found');
    }

    const members = getUsersByClub(clubId).filter(
      (u) => u.isActive && u.approvalStatus === 'approved'
    );

    if (members.length < club.groupSize) {
      logger.warn('Mock: Not enough members for match generation', {
        clubId,
        memberCount: members.length,
        required: club.groupSize,
      });
      throw new ValidationError(
        `Not enough active members. Need at least ${club.groupSize}, but only have ${members.length}`
      );
    }

    // Simple matching algorithm: pair/group members
    const newMatches: Match[] = [];
    const shuffled = [...members].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i += club.groupSize) {
      const group = shuffled.slice(i, i + club.groupSize);
      if (group.length === club.groupSize) {
        newMatches.push({
          id: String(mockMatches.length + newMatches.length + 1),
          clubId,
          participants: group.map((m) => m.id),
          status: MatchStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    mockMatches.push(...newMatches);

    const newRound: MatchRound = {
      id: String(mockMatchRounds.length + 1),
      clubId,
      matches: newMatches,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    mockMatchRounds.push(newRound);
    logger.info('Mock: Matches generated', { clubId, matchCount: newMatches.length });
    return newRound;
  }

  /**
   * Get match rounds for a club
   */
  async getMatchRounds(clubId: string): Promise<MatchRound[]> {
    logger.debug('Fetching match rounds', { clubId });

    if (this.useMockData) {
      return this.mockGetMatchRounds(clubId);
    }

    try {
      const rounds = await apiService.get<MatchRound[]>(`/matches/rounds?clubId=${clubId}`);
      logger.debug('Match rounds fetched', { clubId, count: rounds.length });
      return rounds;
    } catch (error) {
      logger.error('Failed to fetch match rounds', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get match rounds implementation
   */
  private async mockGetMatchRounds(clubId: string): Promise<MatchRound[]> {
    const rounds = getMatchRoundsByClub(clubId);
    logger.debug('Mock: Match rounds fetched', { clubId, count: rounds.length });
    return rounds;
  }

  /**
   * Get all matches for a club
   */
  async getClubMatches(clubId: string): Promise<Match[]> {
    logger.debug('Fetching club matches', { clubId });

    if (this.useMockData) {
      return this.mockGetClubMatches(clubId);
    }

    try {
      const matches = await apiService.get<Match[]>(`/matches/club/${clubId}`);
      logger.debug('Club matches fetched', { clubId, count: matches.length });
      return matches;
    } catch (error) {
      logger.error('Failed to fetch club matches', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get club matches implementation
   */
  private async mockGetClubMatches(clubId: string): Promise<Match[]> {
    const matches = getMatchesByClub(clubId);
    logger.debug('Mock: Club matches fetched', { clubId, count: matches.length });
    return matches;
  }

  /**
   * Sleep helper for mock delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const matchService = new MatchService();
