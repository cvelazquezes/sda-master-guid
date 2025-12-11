import React, { useMemo } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HierarchyFilterItem } from './HierarchyFilterItem';
import { StatusFilterSection } from './StatusFilterSection';
import { createModalStyles, createFilterStyles, createButtonStyles } from './styles';
import { ANIMATION_TYPE, ICONS, HIERARCHY_FIELDS } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { ClubFilters } from './types';

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  isMobile: boolean;
  filters: ClubFilters;
  onUpdateFilter: (field: string, value: string) => void;
  onClearFilters: () => void;
  availableDivisions: string[];
  availableUnions: string[];
  availableAssociations: string[];
  availableChurches: string[];
  colors: {
    backdrop: string;
    surface: string;
    borderLight: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    success: string;
    error: string;
  };
  t: (key: string) => string;
};

type HierarchyFiltersProps = {
  filters: ClubFilters;
  onUpdateFilter: (f: string, v: string) => void;
  availableDivisions: string[];
  availableUnions: string[];
  availableAssociations: string[];
  availableChurches: string[];
  colors: { primary: string; success: string };
  t: (key: string) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
};

function HierarchyFilters({
  filters,
  onUpdateFilter,
  availableDivisions,
  availableUnions,
  availableAssociations,
  availableChurches,
  colors,
  t,
  filterStyles,
}: HierarchyFiltersProps): React.JSX.Element {
  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t('screens.clubsManagement.organizationSection')}
      </Text>
      <HierarchyFilterItem
        icon={ICONS.EARTH}
        label={t('components.organizationHierarchy.levels.division')}
        values={availableDivisions}
        selectedValue={filters.division}
        colors={colors}
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.DIVISION, v)}
      />
      <HierarchyFilterItem
        icon={ICONS.DOMAIN}
        label={t('components.organizationHierarchy.levels.union')}
        values={availableUnions}
        selectedValue={filters.union}
        colors={colors}
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.UNION, v)}
      />
      <HierarchyFilterItem
        icon={ICONS.OFFICE_BUILDING}
        label={t('components.organizationHierarchy.levels.association')}
        values={availableAssociations}
        selectedValue={filters.association}
        colors={colors}
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.ASSOCIATION, v)}
      />
      <HierarchyFilterItem
        icon={ICONS.CHURCH}
        label={t('components.organizationHierarchy.levels.church')}
        values={availableChurches}
        selectedValue={filters.church}
        colors={colors}
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.CHURCH, v)}
      />
    </View>
  );
}

function InfoBanner({
  color,
  filterStyles,
}: {
  color: string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[filterStyles.infoBanner, { backgroundColor: `${color}20` }]}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.sm} color={color} />
    </View>
  );
}

export function FilterModal({
  visible,
  onClose,
  isMobile,
  filters,
  onUpdateFilter,
  onClearFilters,
  availableDivisions,
  availableUnions,
  availableAssociations,
  availableChurches,
  colors,
  t,
}: FilterModalProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const modalStyles = useMemo(
    () => createModalStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );
  const filterStyles = useMemo(
    () => createFilterStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );
  const buttonStyles = useMemo(
    () => createButtonStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const anim = isMobile ? ANIMATION_TYPE.SLIDE : ANIMATION_TYPE.FADE;
  const overlayStyle = [
    modalStyles.overlay,
    { backgroundColor: colors.backdrop },
    isMobile && modalStyles.overlayMobile,
  ];
  const contentStyle = [
    modalStyles.content,
    { backgroundColor: colors.surface },
    isMobile && modalStyles.contentMobile,
  ];
  const hProps = {
    filters,
    onUpdateFilter,
    availableDivisions,
    availableUnions,
    availableAssociations,
    availableChurches,
    colors,
    t,
    filterStyles,
  };

  return (
    <Modal
      transparent
      accessibilityViewIsModal
      visible={visible}
      animationType={anim}
      onRequestClose={onClose}
    >
      <View style={overlayStyle}>
        <View style={contentStyle}>
          {isMobile && (
            <View style={[modalStyles.dragHandle, { backgroundColor: colors.borderLight }]} />
          )}
          <ModalHeader colors={colors} t={t} modalStyles={modalStyles} onClose={onClose} />
          <ScrollView style={modalStyles.body}>
            <InfoBanner color={colors.primary} filterStyles={filterStyles} />
            <HierarchyFilters {...hProps} />
            <StatusFilterSection
              currentStatus={filters.status}
              colors={colors}
              t={t}
              onSelectStatus={onUpdateFilter}
            />
          </ScrollView>
          <ModalFooter
            colors={colors}
            t={t}
            modalStyles={modalStyles}
            buttonStyles={buttonStyles}
            onClear={onClearFilters}
            onClose={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

function ModalHeader({
  colors,
  t,
  onClose,
  modalStyles,
}: {
  colors: { borderLight: string; textPrimary: string; textSecondary: string };
  t: (key: string) => string;
  onClose: () => void;
  modalStyles: ReturnType<typeof createModalStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[modalStyles.header, { borderBottomColor: colors.borderLight }]}>
      <Text style={[modalStyles.title, { color: colors.textPrimary }]}>
        {t('screens.clubsManagement.filterClubs')}
      </Text>
      <TouchableOpacity
        style={modalStyles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="Close modal"
        onPress={onClose}
      >
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={iconSizes.lg}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

function ModalFooter({
  colors,
  t,
  onClear,
  onClose,
  modalStyles,
  buttonStyles,
}: {
  colors: { textSecondary: string };
  t: (key: string) => string;
  onClear: () => void;
  onClose: () => void;
  modalStyles: ReturnType<typeof createModalStyles>;
  buttonStyles: ReturnType<typeof createButtonStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity
        style={buttonStyles.clear}
        accessibilityRole="button"
        accessibilityLabel="Clear all filters"
        onPress={onClear}
      >
        <MaterialCommunityIcons
          name={ICONS.FILTER_OFF}
          size={iconSizes.md}
          color={colors.textSecondary}
        />
        <Text style={buttonStyles.clearText}>{t('screens.clubsManagement.clearAll')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={buttonStyles.apply}
        accessibilityRole="button"
        accessibilityLabel="Apply filters"
        onPress={onClose}
      >
        <Text style={buttonStyles.applyText}>{t('screens.clubsManagement.applyFilters')}</Text>
      </TouchableOpacity>
    </View>
  );
}
