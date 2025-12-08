import React, { useMemo } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Club, UserRole, UserStatus } from '../../../../types';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import {
  ANIMATION_TYPE,
  ICONS,
  FILTER_STATUS,
  HIERARCHY_FIELDS,
  EMPTY_VALUE,
} from '../../../../shared/constants';
import { createModalStyles, createFilterStyles, createButtonStyles } from './styles';
import { UserFilters } from './types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  isMobile: boolean;
  filters: UserFilters;
  onUpdateFilter: (field: string, value: string) => void;
  onClearFilters: () => void;
  availableDivisions: string[];
  availableUnions: string[];
  availableAssociations: string[];
  availableChurches: string[];
  availableClubs: Club[];
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
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
  availableClubs,
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
  const onClear = (): void => {
    onClearFilters();
    onClose();
  };

  return (
    <Modal visible={visible} animationType={anim} transparent onRequestClose={onClose}>
      <View style={overlayStyle}>
        <View style={contentStyle}>
          {isMobile && (
            <View style={[modalStyles.dragHandle, { backgroundColor: colors.borderLight }]} />
          )}
          <ModalHeader colors={colors} t={t} onClose={onClose} modalStyles={modalStyles} />
          <ScrollView style={modalStyles.body}>
            <InfoBanner colors={colors} t={t} filterStyles={filterStyles} />
            <OrgSection
              filters={filters}
              onUpdate={onUpdateFilter}
              divisions={availableDivisions}
              unions={availableUnions}
              associations={availableAssociations}
              churches={availableChurches}
              clubs={availableClubs}
              colors={colors}
              t={t}
              filterStyles={filterStyles}
            />
            <RoleSection
              filters={filters}
              onUpdate={onUpdateFilter}
              colors={colors}
              t={t}
              filterStyles={filterStyles}
            />
            <StatusSection
              filters={filters}
              onUpdate={onUpdateFilter}
              colors={colors}
              t={t}
              filterStyles={filterStyles}
            />
          </ScrollView>
          <ModalFooter
            colors={colors}
            t={t}
            onClear={onClear}
            onClose={onClose}
            modalStyles={modalStyles}
            buttonStyles={buttonStyles}
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
  colors: Record<string, string>;
  t: (key: string) => string;
  onClose: () => void;
  modalStyles: ReturnType<typeof createModalStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[modalStyles.header, { borderBottomColor: colors.border }]}>
      <Text style={[modalStyles.title, { color: colors.textPrimary }]}>
        {t('screens.usersManagement.filterUsers')}
      </Text>
      <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={iconSizes.lg}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

function InfoBanner({
  colors,
  t,
  filterStyles,
}: {
  colors: Record<string, string>;
  t: (key: string) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={filterStyles.infoBanner}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.sm} color={colors.primary} />
      <Text style={filterStyles.infoText}>
        {t('screens.usersManagement.filterDescription')}
      </Text>
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
  colors: Record<string, string>;
  t: (key: string) => string;
  onClear: () => void;
  onClose: () => void;
  modalStyles: ReturnType<typeof createModalStyles>;
  buttonStyles: ReturnType<typeof createButtonStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity style={buttonStyles.clear} onPress={onClear}>
        <MaterialCommunityIcons
          name={ICONS.FILTER_OFF}
          size={iconSizes.md}
          color={colors.textSecondary}
        />
        <Text style={buttonStyles.clearText}>{t('screens.usersManagement.clearAll')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={buttonStyles.apply} onPress={onClose}>
        <Text style={buttonStyles.applyText}>{t('screens.usersManagement.applyFilters')}</Text>
      </TouchableOpacity>
    </View>
  );
}

interface OrgSectionProps {
  filters: UserFilters;
  onUpdate: (f: string, v: string) => void;
  divisions: string[];
  unions: string[];
  associations: string[];
  churches: string[];
  clubs: Club[];
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}

function OrgSection({
  filters,
  onUpdate,
  divisions,
  unions,
  associations,
  churches,
  clubs,
  colors,
  t,
  filterStyles,
}: OrgSectionProps): React.JSX.Element {
  const base = 'components.organizationHierarchy.levels';
  const hierarchies = [
    {
      items: divisions,
      field: HIERARCHY_FIELDS.DIVISION,
      icon: ICONS.EARTH,
      label: t(`${base}.division`),
    },
    { items: unions, field: HIERARCHY_FIELDS.UNION, icon: ICONS.DOMAIN, label: t(`${base}.union`) },
    {
      items: associations,
      field: HIERARCHY_FIELDS.ASSOCIATION,
      icon: ICONS.OFFICE_BUILDING,
      label: t(`${base}.association`),
    },
    {
      items: churches,
      field: HIERARCHY_FIELDS.CHURCH,
      icon: ICONS.CHURCH,
      label: t(`${base}.church`),
    },
  ];

  return (
    <View style={filterStyles.section}>
      <Text style={[filterStyles.sectionTitle, { color: colors.textPrimary }]}>
        {t('screens.usersManagement.organizationSection')}
      </Text>
      {hierarchies.map(
        ({ items, field, icon, label }) =>
          items.length > 0 && (
            <HierarchyOptions
              key={field}
              label={label}
              icon={icon}
              items={items}
              selected={filters[field as keyof UserFilters] as string}
              onSelect={(v): void => onUpdate(field, v)}
              colors={colors}
              filterStyles={filterStyles}
            />
          )
      )}
      {clubs.length > 0 && (
        <ClubsSection
          filters={filters}
          onUpdate={onUpdate}
          clubs={clubs}
          colors={colors}
          t={t}
          filterStyles={filterStyles}
        />
      )}
    </View>
  );
}

function ClubsSection({
  filters,
  onUpdate,
  clubs,
  colors,
  t,
  filterStyles,
}: {
  filters: UserFilters;
  onUpdate: (f: string, v: string) => void;
  clubs: Club[];
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const allLabel = t('screens.usersManagement.allClubsIn', { church: filters.church });
  const allActive = !filters.clubId;

  return (
    <View>
      <Text style={[filterStyles.label, { color: colors.textSecondary }]}>
        {t('screens.usersManagement.clubOptional')}
      </Text>
      <ClubOption
        label={allLabel}
        isActive={allActive}
        onPress={(): void => onUpdate(HIERARCHY_FIELDS.CLUB_ID, EMPTY_VALUE)}
        colors={colors}
        filterStyles={filterStyles}
      />
      {clubs.map((club) => (
        <ClubOption
          key={club.id}
          label={club.name}
          isActive={filters.clubId === club.id}
          isInactive={!club.isActive}
          inactiveLabel={t('screens.usersManagement.inactive')}
          onPress={(): void => onUpdate(HIERARCHY_FIELDS.CLUB_ID, club.id)}
          colors={colors}
          filterStyles={filterStyles}
        />
      ))}
    </View>
  );
}

function ClubOption({
  label,
  isActive,
  isInactive,
  inactiveLabel,
  onPress,
  colors,
  filterStyles,
}: {
  label: string;
  isActive: boolean;
  isInactive?: boolean;
  inactiveLabel?: string;
  onPress: () => void;
  colors: Record<string, string>;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <TouchableOpacity
      style={[filterStyles.option, isActive && filterStyles.optionActive]}
      onPress={onPress}
    >
      <View style={filterStyles.optionContent}>
        <Text style={[filterStyles.optionText, isActive && filterStyles.optionTextActive]}>
          {label}
        </Text>
        {isInactive && <Text style={filterStyles.clubInactiveLabel}>{inactiveLabel}</Text>}
      </View>
      {isActive && (
        <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}

interface HierarchyOptionsProps {
  label: string;
  icon: string;
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  colors: Record<string, string>;
  filterStyles: ReturnType<typeof createFilterStyles>;
}

function HierarchyOptions({
  label,
  icon,
  items,
  selected,
  onSelect,
  colors,
  filterStyles,
}: HierarchyOptionsProps): React.JSX.Element | null {
  if (items.length === 0) {
    return null;
  }
  if (items.length === 1) {
    return (
      <SingleHierarchyItem
        icon={icon}
        label={label}
        value={items[0]}
        colors={colors}
        filterStyles={filterStyles}
      />
    );
  }
  return (
    <View>
      <Text style={[filterStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      {items.map((item) => (
        <HierarchyOptionItem
          key={item}
          item={item}
          isSelected={selected === item}
          onSelect={onSelect}
          colors={colors}
          filterStyles={filterStyles}
        />
      ))}
    </View>
  );
}

function SingleHierarchyItem({
  icon,
  label,
  value,
  colors,
  filterStyles,
}: {
  icon: string;
  label: string;
  value: string;
  colors: Record<string, string>;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[filterStyles.hierarchyItem, { backgroundColor: colors.surfaceLight }]}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.EARTH}
        size={iconSizes.sm}
        color={colors.primary}
      />
      <View style={filterStyles.hierarchyInfo}>
        <Text style={[filterStyles.label, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[filterStyles.hierarchyValue, { color: colors.textPrimary }]}>{value}</Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHECK_CIRCLE}
        size={iconSizes.sm}
        color={colors.success}
      />
    </View>
  );
}

function HierarchyOptionItem({
  item,
  isSelected,
  onSelect,
  colors,
  filterStyles,
}: {
  item: string;
  isSelected: boolean;
  onSelect: (v: string) => void;
  colors: Record<string, string>;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const optStyle = [
    filterStyles.option,
    { backgroundColor: colors.surfaceLight },
    isSelected && [
      filterStyles.optionActive,
      { backgroundColor: colors.primaryAlpha20, borderColor: colors.primary },
    ],
  ];
  const textStyle = [
    filterStyles.optionText,
    { color: colors.textSecondary },
    isSelected && [filterStyles.optionTextActive, { color: colors.textPrimary }],
  ];
  return (
    <TouchableOpacity style={optStyle} onPress={(): void => onSelect(item)}>
      <Text style={textStyle}>{item}</Text>
      {isSelected && (
        <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}

interface RoleSectionProps {
  filters: UserFilters;
  onUpdate: (f: string, v: string) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}

function RoleSection({
  filters,
  onUpdate,
  colors,
  t,
  filterStyles,
}: RoleSectionProps): React.JSX.Element {
  const options = [
    {
      id: FILTER_STATUS.ALL,
      label: t('screens.usersManagement.allRoles'),
      icon: ICONS.ACCOUNT_GROUP,
      color: colors.textSecondary,
    },
    {
      id: UserRole.ADMIN,
      label: t('screens.usersManagement.adminFilterLabel'),
      icon: ICONS.SHIELD_CROWN,
      color: colors.error,
    },
    {
      id: UserRole.CLUB_ADMIN,
      label: t('screens.usersManagement.clubAdminFilterLabel'),
      icon: ICONS.SHIELD_ACCOUNT,
      color: colors.warning,
    },
    {
      id: UserRole.USER,
      label: t('screens.usersManagement.userFilterLabel'),
      icon: ICONS.ACCOUNT,
      color: colors.info,
    },
  ];
  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>{t('screens.usersManagement.roleSection')}</Text>
      {options.map((opt) => (
        <FilterOption
          key={opt.id}
          isActive={filters.role === opt.id}
          icon={opt.icon}
          iconColor={filters.role === opt.id ? colors.primary : opt.color}
          label={opt.label}
          onPress={(): void => onUpdate(HIERARCHY_FIELDS.ROLE, opt.id)}
          colors={colors}
          filterStyles={filterStyles}
        />
      ))}
    </View>
  );
}

interface StatusSectionProps {
  filters: UserFilters;
  onUpdate: (f: string, v: string) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}

function StatusSection({
  filters,
  onUpdate,
  colors,
  t,
  filterStyles,
}: StatusSectionProps): React.JSX.Element {
  const getStatusValue = (id: string): string => {
    if (id === UserStatus.ACTIVE) {
      return FILTER_STATUS.ACTIVE;
    }
    if (id === UserStatus.INACTIVE) {
      return FILTER_STATUS.INACTIVE;
    }
    return id;
  };
  const options = [
    {
      id: FILTER_STATUS.ALL,
      label: t('screens.usersManagement.allUsers'),
      icon: ICONS.ACCOUNT_GROUP,
      color: colors.textSecondary,
    },
    {
      id: UserStatus.ACTIVE,
      label: t('screens.usersManagement.activeOnly'),
      icon: ICONS.CHECK_CIRCLE,
      color: colors.success,
    },
    {
      id: UserStatus.INACTIVE,
      label: t('screens.usersManagement.inactiveOnly'),
      icon: ICONS.CANCEL,
      color: colors.error,
    },
  ];
  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t('screens.usersManagement.userStatusSection')}
      </Text>
      {options.map((opt) => (
        <FilterOption
          key={opt.id}
          isActive={filters.status === opt.id}
          icon={opt.icon}
          iconColor={filters.status === opt.id ? colors.primary : opt.color}
          label={opt.label}
          onPress={(): void => onUpdate(HIERARCHY_FIELDS.STATUS, getStatusValue(opt.id))}
          colors={colors}
          filterStyles={filterStyles}
        />
      ))}
    </View>
  );
}

function FilterOption({
  isActive,
  icon,
  iconColor,
  label,
  onPress,
  colors,
  filterStyles,
}: {
  isActive: boolean;
  icon: string;
  iconColor: string;
  label: string;
  onPress: () => void;
  colors: Record<string, string>;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <TouchableOpacity
      style={[filterStyles.option, isActive && filterStyles.optionActive]}
      onPress={onPress}
    >
      <View style={filterStyles.optionContent}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK}
          size={iconSizes.md}
          color={iconColor}
        />
        <Text style={[filterStyles.optionText, isActive && filterStyles.optionTextActive]}>
          {label}
        </Text>
      </View>
      {isActive && (
        <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}
