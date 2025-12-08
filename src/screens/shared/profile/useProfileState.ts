import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { ALERT_BUTTON_STYLE } from '../../../shared/constants';

interface UseProfileStateReturn {
  isActive: boolean;
  loading: boolean;
  handleToggleActive: (value: boolean) => Promise<void>;
  handleLogout: () => void;
}

export function useProfileState(): UseProfileStateReturn {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const [isActive, setIsActive] = useState(user?.isActive !== false);
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async (value: boolean): Promise<void> => {
    setLoading(true);
    try {
      await updateUser({ isActive: value });
      setIsActive(value);
      const msg = value ? t('success.accountActivated') : t('success.accountPaused');
      Alert.alert(t('common.success'), msg);
    } catch {
      Alert.alert(t('common.error'), t('errors.failedToUpdateSettings'));
      setIsActive(!value);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    Alert.alert(t('titles.logout'), t('warnings.confirmLogout'), [
      { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('titles.logout'),
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: async () => {
          try {
            await logout();
          } catch {
            Alert.alert(t('common.error'), t('errors.failedToLogout'));
          }
        },
      },
    ]);
  };

  return { isActive, loading, handleToggleActive, handleLogout };
}
