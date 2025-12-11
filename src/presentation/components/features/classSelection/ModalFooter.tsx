import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { A11Y_ROLE, ICONS } from '../../../../shared/constants';
import { useTheme } from '../../../state/ThemeContext';
import { Text } from '../../primitives';
import type { ThemeColors } from './types';

type ModalFooterProps = {
  onCancel: () => void;
  onSave: () => void;
  colors: ThemeColors;
};

export const ModalFooter: React.FC<ModalFooterProps> = ({ onCancel, onSave, colors }) => {
  const { t } = useTranslation();
  const { iconSizes } = useTheme();

  return (
    <View style={[styles.footer, { borderTopColor: colors.border }]}>
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: colors.surfaceLight }]}
        accessibilityRole={A11Y_ROLE.BUTTON}
        onPress={onCancel}
      >
        <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
          {t('common.cancel')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        accessibilityRole={A11Y_ROLE.BUTTON}
        onPress={onSave}
      >
        <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={colors.textInverse} />
        <Text style={[styles.saveButtonText, { color: colors.textInverse }]}>
          {t('common.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
