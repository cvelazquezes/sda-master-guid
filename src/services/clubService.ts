/**
 * Club Service
 * Handles club management with mock/backend toggle
 */

import { apiService } from './api';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';
import { Club, MatchFrequency, User } from '../types';
import { mockClubs, getUsersByClub } from './mockData';
import { NotFoundError } from '../utils/errors';

// Constants
const MOCK_API_DELAY_MS = 300;

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
  private useMockData = environment.useMockData;

  /**
   * Get all clubs
   */
  async getAllClubs(): Promise<Club[]> {
    logger.debug('Fetching all clubs');

    if (this.useMockData) {
      return this.mockGetAllClubs();
    }

    try {
      const clubs = await apiService.get<Club[]>('/clubs');
      logger.debug('Clubs fetched', { count: clubs.length });
      return clubs;
    } catch (error) {
      logger.error('Failed to fetch clubs', error as Error);
      throw error;
    }
  }

  /**
   * Mock get all clubs implementation
   */
  private async mockGetAllClubs(): Promise<Club[]> {
    logger.debug('Mock: Getting all clubs', { count: mockClubs.length });
    return [...mockClubs];
  }

  /**
   * Get club by ID
   */
  async getClub(clubId: string): Promise<Club> {
    logger.debug('Fetching club', { clubId });

    if (this.useMockData) {
      return this.mockGetClub(clubId);
    }

    try {
      const club = await apiService.get<Club>(`/clubs/${clubId}`);
      logger.debug('Club fetched', { clubId: club.id });
      return club;
    } catch (error) {
      logger.error('Failed to fetch club', error as Error, { clubId });
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
      logger.warn('Mock: Club not found', { clubId });
      throw new NotFoundError('Club not found');
    }

    // Only count approved members in memberCount
    const approvedMembers = getUsersByClub(clubId).filter(
      (u) => u.approvalStatus === 'approved'
    );

    logger.debug('Mock: Club fetched', { clubId, memberCount: approvedMembers.length });
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

    logger.info('Creating club', { name, church });

    if (this.useMockData) {
      return this.mockCreateClub(clubData);
    }

    try {
      const newClub = await apiService.post<Club>('/clubs', clubData);
      logger.info('Club created', { clubId: newClub.id, name: newClub.name });
      return newClub;
    } catch (error) {
      logger.error('Failed to create club', error as Error, { name });
      throw error;
    }
  }

  /**
   * Mock create club implementation
   */
  private async mockCreateClub(data: CreateClubData): Promise<Club> {
    await this.sleep(500); // Longer delay for create operations

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
    logger.info('Mock: Club created', { clubId: newClub.id, name: newClub.name });
    return newClub;
  }

  /**
   * Update club
   */
  async updateClub(clubId: string, data: Partial<Club>): Promise<Club> {
    logger.info('Updating club', { clubId, fields: Object.keys(data) });

    if (this.useMockData) {
      return this.mockUpdateClub(clubId, data);
    }

    try {
      const updatedClub = await apiService.patch<Club>(`/clubs/${clubId}`, data);
      logger.info('Club updated', { clubId: updatedClub.id });
      return updatedClub;
    } catch (error) {
      logger.error('Failed to update club', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock update club implementation
   */
  private async mockUpdateClub(clubId: string, data: Partial<Club>): Promise<Club> {
    await this.sleep(MOCK_API_DELAY_MS);

    const clubIndex = mockClubs.findIndex((c) => c.id === clubId);
    if (clubIndex === -1) {
      logger.warn('Mock: Club not found for update', { clubId });
      throw new NotFoundError('Club not found');
    }

    mockClubs[clubIndex] = {
      ...mockClubs[clubIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    logger.info('Mock: Club updated', { clubId });
    return mockClubs[clubIndex];
  }

  /**
   * Delete club
   */
  async deleteClub(clubId: string): Promise<void> {
    logger.info('Deleting club', { clubId });

    if (this.useMockData) {
      return this.mockDeleteClub(clubId);
    }

    try {
      await apiService.delete<void>(`/clubs/${clubId}`);
      logger.info('Club deleted', { clubId });
    } catch (error) {
      logger.error('Failed to delete club', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock delete club implementation
   */
  private async mockDeleteClub(clubId: string): Promise<void> {
    await this.sleep(MOCK_API_DELAY_MS);

    const clubIndex = mockClubs.findIndex((c) => c.id === clubId);
    if (clubIndex !== -1) {
      mockClubs.splice(clubIndex, 1);
      logger.info('Mock: Club deleted', { clubId });
    } else {
      logger.warn('Mock: Club not found for deletion', { clubId });
    }
  }

  /**
   * Join a club
   */
  async joinClub(clubId: string): Promise<void> {
    logger.info('Joining club', { clubId });

    if (this.useMockData) {
      return this.mockJoinClub(clubId);
    }

    try {
      await apiService.post<void>(`/clubs/${clubId}/join`, {});
      logger.info('Joined club', { clubId });
    } catch (error) {
      logger.error('Failed to join club', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock join club implementation
   */
  private async mockJoinClub(clubId: string): Promise<void> {
    await this.sleep(MOCK_API_DELAY_MS);
    // This would update the user's clubId in a real scenario
    logger.info('Mock: Joined club', { clubId });
  }

  /**
   * Leave a club
   */
  async leaveClub(clubId: string): Promise<void> {
    logger.info('Leaving club', { clubId });

    if (this.useMockData) {
      return this.mockLeaveClub(clubId);
    }

    try {
      await apiService.post<void>(`/clubs/${clubId}/leave`, {});
      logger.info('Left club', { clubId });
    } catch (error) {
      logger.error('Failed to leave club', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock leave club implementation
   */
  private async mockLeaveClub(clubId: string): Promise<void> {
    await this.sleep(MOCK_API_DELAY_MS);
    logger.info('Mock: Left club', { clubId });
  }

  /**
   * Get club members
   */
  async getClubMembers(clubId: string): Promise<User[]> {
    logger.debug('Fetching club members', { clubId });

    if (this.useMockData) {
      return this.mockGetClubMembers(clubId);
    }

    try {
      const members = await apiService.get<User[]>(`/clubs/${clubId}/members`);
      logger.debug('Club members fetched', { clubId, count: members.length });
      return members;
    } catch (error) {
      logger.error('Failed to fetch club members', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get club members implementation
   */
  private async mockGetClubMembers(clubId: string): Promise<User[]> {
    const members = getUsersByClub(clubId);
    logger.debug('Mock: Club members fetched', { clubId, count: members.length });
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
