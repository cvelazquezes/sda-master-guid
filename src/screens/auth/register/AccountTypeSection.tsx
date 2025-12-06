import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../../shared/theme';
import { ICONS, flexValues } from '../../../shared/constants';

interface AccountTypeSectionProps {
  isClubAdmin: boolean;
  onToggle: () => void;
  sectionTitle: string;
  checkboxLabel: string;
  infoText: string;
}

export function AccountTypeSection({
  isClubAdmin,
  onToggle,
  sectionTitle,
  checkboxLabel,
  infoText,
}: AccountTypeSectionProps): React.JSX.Element {
  const checkboxIcon = isClubAdmin ? ICONS.CHECKBOX_MARKED : ICONS.CHECKBOX_BLANK_OUTLINE;

  return (
    <>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_COG}
          size={mobileIconSizes.medium}
          color={designTokens.colors.primary}
        />
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      </View>
      <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
        <MaterialCommunityIcons
          name={checkboxIcon}
          size={mobileIconSizes.large}
          color={designTokens.colors.primary}
        />
        <Text style={styles.checkboxLabel}>{checkboxLabel}</Text>
      </TouchableOpacity>
      {isClubAdmin && (
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name={ICONS.INFORMATION}
            size={mobileIconSizes.medium}
            color={designTokens.colors.info}
          />
          <Text style={styles.infoText}>{infoText}</Text>
        </View>
      )}
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
  checkboxContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
  },
  checkboxLabel: {
    ...mobileTypography.bodyLarge,
    marginLeft: designTokens.spacing.md,
    color: designTokens.colors.textPrimary,
  },
  infoBox: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.infoLight,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  infoText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.info,
    flex: flexValues.one,
  },
});
