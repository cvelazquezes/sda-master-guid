import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createSectionStyles, createClassSelectionStyles } from './styles';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS, LIST_SEPARATOR } from '../../../../shared/constants';
import type { PathfinderClass } from '../../../../types';

type ClassSelectionSectionProps = {
  selectedClasses: PathfinderClass[];
  onOpenModal: () => void;
  sectionTitle: string;
  description: string;
  selectText: string;
  selectedText: string;
};

export function ClassSelectionSection({
  selectedClasses,
  onOpenModal,
  sectionTitle,
  description,
  selectText,
  selectedText,
}: ClassSelectionSectionProps): React.JSX.Element {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();

  const sectionStyles = useMemo(
    () => createSectionStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const classSelectionStyles = useMemo(
    () => createClassSelectionStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  const displayText =
    selectedClasses.length > 0
      ? `${selectedText}: ${selectedClasses.join(LIST_SEPARATOR)}`
      : selectText;

  return (
    <>
      <View style={sectionStyles.header}>
        <MaterialCommunityIcons name={ICONS.SCHOOL} size={iconSizes.md} color={colors.primary} />
        <Text style={sectionStyles.title}>{sectionTitle}</Text>
      </View>
      <Text style={sectionStyles.description}>{description}</Text>
      <TouchableOpacity style={classSelectionStyles.button} onPress={onOpenModal}>
        <View style={classSelectionStyles.buttonContent}>
          <MaterialCommunityIcons name={ICONS.SCHOOL} size={iconSizes.md} color={colors.primary} />
          <Text style={classSelectionStyles.buttonText}>{displayText}</Text>
        </View>
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_RIGHT}
          size={iconSizes.lg}
          color={colors.primary}
        />
      </TouchableOpacity>
    </>
  );
}
