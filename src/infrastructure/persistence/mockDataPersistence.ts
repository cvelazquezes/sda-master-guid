/**
 * Mock Data Persistence Layer
 * Persists mock data to AsyncStorage so data survives app restarts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../../shared/utils/logger';
import type { User, Club, Match, MatchRound } from '../../types';

// Storage keys
const STORAGE_KEYS = {
  USERS: '@mock_users',
  CLUBS: '@mock_clubs',
  MATCHES: '@mock_matches',
  MATCH_ROUNDS: '@mock_match_rounds',
  INITIALIZED: '@mock_data_initialized',
};

export type MockDataStore = {
  users: User[];
  clubs: Club[];
  matches: Match[];
  matchRounds: MatchRound[];
};

/**
 * Load mock data from storage
 */
export const loadMockData = async (): Promise<MockDataStore | null> => {
  try {
    const isInitialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);

    if (!isInitialized) {
      logger.info('Mock data not initialized yet');
      return null;
    }

    const [usersData, clubsData, matchesData, roundsData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.USERS),
      AsyncStorage.getItem(STORAGE_KEYS.CLUBS),
      AsyncStorage.getItem(STORAGE_KEYS.MATCHES),
      AsyncStorage.getItem(STORAGE_KEYS.MATCH_ROUNDS),
    ]);

    if (!usersData || !clubsData || !matchesData || !roundsData) {
      logger.warn('Some mock data is missing');
      return null;
    }

    const data: MockDataStore = {
      users: JSON.parse(usersData),
      clubs: JSON.parse(clubsData),
      matches: JSON.parse(matchesData),
      matchRounds: JSON.parse(roundsData),
    };

    logger.info('Mock data loaded from storage', {
      userCount: data.users.length,
      clubCount: data.clubs.length,
      matchCount: data.matches.length,
    });

    return data;
  } catch (error) {
    logger.error('Failed to load mock data', error as Error);
    return null;
  }
};

/**
 * Save mock data to storage
 */
export const saveMockData = async (data: MockDataStore): Promise<boolean> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users)),
      AsyncStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(data.clubs)),
      AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(data.matches)),
      AsyncStorage.setItem(STORAGE_KEYS.MATCH_ROUNDS, JSON.stringify(data.matchRounds)),
      AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true'),
    ]);

    logger.debug('Mock data saved to storage');
    return true;
  } catch (error) {
    logger.error('Failed to save mock data', error as Error);
    return false;
  }
};

/**
 * Clear all mock data from storage
 */
export const clearMockData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.CLUBS,
      STORAGE_KEYS.MATCHES,
      STORAGE_KEYS.MATCH_ROUNDS,
      STORAGE_KEYS.INITIALIZED,
    ]);

    logger.info('Mock data cleared from storage');
    return true;
  } catch (error) {
    logger.error('Failed to clear mock data', error as Error);
    return false;
  }
};

/**
 * Reset mock data to initial state
 */
export const resetMockData = async (): Promise<boolean> => {
  try {
    await clearMockData();
    logger.info('Mock data reset to initial state');
    return true;
  } catch (error) {
    logger.error('Failed to reset mock data', error as Error);
    return false;
  }
};

/**
 * Check if mock data is initialized
 */
export const isMockDataInitialized = async (): Promise<boolean> => {
  try {
    const isInitialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
    return isInitialized === 'true';
  } catch (error) {
    logger.error('Failed to check mock data initialization', error as Error);
    return false;
  }
};
