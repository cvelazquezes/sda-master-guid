import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ThemeColors } from './types';
import { styles } from './styles';

interface HierarchyItemProps {
  icon: string;
  labelKey: string;
  badgeKey: string;
  value: string;
  colors: ThemeColors;
}

export const HierarchyItem: React.FC<HierarchyItemProps> = ({
  icon,
  labelKey,
  badgeKey,
  value,
  colors,
}) => {
  const { t } = useTranslation();
  const { iconSizes } = useTheme();

  return (
    <View style={styles.hierarchyItem}>
      <View style={styles.levelContainer}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={iconSizes.sm}
          color={colors.textSecondary}
        />
        <Text style={[styles.levelLabel, { color: colors.textPrimary }]}>{t(labelKey)}</Text>
        <View style={[styles.levelBadge, { backgroundColor: colors.infoLight }]}>
          <Text style={[styles.levelBadgeText, { color: colors.info }]}>{t(badgeKey)}</Text>
        </View>
      </View>
      <Text style={[styles.hierarchyValue, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
};
