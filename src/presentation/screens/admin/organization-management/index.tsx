import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrgCard } from './OrgCard';
import { handleSave, handleDelete } from './orgHandlers';
import { OrgModal } from './OrgModal';
import { getTypeLabel, getTypeIcon } from './orgUtils';
import { createStyles } from './styles';
import { TypeSelector } from './TypeSelector';
import { useOrganizationData } from './useOrganizationData';
import {
  SAFE_AREA_EDGES,
  A11Y_ROLE,
  ICONS,
  BREAKPOINTS,
  HIERARCHY_FIELDS,
  EMPTY_VALUE,
  FLEX,
} from '../../../../shared/constants';
import { PageHeader, SearchBar, EmptyState, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { OrganizationItem } from './types';

function getFormDataForEdit(org: OrganizationItem): {
  name: string;
  parentDivision: string;
  parentUnion: string;
  parentAssociation: string;
} {
  const isUnion = org.type === HIERARCHY_FIELDS.UNION;
  const isAssociation = org.type === HIERARCHY_FIELDS.ASSOCIATION;
  const isChurch = org.type === HIERARCHY_FIELDS.CHURCH;
  return {
    name: org.name,
    parentDivision: isUnion ? (org.parent ?? EMPTY_VALUE) : EMPTY_VALUE,
    parentUnion: isAssociation ? (org.parent ?? EMPTY_VALUE) : EMPTY_VALUE,
    parentAssociation: isChurch ? (org.parent ?? EMPTY_VALUE) : EMPTY_VALUE,
  };
}

export const OrganizationManagementScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);
  const isMobile = windowWidth < BREAKPOINTS.MOBILE;
  const orgData = useOrganizationData(t);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const filteredOrgs = orgData.organizations.filter((o) =>
    o.name.toLowerCase().includes(orgData.searchQuery.toLowerCase())
  );
  const subtitleType = getTypeLabel(orgData.selectedType, t).toLowerCase();
  const handleCreate = (): void => {
    setEditMode(false);
    orgData.resetForm();
    setModalVisible(true);
  };
  const handleEdit = (org: OrganizationItem): void => {
    setEditMode(true);
    orgData.setFormData(getFormDataForEdit(org));
    setModalVisible(true);
  };
  const onCloseModal = (): void => {
    setModalVisible(false);
    orgData.resetForm();
  };
  const onSave = (): void =>
    handleSave({
      formData: orgData.formData,
      selectedType: orgData.selectedType,
      editMode,
      setModalVisible,
      resetForm: orgData.resetForm,
      t,
    });

  return (
    <SafeAreaView style={styles.container} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <PageHeader
        showActions
        title={t('screens.organizationManagement.title')}
        subtitle={t('screens.organizationManagement.subtitle', { type: subtitleType })}
      />
      <TypeSelector
        selectedType={orgData.selectedType}
        colors={colors}
        t={t}
        onSelectType={orgData.setSelectedType}
      />
      <ActionsBar
        searchQuery={orgData.searchQuery}
        setSearchQuery={orgData.setSearchQuery}
        selectedType={orgData.selectedType}
        colors={colors}
        t={t}
        styles={styles}
        onCreatePress={handleCreate}
      />
      <OrgList
        loading={orgData.loading}
        orgs={filteredOrgs}
        selectedType={orgData.selectedType}
        searchQuery={orgData.searchQuery}
        colors={colors}
        t={t}
        styles={styles}
        onEdit={handleEdit}
      />
      <OrgModal
        visible={modalVisible}
        isMobile={isMobile}
        editMode={editMode}
        selectedType={orgData.selectedType}
        formData={orgData.formData}
        setFormData={orgData.setFormData}
        parentDivisionSearch={orgData.parentDivisionSearch}
        setParentDivisionSearch={orgData.setParentDivisionSearch}
        parentUnionSearch={orgData.parentUnionSearch}
        setParentUnionSearch={orgData.setParentUnionSearch}
        parentAssociationSearch={orgData.parentAssociationSearch}
        setParentAssociationSearch={orgData.setParentAssociationSearch}
        clubs={orgData.clubs}
        colors={colors}
        t={t}
        onClose={onCloseModal}
        onSave={onSave}
      />
    </SafeAreaView>
  );
};

type ThemeColors = ReturnType<typeof useTheme>['colors'];
type HierarchyType = typeof HIERARCHY_FIELDS.DIVISION;

function ActionsBar({
  searchQuery,
  setSearchQuery,
  selectedType,
  onCreatePress,
  colors,
  t,
  styles,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedType: string;
  onCreatePress: () => void;
  colors: ThemeColors;
  t: (k: string, o?: Record<string, unknown>) => string;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={styles.actionsContainer}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          placeholder={t('screens.organizationManagement.searchType', {
            type: getTypeLabel(selectedType as HierarchyType, t).toLowerCase(),
          })}
          style={{ flex: FLEX.ONE }}
          onChangeText={setSearchQuery}
        />
      </View>
      <TouchableOpacity
        style={styles.createButton}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('screens.organizationManagement.createNewType', {
          type: getTypeLabel(selectedType as HierarchyType, t).toLowerCase(),
        })}
        onPress={onCreatePress}
      >
        <MaterialCommunityIcons name={ICONS.PLUS} size={iconSizes.md} color={colors.textInverse} />
        <Text style={styles.createButtonText}>{t('screens.organizationManagement.new')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function OrgList({
  loading,
  orgs,
  selectedType,
  searchQuery,
  onEdit,
  colors,
  t,
  styles,
}: {
  loading: boolean;
  orgs: OrganizationItem[];
  selectedType: string;
  searchQuery: string;
  onEdit: (o: OrganizationItem) => void;
  colors: ThemeColors;
  t: (k: string, o?: Record<string, unknown>) => string;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  if (loading) {
    return (
      <ScrollView style={styles.content}>
        <Text style={styles.loadingText}>{t('screens.organizationManagement.loading')}</Text>
      </ScrollView>
    );
  }
  if (orgs.length === 0) {
    const emptyMsg = searchQuery
      ? t('screens.organizationManagement.tryAdjustingSearch')
      : t('screens.organizationManagement.addFirstType', {
          type: getTypeLabel(selectedType as HierarchyType, t).toLowerCase(),
        });
    return (
      <ScrollView style={styles.content}>
        <EmptyState
          icon={getTypeIcon(selectedType as HierarchyType)}
          title={t('screens.organizationManagement.noTypeFound', {
            type: getTypeLabel(selectedType as HierarchyType, t),
          })}
          description={emptyMsg}
        />
      </ScrollView>
    );
  }
  return (
    <ScrollView style={styles.content}>
      {orgs.map((org) => (
        <OrgCard
          key={org.id}
          org={org}
          colors={{
            primary: colors.primary,
            info: colors.info,
            warning: colors.warning,
            success: colors.success,
            textPrimary: colors.textPrimary,
            textSecondary: colors.textSecondary,
            textTertiary: colors.textTertiary,
            border: colors.border,
            error: colors.error,
            surface: colors.surface,
          }}
          t={t}
          onEdit={onEdit}
          onDelete={(o): void => handleDelete(o, t)}
        />
      ))}
    </ScrollView>
  );
}

export default OrganizationManagementScreen;
