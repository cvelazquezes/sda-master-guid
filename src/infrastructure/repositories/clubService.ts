/**
 * Club Service
 * Handles club management with mock/backend toggle
 */

import { apiService } from '../http/api';
import { environment } from '../config/environment';
import { logger } from '../../shared/utils/logger';
import { Club, MatchFrequency, User, ApprovalStatus } from '../../types';
import { mockClubs, getUsersByClub } from '../persistence/mockData';
import { NotFoundError } from '../../shared/utils/errors';
import { LOG_MESSAGES, API_ENDPOINTS } from '../../shared/constants';
import { MOCK_DELAY } from '../../shared/constants/timing';

interface CreateClubData {
  name: string;
  description: string;
  matchFrequency: MatchFrequency;
  groupSize: number;
  church: string;
  association: string;
  union: string;
  division: string;
}

class ClubService {
  private useMockData = environment.mock.useMockApi;

  /**
   * Get all clubs
   */
  async getAllClubs(): Promise<Club[]> {
    logger.debug(LOG_MESSAGES.CLUB.FETCHING_ALL);

    if (this.useMockData) {
      return this.mockGetAllClubs();
    }

    try {
      const clubs = await apiService.get<Club[]>(API_ENDPOINTS.CLUBS.BASE);
      logger.debug(LOG_MESSAGES.CLUB.FETCHED_ALL, { count: clubs.length });
      return clubs;
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.FETCH_FAILED, error as Error);
      throw error;
    }
  }

  /**
   * Mock get all clubs implementation
   */
  private async mockGetAllClubs(): Promise<Club[]> {
    logger.debug(LOG_MESSAGES.CLUB.MOCK_GETTING_ALL, { count: mockClubs.length });
    return [...mockClubs];
  }

  /**
   * Get club by ID
   */
  async getClub(clubId: string): Promise<Club> {
    logger.debug(LOG_MESSAGES.CLUB.FETCHING_ONE, { clubId });

    if (this.useMockData) {
      return this.mockGetClub(clubId);
    }

    try {
      const club = await apiService.get<Club>(API_ENDPOINTS.CLUBS.BY_ID(clubId));
      logger.debug(LOG_MESSAGES.CLUB.FETCHED_ONE, { clubId: club.id });
      return club;
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.FETCH_ONE_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Get club by ID (alias for getClub)
   */
  async getClubById(clubId: string): Promise<Club> {
    return this.getClub(clubId);
  }

  /**
   * Mock get club implementation
   */
  private async mockGetClub(clubId: string): Promise<Club> {
    const club = mockClubs.find((c) => c.id === clubId);
    if (!club) {
      logger.warn(LOG_MESSAGES.CLUB.MOCK_NOT_FOUND, { clubId });
      throw new NotFoundError(LOG_MESSAGES.CLUB.NOT_FOUND);
    }

    // Only count approved members in memberCount
    const approvedMembers = getUsersByClub(clubId).filter(
      (u) => u.approvalStatus === ApprovalStatus.APPROVED
    );

    logger.debug(LOG_MESSAGES.CLUB.MOCK_FETCHED, { clubId, memberCount: approvedMembers.length });
    return { ...club, memberCount: approvedMembers.length };
  }

  /**
   * Create new club
   */
  async createClub(
    name: string,
    description: string,
    matchFrequency: MatchFrequency,
    groupSize: number,
    church: string,
    association: string,
    union: string,
    division: string
  ): Promise<Club> {
    const clubData: CreateClubData = {
      name,
      description,
      matchFrequency,
      groupSize,
      church,
      association,
      union,
      division,
    };

    logger.info(LOG_MESSAGES.CLUB.CREATING, { name, church });

    if (this.useMockData) {
      return this.mockCreateClub(clubData);
    }

    try {
      const newClub = await apiService.post<Club>(API_ENDPOINTS.CLUBS.BASE, clubData);
      logger.info(LOG_MESSAGES.CLUB.CREATED, { clubId: newClub.id, name: newClub.name });
      return newClub;
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.CREATE_FAILED, error as Error, { name });
      throw error;
    }
  }

  /**
   * Mock create club implementation
   */
  private async mockCreateClub(data: CreateClubData): Promise<Club> {
    await this.sleep(MOCK_DELAY.NORMAL); // Longer delay for create operations

    const newClub: Club = {
      id: String(mockClubs.length + 1),
      ...data,
      adminId: '2', // Default to club admin in mock data
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberCount: 0,
    };

    mockClubs.push(newClub);
    logger.info(LOG_MESSAGES.CLUB.MOCK_CREATED, { clubId: newClub.id, name: newClub.name });
    return newClub;
  }

  /**
   * Update club
   */
  async updateClub(clubId: string, data: Partial<Club>): Promise<Club> {
    logger.info(LOG_MESSAGES.CLUB.UPDATING, { clubId, fields: Object.keys(data) });

    if (this.useMockData) {
      return this.mockUpdateClub(clubId, data);
    }

    try {
      const updatedClub = await apiService.patch<Club>(API_ENDPOINTS.CLUBS.BY_ID(clubId), data);
      logger.info(LOG_MESSAGES.CLUB.UPDATED, { clubId: updatedClub.id });
      return updatedClub;
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.UPDATE_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock update club implementation
   */
  private async mockUpdateClub(clubId: string, data: Partial<Club>): Promise<Club> {
    await this.sleep(MOCK_DELAY.FAST);

    const clubIndex = mockClubs.findIndex((c) => c.id === clubId);
    if (clubIndex === -1) {
      logger.warn(LOG_MESSAGES.CLUB.MOCK_NOT_FOUND_UPDATE, { clubId });
      throw new NotFoundError(LOG_MESSAGES.CLUB.NOT_FOUND);
    }

    mockClubs[clubIndex] = {
      ...mockClubs[clubIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    logger.info(LOG_MESSAGES.CLUB.MOCK_UPDATED, { clubId });
    return mockClubs[clubIndex];
  }

  /**
   * Delete club
   */
  async deleteClub(clubId: string): Promise<void> {
    logger.info(LOG_MESSAGES.CLUB.DELETING, { clubId });

    if (this.useMockData) {
      return this.mockDeleteClub(clubId);
    }

    try {
      await apiService.delete<void>(API_ENDPOINTS.CLUBS.BY_ID(clubId));
      logger.info(LOG_MESSAGES.CLUB.DELETED, { clubId });
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.DELETE_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock delete club implementation
   */
  private async mockDeleteClub(clubId: string): Promise<void> {
    await this.sleep(MOCK_DELAY.FAST);

    const clubIndex = mockClubs.findIndex((c) => c.id === clubId);
    if (clubIndex !== -1) {
      mockClubs.splice(clubIndex, 1);
      logger.info(LOG_MESSAGES.CLUB.MOCK_DELETED, { clubId });
    } else {
      logger.warn(LOG_MESSAGES.CLUB.MOCK_NOT_FOUND_DELETE, { clubId });
    }
  }

  /**
   * Join a club
   */
  async joinClub(clubId: string): Promise<void> {
    logger.info(LOG_MESSAGES.CLUB.JOINING, { clubId });

    if (this.useMockData) {
      return this.mockJoinClub(clubId);
    }

    try {
      await apiService.post<void>(API_ENDPOINTS.CLUBS.JOIN(clubId), {});
      logger.info(LOG_MESSAGES.CLUB.JOINED, { clubId });
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.JOIN_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock join club implementation
   */
  private async mockJoinClub(clubId: string): Promise<void> {
    await this.sleep(MOCK_DELAY.FAST);
    // This would update the user's clubId in a real scenario
    logger.info(LOG_MESSAGES.CLUB.MOCK_JOINED, { clubId });
  }

  /**
   * Leave a club
   */
  async leaveClub(clubId: string): Promise<void> {
    logger.info(LOG_MESSAGES.CLUB.LEAVING, { clubId });

    if (this.useMockData) {
      return this.mockLeaveClub(clubId);
    }

    try {
      await apiService.post<void>(API_ENDPOINTS.CLUBS.LEAVE(clubId), {});
      logger.info(LOG_MESSAGES.CLUB.LEFT, { clubId });
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.LEAVE_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock leave club implementation
   */
  private async mockLeaveClub(clubId: string): Promise<void> {
    await this.sleep(MOCK_DELAY.FAST);
    logger.info(LOG_MESSAGES.CLUB.MOCK_LEFT, { clubId });
  }

  /**
   * Get club members
   */
  async getClubMembers(clubId: string): Promise<User[]> {
    logger.debug(LOG_MESSAGES.CLUB.FETCHING_MEMBERS, { clubId });

    if (this.useMockData) {
      return this.mockGetClubMembers(clubId);
    }

    try {
      const members = await apiService.get<User[]>(API_ENDPOINTS.CLUBS.MEMBERS(clubId));
      logger.debug(LOG_MESSAGES.CLUB.FETCHED_MEMBERS, { clubId, count: members.length });
      return members;
    } catch (error) {
      logger.error(LOG_MESSAGES.CLUB.FETCH_MEMBERS_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get club members implementation
   */
  private async mockGetClubMembers(clubId: string): Promise<User[]> {
    const members = getUsersByClub(clubId);
    logger.debug(LOG_MESSAGES.CLUB.MOCK_FETCHED_MEMBERS, { clubId, count: members.length });
    return members;
  }

  /**
   * Sleep helper for mock delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const clubService = new ClubService();
