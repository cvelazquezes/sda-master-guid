import { Alert } from 'react-native';
import { UserRole } from '../../../../types';
import { userService } from '../../../../infrastructure/repositories/userService';
import { ALERT_BUTTON_STYLE } from '../../../../shared/constants';

type TranslationFn = (key: string, opts?: Record<string, unknown>) => string;

export async function handleToggleUserStatus(
  userId: string,
  isActive: boolean,
  loadData: () => Promise<void>,
  t: TranslationFn
): Promise<void> {
  try {
    await userService.updateUser(userId, { isActive: !isActive });
    loadData();
  } catch {
    Alert.alert(t('common.error'), t('errors.failedToUpdateUserStatus'));
  }
}

interface HandleApproveUserOptions {
  userId: string;
  userName: string;
  userRole: UserRole;
  loadData: () => Promise<void>;
  t: TranslationFn;
}

export function handleApproveUser(options: HandleApproveUserOptions): void {
  const { userId, userName, userRole, loadData, t } = options;
  const roleLabel =
    userRole === UserRole.CLUB_ADMIN
      ? t('screens.usersManagement.roleClubAdmin')
      : t('screens.usersManagement.roleUser');
  Alert.alert(
    t('titles.approveUser'),
    t('warnings.confirmApproveUser', { name: userName, role: roleLabel }),
    [
      { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('buttons.approve'),
        onPress: async (): Promise<void> => {
          try {
            await userService.approveUser(userId);
            Alert.alert(t('common.success'), t('success.userApproved', { name: userName }));
            loadData();
          } catch {
            Alert.alert(t('common.error'), t('errors.failedToApproveUser'));
          }
        },
      },
    ]
  );
}

export function handleRejectUser(
  userId: string,
  userName: string,
  loadData: () => Promise<void>,
  t: TranslationFn
): void {
  Alert.alert(t('titles.rejectUser'), t('warnings.confirmRejectUser', { name: userName }), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('buttons.reject'),
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.rejectUser(userId);
          Alert.alert(t('common.success'), t('success.userRejected', { name: userName }));
          loadData();
        } catch {
          Alert.alert(t('common.error'), t('errors.failedToRejectUser'));
        }
      },
    },
  ]);
}

export function handleDeleteUser(
  userId: string,
  userName: string,
  loadData: () => Promise<void>,
  t: TranslationFn
): void {
  Alert.alert(t('titles.deleteUser'), t('warnings.confirmDeleteUser', { name: userName }), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('common.delete'),
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.deleteUser(userId);
          loadData();
        } catch {
          Alert.alert(t('common.error'), t('errors.failedToDeleteUser'));
        }
      },
    },
  ]);
}
