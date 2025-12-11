import React, { useMemo } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HierarchyFilterItem } from './HierarchyFilterItem';
import { createModalStyles, createFilterStyles, createButtonStyles } from './styles';
import {
  ANIMATION_TYPE,
  ICONS,
  HIERARCHY_FIELDS,
  KEYBOARD_TYPE,
  FLEX,
} from '../../../../shared/constants';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { ClubFormData } from './types';
import type { MatchFrequency } from '../../../../types';

type FrequencyOption = {
  id: MatchFrequency;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
};

type CreateClubModalProps = {
  visible: boolean;
  onClose: () => void;
  isMobile: boolean;
  formData: ClubFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClubFormData>>;
  onUpdateField: (field: string, value: string) => void;
  onCreateClub: () => void;
  availableDivisions: string[];
  availableUnions: string[];
  availableAssociations: string[];
  availableChurches: string[];
  frequencyOptions: FrequencyOption[];
  colors: {
    backdrop: string;
    surface: string;
    borderLight: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    success: string;
  };
  t: (key: string, opts?: Record<string, unknown>) => string;
};

export function CreateClubModal({
  visible,
  onClose,
  isMobile,
  formData,
  setFormData,
  onUpdateField,
  onCreateClub,
  availableDivisions,
  availableUnions,
  availableAssociations,
  availableChurches,
  frequencyOptions,
  colors,
  t,
}: CreateClubModalProps): React.JSX.Element {
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
  const orgProps = {
    formData,
    onUpdateField,
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
            <InfoBanner colors={colors} t={t} filterStyles={filterStyles} />
            <ClubInfoSection
              formData={formData}
              setFormData={setFormData}
              t={t}
              filterStyles={filterStyles}
            />
            <OrgHierarchySection {...orgProps} />
            <SettingsSection
              formData={formData}
              setFormData={setFormData}
              frequencyOptions={frequencyOptions}
              colors={colors}
              t={t}
              filterStyles={filterStyles}
            />
          </ScrollView>
          <ModalFooter
            colors={colors}
            t={t}
            modalStyles={modalStyles}
            buttonStyles={buttonStyles}
            onClose={onClose}
            onCreateClub={onCreateClub}
          />
        </View>
      </View>
    </Modal>
  );
}

type ModalHeaderProps = {
  onClose: () => void;
  colors: { textPrimary: string; textSecondary: string; borderLight: string };
  t: (key: string) => string;
  modalStyles: ReturnType<typeof createModalStyles>;
};

function ModalHeader({ onClose, colors, t, modalStyles }: ModalHeaderProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[modalStyles.header, { borderBottomColor: colors.borderLight }]}>
      <Text style={[modalStyles.title, { color: colors.textPrimary }]}>
        {t('screens.clubsManagement.createNewClub')}
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

function InfoBanner({
  colors,
  t,
  filterStyles,
}: {
  colors: { primary: string };
  t: (key: string) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={filterStyles.infoBanner}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.sm} color={colors.primary} />
      <Text style={filterStyles.infoText}>{t('screens.clubsManagement.filterDescription')}</Text>
    </View>
  );
}

type ClubInfoSectionProps = {
  formData: ClubFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClubFormData>>;
  t: (key: string) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
};

function ClubInfoSection({
  formData,
  setFormData,
  t,
  filterStyles,
}: ClubInfoSectionProps): React.JSX.Element {
  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t('screens.clubsManagement.clubInformationSection')}
      </Text>
      <Input
        required
        label={t('screens.clubsManagement.clubNameLabel')}
        value={formData.name}
        placeholder={t('placeholders.enterClubName')}
        icon={ICONS.ACCOUNT_GROUP}
        accessibilityHint="Required field"
        onChangeText={(text): void => setFormData((p) => ({ ...p, name: text }))}
      />
      <Input
        multiline
        required
        label={t('screens.clubsManagement.descriptionLabel')}
        value={formData.description}
        placeholder={t('placeholders.enterClubDescription')}
        icon={ICONS.TEXT}
        accessibilityHint="Required field"
        onChangeText={(text): void => setFormData((p) => ({ ...p, description: text }))}
      />
    </View>
  );
}

type OrgHierarchySectionProps = {
  formData: ClubFormData;
  onUpdateField: (f: string, v: string) => void;
  availableDivisions: string[];
  availableUnions: string[];
  availableAssociations: string[];
  availableChurches: string[];
  colors: { primary: string; success: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
};

type HierarchyRowProps = {
  icon: string;
  label: string;
  values: string[];
  selected: string;
  onSelect: (v: string) => void;
  parent?: string;
  noDataKey: string;
  colors: { primary: string; success: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
};

function HierarchyRow(props: HierarchyRowProps): React.JSX.Element | null {
  const { icon, label, values, selected, onSelect, parent, noDataKey, colors, t, filterStyles } =
    props;
  if (values.length > 0) {
    return (
      <HierarchyFilterItem
        icon={icon}
        label={label}
        values={values}
        selectedValue={selected}
        colors={colors}
        onSelect={onSelect}
      />
    );
  }
  if (!parent) {
    return noDataKey.includes('Division') ? (
      <Text style={filterStyles.noDataText}>{t(noDataKey)}</Text>
    ) : null;
  }
  const key = noDataKey.includes('division')
    ? 'division'
    : noDataKey.includes('union')
      ? 'union'
      : 'association';
  return <Text style={filterStyles.noDataText}>{t(noDataKey, { [key]: parent })}</Text>;
}

function OrgHierarchySection({
  formData,
  onUpdateField,
  availableDivisions,
  availableUnions,
  availableAssociations,
  availableChurches,
  colors,
  t,
  filterStyles,
}: OrgHierarchySectionProps): React.JSX.Element {
  const labels = {
    division: t('components.organizationHierarchy.levels.division'),
    union: t('components.organizationHierarchy.levels.union'),
    association: t('components.organizationHierarchy.levels.association'),
    church: t('components.organizationHierarchy.levels.church'),
  };

  const divNoData = 'screens.clubsManagement.noDivisionsAvailable';
  const unionNoData = 'screens.clubsManagement.noUnionsAvailable';
  const assocNoData = 'screens.clubsManagement.noAssociationsAvailable';
  const churchNoData = 'screens.clubsManagement.noChurchesAvailable';

  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t('screens.clubsManagement.organizationSection')}
      </Text>
      <HierarchyRow
        icon={ICONS.EARTH}
        label={labels.division}
        values={availableDivisions}
        selected={formData.division}
        noDataKey={divNoData}
        colors={colors}
        t={t}
        filterStyles={filterStyles}
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.DIVISION, v)}
      />
      <HierarchyRow
        icon={ICONS.DOMAIN}
        label={labels.union}
        values={availableUnions}
        selected={formData.union}
        parent={formData.division}
        noDataKey={unionNoData}
        colors={colors}
        t={t}
        filterStyles={filterStyles}
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.UNION, v)}
      />
      <HierarchyRow
        icon={ICONS.OFFICE_BUILDING}
        label={labels.association}
        values={availableAssociations}
        selected={formData.association}
        parent={formData.union}
        noDataKey={assocNoData}
        colors={colors}
        t={t}
        filterStyles={filterStyles}
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.ASSOCIATION, v)}
      />
      <HierarchyRow
        icon={ICONS.CHURCH}
        label={labels.church}
        values={availableChurches}
        selected={formData.church}
        parent={formData.association}
        noDataKey={churchNoData}
        colors={colors}
        t={t}
        filterStyles={filterStyles}
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.CHURCH, v)}
      />
    </View>
  );
}

const DEFAULT_GROUP_SIZE = 2;

type FreqOptionProps = {
  option: FrequencyOption;
  isActive: boolean;
  colors: { primary: string; textSecondary: string };
  onPress: () => void;
  filterStyles: ReturnType<typeof createFilterStyles>;
};

function FreqOption({
  option,
  isActive,
  colors,
  onPress,
  filterStyles,
}: FreqOptionProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconColor = isActive ? colors.primary : option.iconColor || colors.textSecondary;
  const optStyle = [filterStyles.option, isActive && filterStyles.optionActive];
  return (
    <TouchableOpacity
      key={option.id}
      style={optStyle}
      accessibilityRole="radio"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={option.title}
      onPress={onPress}
    >
      <View style={filterStyles.optionContent}>
        <MaterialCommunityIcons
          name={option.icon as typeof ICONS.CHECK}
          size={iconSizes.md}
          color={iconColor}
        />
        <View style={{ flex: FLEX.ONE }}>
          <Text style={[filterStyles.optionText, isActive && filterStyles.optionTextActive]}>
            {option.title}
          </Text>
          {option.subtitle && <Text style={filterStyles.optionSubtitle}>{option.subtitle}</Text>}
        </View>
      </View>
      {isActive && (
        <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}

type SettingsSectionProps = {
  formData: ClubFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClubFormData>>;
  frequencyOptions: FrequencyOption[];
  colors: { primary: string; textSecondary: string };
  t: (key: string) => string;
  filterStyles: ReturnType<typeof createFilterStyles>;
};

function SettingsSection({
  formData,
  setFormData,
  frequencyOptions,
  colors,
  t,
  filterStyles,
}: SettingsSectionProps): React.JSX.Element {
  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t('screens.clubsManagement.clubSettingsSection')}
      </Text>
      <Text style={filterStyles.label}>{t('screens.clubsManagement.matchFrequency')}</Text>
      {frequencyOptions.map((o) => (
        <FreqOption
          key={o.id}
          option={o}
          isActive={formData.matchFrequency === o.id}
          colors={colors}
          filterStyles={filterStyles}
          onPress={(): void => setFormData((p) => ({ ...p, matchFrequency: o.id }))}
        />
      ))}
      <Input
        required
        label={t('screens.clubsManagement.groupSizeLabel')}
        value={formData.groupSize.toString()}
        placeholder={t('placeholders.enterGroupSize')}
        icon={ICONS.ACCOUNT_MULTIPLE}
        keyboardType={KEYBOARD_TYPE.NUMERIC}
        accessibilityHint="Required field"
        onChangeText={(txt): void =>
          setFormData((p) => ({ ...p, groupSize: parseInt(txt, 10) || DEFAULT_GROUP_SIZE }))
        }
      />
    </View>
  );
}

type ModalFooterProps = {
  onClose: () => void;
  onCreateClub: () => void;
  colors: { textSecondary: string };
  t: (key: string) => string;
  modalStyles: ReturnType<typeof createModalStyles>;
  buttonStyles: ReturnType<typeof createButtonStyles>;
};

function ModalFooter({
  onClose,
  onCreateClub,
  colors,
  t,
  modalStyles,
  buttonStyles,
}: ModalFooterProps): React.JSX.Element {
  const { iconSizes, colors: themeColors } = useTheme();
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity
        style={buttonStyles.clear}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        onPress={onClose}
      >
        <MaterialCommunityIcons
          name={ICONS.CLOSE_CIRCLE}
          size={iconSizes.md}
          color={colors.textSecondary}
        />
        <Text style={buttonStyles.clearText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={buttonStyles.apply}
        accessibilityRole="button"
        accessibilityLabel="Create club"
        onPress={onCreateClub}
      >
        <MaterialCommunityIcons
          name={ICONS.PLUS_CIRCLE}
          size={iconSizes.md}
          color={themeColors.textInverse}
        />
        <Text style={buttonStyles.applyText}>{t('screens.clubsManagement.createClub')}</Text>
      </TouchableOpacity>
    </View>
  );
}
