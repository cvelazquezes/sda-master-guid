import { Alert } from 'react-native';
import { ALERT_BUTTON_STYLE, HIERARCHY_FIELDS, OrganizationType } from '../../../shared/constants';
import { OrganizationItem, OrgFormData } from './types';
import { getTypeLabel } from './orgUtils';

type TranslationFn = (key: string, opts?: Record<string, unknown>) => string;

interface HandleSaveOptions {
  formData: OrgFormData;
  selectedType: OrganizationType;
  editMode: boolean;
  setModalVisible: (v: boolean) => void;
  resetForm: () => void;
  t: TranslationFn;
}

export function handleSave(options: HandleSaveOptions): void {
  const { formData, selectedType, editMode, setModalVisible, resetForm, t } = options;
  if (!formData.name.trim()) {
    Alert.alert(t('common.error'), t('errors.pleaseEnterName'));
    return;
  }

  if (selectedType === HIERARCHY_FIELDS.UNION && !formData.parentDivision) {
    Alert.alert(t('common.error'), t('errors.pleaseSelectParentDivision'));
    return;
  }
  if (selectedType === HIERARCHY_FIELDS.ASSOCIATION && !formData.parentUnion) {
    Alert.alert(t('common.error'), t('errors.pleaseSelectParentUnion'));
    return;
  }
  if (selectedType === HIERARCHY_FIELDS.CHURCH && !formData.parentAssociation) {
    Alert.alert(t('common.error'), t('errors.pleaseSelectParentAssociation'));
    return;
  }

  const typeLabel = getTypeLabel(selectedType, t);
  Alert.alert(
    t('common.success'),
    editMode
      ? t('screens.organizationManagement.typeUpdated', { type: typeLabel, name: formData.name })
      : t('screens.organizationManagement.typeCreated', { type: typeLabel, name: formData.name }),
    [
      {
        text: t('common.ok'),
        onPress: (): void => {
          setModalVisible(false);
          resetForm();
        },
      },
    ]
  );
}

export function handleDelete(org: OrganizationItem, t: TranslationFn): void {
  const typeLabel = getTypeLabel(org.type, t);
  Alert.alert(
    t('screens.organizationManagement.deleteType', { type: typeLabel }),
    t('screens.organizationManagement.confirmDeleteMessage', {
      name: org.name,
      type: org.type,
      count: org.clubCount,
    }),
    [
      { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('common.delete'),
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: (): void => {
          Alert.alert(t('common.success'), t('success.organizationDeleted', { type: typeLabel }));
        },
      },
    ]
  );
}
