import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS, TEXT_LINES } from '../../../../shared/constants';
import { styles } from './styles';

interface ClubHierarchyProps {
  church?: string;
  association?: string;
  isActive: boolean;
  primaryColor: string;
  textColor: string;
}

export const ClubHierarchy: React.FC<ClubHierarchyProps> = ({
  church,
  association,
  isActive,
  primaryColor,
  textColor,
}) => {
  const { iconSizes } = useTheme();

  if (!church && !association) {
    return null;
  }

  const iconColor = isActive ? primaryColor : textColor;

  return (
    <View style={styles.hierarchyContainer}>
      {church && (
        <View style={styles.hierarchyItem}>
          <MaterialCommunityIcons name={ICONS.CHURCH} size={iconSizes.xs} color={iconColor} />
          <Text
            style={[styles.hierarchyText, { color: textColor }]}
            numberOfLines={TEXT_LINES.single}
          >
            {church}
          </Text>
        </View>
      )}
      {association && (
        <View style={styles.hierarchyItem}>
          <MaterialCommunityIcons
            name={ICONS.OFFICE_BUILDING}
            size={iconSizes.xs}
            color={iconColor}
          />
          <Text
            style={[styles.hierarchyText, { color: textColor }]}
            numberOfLines={TEXT_LINES.single}
          >
            {association}
          </Text>
        </View>
      )}
    </View>
  );
};
