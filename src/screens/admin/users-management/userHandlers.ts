import { Alert } from 'react-native';
import { UserRole } from '../../../types';
import { userService } from '../../../services/userService';
import { ALERT_BUTTON_STYLE, MESSAGES, dynamicMessages } from '../../../shared/constants';

export async function handleToggleUserStatus(
  userId: string,
  isActive: boolean,
  loadData: () => Promise<void>
): Promise<void> {
  try {
    await userService.updateUser(userId, { isActive: !isActive });
    loadData();
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_USER_STATUS);
  }
}

interface HandleApproveUserOptions {
  userId: string;
  userName: string;
  userRole: UserRole;
  loadData: () => Promise<void>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function handleApproveUser(options: HandleApproveUserOptions): void {
  const { userId, userName, userRole, loadData, t } = options;
  const roleLabel =
    userRole === UserRole.CLUB_ADMIN
      ? t('screens.usersManagement.roleClubAdmin')
      : t('screens.usersManagement.roleUser');
  Alert.alert(
    MESSAGES.TITLES.APPROVE_USER,
    dynamicMessages.confirmApproveUser(userName, roleLabel),
    [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.APPROVE,
        onPress: async (): Promise<void> => {
          try {
            await userService.approveUser(userId);
            Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.userApproved(userName));
            loadData();
          } catch {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_APPROVE_USER);
          }
        },
      },
    ]
  );
}

export function handleRejectUser(
  userId: string,
  userName: string,
  loadData: () => Promise<void>
): void {
  Alert.alert(MESSAGES.TITLES.REJECT_USER, dynamicMessages.confirmRejectUser(userName), [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: MESSAGES.BUTTONS.REJECT,
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.rejectUser(userId);
          Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.userRejected(userName));
          loadData();
        } catch {
          Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_REJECT_USER);
        }
      },
    },
  ]);
}

export function handleDeleteUser(
  userId: string,
  userName: string,
  loadData: () => Promise<void>
): void {
  Alert.alert(MESSAGES.TITLES.DELETE_USER, dynamicMessages.confirmDeleteUser(userName), [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: MESSAGES.BUTTONS.DELETE,
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.deleteUser(userId);
          loadData();
        } catch {
          Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_DELETE_USER);
        }
      },
    },
  ]);
}
