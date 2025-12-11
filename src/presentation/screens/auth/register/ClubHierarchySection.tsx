import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ClubPicker } from './ClubPicker';
import { HierarchyPicker } from './HierarchyPicker';
import { createSectionStyles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { Club } from '../../../../types';

type SectionStylesType = ReturnType<typeof createSectionStyles>;

type ClubHierarchySectionProps = {
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
};

// Section header
function SectionHeaderRow({
  title,
  sectionStyles,
}: {
  title: string;
  sectionStyles: SectionStylesType;
}): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={sectionStyles.header}>
      <MaterialCommunityIcons name={ICONS.SITEMAP} size={iconSizes.md} color={colors.primary} />
      <Text style={sectionStyles.title}>{title}</Text>
    </View>
  );
}

export function ClubHierarchySection(props: ClubHierarchySectionProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useTheme();

  const sectionStyles = useMemo(
    () => createSectionStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

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
      <SectionHeaderRow title={sectionTitle} sectionStyles={sectionStyles} />
      <Text style={sectionStyles.description}>{description}</Text>
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
