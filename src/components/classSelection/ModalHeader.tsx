import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { useTheme } from '../../contexts/ThemeContext';
import { A11Y_ROLE, ICONS } from '../../shared/constants';
import { ThemeColors } from './types';
import { styles } from './styles';

interface ModalHeaderProps {
  onClose: () => void;
  colors: ThemeColors;
}

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
        onPress={onClose}
        style={styles.closeButton}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('accessibility.closeModal')}
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
