import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { designTokens } from '../../shared/theme';
import { styles } from './styles';

interface HierarchyItemProps {
  icon: string;
  labelKey: string;
  badgeKey: string;
  value: string;
}

export const HierarchyItem: React.FC<HierarchyItemProps> = ({
  icon,
  labelKey,
  badgeKey,
  value,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.hierarchyItem}>
      <View style={styles.levelContainer}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={designTokens.iconSize.sm}
          color={designTokens.colors.textSecondary}
        />
        <Text style={styles.levelLabel}>{t(labelKey)}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{t(badgeKey)}</Text>
        </View>
      </View>
      <Text style={styles.hierarchyValue}>{value}</Text>
    </View>
  );
};
