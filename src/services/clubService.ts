import api from './api';
import { Club, MatchFrequency } from '../types';
import { mockClubs, mockUsers, getUsersByClub } from './mockData';

const USE_MOCK_DATA = true;

export const clubService = {
  async getAllClubs(): Promise<Club[]> {
    if (USE_MOCK_DATA) {
      // Return immediately without delay for better UX
      return [...mockClubs];
    }
    const response = await api.get('/clubs');
    return response.data;
  },

  async getClub(clubId: string): Promise<Club> {
    if (USE_MOCK_DATA) {
      const club = mockClubs.find((c) => c.id === clubId);
      if (!club) throw new Error('Club not found');
      return { ...club, memberCount: getUsersByClub(clubId).length };
    }
    const response = await api.get(`/clubs/${clubId}`);
    return response.data;
  },

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
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newClub: Club = {
        id: String(mockClubs.length + 1),
        name,
        description,
        adminId: '2', // Default to club admin
        isActive: true,
        matchFrequency,
        groupSize,
        church,
        association,
        union,
        division,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberCount: 0,
      };
      mockClubs.push(newClub);
      return newClub;
    }
    const response = await api.post('/clubs', {
      name,
      description,
      matchFrequency,
      groupSize,
      church,
      association,
      union,
      division,
    });
    return response.data;
  },

  async updateClub(clubId: string, data: Partial<Club>): Promise<Club> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const clubIndex = mockClubs.findIndex((c) => c.id === clubId);
      if (clubIndex === -1) throw new Error('Club not found');
      mockClubs[clubIndex] = { ...mockClubs[clubIndex], ...data, updatedAt: new Date().toISOString() };
      return mockClubs[clubIndex];
    }
    const response = await api.patch(`/clubs/${clubId}`, data);
    return response.data;
  },

  async deleteClub(clubId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const clubIndex = mockClubs.findIndex((c) => c.id === clubId);
      if (clubIndex !== -1) {
        mockClubs.splice(clubIndex, 1);
      }
      return;
    }
    await api.delete(`/clubs/${clubId}`);
  },

  async joinClub(clubId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // This would update the user's clubId in a real scenario
      return;
    }
    await api.post(`/clubs/${clubId}/join`);
  },

  async leaveClub(clubId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }
    await api.post(`/clubs/${clubId}/leave`);
  },

  async getClubMembers(clubId: string): Promise<any[]> {
    if (USE_MOCK_DATA) {
      return getUsersByClub(clubId);
    }
    const response = await api.get(`/clubs/${clubId}/members`);
    return response.data;
  },
};

