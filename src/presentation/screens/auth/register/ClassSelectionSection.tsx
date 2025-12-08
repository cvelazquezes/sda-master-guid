import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { PathfinderClass } from '../../../../types';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../../theme';
import { ICONS, LIST_SEPARATOR, FLEX } from '../../../../shared/constants';

interface ClassSelectionSectionProps {
  selectedClasses: PathfinderClass[];
  onOpenModal: () => void;
  sectionTitle: string;
  description: string;
  selectText: string;
  selectedText: string;
}

export function ClassSelectionSection({
  selectedClasses,
  onOpenModal,
  sectionTitle,
  description,
  selectText,
  selectedText,
}: ClassSelectionSectionProps): React.JSX.Element {
  const displayText =
    selectedClasses.length > 0
      ? `${selectedText}: ${selectedClasses.join(LIST_SEPARATOR)}`
      : selectText;

  return (
    <>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons
          name={ICONS.SCHOOL}
          size={mobileIconSizes.medium}
          color={designTokens.colors.primary}
        />
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={onOpenModal}>
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name={ICONS.SCHOOL}
            size={mobileIconSizes.medium}
            color={designTokens.colors.primary}
          />
          <Text style={styles.buttonText}>{displayText}</Text>
        </View>
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_RIGHT}
          size={mobileIconSizes.large}
          color={designTokens.colors.primary}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    color: designTokens.colors.primary,
  },
  description: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
    marginTop: -designTokens.spacing.sm,
  },
  button: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.inputBackground,
  },
  buttonContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
    flex: FLEX.ONE,
  },
  buttonText: {
    ...mobileTypography.bodyLarge,
    flex: FLEX.ONE,
  },
});
