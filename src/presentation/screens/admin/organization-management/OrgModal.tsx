import React from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import {
  ANIMATION_TYPE,
  ICONS,
  A11Y_ROLE,
  HIERARCHY_FIELDS,
  EMPTY_VALUE,
} from '../../../../shared/constants';
import { modalStyles, filterStyles, buttonStyles } from './styles';
import { OrgFormData } from './types';
import {
  getTypeLabel,
  getTypeIcon,
  getAvailableDivisions,
  getAvailableUnions,
  getAvailableAssociations,
  getAvailableParents,
} from './orgUtils';
import { HierarchySelector } from './HierarchySelector';
import { Club } from '../../../../types';

interface OrgModalProps {
  visible: boolean;
  onClose: () => void;
  isMobile: boolean;
  editMode: boolean;
  selectedType: string;
  formData: OrgFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrgFormData>>;
  parentDivisionSearch: string;
  setParentDivisionSearch: (s: string) => void;
  parentUnionSearch: string;
  setParentUnionSearch: (s: string) => void;
  parentAssociationSearch: string;
  setParentAssociationSearch: (s: string) => void;
  clubs: Club[];
  onSave: () => void;
  colors: {
    backdrop: string;
    surface: string;
    borderLight: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    primaryLight: string;
    success: string;
    warning: string;
    textInverse: string;
    info: string;
  };
  t: (key: string, opts?: Record<string, unknown>) => string;
}

type HierarchyType = typeof HIERARCHY_FIELDS.DIVISION;

const NON_DIVISION_TYPES = [
  HIERARCHY_FIELDS.UNION,
  HIERARCHY_FIELDS.ASSOCIATION,
  HIERARCHY_FIELDS.CHURCH,
];

export function OrgModal({
  visible,
  onClose,
  isMobile,
  editMode,
  selectedType,
  formData,
  setFormData,
  parentDivisionSearch,
  setParentDivisionSearch,
  parentUnionSearch,
  setParentUnionSearch,
  parentAssociationSearch,
  setParentAssociationSearch,
  clubs,
  onSave,
  colors,
  t,
}: OrgModalProps): React.JSX.Element {
  const typeLabel = getTypeLabel(selectedType as HierarchyType, t);
  const divisions = getAvailableDivisions(clubs);
  const unions = getAvailableUnions(clubs, formData.parentDivision || undefined);
  const associations = getAvailableAssociations(clubs, formData.parentUnion || undefined);
  const parents = getAvailableParents(clubs, selectedType as HierarchyType);
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

  const isNonDivisionType = NON_DIVISION_TYPES.includes(
    selectedType as (typeof NON_DIVISION_TYPES)[number]
  );
  const noParentWarning = isNonDivisionType && parents.length === 0;

  return (
    <Modal visible={visible} animationType={anim} transparent onRequestClose={onClose}>
      <View style={overlayStyle}>
        <View style={contentStyle}>
          {isMobile && (
            <View style={[modalStyles.handle, { backgroundColor: colors.borderLight }]} />
          )}
          <ModalHeader
            editMode={editMode}
            typeLabel={typeLabel}
            onClose={onClose}
            colors={colors}
            t={t}
          />
          <ScrollView style={modalStyles.body}>
            <InfoBanner selectedType={selectedType} colors={colors} t={t} />
            <HierarchySelectors
              selectedType={selectedType}
              formData={formData}
              setFormData={setFormData}
              divisions={divisions}
              unions={unions}
              associations={associations}
              parentDivisionSearch={parentDivisionSearch}
              setParentDivisionSearch={setParentDivisionSearch}
              parentUnionSearch={parentUnionSearch}
              setParentUnionSearch={setParentUnionSearch}
              parentAssociationSearch={parentAssociationSearch}
              setParentAssociationSearch={setParentAssociationSearch}
              colors={colors}
              t={t}
            />
            <TypeInfoSection
              typeLabel={typeLabel}
              selectedType={selectedType}
              formData={formData}
              setFormData={setFormData}
              t={t}
            />
            {noParentWarning && (
              <NoParentWarning selectedType={selectedType} colors={colors} t={t} />
            )}
          </ScrollView>
          <ModalFooter
            editMode={editMode}
            onClose={onClose}
            onSave={onSave}
            colors={colors}
            t={t}
          />
        </View>
      </View>
    </Modal>
  );
}

function ModalHeader({
  editMode,
  typeLabel,
  onClose,
  colors,
  t,
}: {
  editMode: boolean;
  typeLabel: string;
  onClose: () => void;
  colors: { borderLight: string; textPrimary: string; textSecondary: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
}): React.JSX.Element {
  const titleKey = editMode
    ? 'screens.organizationManagement.editType'
    : 'screens.organizationManagement.createType';
  const closeLabel = t('screens.organizationManagement.closeModal');

  const { iconSizes } = useTheme();
  return (
    <View style={[modalStyles.header, { borderBottomColor: colors.borderLight }]}>
      <Text style={[modalStyles.title, { color: colors.textPrimary }]}>
        {t(titleKey, { type: typeLabel })}
      </Text>
      <TouchableOpacity
        onPress={onClose}
        style={modalStyles.closeButton}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={closeLabel}
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
  selectedType,
  colors,
  t,
}: {
  selectedType: string;
  colors: { primaryLight: string; primary: string };
  t: (key: string) => string;
}): React.JSX.Element {
  const getInfoText = (): string => {
    const base = 'screens.organizationManagement';
    if (selectedType === HIERARCHY_FIELDS.DIVISION) {
      return t(`${base}.divisionInfo`);
    }
    if (selectedType === HIERARCHY_FIELDS.UNION) {
      return t(`${base}.unionInfo`);
    }
    if (selectedType === HIERARCHY_FIELDS.ASSOCIATION) {
      return t(`${base}.associationInfo`);
    }
    return t(`${base}.churchInfo`);
  };

  const { iconSizes } = useTheme();
  return (
    <View style={[filterStyles.infoBanner, { backgroundColor: colors.primaryLight }]}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.sm} color={colors.primary} />
      <Text style={[filterStyles.infoText, { color: colors.primary }]}>{getInfoText()}</Text>
    </View>
  );
}

interface HierarchySelectorsProps {
  selectedType: string;
  formData: OrgFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrgFormData>>;
  divisions: string[];
  unions: string[];
  associations: string[];
  parentDivisionSearch: string;
  setParentDivisionSearch: (s: string) => void;
  parentUnionSearch: string;
  setParentUnionSearch: (s: string) => void;
  parentAssociationSearch: string;
  setParentAssociationSearch: (s: string) => void;
  colors: {
    primary: string;
    primaryLight: string;
    info: string;
    warning: string;
    success: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
  };
  t: (key: string, opts?: Record<string, unknown>) => string;
}

function HierarchySelectors(props: HierarchySelectorsProps): React.JSX.Element | null {
  const { selectedType, divisions } = props;

  if (selectedType === HIERARCHY_FIELDS.UNION && divisions.length > 0) {
    return <UnionHierarchy {...props} />;
  }
  if (selectedType === HIERARCHY_FIELDS.ASSOCIATION && divisions.length > 0) {
    return <AssociationHierarchy {...props} />;
  }
  if (selectedType === HIERARCHY_FIELDS.CHURCH && divisions.length > 0) {
    return <ChurchHierarchy {...props} />;
  }
  return null;
}

function UnionHierarchy({
  formData,
  setFormData,
  divisions,
  parentDivisionSearch,
  setParentDivisionSearch,
  colors,
  t,
}: HierarchySelectorsProps): React.JSX.Element {
  const base = 'screens.organizationManagement';
  const divLabel = t('components.organizationHierarchy.levels.division');

  return (
    <HierarchySelector
      title={t(`${base}.parentDivision`)}
      icon={ICONS.EARTH}
      iconColor={colors.primary}
      items={divisions}
      selectedValue={formData.parentDivision}
      searchValue={parentDivisionSearch}
      onSearch={setParentDivisionSearch}
      onSelect={(v): void => setFormData((p) => ({ ...p, parentDivision: v }))}
      onClear={(): void => setFormData((p) => ({ ...p, parentDivision: EMPTY_VALUE }))}
      searchPlaceholder={t(`${base}.searchDivisions`)}
      noResultsText={t(`${base}.noDivisionsMatching`, { query: parentDivisionSearch })}
      levelLabel={divLabel}
      colors={colors}
      t={t}
    />
  );
}

function AssociationHierarchy({
  formData,
  setFormData,
  divisions,
  unions,
  parentDivisionSearch,
  setParentDivisionSearch,
  parentUnionSearch,
  setParentUnionSearch,
  colors,
  t,
}: HierarchySelectorsProps): React.JSX.Element {
  const base = 'screens.organizationManagement';
  const divLabel = t('components.organizationHierarchy.levels.division');
  const unionLabel = t('components.organizationHierarchy.levels.union');

  return (
    <>
      <HierarchySelector
        title={t(`${base}.selectDivision`)}
        icon={ICONS.EARTH}
        iconColor={colors.primary}
        items={divisions}
        selectedValue={formData.parentDivision}
        searchValue={parentDivisionSearch}
        onSearch={setParentDivisionSearch}
        onSelect={(v): void => {
          setFormData((p) => ({ ...p, parentDivision: v, parentUnion: EMPTY_VALUE }));
        }}
        onClear={(): void => {
          setFormData((p) => ({
            ...p,
            parentDivision: EMPTY_VALUE,
            parentUnion: EMPTY_VALUE,
          }));
        }}
        searchPlaceholder={t(`${base}.searchDivisions`)}
        noResultsText={t(`${base}.noDivisionsMatching`, { query: parentDivisionSearch })}
        levelLabel={divLabel}
        colors={colors}
        t={t}
      />
      {formData.parentDivision && (
        <HierarchySelector
          title={t(`${base}.selectUnion`)}
          icon={ICONS.DOMAIN}
          iconColor={colors.info}
          items={unions}
          selectedValue={formData.parentUnion}
          searchValue={parentUnionSearch}
          onSearch={setParentUnionSearch}
          onSelect={(v): void => setFormData((p) => ({ ...p, parentUnion: v }))}
          onClear={(): void => setFormData((p) => ({ ...p, parentUnion: EMPTY_VALUE }))}
          searchPlaceholder={t(`${base}.searchUnions`)}
          noResultsText={t(`${base}.noUnionsIn`, { division: formData.parentDivision })}
          levelLabel={unionLabel}
          colors={colors}
          t={t}
        />
      )}
    </>
  );
}

function ChurchHierarchy({
  formData,
  setFormData,
  divisions,
  unions,
  associations,
  parentDivisionSearch,
  setParentDivisionSearch,
  parentUnionSearch,
  setParentUnionSearch,
  parentAssociationSearch,
  setParentAssociationSearch,
  colors,
  t,
}: HierarchySelectorsProps): React.JSX.Element {
  const divLabel = t('components.organizationHierarchy.levels.division');
  const unionLabel = t('components.organizationHierarchy.levels.union');
  const assocLabel = t('components.organizationHierarchy.levels.association');

  return (
    <>
      <ChurchDivisionSelector
        formData={formData}
        setFormData={setFormData}
        divisions={divisions}
        parentDivisionSearch={parentDivisionSearch}
        setParentDivisionSearch={setParentDivisionSearch}
        colors={colors}
        t={t}
        divLabel={divLabel}
      />
      {formData.parentDivision && (
        <ChurchUnionSelector
          formData={formData}
          setFormData={setFormData}
          unions={unions}
          parentUnionSearch={parentUnionSearch}
          setParentUnionSearch={setParentUnionSearch}
          colors={colors}
          t={t}
          unionLabel={unionLabel}
        />
      )}
      {formData.parentUnion && (
        <ChurchAssocSelector
          formData={formData}
          setFormData={setFormData}
          associations={associations}
          parentAssociationSearch={parentAssociationSearch}
          setParentAssociationSearch={setParentAssociationSearch}
          colors={colors}
          t={t}
          assocLabel={assocLabel}
        />
      )}
    </>
  );
}

interface ChurchDivProps {
  formData: OrgFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrgFormData>>;
  divisions: string[];
  parentDivisionSearch: string;
  setParentDivisionSearch: (s: string) => void;
  colors: HierarchySelectorsProps['colors'];
  t: (key: string, opts?: Record<string, unknown>) => string;
  divLabel: string;
}

function ChurchDivisionSelector({
  formData,
  setFormData,
  divisions,
  parentDivisionSearch,
  setParentDivisionSearch,
  colors,
  t,
  divLabel,
}: ChurchDivProps): React.JSX.Element {
  const base = 'screens.organizationManagement';
  return (
    <HierarchySelector
      title={t(`${base}.selectDivision`)}
      icon={ICONS.EARTH}
      iconColor={colors.primary}
      items={divisions}
      selectedValue={formData.parentDivision}
      searchValue={parentDivisionSearch}
      onSearch={setParentDivisionSearch}
      onSelect={(v): void => {
        setFormData((p) => ({
          ...p,
          parentDivision: v,
          parentUnion: EMPTY_VALUE,
          parentAssociation: EMPTY_VALUE,
        }));
      }}
      onClear={(): void => {
        setFormData((p) => ({
          ...p,
          parentDivision: EMPTY_VALUE,
          parentUnion: EMPTY_VALUE,
          parentAssociation: EMPTY_VALUE,
        }));
      }}
      searchPlaceholder={t(`${base}.searchDivisions`)}
      noResultsText={t(`${base}.noDivisionsMatching`, { query: parentDivisionSearch })}
      levelLabel={divLabel}
      colors={colors}
      t={t}
    />
  );
}

interface ChurchUnionProps {
  formData: OrgFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrgFormData>>;
  unions: string[];
  parentUnionSearch: string;
  setParentUnionSearch: (s: string) => void;
  colors: HierarchySelectorsProps['colors'];
  t: (key: string, opts?: Record<string, unknown>) => string;
  unionLabel: string;
}

function ChurchUnionSelector({
  formData,
  setFormData,
  unions,
  parentUnionSearch,
  setParentUnionSearch,
  colors,
  t,
  unionLabel,
}: ChurchUnionProps): React.JSX.Element {
  const base = 'screens.organizationManagement';
  return (
    <HierarchySelector
      title={t(`${base}.selectUnion`)}
      icon={ICONS.DOMAIN}
      iconColor={colors.info}
      items={unions}
      selectedValue={formData.parentUnion}
      searchValue={parentUnionSearch}
      onSearch={setParentUnionSearch}
      onSelect={(v): void => {
        setFormData((p) => ({ ...p, parentUnion: v, parentAssociation: EMPTY_VALUE }));
      }}
      onClear={(): void => {
        setFormData((p) => ({ ...p, parentUnion: EMPTY_VALUE, parentAssociation: EMPTY_VALUE }));
      }}
      searchPlaceholder={t(`${base}.searchUnions`)}
      noResultsText={t(`${base}.noUnionsIn`, { division: formData.parentDivision })}
      levelLabel={unionLabel}
      colors={colors}
      t={t}
    />
  );
}

interface ChurchAssocProps {
  formData: OrgFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrgFormData>>;
  associations: string[];
  parentAssociationSearch: string;
  setParentAssociationSearch: (s: string) => void;
  colors: HierarchySelectorsProps['colors'];
  t: (key: string, opts?: Record<string, unknown>) => string;
  assocLabel: string;
}

function ChurchAssocSelector({
  formData,
  setFormData,
  associations,
  parentAssociationSearch,
  setParentAssociationSearch,
  colors,
  t,
  assocLabel,
}: ChurchAssocProps): React.JSX.Element {
  const base = 'screens.organizationManagement';
  return (
    <HierarchySelector
      title={t(`${base}.selectAssociation`)}
      icon={ICONS.OFFICE_BUILDING}
      iconColor={colors.warning}
      items={associations}
      selectedValue={formData.parentAssociation}
      searchValue={parentAssociationSearch}
      onSearch={setParentAssociationSearch}
      onSelect={(v): void => setFormData((p) => ({ ...p, parentAssociation: v }))}
      onClear={(): void => setFormData((p) => ({ ...p, parentAssociation: EMPTY_VALUE }))}
      searchPlaceholder={t(`${base}.searchAssociations`)}
      noResultsText={t(`${base}.noAssociationsIn`, { union: formData.parentUnion })}
      levelLabel={assocLabel}
      colors={colors}
      t={t}
    />
  );
}

function TypeInfoSection({
  typeLabel,
  selectedType,
  formData,
  setFormData,
  t,
}: {
  typeLabel: string;
  selectedType: string;
  formData: OrgFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrgFormData>>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}): React.JSX.Element {
  const base = 'screens.organizationManagement';

  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t(`${base}.typeInformation`, { type: typeLabel })}
      </Text>
      <Input
        label={t(`${base}.typeName`, { type: typeLabel })}
        icon={getTypeIcon(selectedType as HierarchyType)}
        placeholder={t(`${base}.enterTypeName`, { type: typeLabel.toLowerCase() })}
        value={formData.name}
        onChangeText={(text): void => setFormData((p) => ({ ...p, name: text }))}
        required
      />
    </View>
  );
}

function NoParentWarning({
  selectedType,
  colors,
  t,
}: {
  selectedType: string;
  colors: { warning: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
}): React.JSX.Element {
  const getParentType = (): string => {
    const divLevel = t('components.organizationHierarchy.levels.division').toLowerCase();
    const unionLevel = t('components.organizationHierarchy.levels.union').toLowerCase();
    const assocLevel = t('components.organizationHierarchy.levels.association').toLowerCase();

    if (selectedType === HIERARCHY_FIELDS.UNION) {
      return divLevel;
    }
    if (selectedType === HIERARCHY_FIELDS.ASSOCIATION) {
      return unionLevel;
    }
    return assocLevel;
  };

  const { iconSizes } = useTheme();
  return (
    <View style={filterStyles.warningBanner}>
      <MaterialCommunityIcons name={ICONS.ALERT} size={iconSizes.md} color={colors.warning} />
      <Text style={filterStyles.warningText}>
        {t('screens.organizationManagement.noParentAvailable', { parentType: getParentType() })}
      </Text>
    </View>
  );
}

function ModalFooter({
  editMode,
  onClose,
  onSave,
  colors,
  t,
}: {
  editMode: boolean;
  onClose: () => void;
  onSave: () => void;
  colors: { textSecondary: string; textInverse: string };
  t: (key: string) => string;
}): React.JSX.Element {
  const base = 'screens.organizationManagement';
  const saveIcon = editMode ? ICONS.CONTENT_SAVE : ICONS.PLUS_CIRCLE;
  const saveLabel = editMode ? t(`${base}.saveChanges`) : t(`${base}.createOrganization`);
  const saveText = editMode ? t(`${base}.save`) : t(`${base}.create`);

  const { iconSizes } = useTheme();
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity
        style={buttonStyles.clear}
        onPress={onClose}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('common.cancel')}
      >
        <MaterialCommunityIcons
          name={ICONS.CLOSE_CIRCLE}
          size={iconSizes.sm}
          color={colors.textSecondary}
        />
        <Text style={buttonStyles.clearText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={buttonStyles.apply}
        onPress={onSave}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={saveLabel}
      >
        <MaterialCommunityIcons name={saveIcon} size={iconSizes.sm} color={colors.textInverse} />
        <Text style={buttonStyles.applyText}>{saveText}</Text>
      </TouchableOpacity>
    </View>
  );
}
