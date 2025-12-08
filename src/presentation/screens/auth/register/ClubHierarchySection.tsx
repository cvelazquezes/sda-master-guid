import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { Club } from '../../../../types';
import { HierarchyPicker } from './HierarchyPicker';
import { ClubPicker } from './ClubPicker';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../../theme';
import { ICONS } from '../../../../shared/constants';

interface ClubHierarchySectionProps {
  sectionTitle: string;
  description: string;
  labels: {
    division: string;
    union: string;
    association: string;
    church: string;
    club: string;
  };
  hierarchy: {
    division: string;
    union: string;
    association: string;
    church: string;
    clubId: string;
  };
  divisions: string[];
  unions: string[];
  associations: string[];
  churches: string[];
  filteredClubs: Club[];
  onDivisionChange: (v: string) => void;
  onUnionChange: (v: string) => void;
  onAssociationChange: (v: string) => void;
  onChurchChange: (v: string) => void;
  onClubSelect: (id: string) => void;
}

// Section header
function SectionHeaderRow({ title }: { title: string }): React.JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons
        name={ICONS.SITEMAP}
        size={mobileIconSizes.medium}
        color={designTokens.colors.primary}
      />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function ClubHierarchySection(props: ClubHierarchySectionProps): React.JSX.Element {
  const {
    sectionTitle,
    description,
    labels,
    hierarchy,
    divisions,
    unions,
    associations,
    churches,
    filteredClubs,
  } = props;
  const { onDivisionChange, onUnionChange, onAssociationChange, onChurchChange, onClubSelect } =
    props;

  return (
    <>
      <SectionHeaderRow title={sectionTitle} />
      <Text style={styles.description}>{description}</Text>
      <HierarchyPicker
        label={labels.division}
        options={divisions}
        selectedValue={hierarchy.division}
        onSelect={onDivisionChange}
      />
      {hierarchy.division && (
        <HierarchyPicker
          label={labels.union}
          options={unions}
          selectedValue={hierarchy.union}
          onSelect={onUnionChange}
        />
      )}
      {hierarchy.union && (
        <HierarchyPicker
          label={labels.association}
          options={associations}
          selectedValue={hierarchy.association}
          onSelect={onAssociationChange}
        />
      )}
      {hierarchy.association && (
        <HierarchyPicker
          label={labels.church}
          options={churches}
          selectedValue={hierarchy.church}
          onSelect={onChurchChange}
        />
      )}
      {hierarchy.church && filteredClubs.length > 0 && (
        <ClubPicker
          label={labels.club}
          clubs={filteredClubs}
          selectedClubId={hierarchy.clubId}
          onSelect={onClubSelect}
        />
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
  description: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
    marginTop: -designTokens.spacing.sm,
  },
});
