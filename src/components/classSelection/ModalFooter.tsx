import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { useTheme } from '../../contexts/ThemeContext';
import { A11Y_ROLE, ICONS } from '../../shared/constants';
import { ThemeColors } from './types';
import { styles } from './styles';

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  colors: ThemeColors;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ onCancel, onSave, colors }) => {
  const { t } = useTranslation();
  const { iconSizes } = useTheme();

  return (
    <View style={[styles.footer, { borderTopColor: colors.border }]}>
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: colors.surfaceLight }]}
        onPress={onCancel}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
          {t('common.cancel')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={onSave}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={colors.textInverse} />
        <Text style={[styles.saveButtonText, { color: colors.textInverse }]}>
          {t('common.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
