import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { designTokens } from '../../shared/theme';
import { A11Y_ROLE, ICONS } from '../../shared/constants';
import { styles } from './styles';

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ onCancel, onSave }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <MaterialCommunityIcons
          name={ICONS.CHECK}
          size={designTokens.iconSize.md}
          color={designTokens.colors.textInverse}
        />
        <Text style={styles.saveButtonText}>{t('common.save')}</Text>
      </TouchableOpacity>
    </View>
  );
};
