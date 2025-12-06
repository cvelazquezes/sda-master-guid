import React from 'react';
import { View } from 'react-native';
import { HierarchyData } from './types';
import { HierarchyItem } from './HierarchyItem';
import { HIERARCHY_LEVELS } from './config';
import { styles } from './styles';

interface ExpandedViewProps {
  data: HierarchyData;
}

export const ExpandedView: React.FC<ExpandedViewProps> = ({ data }) => {
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
            />
          )
      )}
    </View>
  );
};
