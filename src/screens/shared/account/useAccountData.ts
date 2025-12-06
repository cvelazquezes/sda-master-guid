import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Club, UserRole } from '../../../types';
import { clubService } from '../../../services/clubService';
import { logger } from '../../../shared/utils/logger';
import { LOG_MESSAGES } from '../../../shared/constants/logMessages';
import { MESSAGES } from '../../../shared/constants';

interface UseAccountDataReturn {
  club: Club | null;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export function useAccountData(
  clubId: string | undefined,
  role: UserRole | undefined,
  initialActive: boolean
): UseAccountDataReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [isActive, setIsActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClub = async (): Promise<void> => {
      if (clubId && role !== UserRole.ADMIN) {
        try {
          const clubData = await clubService.getClubById(clubId);
          setClub(clubData);
        } catch (error) {
          logger.error(
            LOG_MESSAGES.COMPONENTS.USER_DETAIL_MODAL.FAILED_TO_LOAD_CLUB,
            error as Error
          );
        }
      }
    };
    fetchClub();
  }, [clubId, role]);

  return { club, isActive, setIsActive, loading, setLoading };
}

export async function handleToggleActive(
  value: boolean,
  setIsActive: (v: boolean) => void,
  setLoading: (v: boolean) => void,
  updateUser: (data: { isActive: boolean }) => Promise<void>
): Promise<void> {
  setLoading(true);
  try {
    await updateUser({ isActive: value });
    setIsActive(value);
    Alert.alert(
      MESSAGES.TITLES.SUCCESS,
      value ? MESSAGES.SUCCESS.ACCOUNT_ACTIVATED : MESSAGES.SUCCESS.ACCOUNT_PAUSED
    );
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_SETTINGS);
    setIsActive(!value);
  } finally {
    setLoading(false);
  }
}

export function handleLogout(logout: () => Promise<void>): void {
  Alert.alert(MESSAGES.TITLES.LOGOUT, MESSAGES.WARNINGS.CONFIRM_LOGOUT, [
    { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
    {
      text: MESSAGES.TITLES.LOGOUT,
      style: 'destructive',
      onPress: async (): Promise<void> => {
        try {
          await logout();
        } catch {
          Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOGOUT);
        }
      },
    },
  ]);
}
