import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { Club } from '../../../types';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../../shared/theme';
import { ICONS, dimensionValues, flexValues } from '../../../shared/constants';

interface ClubPickerProps {
  label: string;
  clubs: Club[];
  selectedClubId: string;
  onSelect: (clubId: string) => void;
}

export function ClubPicker({
  label,
  clubs,
  selectedClubId,
  onSelect,
}: ClubPickerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView style={styles.clubsList}>
        {clubs.map((club) => {
          const isSelected = selectedClubId === club.id;
          const iconName = isSelected ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK;
          const iconColor = isSelected
            ? designTokens.colors.primary
            : designTokens.colors.textSecondary;
          return (
            <TouchableOpacity
              key={club.id}
              style={[styles.clubOption, isSelected && styles.clubOptionSelected]}
              onPress={() => onSelect(club.id)}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={mobileIconSizes.medium}
                color={iconColor}
              />
              <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubDescription}>{club.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.md,
  },
  label: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: designTokens.spacing.md,
  },
  clubsList: {
    maxHeight: dimensionValues.maxHeight.listMedium,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderMedium,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  clubOption: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  clubOptionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
  },
  clubInfo: {
    marginLeft: designTokens.spacing.md,
    flex: flexValues.one,
  },
  clubName: {
    ...mobileTypography.bodyLargeBold,
  },
  clubDescription: {
    ...mobileTypography.bodySmall,
    marginTop: designTokens.spacing.xs,
  },
});
