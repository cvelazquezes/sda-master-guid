import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { CLASS_SELECTION, ICONS } from '../../../../shared/constants';
import { useTheme } from '../../../state/ThemeContext';
import { Text } from '../../primitives';
import type { ThemeColors } from './types';

type InfoCardProps = {
  selectedCount: number;
  colors: ThemeColors;
};

export const InfoCard: React.FC<InfoCardProps> = ({ selectedCount, colors }) => {
  const { t } = useTranslation();
  const { iconSizes } = useTheme();

  return (
    <View style={[styles.infoCard, { backgroundColor: colors.primaryAlpha20 }]}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.md} color={colors.primary} />
      <Text style={[styles.infoText, { color: colors.textPrimary }]}>
        {t('classes.classInfo')} {selectedCount}/{CLASS_SELECTION.MAX}
      </Text>
    </View>
  );
};
