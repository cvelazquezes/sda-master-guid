import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { ScreenHeader, SearchBar, EmptyState, Text } from '../../../shared/components';
import { designTokens } from '../../../shared/theme';
import {
  SAFE_AREA_EDGES,
  A11Y_ROLE,
  ICONS,
  BREAKPOINTS,
  HIERARCHY_FIELDS,
  EMPTY_VALUE,
  flexValues,
} from '../../../shared/constants';
import { styles } from './styles';
import { OrganizationItem } from './types';
import { useOrganizationData } from './useOrganizationData';
import { getTypeLabel, getTypeIcon } from './orgUtils';
import { handleSave, handleDelete } from './orgHandlers';
import { TypeSelector } from './TypeSelector';
import { OrgCard } from './OrgCard';
import { OrgModal } from './OrgModal';

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
    parentDivision: isUnion ? org.parent || EMPTY_VALUE : EMPTY_VALUE,
    parentUnion: isAssociation ? org.parent || EMPTY_VALUE : EMPTY_VALUE,
    parentAssociation: isChurch ? org.parent || EMPTY_VALUE : EMPTY_VALUE,
  };
}

export const OrganizationManagementScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = windowWidth < BREAKPOINTS.MOBILE;
  const orgData = useOrganizationData();
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
    handleSave(
      orgData.formData,
      orgData.selectedType,
      editMode,
      setModalVisible,
      orgData.resetForm,
      t
    );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}
    >
      <ScreenHeader
        title={t('screens.organizationManagement.title')}
        subtitle={t('screens.organizationManagement.subtitle', { type: subtitleType })}
      />
      <TypeSelector
        selectedType={orgData.selectedType}
        onSelectType={orgData.setSelectedType}
        colors={colors}
        t={t}
      />
      <ActionsBar
        searchQuery={orgData.searchQuery}
        setSearchQuery={orgData.setSearchQuery}
        selectedType={orgData.selectedType}
        onCreatePress={handleCreate}
        colors={colors}
        t={t}
      />
      <OrgList
        loading={orgData.loading}
        orgs={filteredOrgs}
        selectedType={orgData.selectedType}
        searchQuery={orgData.searchQuery}
        onEdit={handleEdit}
        colors={colors}
        t={t}
      />
      <OrgModal
        visible={modalVisible}
        onClose={onCloseModal}
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
        onSave={onSave}
        colors={colors}
        t={t}
      />
    </SafeAreaView>
  );
};

function ActionsBar({
  searchQuery,
  setSearchQuery,
  selectedType,
  onCreatePress,
  colors,
  t,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedType: string;
  onCreatePress: () => void;
  colors: Record<string, string>;
  t: (k: string, o?: Record<string, unknown>) => string;
}): React.JSX.Element {
  return (
    <View style={styles.actionsContainer}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('screens.organizationManagement.searchType', {
            type: getTypeLabel(selectedType, t).toLowerCase(),
          })}
          style={{ flex: flexValues.one }}
        />
      </View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={onCreatePress}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('screens.organizationManagement.createNewType', {
          type: getTypeLabel(selectedType, t).toLowerCase(),
        })}
      >
        <MaterialCommunityIcons
          name={ICONS.PLUS}
          size={designTokens.iconSize.md}
          color={colors.textInverse}
        />
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
}: {
  loading: boolean;
  orgs: OrganizationItem[];
  selectedType: string;
  searchQuery: string;
  onEdit: (o: OrganizationItem) => void;
  colors: Record<string, string>;
  t: (k: string, o?: Record<string, unknown>) => string;
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
          type: getTypeLabel(selectedType, t).toLowerCase(),
        });
    return (
      <ScrollView style={styles.content}>
        <EmptyState
          icon={getTypeIcon(selectedType)}
          title={t('screens.organizationManagement.noTypeFound', {
            type: getTypeLabel(selectedType, t),
          })}
          message={emptyMsg}
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
          onEdit={onEdit}
          onDelete={(o): void => handleDelete(o, t)}
          colors={colors}
          t={t}
        />
      ))}
    </ScrollView>
  );
}

export default OrganizationManagementScreen;
