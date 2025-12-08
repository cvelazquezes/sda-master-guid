import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { clubService } from '../../../services/clubService';
import { Club, MatchFrequency } from '../../../types';
import { CLUB, EMPTY_VALUE } from '../../../shared/constants';

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

interface FormData {
  name: string;
  description: string;
  matchFrequency: MatchFrequency;
  groupSize: number;
}

interface UseClubSettingsReturn {
  club: Club | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleSave: () => Promise<void>;
}

export function useClubSettings(
  clubId: string | undefined,
  t: TranslationFn
): UseClubSettingsReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: EMPTY_VALUE,
    description: EMPTY_VALUE,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: CLUB.DEFAULT_GROUP_SIZE,
  });

  const loadClub = useCallback(async (): Promise<void> => {
    if (!clubId) {
      return;
    }
    try {
      const clubData = await clubService.getClub(clubId);
      setClub(clubData);
      setFormData({
        name: clubData.name,
        description: clubData.description,
        matchFrequency: clubData.matchFrequency,
        groupSize: clubData.groupSize,
      });
    } catch {
      Alert.alert(t('common.error'), t('errors.failedToLoadClubSettings'));
    }
  }, [clubId, t]);

  useEffect(() => {
    if (clubId) {
      loadClub();
    }
  }, [clubId, loadClub]);

  const handleSave = async (): Promise<void> => {
    if (!clubId || !formData.name || !formData.description) {
      Alert.alert(t('common.error'), t('errors.missingFields'));
      return;
    }
    try {
      await clubService.updateClub(clubId, formData);
      loadClub();
      Alert.alert(t('common.success'), t('success.clubUpdated'));
    } catch {
      Alert.alert(t('common.error'), t('errors.failedToUpdateClubSettings'));
    }
  };

  return { club, formData, setFormData, handleSave };
}
