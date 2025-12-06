import { useState, useEffect, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { clubService } from '../../../services/clubService';
import { userService } from '../../../services/userService';
import { Club, User } from '../../../types';
import { logger } from '../../../shared/utils/logger';
import { LOG_MESSAGES } from '../../../shared/constants/logMessages';
import { ANIMATION_DURATION } from '../../../shared/constants';

interface UseSettingsDataReturn {
  club: Club | null;
  fullUser: User | null;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  refreshing: boolean;
  loading: boolean;
  fadeAnim: Animated.Value;
  loadData: () => Promise<void>;
  onRefresh: () => void;
}

export function useSettingsData(
  userId?: string,
  clubId?: string,
  initialActive?: boolean
): UseSettingsDataReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [isActive, setIsActive] = useState(initialActive ?? true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadData = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (clubId) {
        const clubData = await clubService.getClub(clubId);
        setClub(clubData);
      }
      if (userId) {
        const userData = await userService.getUser(userId);
        setFullUser(userData);
        setIsActive(userData?.isActive ?? true);
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.SETTINGS.FAILED_TO_LOAD_DATA, error as Error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.MEDIUM,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fadeAnim]);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  return {
    club,
    fullUser,
    isActive,
    setIsActive,
    refreshing,
    loading,
    fadeAnim,
    loadData,
    onRefresh,
  };
}
