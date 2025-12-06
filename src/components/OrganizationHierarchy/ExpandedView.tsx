import React from 'react';
import { View } from 'react-native';
import { HierarchyData, ThemeColors } from './types';
import { HierarchyItem } from './HierarchyItem';
import { HIERARCHY_LEVELS } from './config';
import { styles } from './styles';

interface ExpandedViewProps {
  data: HierarchyData;
  colors: ThemeColors;
}

export const ExpandedView: React.FC<ExpandedViewProps> = ({ data, colors }) => {
  return (
    <View style={styles.content}>
      {HIERARCHY_LEVELS.map(
        (level) =>
          data[level.key] && (
            <HierarchyItem
              key={level.key}
              icon={level.icon}
              labelKey={level.labelKey}
              badgeKey={level.badgeKey}
              value={data[level.key] as string}
              colors={colors}
            />
          )
      )}
    </View>
  );
};
