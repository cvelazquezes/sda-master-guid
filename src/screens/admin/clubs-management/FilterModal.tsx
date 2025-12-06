import React from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { designTokens } from '../../../shared/theme';
import { ANIMATION, ICONS, HIERARCHY_FIELDS } from '../../../shared/constants';
import { modalStyles, filterStyles, buttonStyles } from './styles';
import { ClubFilters } from './types';
import { HierarchyFilterItem } from './HierarchyFilterItem';
import { StatusFilterSection } from './StatusFilterSection';

interface FilterModalProps {
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
}

interface HierarchyFiltersProps {
  filters: ClubFilters;
  onUpdateFilter: (f: string, v: string) => void;
  availableDivisions: string[];
  availableUnions: string[];
  availableAssociations: string[];
  availableChurches: string[];
  colors: { primary: string; success: string };
  t: (key: string) => string;
}

function HierarchyFilters({
  filters,
  onUpdateFilter,
  availableDivisions,
  availableUnions,
  availableAssociations,
  availableChurches,
  colors,
  t,
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
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.DIVISION, v)}
        colors={colors}
      />
      <HierarchyFilterItem
        icon={ICONS.DOMAIN}
        label={t('components.organizationHierarchy.levels.union')}
        values={availableUnions}
        selectedValue={filters.union}
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.UNION, v)}
        colors={colors}
      />
      <HierarchyFilterItem
        icon={ICONS.OFFICE_BUILDING}
        label={t('components.organizationHierarchy.levels.association')}
        values={availableAssociations}
        selectedValue={filters.association}
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.ASSOCIATION, v)}
        colors={colors}
      />
      <HierarchyFilterItem
        icon={ICONS.CHURCH}
        label={t('components.organizationHierarchy.levels.church')}
        values={availableChurches}
        selectedValue={filters.church}
        onSelect={(v): void => onUpdateFilter(HIERARCHY_FIELDS.CHURCH, v)}
        colors={colors}
      />
    </View>
  );
}

function InfoBanner({ color }: { color: string }): React.JSX.Element {
  return (
    <View style={[filterStyles.infoBanner, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons
        name={ICONS.INFORMATION}
        size={designTokens.iconSize.sm}
        color={color}
      />
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
  const anim = isMobile ? ANIMATION.SLIDE : ANIMATION.FADE;
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
  };

  return (
    <Modal visible={visible} animationType={anim} transparent onRequestClose={onClose}>
      <View style={overlayStyle}>
        <View style={contentStyle}>
          {isMobile && (
            <View style={[modalStyles.dragHandle, { backgroundColor: colors.borderLight }]} />
          )}
          <ModalHeader colors={colors} t={t} onClose={onClose} />
          <ScrollView style={modalStyles.body}>
            <InfoBanner color={colors.primary} />
            <HierarchyFilters {...hProps} />
            <StatusFilterSection
              currentStatus={filters.status}
              onSelectStatus={onUpdateFilter}
              colors={colors}
              t={t}
            />
          </ScrollView>
          <ModalFooter colors={colors} t={t} onClear={onClearFilters} onClose={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function ModalHeader({
  colors,
  t,
  onClose,
}: {
  colors: { borderLight: string; textPrimary: string; textSecondary: string };
  t: (key: string) => string;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <View style={[modalStyles.header, { borderBottomColor: colors.borderLight }]}>
      <Text style={[modalStyles.title, { color: colors.textPrimary }]}>
        {t('screens.clubsManagement.filterClubs')}
      </Text>
      <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={designTokens.iconSize.lg}
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
}: {
  colors: { textSecondary: string };
  t: (key: string) => string;
  onClear: () => void;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity style={buttonStyles.clear} onPress={onClear}>
        <MaterialCommunityIcons
          name={ICONS.FILTER_OFF}
          size={designTokens.iconSize.md}
          color={colors.textSecondary}
        />
        <Text style={buttonStyles.clearText}>{t('screens.clubsManagement.clearAll')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={buttonStyles.apply} onPress={onClose}>
        <Text style={buttonStyles.applyText}>{t('screens.clubsManagement.applyFilters')}</Text>
      </TouchableOpacity>
    </View>
  );
}
