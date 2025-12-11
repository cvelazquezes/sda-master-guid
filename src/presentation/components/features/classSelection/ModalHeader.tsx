import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { A11Y_ROLE, ICONS } from '../../../../shared/constants';
import { useTheme } from '../../../state/ThemeContext';
import { Text } from '../../primitives';
import type { ThemeColors } from './types';

type ModalHeaderProps = {
  onClose: () => void;
  colors: ThemeColors;
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose, colors }) => {
  const { t } = useTranslation();
  const { iconSizes } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.headerLeft}>
        <MaterialCommunityIcons name={ICONS.SCHOOL} size={iconSizes.lg} color={colors.primary} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('classes.selectClasses')}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('accessibility.closeModal')}
        onPress={onClose}
      >
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={iconSizes.lg}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};
