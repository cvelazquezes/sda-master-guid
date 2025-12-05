import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  Text,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { clubService } from '../../services/clubService';
import { useTheme } from '../../contexts/ThemeContext';
import { Club, MatchFrequency } from '../../types';
import { ClubCard } from '../../components/ClubCard';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import {
  ScreenHeader,
  SearchBar,
  EmptyState,
  StandardButton,
  StandardInput,
} from '../../shared/components';
import {
  mobileTypography,
  mobileFontSizes,
  designTokens,
  layoutConstants,
} from '../../shared/theme';
import {
  ALERT_BUTTON_STYLE,
  ANIMATION,
  BREAKPOINTS,
  CLUB_SETTINGS,
  EMPTY_VALUE,
  FILTER_STATUS,
  HIERARCHY_FIELDS,
  ICONS,
  KEYBOARD_TYPE,
  MESSAGES,
  borderValues,
  dimensionValues,
  dynamicMessages,
  flexValues,
  textTransformValues,
  typographyValues,
} from '../../shared/constants';

const ClubsManagementScreen = () => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = windowWidth < BREAKPOINTS.MOBILE;

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);
  const [filters, setFilters] = useState({
    division: EMPTY_VALUE,
    union: EMPTY_VALUE,
    association: EMPTY_VALUE,
    church: EMPTY_VALUE,
    clubId: EMPTY_VALUE,
    status: FILTER_STATUS.ALL,
  });
  const [formData, setFormData] = useState({
    name: EMPTY_VALUE,
    description: EMPTY_VALUE,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: CLUB_SETTINGS.defaultGroupSize,
    church: EMPTY_VALUE,
    association: EMPTY_VALUE,
    union: EMPTY_VALUE,
    division: EMPTY_VALUE,
  });

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const clubsData = await clubService.getAllClubs();
      setClubs(clubsData);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_CLUBS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadClubs();
  };

  const handleCreateClub = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.church ||
      !formData.association ||
      !formData.union ||
      !formData.division
    ) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.MISSING_REQUIRED_FIELDS);
      return;
    }

    try {
      await clubService.createClub(
        formData.name,
        formData.description,
        formData.matchFrequency,
        formData.groupSize,
        formData.church,
        formData.association,
        formData.union,
        formData.division
      );
      Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.CLUB_CREATED);
      setModalVisible(false);
      resetForm();
      loadClubs();
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_CREATE_CLUB);
    }
  };

  const handleToggleClubStatus = async (clubId: string, isActive: boolean) => {
    try {
      await clubService.updateClub(clubId, { isActive: !isActive });
      loadClubs();
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_CLUB_STATUS);
    }
  };

  const handleDeleteClub = (clubId: string, clubName: string) => {
    Alert.alert(MESSAGES.TITLES.DELETE_CLUB, dynamicMessages.confirmDeleteClub(clubName), [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.DELETE,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: async () => {
          try {
            await clubService.deleteClub(clubId);
            loadClubs();
          } catch (error) {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_DELETE_CLUB);
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setFormData({
      name: EMPTY_VALUE,
      description: EMPTY_VALUE,
      matchFrequency: MatchFrequency.WEEKLY,
      groupSize: 2,
      church: EMPTY_VALUE,
      association: EMPTY_VALUE,
      union: EMPTY_VALUE,
      division: EMPTY_VALUE,
    });
  };

  const clearFilters = () => {
    setFilters({
      division: EMPTY_VALUE,
      union: EMPTY_VALUE,
      association: EMPTY_VALUE,
      church: EMPTY_VALUE,
      clubId: EMPTY_VALUE,
      status: FILTER_STATUS.ALL,
    });
    setSearchQuery(EMPTY_VALUE);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.division) count++;
    if (filters.union) count++;
    if (filters.association) count++;
    if (filters.church) count++;
    if (filters.clubId) count++;
    if (filters.status !== FILTER_STATUS.ALL) count++;
    if (searchQuery) count++;
    return count;
  };

  // Type for hierarchy fields only - using HIERARCHY_FIELDS constant values
  type HierarchyField =
    | typeof HIERARCHY_FIELDS.DIVISION
    | typeof HIERARCHY_FIELDS.UNION
    | typeof HIERARCHY_FIELDS.ASSOCIATION
    | typeof HIERARCHY_FIELDS.CHURCH;

  // Get unique values for hierarchical filters (from clubs)
  const getUniqueClubValues = (field: HierarchyField) => {
    let filteredClubs = clubs;

    // Apply hierarchical filtering based on the field
    if (field === HIERARCHY_FIELDS.UNION && filters.division) {
      filteredClubs = clubs.filter((club) => club.division === filters.division);
    } else if (field === HIERARCHY_FIELDS.ASSOCIATION && filters.union) {
      filteredClubs = clubs.filter((club) => {
        if (filters.division && club.division !== filters.division) return false;
        if (club.union !== filters.union) return false;
        return true;
      });
    } else if (field === HIERARCHY_FIELDS.CHURCH && filters.association) {
      filteredClubs = clubs.filter((club) => {
        if (filters.division && club.division !== filters.division) return false;
        if (filters.union && club.union !== filters.union) return false;
        if (club.association !== filters.association) return false;
        return true;
      });
    }

    const values = filteredClubs.map((club) => club[field]).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  // Get available options without empty string for smart auto-selection
  const availableDivisions = getUniqueClubValues(HIERARCHY_FIELDS.DIVISION);
  const availableUnions = getUniqueClubValues(HIERARCHY_FIELDS.UNION);
  const availableAssociations = getUniqueClubValues(HIERARCHY_FIELDS.ASSOCIATION);
  const availableChurches = getUniqueClubValues(HIERARCHY_FIELDS.CHURCH);

  // Auto-select when only one option exists and filter modal opens
  useEffect(() => {
    if (filterVisible) {
      // Auto-select division if only one exists
      if (availableDivisions.length === 1 && !filters.division) {
        setFilters((prev) => ({ ...prev, [HIERARCHY_FIELDS.DIVISION]: availableDivisions[0] }));
      }
      // Auto-select union if only one exists
      if (availableUnions.length === 1 && !filters.union) {
        setFilters((prev) => ({ ...prev, [HIERARCHY_FIELDS.UNION]: availableUnions[0] }));
      }
      // Auto-select association if only one exists
      if (availableAssociations.length === 1 && !filters.association) {
        setFilters((prev) => ({
          ...prev,
          [HIERARCHY_FIELDS.ASSOCIATION]: availableAssociations[0],
        }));
      }
      // Auto-select church if only one exists
      if (availableChurches.length === 1 && !filters.church) {
        setFilters((prev) => ({ ...prev, [HIERARCHY_FIELDS.CHURCH]: availableChurches[0] }));
      }
    }
  }, [
    filterVisible,
    availableDivisions,
    availableUnions,
    availableAssociations,
    availableChurches,
  ]);

  // Update filters with cascade logic
  const updateFilter = (field: string, value: string) => {
    const newFilters = { ...filters };

    // Update primary field
    if (field === HIERARCHY_FIELDS.DIVISION) {
      newFilters.division = value;
      // Clear dependent filters
      newFilters.union = EMPTY_VALUE;
      newFilters.association = EMPTY_VALUE;
      newFilters.church = EMPTY_VALUE;

      // Validate union if set
      if (newFilters.union) {
        const validUnions = getUniqueClubValues(HIERARCHY_FIELDS.UNION);
        if (!validUnions.includes(newFilters.union)) {
          newFilters.union = EMPTY_VALUE;
        }
      }
    } else if (field === HIERARCHY_FIELDS.UNION) {
      newFilters.union = value;
      // Clear dependent filters
      newFilters.association = EMPTY_VALUE;
      newFilters.church = EMPTY_VALUE;

      // Validate association if set
      if (newFilters.association) {
        const validAssociations = getUniqueClubValues(HIERARCHY_FIELDS.ASSOCIATION);
        if (!validAssociations.includes(newFilters.association)) {
          newFilters.association = EMPTY_VALUE;
        }
      }
    } else if (field === HIERARCHY_FIELDS.ASSOCIATION) {
      newFilters.association = value;
      // Clear dependent filters
      newFilters.church = EMPTY_VALUE;

      // Validate church if set
      if (newFilters.church) {
        const validChurches = getUniqueClubValues(HIERARCHY_FIELDS.CHURCH);
        if (!validChurches.includes(newFilters.church)) {
          newFilters.church = EMPTY_VALUE;
        }
      }
    } else if (field === HIERARCHY_FIELDS.CHURCH) {
      newFilters.church = value;
    } else if (field === HIERARCHY_FIELDS.STATUS) {
      newFilters.status = value;
    }

    setFilters(newFilters);
  };

  const filteredClubs = clubs.filter((club) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        club.name.toLowerCase().includes(query) || club.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (filters.division && club.division !== filters.division) return false;
    if (filters.union && club.union !== filters.union) return false;
    if (filters.association && club.association !== filters.association) return false;
    if (filters.church && club.church !== filters.church) return false;
    if (filters.clubId && club.id !== filters.clubId) return false;
    if (filters.status === FILTER_STATUS.ACTIVE && !club.isActive) return false;
    if (filters.status === FILTER_STATUS.INACTIVE && club.isActive) return false;

    return true;
  });

  // Match Frequency options
  const matchFrequencyOptions = [
    {
      id: MatchFrequency.WEEKLY,
      title: t('components.frequencyOptions.weekly'),
      subtitle: t('components.frequencyOptions.weeklySubtitle'),
      icon: ICONS.CALENDAR_WEEK,
      iconColor: colors.primary,
    },
    {
      id: MatchFrequency.BIWEEKLY,
      title: t('components.frequencyOptions.biweekly'),
      subtitle: t('components.frequencyOptions.biweeklySubtitle'),
      icon: ICONS.CALENDAR_RANGE,
      iconColor: designTokens.colors.info,
    },
    {
      id: MatchFrequency.MONTHLY,
      title: t('components.frequencyOptions.monthly'),
      subtitle: t('components.frequencyOptions.monthlySubtitle'),
      icon: ICONS.CALENDAR_MONTH,
      iconColor: colors.warning,
    },
  ];

  // Get unique values for form hierarchy (for Create Club modal)
  const getFormUniqueValues = (field: HierarchyField) => {
    let filteredClubs = clubs;

    // Apply hierarchical filtering based on current form selections
    if (field === HIERARCHY_FIELDS.UNION && formData.division) {
      filteredClubs = clubs.filter((club) => club.division === formData.division);
    } else if (field === HIERARCHY_FIELDS.ASSOCIATION && formData.union) {
      filteredClubs = clubs.filter((club) => {
        if (formData.division && club.division !== formData.division) return false;
        if (club.union !== formData.union) return false;
        return true;
      });
    } else if (field === HIERARCHY_FIELDS.CHURCH && formData.association) {
      filteredClubs = clubs.filter((club) => {
        if (formData.division && club.division !== formData.division) return false;
        if (formData.union && club.union !== formData.union) return false;
        if (club.association !== formData.association) return false;
        return true;
      });
    }

    const values = filteredClubs.map((club) => club[field]).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  // Get available options for each hierarchy level in form
  const formAvailableDivisions = getFormUniqueValues(HIERARCHY_FIELDS.DIVISION);
  const formAvailableUnions = getFormUniqueValues(HIERARCHY_FIELDS.UNION);
  const formAvailableAssociations = getFormUniqueValues(HIERARCHY_FIELDS.ASSOCIATION);
  const formAvailableChurches = getFormUniqueValues(HIERARCHY_FIELDS.CHURCH);

  // Auto-populate hierarchy when create modal opens
  useEffect(() => {
    if (modalVisible && clubs.length > 0) {
      // Auto-select division if only one exists and not already set
      if (formAvailableDivisions.length === 1 && !formData.division) {
        setFormData((prev) => ({ ...prev, division: formAvailableDivisions[0] }));
      }
      // Auto-select union if only one exists and not already set
      if (formAvailableUnions.length === 1 && !formData.union && formData.division) {
        setFormData((prev) => ({ ...prev, union: formAvailableUnions[0] }));
      }
      // Auto-select association if only one exists and not already set
      if (formAvailableAssociations.length === 1 && !formData.association && formData.union) {
        setFormData((prev) => ({ ...prev, association: formAvailableAssociations[0] }));
      }
      // Auto-select church if only one exists and not already set
      if (formAvailableChurches.length === 1 && !formData.church && formData.association) {
        setFormData((prev) => ({ ...prev, church: formAvailableChurches[0] }));
      }
    }
  }, [
    modalVisible,
    formAvailableDivisions,
    formAvailableUnions,
    formAvailableAssociations,
    formAvailableChurches,
  ]);

  // Handle hierarchy selection in form with cascading clear
  const handleFormFieldUpdate = (field: string, value: string) => {
    const newFormData = { ...formData };

    if (field === HIERARCHY_FIELDS.DIVISION) {
      newFormData.division = value;
      // Clear dependent fields
      newFormData.union = EMPTY_VALUE;
      newFormData.association = EMPTY_VALUE;
      newFormData.church = EMPTY_VALUE;
    } else if (field === HIERARCHY_FIELDS.UNION) {
      newFormData.union = value;
      // Clear dependent fields
      newFormData.association = EMPTY_VALUE;
      newFormData.church = EMPTY_VALUE;
    } else if (field === HIERARCHY_FIELDS.ASSOCIATION) {
      newFormData.association = value;
      // Clear dependent field
      newFormData.church = EMPTY_VALUE;
    } else if (field === HIERARCHY_FIELDS.CHURCH) {
      newFormData.church = value;
    }

    setFormData(newFormData);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader
        title={t('screens.clubsManagement.title')}
        subtitle={t('screens.clubsManagement.subtitle', {
          filtered: filteredClubs.length,
          total: clubs.length,
        })}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={MESSAGES.PLACEHOLDERS.SEARCH_CLUBS}
        onFilterPress={() => setFilterVisible(true)}
        filterActive={getActiveFilterCount() > 0}
      />

      <View style={styles.content}>
        <StandardButton
          title={t('screens.clubsManagement.createNewClub')}
          onPress={() => setModalVisible(true)}
          icon={ICONS.PLUS}
        />

        {loading ? (
          <EmptyState
            icon={ICONS.LOADING}
            title={t('screens.clubsManagement.loadingClubs')}
            description={t('screens.clubsManagement.pleaseWait')}
          />
        ) : filteredClubs.length === 0 ? (
          <EmptyState
            icon={ICONS.ACCOUNT_GROUP_OUTLINE}
            title={t('screens.clubsManagement.noClubsFound')}
            description={
              clubs.length === 0
                ? t('screens.clubsManagement.noClubsInSystem')
                : t('screens.clubsManagement.tryAdjustingFilters')
            }
          />
        ) : (
          filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              onPress={() => {
                setSelectedClub(club);
                setDetailVisible(true);
              }}
              showAdminActions={true}
              onToggleStatus={() => handleToggleClubStatus(club.id, club.isActive)}
              onDelete={() => handleDeleteClub(club.id, club.name)}
            />
          ))
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType={isMobile ? ANIMATION.SLIDE : ANIMATION.FADE}
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
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
            {/* Drag Handle - Mobile Only */}
            {isMobile && (
              <View style={[styles.dragHandle, { backgroundColor: colors.borderLight }]} />
            )}

            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {t('screens.clubsManagement.filterClubs')}
              </Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)} style={styles.closeButton}>
                <MaterialCommunityIcons
                  name={ICONS.CLOSE}
                  size={designTokens.iconSize.lg}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Hierarchical Filter Info */}
              <View style={[styles.hierarchyInfoBanner, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons
                  name={ICONS.INFORMATION}
                  size={designTokens.iconSize.sm}
                  color={colors.primary}
                />
                <Text style={[styles.hierarchyInfoText, { color: colors.primary }]}>
                  {t('screens.clubsManagement.filterDescription')}
                </Text>
              </View>

              {/* Organization Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.clubsManagement.organizationSection')}
                </Text>

                {/* Division */}
                {availableDivisions.length === 1 ? (
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
                      <Text style={styles.hierarchyValue}>{availableDivisions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.division')}
                    </Text>
                    {availableDivisions.map((division) => (
                      <TouchableOpacity
                        key={division}
                        style={[
                          styles.filterOption,
                          filters.division === division && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter(HIERARCHY_FIELDS.DIVISION, division)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            filters.division === division && styles.filterOptionTextActive,
                          ]}
                        >
                          {division}
                        </Text>
                        {filters.division === division && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Union */}
                {availableUnions.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons
                      name={ICONS.DOMAIN}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>
                        {t('components.organizationHierarchy.levels.union')}
                      </Text>
                      <Text style={styles.hierarchyValue}>{availableUnions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : availableUnions.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.union')}
                    </Text>
                    {availableUnions.map((union) => (
                      <TouchableOpacity
                        key={union}
                        style={[
                          styles.filterOption,
                          filters.union === union && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter(HIERARCHY_FIELDS.UNION, union)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            filters.union === union && styles.filterOptionTextActive,
                          ]}
                        >
                          {union}
                        </Text>
                        {filters.union === union && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {/* Association */}
                {availableAssociations.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons
                      name={ICONS.OFFICE_BUILDING}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>
                        {t('components.organizationHierarchy.levels.association')}
                      </Text>
                      <Text style={styles.hierarchyValue}>{availableAssociations[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : availableAssociations.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.association')}
                    </Text>
                    {availableAssociations.map((association) => (
                      <TouchableOpacity
                        key={association}
                        style={[
                          styles.filterOption,
                          filters.association === association && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter(HIERARCHY_FIELDS.ASSOCIATION, association)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            filters.association === association && styles.filterOptionTextActive,
                          ]}
                        >
                          {association}
                        </Text>
                        {filters.association === association && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {/* Church */}
                {availableChurches.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons
                      name={ICONS.CHURCH}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>
                        {t('components.organizationHierarchy.levels.church')}
                      </Text>
                      <Text style={styles.hierarchyValue}>{availableChurches[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : availableChurches.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.church')}
                    </Text>
                    {availableChurches.map((church) => (
                      <TouchableOpacity
                        key={church}
                        style={[
                          styles.filterOption,
                          filters.church === church && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter(HIERARCHY_FIELDS.CHURCH, church)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            filters.church === church && styles.filterOptionTextActive,
                          ]}
                        >
                          {church}
                        </Text>
                        {filters.church === church && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* Status Filter Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.clubsManagement.clubStatusSection')}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filters.status === FILTER_STATUS.ALL && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.STATUS, FILTER_STATUS.ALL)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.ACCOUNT_GROUP}
                      size={designTokens.iconSize.md}
                      color={
                        filters.status === FILTER_STATUS.ALL ? colors.primary : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === FILTER_STATUS.ALL && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.clubsManagement.allClubs')}
                    </Text>
                  </View>
                  {filters.status === FILTER_STATUS.ALL && (
                    <MaterialCommunityIcons
                      name={ICONS.CHECK}
                      size={designTokens.iconSize.md}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filters.status === FILTER_STATUS.ACTIVE && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.STATUS, FILTER_STATUS.ACTIVE)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.md}
                      color={
                        filters.status === FILTER_STATUS.ACTIVE ? colors.primary : colors.success
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === FILTER_STATUS.ACTIVE && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.clubsManagement.activeOnly')}
                    </Text>
                  </View>
                  {filters.status === FILTER_STATUS.ACTIVE && (
                    <MaterialCommunityIcons
                      name={ICONS.CHECK}
                      size={designTokens.iconSize.md}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filters.status === FILTER_STATUS.INACTIVE && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.STATUS, FILTER_STATUS.INACTIVE)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.CANCEL}
                      size={designTokens.iconSize.md}
                      color={
                        filters.status === FILTER_STATUS.INACTIVE ? colors.primary : colors.error
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === FILTER_STATUS.INACTIVE && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.clubsManagement.inactiveOnly')}
                    </Text>
                  </View>
                  {filters.status === FILTER_STATUS.INACTIVE && (
                    <MaterialCommunityIcons
                      name={ICONS.CHECK}
                      size={designTokens.iconSize.md}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <MaterialCommunityIcons
                  name={ICONS.FILTER_OFF}
                  size={designTokens.iconSize.md}
                  color={colors.textSecondary}
                />
                <Text style={styles.clearButtonText}>{t('screens.clubsManagement.clearAll')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterVisible(false)}>
                <Text style={styles.applyButtonText}>
                  {t('screens.clubsManagement.applyFilters')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Club Modal */}
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
            {/* Drag Handle - Mobile Only */}
            {isMobile && (
              <View style={[styles.dragHandle, { backgroundColor: colors.borderLight }]} />
            )}

            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {t('screens.clubsManagement.createNewClub')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name={ICONS.CLOSE}
                  size={designTokens.iconSize.lg}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Hierarchical Filter Info - Top of Modal */}
              <View style={[styles.hierarchyInfoBanner, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons
                  name={ICONS.INFORMATION}
                  size={designTokens.iconSize.sm}
                  color={colors.primary}
                />
                <Text style={[styles.hierarchyInfoText, { color: colors.primary }]}>
                  {t('screens.clubsManagement.filterDescription')}
                </Text>
              </View>

              {/* Club Information Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.clubsManagement.clubInformationSection')}
                </Text>

                <StandardInput
                  label={t('screens.clubsManagement.clubNameLabel')}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder={MESSAGES.PLACEHOLDERS.ENTER_CLUB_NAME}
                  icon={ICONS.ACCOUNT_GROUP}
                  required
                />

                <StandardInput
                  label={t('screens.clubsManagement.descriptionLabel')}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder={MESSAGES.PLACEHOLDERS.ENTER_CLUB_DESCRIPTION}
                  icon={ICONS.TEXT}
                  multiline
                  required
                />
              </View>

              {/* Organization Hierarchy Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.clubsManagement.organizationSection')}
                </Text>

                {/* Division */}
                {formAvailableDivisions.length === 1 ? (
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
                      <Text style={styles.hierarchyValue}>{formAvailableDivisions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : formAvailableDivisions.length > 0 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.division')}
                    </Text>
                    {formAvailableDivisions.map((division) => (
                      <TouchableOpacity
                        key={division}
                        style={[
                          styles.filterOption,
                          formData.division === division && styles.filterOptionActive,
                        ]}
                        onPress={() => handleFormFieldUpdate(HIERARCHY_FIELDS.DIVISION, division)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            formData.division === division && styles.filterOptionTextActive,
                          ]}
                        >
                          {division}
                        </Text>
                        {formData.division === division && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>
                    {t('screens.clubsManagement.noDivisionsAvailable')}
                  </Text>
                )}

                {/* Union */}
                {formAvailableUnions.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons
                      name={ICONS.DOMAIN}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>
                        {t('components.organizationHierarchy.levels.union')}
                      </Text>
                      <Text style={styles.hierarchyValue}>{formAvailableUnions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : formAvailableUnions.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.union')}
                    </Text>
                    {formAvailableUnions.map((union) => (
                      <TouchableOpacity
                        key={union}
                        style={[
                          styles.filterOption,
                          formData.union === union && styles.filterOptionActive,
                        ]}
                        onPress={() => handleFormFieldUpdate(HIERARCHY_FIELDS.UNION, union)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            formData.union === union && styles.filterOptionTextActive,
                          ]}
                        >
                          {union}
                        </Text>
                        {formData.union === union && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : formData.division ? (
                  <Text style={styles.noDataText}>
                    {t('screens.clubsManagement.noUnionsAvailable', {
                      division: formData.division,
                    })}
                  </Text>
                ) : null}

                {/* Association */}
                {formAvailableAssociations.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons
                      name={ICONS.OFFICE_BUILDING}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>
                        {t('components.organizationHierarchy.levels.association')}
                      </Text>
                      <Text style={styles.hierarchyValue}>{formAvailableAssociations[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : formAvailableAssociations.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.association')}
                    </Text>
                    {formAvailableAssociations.map((association) => (
                      <TouchableOpacity
                        key={association}
                        style={[
                          styles.filterOption,
                          formData.association === association && styles.filterOptionActive,
                        ]}
                        onPress={() =>
                          handleFormFieldUpdate(HIERARCHY_FIELDS.ASSOCIATION, association)
                        }
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            formData.association === association && styles.filterOptionTextActive,
                          ]}
                        >
                          {association}
                        </Text>
                        {formData.association === association && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : formData.union ? (
                  <Text style={styles.noDataText}>
                    {t('screens.clubsManagement.noAssociationsAvailable', {
                      union: formData.union,
                    })}
                  </Text>
                ) : null}

                {/* Church */}
                {formAvailableChurches.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons
                      name={ICONS.CHURCH}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>
                        {t('components.organizationHierarchy.levels.church')}
                      </Text>
                      <Text style={styles.hierarchyValue}>{formAvailableChurches[0]}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : formAvailableChurches.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('components.organizationHierarchy.levels.church')}
                    </Text>
                    {formAvailableChurches.map((church) => (
                      <TouchableOpacity
                        key={church}
                        style={[
                          styles.filterOption,
                          formData.church === church && styles.filterOptionActive,
                        ]}
                        onPress={() => handleFormFieldUpdate(HIERARCHY_FIELDS.CHURCH, church)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            formData.church === church && styles.filterOptionTextActive,
                          ]}
                        >
                          {church}
                        </Text>
                        {formData.church === church && (
                          <MaterialCommunityIcons
                            name={ICONS.CHECK}
                            size={designTokens.iconSize.md}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : formData.association ? (
                  <Text style={styles.noDataText}>
                    {t('screens.clubsManagement.noChurchesAvailable', {
                      association: formData.association,
                    })}
                  </Text>
                ) : null}
              </View>

              {/* Club Settings Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.clubsManagement.clubSettingsSection')}
                </Text>

                {/* Match Frequency */}
                <View>
                  <Text style={styles.hierarchyLabel}>
                    {t('screens.clubsManagement.matchFrequency')}
                  </Text>
                  {matchFrequencyOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.filterOption,
                        formData.matchFrequency === option.id && styles.filterOptionActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, matchFrequency: option.id as MatchFrequency })
                      }
                    >
                      <View style={styles.filterOptionContent}>
                        <MaterialCommunityIcons
                          name={option.icon as typeof ICONS.CHECK}
                          size={designTokens.iconSize.md}
                          color={
                            formData.matchFrequency === option.id
                              ? colors.primary
                              : option.iconColor || colors.textSecondary
                          }
                        />
                        <View style={{ flex: flexValues.one }}>
                          <Text
                            style={[
                              styles.filterOptionText,
                              formData.matchFrequency === option.id &&
                                styles.filterOptionTextActive,
                            ]}
                          >
                            {option.title}
                          </Text>
                          {option.subtitle && (
                            <Text style={styles.filterOptionSubtitle}>{option.subtitle}</Text>
                          )}
                        </View>
                      </View>
                      {formData.matchFrequency === option.id && (
                        <MaterialCommunityIcons
                          name={ICONS.CHECK}
                          size={designTokens.iconSize.md}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <StandardInput
                  label={t('screens.clubsManagement.groupSizeLabel')}
                  value={formData.groupSize.toString()}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      groupSize: parseInt(text) || CLUB_SETTINGS.defaultGroupSize,
                    })
                  }
                  placeholder={MESSAGES.PLACEHOLDERS.ENTER_GROUP_SIZE}
                  icon={ICONS.ACCOUNT_MULTIPLE}
                  keyboardType={KEYBOARD_TYPE.NUMERIC}
                  required
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <MaterialCommunityIcons
                  name={ICONS.CLOSE_CIRCLE}
                  size={designTokens.iconSize.md}
                  color={colors.textSecondary}
                />
                <Text style={styles.clearButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleCreateClub}>
                <MaterialCommunityIcons
                  name={ICONS.PLUS_CIRCLE}
                  size={designTokens.iconSize.md}
                  color={designTokens.colors.textInverse}
                />
                <Text style={styles.applyButtonText}>
                  {t('screens.clubsManagement.createClub')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Club Detail Modal */}
      <ClubDetailModal
        visible={detailVisible}
        club={selectedClub}
        onClose={() => {
          setDetailVisible(false);
          setSelectedClub(null);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
  formContainer: {
    padding: designTokens.spacing.xl,
  },
  noDataText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textTertiary,
    fontStyle: layoutConstants.fontStyle.italic,
    textAlign: layoutConstants.textAlign.center,
    paddingVertical: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginTop: designTokens.spacing.md,
  },
  filterOptionSubtitle: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    marginTop: designTokens.spacing.xxs,
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
  modalBody: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.lg,
  },
  dragHandle: {
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
    ...mobileTypography.heading2,
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  modalFooter: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
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
  filterSectionTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
  },
  hierarchyLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: designTokens.fontWeight.semibold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
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
  clearButton: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: layoutConstants.alignItems.center,
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.sm,
  },
  clearButtonText: {
    fontSize: mobileFontSizes.lg,
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
    gap: designTokens.spacing.sm,
  },
  applyButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
});

export default ClubsManagementScreen;
