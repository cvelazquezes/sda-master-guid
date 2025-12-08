import { Alert } from 'react-native';
import { userService } from '../../../../infrastructure/repositories/userService';
import { ALERT_BUTTON_STYLE } from '../../../../shared/constants';

export function showToggleActiveAlert(
  userId: string,
  newValue: boolean,
  setIsActive: (v: boolean) => void,
  t: (key: string) => string
): void {
  const title = newValue
    ? t('screens.settings.activateAccount')
    : t('screens.settings.pauseAccount');
  const message = newValue
    ? t('screens.settings.confirmActivate')
    : t('screens.settings.confirmPause');

  Alert.alert(title, message, [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('common.confirm'),
      onPress: async (): Promise<void> => {
        try {
          await userService.updateUserActiveStatus(userId, newValue);
          setIsActive(newValue);
          Alert.alert(
            t('common.success'),
            newValue ? t('screens.settings.accountActivated') : t('screens.settings.accountPaused')
          );
        } catch {
          Alert.alert(
            t('common.error'),
            newValue ? t('screens.settings.failedToActivate') : t('screens.settings.failedToPause')
          );
        }
      },
    },
  ]);
}

export function showLogoutAlert(t: (key: string) => string, logout: () => void): void {
  Alert.alert(t('screens.settings.signOut'), t('screens.settings.confirmSignOut'), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    { text: t('screens.settings.signOut'), style: ALERT_BUTTON_STYLE.DESTRUCTIVE, onPress: logout },
  ]);
}
