/**
 * Match Service
 * Handles match generation and management with mock/backend toggle
 */

import { apiService } from './api';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';
import { secureStorage } from '../utils/secureStorage';
import { Match, MatchRound, MatchStatus, ApprovalStatus } from '../types';
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
import { LOG_MESSAGES } from '../shared/constants/logMessages';
import { MOCK_DELAY } from '../shared/constants/timing';
import { MS, OPACITY_VALUE } from '../shared/constants/numbers';
import { MATCH_ROUND_STATUS } from '../shared/constants/ui';
import i18n from '../i18n';

class MatchService {
  private useMockData = environment.mock.useMockApi;

  /**
   * Get matches for a club
   */
  async getMatches(clubId: string): Promise<Match[]> {
    logger.debug(LOG_MESSAGES.MATCH.FETCHING, { clubId });

    if (this.useMockData) {
      return this.mockGetMatches(clubId);
    }

    try {
      const matches = await apiService.get<Match[]>(`/matches?clubId=${clubId}`);
      logger.debug(LOG_MESSAGES.MATCH.FETCHED, { clubId, count: matches.length });
      return matches;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.FETCH_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get matches implementation
   */
  private async mockGetMatches(clubId: string): Promise<Match[]> {
    const matches = getMatchesByClub(clubId);
    logger.debug(LOG_MESSAGES.MATCH.MOCK_FETCHED, { clubId, count: matches.length });
    return matches;
  }

  /**
   * Get current user's matches
   */
  async getMyMatches(): Promise<Match[]> {
    logger.debug(LOG_MESSAGES.MATCH.FETCHING_MY);

    if (this.useMockData) {
      return this.mockGetMyMatches();
    }

    try {
      const matches = await apiService.get<Match[]>('/matches/me');
      logger.debug(LOG_MESSAGES.MATCH.FETCHED_MY, { count: matches.length });
      return matches;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.FETCH_MY_FAILED, error as Error);
      throw error;
    }
  }

  /**
   * Mock get my matches implementation
   */
  private async mockGetMyMatches(): Promise<Match[]> {
    const userId = await secureStorage.getUserId();
    if (!userId) {
      logger.warn(LOG_MESSAGES.MATCH.MOCK_NO_USER);
      return [];
    }

    const matches = getMatchesForUser(userId);
    logger.debug(LOG_MESSAGES.MATCH.MOCK_FETCHED_MY, { userId, count: matches.length });
    return matches;
  }

  /**
   * Get single match by ID
   */
  async getMatch(matchId: string): Promise<Match> {
    logger.debug(LOG_MESSAGES.MATCH.FETCHING_ONE, { matchId });

    if (this.useMockData) {
      return this.mockGetMatch(matchId);
    }

    try {
      const match = await apiService.get<Match>(`/matches/${matchId}`);
      logger.debug(LOG_MESSAGES.MATCH.FETCHED_ONE, { matchId });
      return match;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.FETCH_ONE_FAILED, error as Error, { matchId });
      throw error;
    }
  }

  /**
   * Mock get match implementation
   */
  private async mockGetMatch(matchId: string): Promise<Match> {
    await this.sleep(MOCK_DELAY.FAST);

    const match = mockMatches.find((m) => m.id === matchId);
    if (!match) {
      logger.warn(LOG_MESSAGES.MATCH.MOCK_NOT_FOUND, { matchId });
      throw new NotFoundError(LOG_MESSAGES.MATCH.NOT_FOUND);
    }

    logger.debug(LOG_MESSAGES.MATCH.MOCK_FETCHED_ONE, { matchId });
    return match;
  }

  /**
   * Update match status
   */
  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<Match> {
    logger.info(LOG_MESSAGES.MATCH.UPDATING_STATUS, { matchId, status });

    if (this.useMockData) {
      return this.mockUpdateMatchStatus(matchId, status);
    }

    try {
      const updatedMatch = await apiService.patch<Match>(`/matches/${matchId}/status`, {
        status,
      });
      logger.info(LOG_MESSAGES.MATCH.STATUS_UPDATED, { matchId, status });
      return updatedMatch;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.STATUS_UPDATE_FAILED, error as Error, { matchId, status });
      throw error;
    }
  }

  /**
   * Mock update match status implementation
   */
  private async mockUpdateMatchStatus(matchId: string, status: MatchStatus): Promise<Match> {
    await this.sleep(MOCK_DELAY.FAST);

    const matchIndex = mockMatches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) {
      logger.warn(LOG_MESSAGES.MATCH.MOCK_NOT_FOUND_STATUS, { matchId });
      throw new NotFoundError(LOG_MESSAGES.MATCH.NOT_FOUND);
    }

    mockMatches[matchIndex] = {
      ...mockMatches[matchIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    logger.info(LOG_MESSAGES.MATCH.MOCK_STATUS_UPDATED, { matchId, status });
    return mockMatches[matchIndex];
  }

  /**
   * Schedule a match
   */
  async scheduleMatch(matchId: string, scheduledDate: string): Promise<Match> {
    logger.info(LOG_MESSAGES.MATCH.SCHEDULING, { matchId, scheduledDate });

    if (this.useMockData) {
      return this.mockScheduleMatch(matchId, scheduledDate);
    }

    try {
      const updatedMatch = await apiService.patch<Match>(`/matches/${matchId}`, {
        scheduledDate,
      });
      logger.info(LOG_MESSAGES.MATCH.SCHEDULED, { matchId, scheduledDate });
      return updatedMatch;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.SCHEDULE_FAILED, error as Error, { matchId });
      throw error;
    }
  }

  /**
   * Mock schedule match implementation
   */
  private async mockScheduleMatch(matchId: string, scheduledDate: string): Promise<Match> {
    await this.sleep(MOCK_DELAY.FAST);

    const matchIndex = mockMatches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) {
      logger.warn(LOG_MESSAGES.MATCH.MOCK_NOT_FOUND_SCHEDULE, { matchId });
      throw new NotFoundError(LOG_MESSAGES.MATCH.NOT_FOUND);
    }

    mockMatches[matchIndex] = {
      ...mockMatches[matchIndex],
      scheduledDate,
      status: MatchStatus.SCHEDULED,
      updatedAt: new Date().toISOString(),
    };

    logger.info(LOG_MESSAGES.MATCH.MOCK_SCHEDULED, { matchId, scheduledDate });
    return mockMatches[matchIndex];
  }

  /**
   * Skip a match
   */
  async skipMatch(matchId: string): Promise<Match> {
    logger.info(LOG_MESSAGES.MATCH.SKIPPING, { matchId });
    return this.updateMatchStatus(matchId, MatchStatus.SKIPPED);
  }

  /**
   * Generate matches for a club
   */
  async generateMatches(clubId: string): Promise<MatchRound> {
    logger.info(LOG_MESSAGES.MATCH.GENERATING, { clubId });

    if (this.useMockData) {
      return this.mockGenerateMatches(clubId);
    }

    try {
      const matchRound = await apiService.post<MatchRound>('/matches/generate', { clubId });
      logger.info(LOG_MESSAGES.MATCH.GENERATED, { clubId, matchCount: matchRound.matches.length });
      return matchRound;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.GENERATE_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock generate matches implementation
   */
  private async mockGenerateMatches(clubId: string): Promise<MatchRound> {
    await this.sleep(MOCK_DELAY.SLOW);

    const club = mockClubs.find((c) => c.id === clubId);
    if (!club) {
      logger.warn(LOG_MESSAGES.MATCH.MOCK_NOT_FOUND_GENERATE, { clubId });
      throw new NotFoundError(LOG_MESSAGES.CLUB.NOT_FOUND);
    }

    const members = getUsersByClub(clubId).filter(
      (u) => u.isActive && u.approvalStatus === ApprovalStatus.APPROVED
    );

    if (members.length < club.groupSize) {
      logger.warn(LOG_MESSAGES.MATCH.MOCK_NOT_ENOUGH_MEMBERS, {
        clubId,
        memberCount: members.length,
        required: club.groupSize,
      });
      throw new ValidationError(
        i18n.t('services.validation.notEnoughMembers', {
          required: club.groupSize,
          count: members.length,
        })
      );
    }

    // Simple matching algorithm: pair/group members
    const newMatches: Match[] = [];
    const shuffled = [...members].sort(() => Math.random() - OPACITY_VALUE.MEDIUM);

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
      scheduledDate: new Date(Date.now() + MS.WEEK).toISOString(),
      status: MATCH_ROUND_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
    };

    mockMatchRounds.push(newRound);
    logger.info(LOG_MESSAGES.MATCH.MOCK_GENERATED, { clubId, matchCount: newMatches.length });
    return newRound;
  }

  /**
   * Get match rounds for a club
   */
  async getMatchRounds(clubId: string): Promise<MatchRound[]> {
    logger.debug(LOG_MESSAGES.MATCH.FETCHING_ROUNDS, { clubId });

    if (this.useMockData) {
      return this.mockGetMatchRounds(clubId);
    }

    try {
      const rounds = await apiService.get<MatchRound[]>(`/matches/rounds?clubId=${clubId}`);
      logger.debug(LOG_MESSAGES.MATCH.FETCHED_ROUNDS, { clubId, count: rounds.length });
      return rounds;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.FETCH_ROUNDS_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get match rounds implementation
   */
  private async mockGetMatchRounds(clubId: string): Promise<MatchRound[]> {
    const rounds = getMatchRoundsByClub(clubId);
    logger.debug(LOG_MESSAGES.MATCH.MOCK_FETCHED_ROUNDS, { clubId, count: rounds.length });
    return rounds;
  }

  /**
   * Get all matches for a club
   */
  async getClubMatches(clubId: string): Promise<Match[]> {
    logger.debug(LOG_MESSAGES.MATCH.FETCHING_CLUB_MATCHES, { clubId });

    if (this.useMockData) {
      return this.mockGetClubMatches(clubId);
    }

    try {
      const matches = await apiService.get<Match[]>(`/matches/club/${clubId}`);
      logger.debug(LOG_MESSAGES.MATCH.FETCHED_CLUB_MATCHES, { clubId, count: matches.length });
      return matches;
    } catch (error) {
      logger.error(LOG_MESSAGES.MATCH.FETCH_CLUB_MATCHES_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get club matches implementation
   */
  private async mockGetClubMatches(clubId: string): Promise<Match[]> {
    const matches = getMatchesByClub(clubId);
    logger.debug(LOG_MESSAGES.MATCH.MOCK_FETCHED_CLUB, { clubId, count: matches.length });
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
