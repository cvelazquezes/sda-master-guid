import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { clubService } from '../../../services/clubService';
import { Club, MatchFrequency } from '../../../types';
import { CLUB_SETTINGS, EMPTY_VALUE, MESSAGES } from '../../../shared/constants';

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

export function useClubSettings(clubId?: string): UseClubSettingsReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: EMPTY_VALUE,
    description: EMPTY_VALUE,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: CLUB_SETTINGS.defaultGroupSize,
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
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_CLUB_SETTINGS);
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      loadClub();
    }
  }, [clubId, loadClub]);

  const handleSave = async (): Promise<void> => {
    if (!clubId || !formData.name || !formData.description) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.MISSING_FIELDS);
      return;
    }
    try {
      await clubService.updateClub(clubId, formData);
      loadClub();
      Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.CLUB_UPDATED);
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_CLUB_SETTINGS);
    }
  };

  return { club, formData, setFormData, handleSave };
}
