import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../shared/components';
import { designTokens } from '../../shared/theme';
import { ICONS, TEXT_LINES } from '../../shared/constants';
import { HierarchyData, ThemeColors } from './types';
import { styles } from './styles';

interface CompactViewProps {
  data: HierarchyData;
  colors: ThemeColors;
}

const COMPACT_ITEMS: { key: keyof HierarchyData; icon: string }[] = [
  { key: 'division', icon: ICONS.EARTH },
  { key: 'church', icon: ICONS.CHURCH },
  { key: 'clubName', icon: ICONS.ACCOUNT_GROUP },
];

export const CompactView: React.FC<CompactViewProps> = ({ data, colors }) => {
  return (
    <View style={styles.compactContainer}>
      {COMPACT_ITEMS.map(
        ({ key, icon }) =>
          data[key] && (
            <View key={key} style={[styles.compactItem, { backgroundColor: colors.surfaceLight }]}>
              <MaterialCommunityIcons
                name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={designTokens.iconSize.xs}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.compactText, { color: colors.textSecondary }]}
                numberOfLines={TEXT_LINES.single}
              >
                {data[key]}
              </Text>
            </View>
          )
      )}
    </View>
  );
};
