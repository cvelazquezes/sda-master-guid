import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../shared/components';
import { PathfinderClass } from '../../types';
import { designTokens } from '../../shared/theme';
import { ICONS } from '../../shared/constants';
import { styles } from './styles';

interface ClassOptionItemProps {
  pathfinderClass: PathfinderClass;
  isSelected: boolean;
  selectionIndex: number;
  onToggle: (pathfinderClass: PathfinderClass) => void;
}

export const ClassOptionItem: React.FC<ClassOptionItemProps> = ({
  pathfinderClass,
  isSelected,
  selectionIndex,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.classOption, isSelected && styles.classOptionSelected]}
      onPress={() => onToggle(pathfinderClass)}
    >
      <View style={styles.classOptionContent}>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <MaterialCommunityIcons
              name={ICONS.CHECK}
              size={designTokens.iconSize.sm}
              color={designTokens.colors.textInverse}
            />
          )}
        </View>
        <Text style={[styles.classOptionText, isSelected && styles.classOptionTextSelected]}>
          {pathfinderClass}
        </Text>
      </View>
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>{selectionIndex + 1}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
