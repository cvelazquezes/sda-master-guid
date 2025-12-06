import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../shared/components';
import { designTokens } from '../../shared/theme';
import { ICONS, TEXT_LINES } from '../../shared/constants';
import { HierarchyData } from './types';
import { styles } from './styles';

interface CompactViewProps {
  data: HierarchyData;
}

const COMPACT_ITEMS: { key: keyof HierarchyData; icon: string }[] = [
  { key: 'division', icon: ICONS.EARTH },
  { key: 'church', icon: ICONS.CHURCH },
  { key: 'clubName', icon: ICONS.ACCOUNT_GROUP },
];

export const CompactView: React.FC<CompactViewProps> = ({ data }) => {
  return (
    <View style={styles.compactContainer}>
      {COMPACT_ITEMS.map(
        ({ key, icon }) =>
          data[key] && (
            <View key={key} style={styles.compactItem}>
              <MaterialCommunityIcons
                name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={designTokens.iconSize.xs}
                color={designTokens.colors.textSecondary}
              />
              <Text style={styles.compactText} numberOfLines={TEXT_LINES.single}>
                {data[key]}
              </Text>
            </View>
          )
      )}
    </View>
  );
};
