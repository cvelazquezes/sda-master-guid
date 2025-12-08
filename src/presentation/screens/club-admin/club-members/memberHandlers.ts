import { Alert } from 'react-native';
import { userService } from '../../../../infrastructure/repositories/userService';
import { PathfinderClass } from '../../../../types';
import { ALERT_BUTTON_STYLE } from '../../../../shared/constants';

type TranslationFn = (key: string, opts?: Record<string, unknown>) => string;

export async function toggleMemberStatus(
  memberId: string,
  isActive: boolean,
  loadData: () => void,
  t: TranslationFn
): Promise<void> {
  try {
    await userService.updateUser(memberId, { isActive: !isActive });
    loadData();
  } catch {
    Alert.alert(t('common.error'), t('errors.failedToUpdateMemberStatus'));
  }
}

export function showDeleteMemberAlert(
  memberId: string,
  memberName: string,
  loadData: () => void,
  t: TranslationFn
): void {
  Alert.alert(t('titles.deleteMember'), t('warnings.confirmDeleteMember', { name: memberName }), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('common.delete'),
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.deleteUser(memberId);
          loadData();
        } catch {
          Alert.alert(t('common.error'), t('errors.failedToDeleteMember'));
        }
      },
    },
  ]);
}

export function showApproveMemberAlert(
  memberId: string,
  memberName: string,
  loadData: () => void,
  t: TranslationFn
): void {
  Alert.alert(t('titles.approveMember'), t('warnings.confirmApproveMember', { name: memberName }), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('buttons.approve'),
      onPress: async (): Promise<void> => {
        try {
          await userService.approveUser(memberId);
          Alert.alert(t('common.success'), t('success.memberApproved', { name: memberName }));
          loadData();
        } catch {
          Alert.alert(t('common.error'), t('errors.failedToApproveMember'));
        }
      },
    },
  ]);
}

export function showRejectMemberAlert(
  memberId: string,
  memberName: string,
  loadData: () => void,
  t: TranslationFn
): void {
  Alert.alert(t('titles.rejectMember'), t('warnings.confirmRejectMember', { name: memberName }), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('buttons.reject'),
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.rejectUser(memberId);
          Alert.alert(t('common.success'), t('success.memberRejected', { name: memberName }));
          loadData();
        } catch {
          Alert.alert(t('common.error'), t('errors.failedToRejectMember'));
        }
      },
    },
  ]);
}

export async function saveClasses(
  memberId: string,
  classes: PathfinderClass[],
  loadData: () => void,
  t: TranslationFn
): Promise<void> {
  try {
    await userService.updateUser(memberId, { classes });
    Alert.alert(t('common.success'), t('success.classesUpdated'));
    loadData();
  } catch {
    Alert.alert(t('common.error'), t('errors.failedToUpdateClasses'));
  }
}
