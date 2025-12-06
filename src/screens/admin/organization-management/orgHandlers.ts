import { Alert } from 'react-native';
import {
  MESSAGES,
  ALERT_BUTTON_STYLE,
  HIERARCHY_FIELDS,
  OrganizationType,
  dynamicMessages,
} from '../../../shared/constants';
import { OrganizationItem, OrgFormData } from './types';
import { getTypeLabel } from './orgUtils';

interface HandleSaveOptions {
  formData: OrgFormData;
  selectedType: OrganizationType;
  editMode: boolean;
  setModalVisible: (v: boolean) => void;
  resetForm: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function handleSave(options: HandleSaveOptions): void {
  const { formData, selectedType, editMode, setModalVisible, resetForm, t } = options;
  if (!formData.name.trim()) {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_ENTER_NAME);
    return;
  }

  if (selectedType === HIERARCHY_FIELDS.UNION && !formData.parentDivision) {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_DIVISION);
    return;
  }
  if (selectedType === HIERARCHY_FIELDS.ASSOCIATION && !formData.parentUnion) {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_UNION);
    return;
  }
  if (selectedType === HIERARCHY_FIELDS.CHURCH && !formData.parentAssociation) {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_ASSOCIATION);
    return;
  }

  const typeLabel = getTypeLabel(selectedType, t);
  Alert.alert(
    MESSAGES.TITLES.SUCCESS,
    editMode
      ? t('screens.organizationManagement.typeUpdated', { type: typeLabel, name: formData.name })
      : t('screens.organizationManagement.typeCreated', { type: typeLabel, name: formData.name }),
    [
      {
        text: MESSAGES.BUTTONS.OK,
        onPress: (): void => {
          setModalVisible(false);
          resetForm();
        },
      },
    ]
  );
}

export function handleDelete(
  org: OrganizationItem,
  t: (key: string, opts?: Record<string, unknown>) => string
): void {
  const typeLabel = getTypeLabel(org.type, t);
  Alert.alert(
    t('screens.organizationManagement.deleteType', { type: typeLabel }),
    t('screens.organizationManagement.confirmDeleteMessage', {
      name: org.name,
      type: org.type,
      count: org.clubCount,
    }),
    [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.DELETE,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: (): void => {
          Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.organizationDeleted(typeLabel));
        },
      },
    ]
  );
}
