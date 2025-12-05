import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { clubService } from '../../services/clubService';
import { useTheme } from '../../contexts/ThemeContext';
import { Club } from '../../types';
import { ScreenHeader, SearchBar, EmptyState, StandardInput } from '../../shared/components';
import {
  mobileFontSizes,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../shared/theme';
import {
  MESSAGES,
  dynamicMessages,
  A11Y_ROLE,
  ICONS,
  TOUCH_OPACITY,
  flexValues,
  dimensionValues,
  ALERT_BUTTON_STYLE,
  ANIMATION,
  textTransformValues,
  typographyValues,
  borderValues,
  SAFE_AREA_EDGES,
  ORGANIZATION_TYPES,
  OrganizationType,
  HIERARCHY_FIELDS,
  EMPTY_VALUE,
  BREAKPOINTS,
} from '../../shared/constants';

interface OrganizationItem {
  id: string;
  name: string;
  type: OrganizationType;
  parent?: string;
  clubCount: number;
}

export const OrganizationManagementScreen = () => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = windowWidth < BREAKPOINTS.MOBILE;

  const [clubs, setClubs] = useState<Club[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);
  const [selectedType, setSelectedType] = useState<OrganizationType>(HIERARCHY_FIELDS.DIVISION);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [, setSelectedOrg] = useState<OrganizationItem | null>(null);

  // Parent search queries
  const [parentDivisionSearch, setParentDivisionSearch] = useState(EMPTY_VALUE);
  const [parentUnionSearch, setParentUnionSearch] = useState(EMPTY_VALUE);
  const [parentAssociationSearch, setParentAssociationSearch] = useState(EMPTY_VALUE);

  // Form data
  const [formData, setFormData] = useState({
    name: EMPTY_VALUE,
    parentDivision: EMPTY_VALUE,
    parentUnion: EMPTY_VALUE,
    parentAssociation: EMPTY_VALUE,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    buildOrganizationsList();
  }, [clubs, selectedType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const clubsList = await clubService.getAllClubs();
      setClubs(clubsList);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const buildOrganizationsList = () => {
    const orgMap = new Map<string, OrganizationItem>();

    clubs.forEach((club) => {
      // Count clubs for each organization
      const divisionKey = `${HIERARCHY_FIELDS.DIVISION}-${club.division}`;
      const unionKey = `${HIERARCHY_FIELDS.UNION}-${club.union}`;
      const associationKey = `${HIERARCHY_FIELDS.ASSOCIATION}-${club.association}`;
      const churchKey = `${HIERARCHY_FIELDS.CHURCH}-${club.church}`;

      // Division
      if (club.division) {
        if (!orgMap.has(divisionKey)) {
          orgMap.set(divisionKey, {
            id: divisionKey,
            name: club.division,
            type: HIERARCHY_FIELDS.DIVISION,
            clubCount: 0,
          });
        }
        orgMap.get(divisionKey)!.clubCount++;
      }

      // Union
      if (club.union) {
        if (!orgMap.has(unionKey)) {
          orgMap.set(unionKey, {
            id: unionKey,
            name: club.union,
            type: HIERARCHY_FIELDS.UNION,
            parent: club.division,
            clubCount: 0,
          });
        }
        orgMap.get(unionKey)!.clubCount++;
      }

      // Association
      if (club.association) {
        if (!orgMap.has(associationKey)) {
          orgMap.set(associationKey, {
            id: associationKey,
            name: club.association,
            type: HIERARCHY_FIELDS.ASSOCIATION,
            parent: club.union,
            clubCount: 0,
          });
        }
        orgMap.get(associationKey)!.clubCount++;
      }

      // Church
      if (club.church) {
        if (!orgMap.has(churchKey)) {
          orgMap.set(churchKey, {
            id: churchKey,
            name: club.church,
            type: HIERARCHY_FIELDS.CHURCH,
            parent: club.association,
            clubCount: 0,
          });
        }
        orgMap.get(churchKey)!.clubCount++;
      }
    });

    const filtered = Array.from(orgMap.values())
      .filter((org) => org.type === selectedType)
      .sort((a, b) => a.name.localeCompare(b.name));

    setOrganizations(filtered);
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get all unique divisions
  const getAvailableDivisions = () => {
    const divisionMap = new Map<string, string>();
    clubs.forEach((club) => {
      if (club.division) {
        divisionMap.set(club.division, club.division);
      }
    });
    return Array.from(divisionMap.values()).sort();
  };

  // Get unions filtered by selected division
  const getAvailableUnions = (divisionFilter?: string) => {
    const unionMap = new Map<string, string>();
    clubs.forEach((club) => {
      if (club.union) {
        if (!divisionFilter || club.division === divisionFilter) {
          unionMap.set(club.union, club.union);
        }
      }
    });
    return Array.from(unionMap.values()).sort();
  };

  // Get associations filtered by selected union
  const getAvailableAssociations = (unionFilter?: string) => {
    const assocMap = new Map<string, string>();
    clubs.forEach((club) => {
      if (club.association) {
        if (!unionFilter || club.union === unionFilter) {
          assocMap.set(club.association, club.association);
        }
      }
    });
    return Array.from(assocMap.values()).sort();
  };

  // Filter by search query
  const filterBySearch = (items: string[], searchQuery: string) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  // Legacy function for compatibility
  const getAvailableParents = () => {
    if (selectedType === HIERARCHY_FIELDS.UNION) return getAvailableDivisions();
    if (selectedType === HIERARCHY_FIELDS.ASSOCIATION) return getAvailableUnions();
    if (selectedType === HIERARCHY_FIELDS.CHURCH) return getAvailableAssociations();
    return [];
  };

  const resetForm = () => {
    setFormData({
      name: EMPTY_VALUE,
      parentDivision: EMPTY_VALUE,
      parentUnion: EMPTY_VALUE,
      parentAssociation: EMPTY_VALUE,
    });
    setParentDivisionSearch(EMPTY_VALUE);
    setParentUnionSearch(EMPTY_VALUE);
    setParentAssociationSearch(EMPTY_VALUE);
    setEditMode(false);
    setSelectedOrg(null);
  };

  const handleCreate = () => {
    setEditMode(false);
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (org: OrganizationItem) => {
    setEditMode(true);
    setSelectedOrg(org);
    const isUnion = org.type === HIERARCHY_FIELDS.UNION;
    const isAssociation = org.type === HIERARCHY_FIELDS.ASSOCIATION;
    const isChurch = org.type === HIERARCHY_FIELDS.CHURCH;
    setFormData({
      name: org.name,
      parentDivision: isUnion ? org.parent || EMPTY_VALUE : EMPTY_VALUE,
      parentUnion: isAssociation ? org.parent || EMPTY_VALUE : EMPTY_VALUE,
      parentAssociation: isChurch ? org.parent || EMPTY_VALUE : EMPTY_VALUE,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_ENTER_NAME);
      return;
    }

    // Validate parent requirement
    if (selectedType === HIERARCHY_FIELDS.UNION && !formData.parentDivision) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_DIVISION);
      return;
    }
    if (selectedType === HIERARCHY_FIELDS.ASSOCIATION && !formData.parentUnion) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_UNION);
      return;
    }
    if (selectedType === HIERARCHY_FIELDS.CHURCH && !formData.parentAssociation) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_ASSOCIATION);
      return;
    }

    try {
      // Note: This is a simplified implementation
      // In a real app, you would need backend endpoints to manage organizations
      // For now, we'll just show a success message

      Alert.alert(
        MESSAGES.TITLES.SUCCESS,
        editMode
          ? t('screens.organizationManagement.typeUpdated', {
              type: getTypeLabel(selectedType),
              name: formData.name,
            })
          : t('screens.organizationManagement.typeCreated', {
              type: getTypeLabel(selectedType),
              name: formData.name,
            }),
        [
          {
            text: MESSAGES.BUTTONS.OK,
            onPress: () => {
              setModalVisible(false);
              resetForm();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.OPERATION_FAILED);
    }
  };

  const handleDelete = (org: OrganizationItem) => {
    Alert.alert(
      t('screens.organizationManagement.deleteType', { type: getTypeLabel(org.type) }),
      t('screens.organizationManagement.confirmDeleteMessage', {
        name: org.name,
        type: org.type,
        count: org.clubCount,
      }),
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: MESSAGES.BUTTONS.DELETE,
          style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
          onPress: async () => {
            // Note: Backend implementation needed
            const typeLabel = getTypeLabel(org.type);
            Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.organizationDeleted(typeLabel));
          },
        },
      ]
    );
  };

  const getTypeLabel = (type: OrganizationType): string => {
    const labels: Record<OrganizationType, string> = {
      [HIERARCHY_FIELDS.DIVISION]: t('components.organizationHierarchy.levels.division'),
      [HIERARCHY_FIELDS.UNION]: t('components.organizationHierarchy.levels.union'),
      [HIERARCHY_FIELDS.ASSOCIATION]: t('components.organizationHierarchy.levels.association'),
      [HIERARCHY_FIELDS.CHURCH]: t('components.organizationHierarchy.levels.church'),
    };
    return labels[type];
  };

  const getTypeIcon = (type: OrganizationType): string => {
    const icons: Record<OrganizationType, string> = {
      [HIERARCHY_FIELDS.DIVISION]: ICONS.EARTH,
      [HIERARCHY_FIELDS.UNION]: ICONS.DOMAIN,
      [HIERARCHY_FIELDS.ASSOCIATION]: ICONS.OFFICE_BUILDING,
      [HIERARCHY_FIELDS.CHURCH]: ICONS.CHURCH,
    };
    return icons[type];
  };

  const getTypeColor = (type: OrganizationType): string => {
    const typeColors: Record<OrganizationType, string> = {
      [HIERARCHY_FIELDS.DIVISION]: colors.primary,
      [HIERARCHY_FIELDS.UNION]: colors.info,
      [HIERARCHY_FIELDS.ASSOCIATION]: colors.warning,
      [HIERARCHY_FIELDS.CHURCH]: colors.success,
    };
    return typeColors[type];
  };

  const containerStyle = [styles.container, { backgroundColor: colors.backgroundSecondary }];
  const subtitleType = getTypeLabel(selectedType).toLowerCase();

  return (
    <SafeAreaView style={containerStyle} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <ScreenHeader
        title={t('screens.organizationManagement.title')}
        subtitle={t('screens.organizationManagement.subtitle', { type: subtitleType })}
      />

      {/* Type Selector */}
      <View style={styles.typeSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeSelector}
        >
          {ORGANIZATION_TYPES.map((type) => {
            const isSelected = selectedType === type;
            const typeLabel = getTypeLabel(type);
            const btnStyle = [styles.typeButton, isSelected && styles.typeButtonActive];
            const iconColor = isSelected ? colors.textInverse : getTypeColor(type);
            const textStyle = [styles.typeButtonText, isSelected && styles.typeButtonTextActive];
            return (
              <TouchableOpacity
                key={type}
                style={btnStyle}
                onPress={() => setSelectedType(type)}
                accessibilityRole={A11Y_ROLE.BUTTON}
                accessibilityLabel={t('screens.organizationManagement.viewTypes', {
                  type: typeLabel,
                })}
                accessibilityState={{ selected: isSelected }}
              >
                <MaterialCommunityIcons
                  name={getTypeIcon(type) as typeof ICONS.CHECK}
                  size={designTokens.iconSize.md}
                  color={iconColor}
                />
                <Text style={textStyle}>{typeLabel}s</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search and Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('screens.organizationManagement.searchType', {
              type: getTypeLabel(selectedType).toLowerCase(),
            })}
            style={{ flex: flexValues.one }}
          />
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
          accessibilityRole={A11Y_ROLE.BUTTON}
          accessibilityLabel={t('screens.organizationManagement.createNewType', {
            type: getTypeLabel(selectedType).toLowerCase(),
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

      {/* Organizations List */}
      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>{t('screens.organizationManagement.loading')}</Text>
        ) : filteredOrganizations.length === 0 ? (
          <EmptyState
            icon={getTypeIcon(selectedType)}
            title={t('screens.organizationManagement.noTypeFound', {
              type: getTypeLabel(selectedType),
            })}
            message={
              searchQuery
                ? t('screens.organizationManagement.tryAdjustingSearch')
                : t('screens.organizationManagement.addFirstType', {
                    type: getTypeLabel(selectedType).toLowerCase(),
                  })
            }
          />
        ) : (
          filteredOrganizations.map((org) => (
            <TouchableOpacity
              key={org.id}
              style={[styles.orgCard, { backgroundColor: colors.surface }]}
              activeOpacity={TOUCH_OPACITY.default}
              onPress={() => handleEdit(org)}
            >
              <View style={styles.orgCardHeader}>
                <View style={styles.orgCardTitle}>
                  <MaterialCommunityIcons
                    name={getTypeIcon(org.type) as typeof ICONS.CHECK}
                    size={mobileIconSizes.medium}
                    color={getTypeColor(org.type)}
                  />
                  <View style={styles.orgCardInfo}>
                    <Text style={[styles.orgName, { color: colors.textPrimary }]}>{org.name}</Text>
                    {org.parent && (
                      <Text style={[styles.orgParent, { color: colors.textSecondary }]}>
                        {org.parent}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(org)}
                  accessibilityRole={A11Y_ROLE.BUTTON}
                  accessibilityLabel={t('screens.organizationManagement.deleteItem', {
                    name: org.name,
                  })}
                >
                  <MaterialCommunityIcons
                    name={ICONS.DELETE_OUTLINE}
                    size={designTokens.iconSize.md}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.orgCardFooter, { borderTopColor: colors.border }]}>
                <MaterialCommunityIcons
                  name={ICONS.ACCOUNT_GROUP}
                  size={designTokens.iconSize.xs}
                  color={colors.textTertiary}
                />
                <Text style={[styles.orgClubCount, { color: colors.textSecondary }]}>
                  {org.clubCount === 1
                    ? t('screens.organizationManagement.clubCount', { count: org.clubCount })
                    : t('screens.organizationManagement.clubCountPlural', { count: org.clubCount })}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType={isMobile ? ANIMATION.SLIDE : ANIMATION.FADE}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.backdrop },
            isMobile && styles.modalOverlayMobile,
          ]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface },
              isMobile && styles.modalContentMobile,
            ]}
          >
            {/* Modal Handle - Mobile Only */}
            {isMobile && (
              <View style={[styles.modalHandle, { backgroundColor: colors.borderLight }]} />
            )}

            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editMode
                  ? t('screens.organizationManagement.editType', {
                      type: getTypeLabel(selectedType),
                    })
                  : t('screens.organizationManagement.createType', {
                      type: getTypeLabel(selectedType),
                    })}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.closeButton}
                accessibilityRole={A11Y_ROLE.BUTTON}
                accessibilityLabel={t('screens.organizationManagement.closeModal')}
              >
                <MaterialCommunityIcons
                  name={ICONS.CLOSE}
                  size={designTokens.iconSize.lg}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Info Banner */}
              <View style={[styles.hierarchyInfoBanner, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons
                  name={ICONS.INFORMATION}
                  size={designTokens.iconSize.sm}
                  color={colors.primary}
                />
                <Text style={[styles.hierarchyInfoText, { color: colors.primary }]}>
                  {selectedType === HIERARCHY_FIELDS.DIVISION
                    ? t('screens.organizationManagement.divisionInfo')
                    : selectedType === HIERARCHY_FIELDS.UNION
                      ? t('screens.organizationManagement.unionInfo')
                      : selectedType === HIERARCHY_FIELDS.ASSOCIATION
                        ? t('screens.organizationManagement.associationInfo')
                        : t('screens.organizationManagement.churchInfo')}
                </Text>
              </View>

              {/* Union: Select Division to be the parent */}
              {selectedType === HIERARCHY_FIELDS.UNION && getAvailableDivisions().length > 0 && (
                <View style={styles.filterSection}>
                  <View style={styles.filterSectionHeader}>
                    <Text style={styles.filterSectionTitle}>
                      {t('screens.organizationManagement.parentDivision')}
                    </Text>
                    {!formData.parentDivision && getAvailableDivisions().length > 1 && (
                      <Text style={styles.resultsCount}>
                        {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length} of{' '}
                        {getAvailableDivisions().length}
                      </Text>
                    )}
                  </View>

                  {getAvailableDivisions().length === 1 ? (
                    <View style={styles.hierarchyItem}>
                      <MaterialCommunityIcons
                        name={ICONS.EARTH}
                        size={designTokens.iconSize.sm}
                        color={colors.primary}
                      />
                      <View style={styles.hierarchyInfo}>
                        <Text style={styles.hierarchyLabel}>
                          {t('components.organizationHierarchy.levels.division')}
                        </Text>
                        <Text style={styles.hierarchyValue}>{getAvailableDivisions()[0]}</Text>
                      </View>
                      <MaterialCommunityIcons
                        name={ICONS.CHECK_CIRCLE}
                        size={designTokens.iconSize.sm}
                        color={colors.success}
                      />
                    </View>
                  ) : formData.parentDivision ? (
                    <TouchableOpacity
                      style={[styles.filterOption, styles.filterOptionActive]}
                      onPress={() => setFormData({ ...formData, parentDivision: EMPTY_VALUE })}
                    >
                      <View style={styles.filterOptionContent}>
                        <MaterialCommunityIcons
                          name={ICONS.EARTH}
                          size={designTokens.iconSize.md}
                          color={colors.primary}
                        />
                        <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>
                          {formData.parentDivision}
                        </Text>
                      </View>
                      <MaterialCommunityIcons
                        name={ICONS.CLOSE_CIRCLE}
                        size={designTokens.iconSize.md}
                        color={colors.textTertiary}
                      />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <StandardInput
                        placeholder={t('screens.organizationManagement.searchDivisions')}
                        icon={ICONS.MAGNIFY}
                        value={parentDivisionSearch}
                        onChangeText={setParentDivisionSearch}
                      />
                      {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length ===
                      0 ? (
                        <Text style={styles.noResultsText}>
                          {t('screens.organizationManagement.noDivisionsMatching', {
                            query: parentDivisionSearch,
                          })}
                        </Text>
                      ) : (
                        filterBySearch(getAvailableDivisions(), parentDivisionSearch).map(
                          (division) => (
                            <TouchableOpacity
                              key={division}
                              style={styles.filterOption}
                              onPress={() => setFormData({ ...formData, parentDivision: division })}
                            >
                              <View style={styles.filterOptionContent}>
                                <MaterialCommunityIcons
                                  name={ICONS.EARTH}
                                  size={designTokens.iconSize.md}
                                  color={colors.textTertiary}
                                />
                                <Text style={styles.filterOptionText}>{division}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        )
                      )}
                    </>
                  )}
                </View>
              )}

              {/* Association: Cascading selection Division → Union */}
              {selectedType === HIERARCHY_FIELDS.ASSOCIATION &&
                getAvailableDivisions().length > 0 && (
                  <>
                    {/* Step 1: Select Division */}
                    <View style={styles.filterSection}>
                      <View style={styles.filterSectionHeader}>
                        <Text style={styles.filterSectionTitle}>
                          {t('screens.organizationManagement.selectDivision')}
                        </Text>
                        {!formData.parentDivision && getAvailableDivisions().length > 1 && (
                          <Text style={styles.resultsCount}>
                            {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length}{' '}
                            of {getAvailableDivisions().length}
                          </Text>
                        )}
                      </View>

                      {getAvailableDivisions().length === 1 ? (
                        <View style={styles.hierarchyItem}>
                          <MaterialCommunityIcons
                            name={ICONS.EARTH}
                            size={designTokens.iconSize.sm}
                            color={colors.primary}
                          />
                          <View style={styles.hierarchyInfo}>
                            <Text style={styles.hierarchyLabel}>
                              {t('components.organizationHierarchy.levels.division')}
                            </Text>
                            <Text style={styles.hierarchyValue}>{getAvailableDivisions()[0]}</Text>
                          </View>
                          <MaterialCommunityIcons
                            name={ICONS.CHECK_CIRCLE}
                            size={designTokens.iconSize.sm}
                            color={colors.success}
                          />
                        </View>
                      ) : formData.parentDivision ? (
                        <TouchableOpacity
                          style={[styles.filterOption, styles.filterOptionActive]}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              parentDivision: EMPTY_VALUE,
                              parentUnion: EMPTY_VALUE,
                            })
                          }
                        >
                          <View style={styles.filterOptionContent}>
                            <MaterialCommunityIcons
                              name={ICONS.EARTH}
                              size={designTokens.iconSize.md}
                              color={colors.primary}
                            />
                            <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>
                              {formData.parentDivision}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name={ICONS.CLOSE_CIRCLE}
                            size={designTokens.iconSize.md}
                            color={colors.textTertiary}
                          />
                        </TouchableOpacity>
                      ) : (
                        <>
                          <StandardInput
                            placeholder={t('screens.organizationManagement.searchDivisions')}
                            icon={ICONS.MAGNIFY}
                            value={parentDivisionSearch}
                            onChangeText={setParentDivisionSearch}
                          />
                          {filterBySearch(getAvailableDivisions(), parentDivisionSearch).map(
                            (division) => (
                              <TouchableOpacity
                                key={division}
                                style={styles.filterOption}
                                onPress={() =>
                                  setFormData({
                                    ...formData,
                                    parentDivision: division,
                                    parentUnion: EMPTY_VALUE,
                                  })
                                }
                              >
                                <View style={styles.filterOptionContent}>
                                  <MaterialCommunityIcons
                                    name={ICONS.EARTH}
                                    size={designTokens.iconSize.md}
                                    color={colors.textTertiary}
                                  />
                                  <Text style={styles.filterOptionText}>{division}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          )}
                        </>
                      )}
                    </View>

                    {/* Step 2: Select Union (filtered by Division) */}
                    {formData.parentDivision && (
                      <View style={styles.filterSection}>
                        <View style={styles.filterSectionHeader}>
                          <Text style={styles.filterSectionTitle}>
                            {t('screens.organizationManagement.selectUnion')}
                          </Text>
                          {!formData.parentUnion &&
                            getAvailableUnions(formData.parentDivision).length > 1 && (
                              <Text style={styles.resultsCount}>
                                {
                                  filterBySearch(
                                    getAvailableUnions(formData.parentDivision),
                                    parentUnionSearch
                                  ).length
                                }{' '}
                                of {getAvailableUnions(formData.parentDivision).length}
                              </Text>
                            )}
                        </View>

                        {getAvailableUnions(formData.parentDivision).length === 0 ? (
                          <Text style={styles.noResultsText}>
                            {t('screens.organizationManagement.noUnionsIn', {
                              division: formData.parentDivision,
                            })}
                          </Text>
                        ) : getAvailableUnions(formData.parentDivision).length === 1 ? (
                          <View style={styles.hierarchyItem}>
                            <MaterialCommunityIcons
                              name={ICONS.DOMAIN}
                              size={designTokens.iconSize.sm}
                              color={colors.info}
                            />
                            <View style={styles.hierarchyInfo}>
                              <Text style={styles.hierarchyLabel}>
                                {t('components.organizationHierarchy.levels.union')}
                              </Text>
                              <Text style={styles.hierarchyValue}>
                                {getAvailableUnions(formData.parentDivision)[0]}
                              </Text>
                            </View>
                            <MaterialCommunityIcons
                              name={ICONS.CHECK_CIRCLE}
                              size={designTokens.iconSize.sm}
                              color={colors.success}
                            />
                          </View>
                        ) : formData.parentUnion ? (
                          <TouchableOpacity
                            style={[styles.filterOption, styles.filterOptionActive]}
                            onPress={() => setFormData({ ...formData, parentUnion: EMPTY_VALUE })}
                          >
                            <View style={styles.filterOptionContent}>
                              <MaterialCommunityIcons
                                name={ICONS.DOMAIN}
                                size={designTokens.iconSize.md}
                                color={colors.primary}
                              />
                              <Text
                                style={[styles.filterOptionText, styles.filterOptionTextActive]}
                              >
                                {formData.parentUnion}
                              </Text>
                            </View>
                            <MaterialCommunityIcons
                              name={ICONS.CLOSE_CIRCLE}
                              size={designTokens.iconSize.md}
                              color={colors.textTertiary}
                            />
                          </TouchableOpacity>
                        ) : (
                          <>
                            <StandardInput
                              placeholder={t('screens.organizationManagement.searchUnions')}
                              icon={ICONS.MAGNIFY}
                              value={parentUnionSearch}
                              onChangeText={setParentUnionSearch}
                            />
                            {filterBySearch(
                              getAvailableUnions(formData.parentDivision),
                              parentUnionSearch
                            ).map((union) => (
                              <TouchableOpacity
                                key={union}
                                style={styles.filterOption}
                                onPress={() => setFormData({ ...formData, parentUnion: union })}
                              >
                                <View style={styles.filterOptionContent}>
                                  <MaterialCommunityIcons
                                    name={ICONS.DOMAIN}
                                    size={designTokens.iconSize.md}
                                    color={colors.textTertiary}
                                  />
                                  <Text style={styles.filterOptionText}>{union}</Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </>
                        )}
                      </View>
                    )}
                  </>
                )}

              {/* Church: Cascading selection Division → Union → Association */}
              {selectedType === HIERARCHY_FIELDS.CHURCH && getAvailableDivisions().length > 0 && (
                <>
                  {/* Step 1: Select Division */}
                  <View style={styles.filterSection}>
                    <View style={styles.filterSectionHeader}>
                      <Text style={styles.filterSectionTitle}>
                        {t('screens.organizationManagement.selectDivision')}
                      </Text>
                      {!formData.parentDivision && getAvailableDivisions().length > 1 && (
                        <Text style={styles.resultsCount}>
                          {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length} of{' '}
                          {getAvailableDivisions().length}
                        </Text>
                      )}
                    </View>

                    {getAvailableDivisions().length === 1 ? (
                      <View style={styles.hierarchyItem}>
                        <MaterialCommunityIcons
                          name={ICONS.EARTH}
                          size={designTokens.iconSize.sm}
                          color={colors.primary}
                        />
                        <View style={styles.hierarchyInfo}>
                          <Text style={styles.hierarchyLabel}>
                            {t('components.organizationHierarchy.levels.division')}
                          </Text>
                          <Text style={styles.hierarchyValue}>{getAvailableDivisions()[0]}</Text>
                        </View>
                        <MaterialCommunityIcons
                          name={ICONS.CHECK_CIRCLE}
                          size={designTokens.iconSize.sm}
                          color={colors.success}
                        />
                      </View>
                    ) : formData.parentDivision ? (
                      <TouchableOpacity
                        style={[styles.filterOption, styles.filterOptionActive]}
                        onPress={() =>
                          setFormData({
                            ...formData,
                            parentDivision: EMPTY_VALUE,
                            parentUnion: EMPTY_VALUE,
                            parentAssociation: EMPTY_VALUE,
                          })
                        }
                      >
                        <View style={styles.filterOptionContent}>
                          <MaterialCommunityIcons
                            name={ICONS.EARTH}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                          <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>
                            {formData.parentDivision}
                          </Text>
                        </View>
                        <MaterialCommunityIcons
                          name={ICONS.CLOSE_CIRCLE}
                          size={designTokens.iconSize.md}
                          color={colors.textTertiary}
                        />
                      </TouchableOpacity>
                    ) : (
                      <>
                        <StandardInput
                          placeholder={t('screens.organizationManagement.searchDivisions')}
                          icon={ICONS.MAGNIFY}
                          value={parentDivisionSearch}
                          onChangeText={setParentDivisionSearch}
                        />
                        {filterBySearch(getAvailableDivisions(), parentDivisionSearch).map(
                          (division) => (
                            <TouchableOpacity
                              key={division}
                              style={styles.filterOption}
                              onPress={() =>
                                setFormData({
                                  ...formData,
                                  parentDivision: division,
                                  parentUnion: EMPTY_VALUE,
                                  parentAssociation: EMPTY_VALUE,
                                })
                              }
                            >
                              <View style={styles.filterOptionContent}>
                                <MaterialCommunityIcons
                                  name={ICONS.EARTH}
                                  size={designTokens.iconSize.md}
                                  color={colors.textTertiary}
                                />
                                <Text style={styles.filterOptionText}>{division}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        )}
                      </>
                    )}
                  </View>

                  {/* Step 2: Select Union (filtered by Division) */}
                  {formData.parentDivision && (
                    <View style={styles.filterSection}>
                      <View style={styles.filterSectionHeader}>
                        <Text style={styles.filterSectionTitle}>
                          {t('screens.organizationManagement.selectUnion')}
                        </Text>
                        {!formData.parentUnion &&
                          getAvailableUnions(formData.parentDivision).length > 1 && (
                            <Text style={styles.resultsCount}>
                              {
                                filterBySearch(
                                  getAvailableUnions(formData.parentDivision),
                                  parentUnionSearch
                                ).length
                              }{' '}
                              of {getAvailableUnions(formData.parentDivision).length}
                            </Text>
                          )}
                      </View>

                      {getAvailableUnions(formData.parentDivision).length === 0 ? (
                        <Text style={styles.noResultsText}>
                          {t('screens.organizationManagement.noUnionsIn', {
                            division: formData.parentDivision,
                          })}
                        </Text>
                      ) : getAvailableUnions(formData.parentDivision).length === 1 ? (
                        <View style={styles.hierarchyItem}>
                          <MaterialCommunityIcons
                            name={ICONS.DOMAIN}
                            size={designTokens.iconSize.sm}
                            color={colors.info}
                          />
                          <View style={styles.hierarchyInfo}>
                            <Text style={styles.hierarchyLabel}>
                              {t('components.organizationHierarchy.levels.union')}
                            </Text>
                            <Text style={styles.hierarchyValue}>
                              {getAvailableUnions(formData.parentDivision)[0]}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name={ICONS.CHECK_CIRCLE}
                            size={designTokens.iconSize.sm}
                            color={colors.success}
                          />
                        </View>
                      ) : formData.parentUnion ? (
                        <TouchableOpacity
                          style={[styles.filterOption, styles.filterOptionActive]}
                          onPress={() =>
                            setFormData({
                              ...formData,
                              parentUnion: EMPTY_VALUE,
                              parentAssociation: EMPTY_VALUE,
                            })
                          }
                        >
                          <View style={styles.filterOptionContent}>
                            <MaterialCommunityIcons
                              name={ICONS.DOMAIN}
                              size={designTokens.iconSize.md}
                              color={colors.primary}
                            />
                            <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>
                              {formData.parentUnion}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name={ICONS.CLOSE_CIRCLE}
                            size={designTokens.iconSize.md}
                            color={colors.textTertiary}
                          />
                        </TouchableOpacity>
                      ) : (
                        <>
                          <StandardInput
                            placeholder={t('screens.organizationManagement.searchUnions')}
                            icon={ICONS.MAGNIFY}
                            value={parentUnionSearch}
                            onChangeText={setParentUnionSearch}
                          />
                          {filterBySearch(
                            getAvailableUnions(formData.parentDivision),
                            parentUnionSearch
                          ).map((union) => (
                            <TouchableOpacity
                              key={union}
                              style={styles.filterOption}
                              onPress={() =>
                                setFormData({
                                  ...formData,
                                  parentUnion: union,
                                  parentAssociation: EMPTY_VALUE,
                                })
                              }
                            >
                              <View style={styles.filterOptionContent}>
                                <MaterialCommunityIcons
                                  name={ICONS.DOMAIN}
                                  size={designTokens.iconSize.md}
                                  color={colors.textTertiary}
                                />
                                <Text style={styles.filterOptionText}>{union}</Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}
                    </View>
                  )}

                  {/* Step 3: Select Association (filtered by Union) */}
                  {formData.parentUnion && (
                    <View style={styles.filterSection}>
                      <View style={styles.filterSectionHeader}>
                        <Text style={styles.filterSectionTitle}>
                          {t('screens.organizationManagement.selectAssociation')}
                        </Text>
                        {!formData.parentAssociation &&
                          getAvailableAssociations(formData.parentUnion).length > 1 && (
                            <Text style={styles.resultsCount}>
                              {
                                filterBySearch(
                                  getAvailableAssociations(formData.parentUnion),
                                  parentAssociationSearch
                                ).length
                              }{' '}
                              of {getAvailableAssociations(formData.parentUnion).length}
                            </Text>
                          )}
                      </View>

                      {getAvailableAssociations(formData.parentUnion).length === 0 ? (
                        <Text style={styles.noResultsText}>
                          {t('screens.organizationManagement.noAssociationsIn', {
                            union: formData.parentUnion,
                          })}
                        </Text>
                      ) : getAvailableAssociations(formData.parentUnion).length === 1 ? (
                        <View style={styles.hierarchyItem}>
                          <MaterialCommunityIcons
                            name={ICONS.OFFICE_BUILDING}
                            size={designTokens.iconSize.sm}
                            color={colors.warning}
                          />
                          <View style={styles.hierarchyInfo}>
                            <Text style={styles.hierarchyLabel}>
                              {t('components.organizationHierarchy.levels.association')}
                            </Text>
                            <Text style={styles.hierarchyValue}>
                              {getAvailableAssociations(formData.parentUnion)[0]}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name={ICONS.CHECK_CIRCLE}
                            size={designTokens.iconSize.sm}
                            color={colors.success}
                          />
                        </View>
                      ) : formData.parentAssociation ? (
                        <TouchableOpacity
                          style={[styles.filterOption, styles.filterOptionActive]}
                          onPress={() =>
                            setFormData({ ...formData, parentAssociation: EMPTY_VALUE })
                          }
                        >
                          <View style={styles.filterOptionContent}>
                            <MaterialCommunityIcons
                              name={ICONS.OFFICE_BUILDING}
                              size={designTokens.iconSize.md}
                              color={colors.primary}
                            />
                            <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>
                              {formData.parentAssociation}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name={ICONS.CLOSE_CIRCLE}
                            size={designTokens.iconSize.md}
                            color={colors.textTertiary}
                          />
                        </TouchableOpacity>
                      ) : (
                        <>
                          <StandardInput
                            placeholder={t('screens.organizationManagement.searchAssociations')}
                            icon={ICONS.MAGNIFY}
                            value={parentAssociationSearch}
                            onChangeText={setParentAssociationSearch}
                          />
                          {filterBySearch(
                            getAvailableAssociations(formData.parentUnion),
                            parentAssociationSearch
                          ).map((association) => (
                            <TouchableOpacity
                              key={association}
                              style={styles.filterOption}
                              onPress={() =>
                                setFormData({ ...formData, parentAssociation: association })
                              }
                            >
                              <View style={styles.filterOptionContent}>
                                <MaterialCommunityIcons
                                  name={ICONS.OFFICE_BUILDING}
                                  size={designTokens.iconSize.md}
                                  color={colors.textTertiary}
                                />
                                <Text style={styles.filterOptionText}>{association}</Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}
                    </View>
                  )}
                </>
              )}

              {/* Name Input Section - AFTER parent selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.organizationManagement.typeInformation', {
                    type: getTypeLabel(selectedType),
                  })}
                </Text>

                <StandardInput
                  label={t('screens.organizationManagement.typeName', {
                    type: getTypeLabel(selectedType),
                  })}
                  icon={getTypeIcon(selectedType)}
                  placeholder={t('screens.organizationManagement.enterTypeName', {
                    type: getTypeLabel(selectedType).toLowerCase(),
                  })}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  required
                />
              </View>

              {/* Warning if no parents available */}
              {((selectedType === HIERARCHY_FIELDS.UNION && getAvailableParents().length === 0) ||
                (selectedType === HIERARCHY_FIELDS.ASSOCIATION &&
                  getAvailableParents().length === 0) ||
                (selectedType === HIERARCHY_FIELDS.CHURCH &&
                  getAvailableParents().length === 0)) && (
                <View style={styles.warningBanner}>
                  <MaterialCommunityIcons
                    name={ICONS.ALERT}
                    size={designTokens.iconSize.md}
                    color={colors.warning}
                  />
                  <Text style={styles.warningText}>
                    {t('screens.organizationManagement.noParentAvailable', {
                      parentType:
                        selectedType === HIERARCHY_FIELDS.UNION
                          ? t('components.organizationHierarchy.levels.division').toLowerCase()
                          : selectedType === HIERARCHY_FIELDS.ASSOCIATION
                            ? t('components.organizationHierarchy.levels.union').toLowerCase()
                            : t(
                                'components.organizationHierarchy.levels.association'
                              ).toLowerCase(),
                    })}
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                accessibilityRole={A11Y_ROLE.BUTTON}
                accessibilityLabel={t('common.cancel')}
              >
                <MaterialCommunityIcons
                  name={ICONS.CLOSE_CIRCLE}
                  size={designTokens.iconSize.sm}
                  color={colors.textSecondary}
                />
                <Text style={styles.clearButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleSave}
                accessibilityRole={A11Y_ROLE.BUTTON}
                accessibilityLabel={
                  editMode
                    ? t('screens.organizationManagement.saveChanges')
                    : t('screens.organizationManagement.createOrganization')
                }
              >
                <MaterialCommunityIcons
                  name={editMode ? ICONS.CONTENT_SAVE : ICONS.PLUS_CIRCLE}
                  size={designTokens.iconSize.sm}
                  color={colors.textInverse}
                />
                <Text style={styles.applyButtonText}>
                  {editMode
                    ? t('screens.organizationManagement.save')
                    : t('screens.organizationManagement.create')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  typeSelectorContainer: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  typeSelector: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  typeButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    gap: designTokens.spacing.xs,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: borderValues.color.transparent,
    minHeight: dimensionValues.minHeight.touchTarget,
  },
  typeButtonActive: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  typeButtonText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  typeButtonTextActive: {
    color: designTokens.colors.textInverse,
  },
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  searchContainer: {
    flex: flexValues.one,
  },
  createButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.xs,
    minHeight: dimensionValues.minHeight.touchTargetStandard,
  },
  createButtonText: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
  content: {
    flex: flexValues.one,
    padding: designTokens.spacing.lg,
  },
  loadingText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    textAlign: layoutConstants.textAlign.center,
    marginTop: designTokens.spacing.xl,
  },
  orgCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    ...designTokens.shadows.sm,
  },
  orgCardHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  orgCardTitle: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: flexValues.one,
    gap: designTokens.spacing.sm,
  },
  orgCardInfo: {
    flex: flexValues.one,
  },
  orgName: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xxs,
  },
  orgParent: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
  },
  deleteButton: {
    padding: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.md,
    minWidth: dimensionValues.minWidth.iconButtonSmall,
    minHeight: dimensionValues.minHeight.iconButtonSmall,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  orgCardFooter: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  orgClubCount: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
  },
  modalOverlay: {
    flex: flexValues.one,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
  },
  modalOverlayMobile: {
    justifyContent: layoutConstants.justifyContent.flexEnd,
    padding: designTokens.spacing.none,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius['3xl'],
    width: dimensionValues.width.full,
    maxWidth: dimensionValues.maxWidth.modal,
    maxHeight: dimensionValues.maxHeight.modalPercent,
  },
  modalContentMobile: {
    maxWidth: dimensionValues.maxWidthPercent.full,
    borderBottomLeftRadius: borderValues.radius.none,
    borderBottomRightRadius: borderValues.radius.none,
    borderTopLeftRadius: designTokens.borderRadius['3xl'],
    borderTopRightRadius: designTokens.borderRadius['3xl'],
  },
  modalHandle: {
    width: designTokens.componentSizes.iconContainer.md,
    height: dimensionValues.height.dragHandle,
    backgroundColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: layoutConstants.alignSelf.center,
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  modalHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  modalTitle: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  modalBody: {
    maxHeight: dimensionValues.maxHeight.modalBodyMedium,
  },
  hierarchyInfoBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    backgroundColor: designTokens.colors.primaryLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.none,
    gap: designTokens.spacing.sm,
  },
  hierarchyInfoText: {
    flex: flexValues.one,
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    lineHeight: typographyValues.lineHeight.md,
  },
  filterSection: {
    padding: designTokens.spacing.lg,
  },
  filterSectionHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  filterSectionTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  resultsCount: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: designTokens.fontWeight.medium,
  },
  hierarchyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  hierarchyInfo: {
    flex: flexValues.one,
  },
  hierarchyLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: designTokens.fontWeight.semibold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
    marginBottom: designTokens.spacing.xxs,
  },
  hierarchyValue: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textPrimary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  filterOption: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: borderValues.color.transparent,
    minHeight: dimensionValues.minHeight.filterOption,
  },
  filterOptionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  filterOptionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: flexValues.one,
    gap: designTokens.spacing.md,
  },
  filterOptionText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    flex: flexValues.one,
  },
  filterOptionTextActive: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  warningBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    backgroundColor: designTokens.colors.warningLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
  },
  warningText: {
    flex: flexValues.one,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.warning,
    lineHeight: typographyValues.lineHeight.lg,
  },
  noResultsText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textTertiary,
    textAlign: layoutConstants.textAlign.center,
    padding: designTokens.spacing.lg,
    fontStyle: layoutConstants.fontStyle.italic,
  },
  modalFooter: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  clearButton: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: layoutConstants.alignItems.center,
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.xs,
    minHeight: dimensionValues.minHeight.selectItem,
  },
  clearButtonText: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
  },
  applyButton: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary,
    alignItems: layoutConstants.alignItems.center,
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.xs,
    minHeight: dimensionValues.minHeight.selectItem,
  },
  applyButtonText: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
});
