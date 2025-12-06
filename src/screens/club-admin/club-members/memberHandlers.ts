import { Alert } from 'react-native';
import { userService } from '../../../services/userService';
import { PathfinderClass } from '../../../types';
import { MESSAGES, dynamicMessages, ALERT_BUTTON_STYLE } from '../../../shared/constants';

export async function toggleMemberStatus(
  memberId: string,
  isActive: boolean,
  loadData: () => void
): Promise<void> {
  try {
    await userService.updateUser(memberId, { isActive: !isActive });
    loadData();
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_MEMBER_STATUS);
  }
}

export function showDeleteMemberAlert(
  memberId: string,
  memberName: string,
  loadData: () => void
): void {
  Alert.alert(MESSAGES.TITLES.DELETE_MEMBER, dynamicMessages.confirmDeleteMember(memberName), [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: MESSAGES.BUTTONS.DELETE,
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.deleteUser(memberId);
          loadData();
        } catch {
          Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_DELETE_MEMBER);
        }
      },
    },
  ]);
}

export function showApproveMemberAlert(
  memberId: string,
  memberName: string,
  loadData: () => void
): void {
  Alert.alert(MESSAGES.TITLES.APPROVE_MEMBER, dynamicMessages.confirmApproveMember(memberName), [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: MESSAGES.BUTTONS.APPROVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.approveUser(memberId);
          Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.memberApproved(memberName));
          loadData();
        } catch {
          Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_APPROVE_MEMBER);
        }
      },
    },
  ]);
}

export function showRejectMemberAlert(
  memberId: string,
  memberName: string,
  loadData: () => void
): void {
  Alert.alert(MESSAGES.TITLES.REJECT_MEMBER, dynamicMessages.confirmRejectMember(memberName), [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: MESSAGES.BUTTONS.REJECT,
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await userService.rejectUser(memberId);
          Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.memberRejected(memberName));
          loadData();
        } catch {
          Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_REJECT_MEMBER);
        }
      },
    },
  ]);
}

export async function saveClasses(
  memberId: string,
  classes: PathfinderClass[],
  loadData: () => void
): Promise<void> {
  try {
    await userService.updateUser(memberId, { classes });
    Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.CLASSES_UPDATED);
    loadData();
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_CLASSES);
  }
}
