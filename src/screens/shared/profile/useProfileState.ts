import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { MESSAGES, ALERT_BUTTON_STYLE } from '../../../shared/constants';

interface UseProfileStateReturn {
  isActive: boolean;
  loading: boolean;
  handleToggleActive: (value: boolean) => Promise<void>;
  handleLogout: () => void;
}

export function useProfileState(): UseProfileStateReturn {
  const { user, updateUser, logout } = useAuth();
  const [isActive, setIsActive] = useState(user?.isActive !== false);
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async (value: boolean): Promise<void> => {
    setLoading(true);
    try {
      await updateUser({ isActive: value });
      setIsActive(value);
      const msg = value ? MESSAGES.SUCCESS.ACCOUNT_ACTIVATED : MESSAGES.SUCCESS.ACCOUNT_PAUSED;
      Alert.alert(MESSAGES.TITLES.SUCCESS, msg);
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_SETTINGS);
      setIsActive(!value);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    Alert.alert(MESSAGES.TITLES.LOGOUT, MESSAGES.WARNINGS.CONFIRM_LOGOUT, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.TITLES.LOGOUT,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: async () => {
          try {
            await logout();
          } catch {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOGOUT);
          }
        },
      },
    ]);
  };

  return { isActive, loading, handleToggleActive, handleLogout };
}
