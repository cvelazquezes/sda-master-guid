import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Match, MatchRound, MatchStatus } from '../types';
import {
  mockMatches,
  mockMatchRounds,
  mockUsers,
  mockClubs,
  getMatchesForUser,
  getMatchesByClub,
  getMatchRoundsByClub,
  getUsersByClub,
} from './mockData';

const USE_MOCK_DATA = true;

// Storage helper
const getUserId = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('auth_user_id');
    } else {
      const { default: SecureStore } = await import('expo-secure-store');
      return await SecureStore.getItemAsync('auth_user_id');
    }
  } catch (error) {
    return await AsyncStorage.getItem('auth_user_id');
  }
};

export const matchService = {
  async getMatches(clubId: string): Promise<Match[]> {
    if (USE_MOCK_DATA) {
      return getMatchesByClub(clubId);
    }
    const response = await api.get(`/matches?clubId=${clubId}`);
    return response.data;
  },

  async getMyMatches(): Promise<Match[]> {
    if (USE_MOCK_DATA) {
      const userId = await getUserId();
      if (!userId) return [];
      return getMatchesForUser(userId);
    }
    const response = await api.get('/matches/me');
    return response.data;
  },

  async getMatch(matchId: string): Promise<Match> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const match = mockMatches.find((m) => m.id === matchId);
      if (!match) throw new Error('Match not found');
      return match;
    }
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<Match> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const matchIndex = mockMatches.findIndex((m) => m.id === matchId);
      if (matchIndex === -1) throw new Error('Match not found');
      mockMatches[matchIndex] = {
        ...mockMatches[matchIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
      return mockMatches[matchIndex];
    }
    const response = await api.patch(`/matches/${matchId}/status`, { status });
    return response.data;
  },

  async scheduleMatch(matchId: string, scheduledDate: string): Promise<Match> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const matchIndex = mockMatches.findIndex((m) => m.id === matchId);
      if (matchIndex === -1) throw new Error('Match not found');
      mockMatches[matchIndex] = {
        ...mockMatches[matchIndex],
        scheduledDate,
        status: MatchStatus.SCHEDULED,
        updatedAt: new Date().toISOString(),
      };
      return mockMatches[matchIndex];
    }
    const response = await api.patch(`/matches/${matchId}`, { scheduledDate });
    return response.data;
  },

  async skipMatch(matchId: string): Promise<Match> {
    return this.updateMatchStatus(matchId, MatchStatus.SKIPPED);
  },

  async generateMatches(clubId: string): Promise<MatchRound> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const club = mockClubs.find((c) => c.id === clubId);
      if (!club) throw new Error('Club not found');
      
      const members = getUsersByClub(clubId).filter((u) => u.isActive && !u.isPaused);
      if (members.length < club.groupSize) {
        throw new Error(`Not enough active members. Need at least ${club.groupSize}`);
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
      return newRound;
    }
    const response = await api.post(`/matches/generate`, { clubId });
    return response.data;
  },

  async getMatchRounds(clubId: string): Promise<MatchRound[]> {
    if (USE_MOCK_DATA) {
      return getMatchRoundsByClub(clubId);
    }
    const response = await api.get(`/matches/rounds?clubId=${clubId}`);
    return response.data;
  },
};

