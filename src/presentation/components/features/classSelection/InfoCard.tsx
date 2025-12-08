import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../primitives';
import { useTheme } from '../../../state/ThemeContext';
import { CLASS_SELECTION, ICONS } from '../../../../shared/constants';
import { ThemeColors } from './types';
import { styles } from './styles';

interface InfoCardProps {
  selectedCount: number;
  colors: ThemeColors;
}

export const InfoCard: React.FC<InfoCardProps> = ({ selectedCount, colors }) => {
  const { t } = useTranslation();
  const { iconSizes } = useTheme();

  return (
    <View style={[styles.infoCard, { backgroundColor: colors.primaryLight }]}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.md} color={colors.primary} />
      <Text style={[styles.infoText, { color: colors.primary }]}>
        {t('classes.classInfo')} {selectedCount}/{CLASS_SELECTION.MAX}
      </Text>
    </View>
  );
};
