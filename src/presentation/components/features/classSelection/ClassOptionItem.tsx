import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { useTheme } from '../../../state/ThemeContext';
import { Text } from '../../primitives';
import type { ThemeColors } from './types';
import type { PathfinderClass } from '../../../../types';

type ClassOptionItemProps = {
  pathfinderClass: PathfinderClass;
  isSelected: boolean;
  selectionIndex: number;
  onToggle: (pathfinderClass: PathfinderClass) => void;
  colors: ThemeColors;
};

export const ClassOptionItem: React.FC<ClassOptionItemProps> = ({
  pathfinderClass,
  isSelected,
  selectionIndex,
  onToggle,
  colors,
}) => {
  const { iconSizes } = useTheme();

  const optionStyle = [
    styles.classOption,
    { backgroundColor: colors.surfaceLight },
    isSelected && { backgroundColor: colors.primaryAlpha20, borderColor: colors.primary },
  ];

  const checkboxStyle = [
    styles.checkbox,
    { borderColor: colors.textTertiary },
    isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
  ];

  return (
    <TouchableOpacity
      style={optionStyle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={pathfinderClass}
      onPress={() => onToggle(pathfinderClass)}
    >
      <View style={styles.classOptionContent}>
        <View style={checkboxStyle}>
          {isSelected && (
            <MaterialCommunityIcons
              name={ICONS.CHECK}
              size={iconSizes.sm}
              color={colors.textInverse}
            />
          )}
        </View>
        <Text
          style={[
            styles.classOptionText,
            { color: colors.textPrimary },
            isSelected && { fontWeight: '600' },
          ]}
        >
          {pathfinderClass}
        </Text>
      </View>
      {isSelected && (
        <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.selectedBadgeText, { color: colors.textInverse }]}>
            {selectionIndex + 1}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
