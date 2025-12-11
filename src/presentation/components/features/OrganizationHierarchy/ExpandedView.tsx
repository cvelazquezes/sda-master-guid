import React from 'react';
import { View } from 'react-native';
import { HIERARCHY_LEVELS } from './config';
import { HierarchyItem } from './HierarchyItem';
import { styles } from './styles';
import type { HierarchyData, ThemeColors } from './types';

type ExpandedViewProps = {
  data: HierarchyData;
  colors: ThemeColors;
};

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
