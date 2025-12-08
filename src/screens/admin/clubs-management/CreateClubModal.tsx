import React from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, StandardInput } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { ANIMATION, ICONS, HIERARCHY_FIELDS, KEYBOARD_TYPE, FLEX } from '../../../shared/constants';
import { MatchFrequency } from '../../../types';
import { modalStyles, filterStyles, buttonStyles } from './styles';
import { ClubFormData } from './types';
import { HierarchyFilterItem } from './HierarchyFilterItem';

interface FrequencyOption {
  id: MatchFrequency;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
}

interface CreateClubModalProps {
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
}

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
  const orgProps = {
    formData,
    onUpdateField,
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
          <ModalHeader onClose={onClose} colors={colors} t={t} />
          <ScrollView style={modalStyles.body}>
            <InfoBanner colors={colors} t={t} />
            <ClubInfoSection formData={formData} setFormData={setFormData} t={t} />
            <OrgHierarchySection {...orgProps} />
            <SettingsSection
              formData={formData}
              setFormData={setFormData}
              frequencyOptions={frequencyOptions}
              colors={colors}
              t={t}
            />
          </ScrollView>
          <ModalFooter onClose={onClose} onCreateClub={onCreateClub} colors={colors} t={t} />
        </View>
      </View>
    </Modal>
  );
}

interface ModalHeaderProps {
  onClose: () => void;
  colors: { textPrimary: string; textSecondary: string; borderLight: string };
  t: (key: string) => string;
}

function ModalHeader({ onClose, colors, t }: ModalHeaderProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[modalStyles.header, { borderBottomColor: colors.borderLight }]}>
      <Text style={[modalStyles.title, { color: colors.textPrimary }]}>
        {t('screens.clubsManagement.createNewClub')}
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
}: {
  colors: { primary: string };
  t: (key: string) => string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const bgColor = colors.primary + '15';
  return (
    <View style={[filterStyles.infoBanner, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.sm} color={colors.primary} />
      <Text style={[filterStyles.infoText, { color: colors.primary }]}>
        {t('screens.clubsManagement.filterDescription')}
      </Text>
    </View>
  );
}

interface ClubInfoSectionProps {
  formData: ClubFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClubFormData>>;
  t: (key: string) => string;
}

function ClubInfoSection({ formData, setFormData, t }: ClubInfoSectionProps): React.JSX.Element {
  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t('screens.clubsManagement.clubInformationSection')}
      </Text>
      <StandardInput
        label={t('screens.clubsManagement.clubNameLabel')}
        value={formData.name}
        onChangeText={(text): void => setFormData((p) => ({ ...p, name: text }))}
        placeholder={t('placeholders.enterClubName')}
        icon={ICONS.ACCOUNT_GROUP}
        required
      />
      <StandardInput
        label={t('screens.clubsManagement.descriptionLabel')}
        value={formData.description}
        onChangeText={(text): void => setFormData((p) => ({ ...p, description: text }))}
        placeholder={t('placeholders.enterClubDescription')}
        icon={ICONS.TEXT}
        multiline
        required
      />
    </View>
  );
}

interface OrgHierarchySectionProps {
  formData: ClubFormData;
  onUpdateField: (f: string, v: string) => void;
  availableDivisions: string[];
  availableUnions: string[];
  availableAssociations: string[];
  availableChurches: string[];
  colors: { primary: string; success: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
}

interface HierarchyRowProps {
  icon: string;
  label: string;
  values: string[];
  selected: string;
  onSelect: (v: string) => void;
  parent?: string;
  noDataKey: string;
  colors: { primary: string; success: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
}

function HierarchyRow(props: HierarchyRowProps): React.JSX.Element | null {
  const { icon, label, values, selected, onSelect, parent, noDataKey, colors, t } = props;
  if (values.length > 0) {
    return (
      <HierarchyFilterItem
        icon={icon}
        label={label}
        values={values}
        selectedValue={selected}
        onSelect={onSelect}
        colors={colors}
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
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.DIVISION, v)}
        noDataKey={divNoData}
        colors={colors}
        t={t}
      />
      <HierarchyRow
        icon={ICONS.DOMAIN}
        label={labels.union}
        values={availableUnions}
        selected={formData.union}
        parent={formData.division}
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.UNION, v)}
        noDataKey={unionNoData}
        colors={colors}
        t={t}
      />
      <HierarchyRow
        icon={ICONS.OFFICE_BUILDING}
        label={labels.association}
        values={availableAssociations}
        selected={formData.association}
        parent={formData.union}
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.ASSOCIATION, v)}
        noDataKey={assocNoData}
        colors={colors}
        t={t}
      />
      <HierarchyRow
        icon={ICONS.CHURCH}
        label={labels.church}
        values={availableChurches}
        selected={formData.church}
        parent={formData.association}
        onSelect={(v): void => onUpdateField(HIERARCHY_FIELDS.CHURCH, v)}
        noDataKey={churchNoData}
        colors={colors}
        t={t}
      />
    </View>
  );
}

const DEFAULT_GROUP_SIZE = 2;

interface FreqOptionProps {
  option: FrequencyOption;
  isActive: boolean;
  colors: { primary: string; textSecondary: string };
  onPress: () => void;
}

function FreqOption({ option, isActive, colors, onPress }: FreqOptionProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconColor = isActive ? colors.primary : option.iconColor || colors.textSecondary;
  const optStyle = [filterStyles.option, isActive && filterStyles.optionActive];
  return (
    <TouchableOpacity key={option.id} style={optStyle} onPress={onPress}>
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

interface SettingsSectionProps {
  formData: ClubFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClubFormData>>;
  frequencyOptions: FrequencyOption[];
  colors: { primary: string; textSecondary: string };
  t: (key: string) => string;
}

function SettingsSection({
  formData,
  setFormData,
  frequencyOptions,
  colors,
  t,
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
          onPress={(): void => setFormData((p) => ({ ...p, matchFrequency: o.id }))}
        />
      ))}
      <StandardInput
        label={t('screens.clubsManagement.groupSizeLabel')}
        value={formData.groupSize.toString()}
        onChangeText={(txt): void =>
          setFormData((p) => ({ ...p, groupSize: parseInt(txt) || DEFAULT_GROUP_SIZE }))
        }
        placeholder={t('placeholders.enterGroupSize')}
        icon={ICONS.ACCOUNT_MULTIPLE}
        keyboardType={KEYBOARD_TYPE.NUMERIC}
        required
      />
    </View>
  );
}

interface ModalFooterProps {
  onClose: () => void;
  onCreateClub: () => void;
  colors: { textSecondary: string };
  t: (key: string) => string;
}

function ModalFooter({ onClose, onCreateClub, colors, t }: ModalFooterProps): React.JSX.Element {
  const { iconSizes, colors: themeColors } = useTheme();
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity style={buttonStyles.clear} onPress={onClose}>
        <MaterialCommunityIcons
          name={ICONS.CLOSE_CIRCLE}
          size={iconSizes.md}
          color={colors.textSecondary}
        />
        <Text style={buttonStyles.clearText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={buttonStyles.apply} onPress={onCreateClub}>
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
