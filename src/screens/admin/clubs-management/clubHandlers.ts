import { Alert } from 'react-native';
import { clubService } from '../../../services/clubService';
import { ALERT_BUTTON_STYLE, MESSAGES, dynamicMessages } from '../../../shared/constants';
import { ClubFormData } from './types';

export async function handleCreateClub(
  formData: ClubFormData,
  setModalVisible: (v: boolean) => void,
  resetForm: () => void,
  loadClubs: () => Promise<void>
): Promise<void> {
  if (
    !formData.name ||
    !formData.description ||
    !formData.church ||
    !formData.association ||
    !formData.union ||
    !formData.division
  ) {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.MISSING_REQUIRED_FIELDS);
    return;
  }

  try {
    await clubService.createClub(
      formData.name,
      formData.description,
      formData.matchFrequency,
      formData.groupSize,
      formData.church,
      formData.association,
      formData.union,
      formData.division
    );
    Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.CLUB_CREATED);
    setModalVisible(false);
    resetForm();
    loadClubs();
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_CREATE_CLUB);
  }
}

export async function handleToggleClubStatus(
  clubId: string,
  isActive: boolean,
  loadClubs: () => Promise<void>
): Promise<void> {
  try {
    await clubService.updateClub(clubId, { isActive: !isActive });
    loadClubs();
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_CLUB_STATUS);
  }
}

export function handleDeleteClub(
  clubId: string,
  clubName: string,
  loadClubs: () => Promise<void>
): void {
  Alert.alert(MESSAGES.TITLES.DELETE_CLUB, dynamicMessages.confirmDeleteClub(clubName), [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: MESSAGES.BUTTONS.DELETE,
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: async (): Promise<void> => {
        try {
          await clubService.deleteClub(clubId);
          loadClubs();
        } catch {
          Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_DELETE_CLUB);
        }
      },
    },
  ]);
}
