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
  StandardInput
} from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../../shared/theme/mobileTypography';
import { MESSAGES, dynamicMessages } from '../../shared/constants';

const ClubsManagementScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = windowWidth < 768;
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    division: '',
    union: '',
    association: '',
    church: '',
    clubId: '',
    status: 'all',
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 2,
    church: '',
    association: '',
    union: '',
    division: '',
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
    if (!formData.name || !formData.description || !formData.church || 
        !formData.association || !formData.union || !formData.division) {
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
      { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
      {
        text: MESSAGES.BUTTONS.DELETE,
        style: 'destructive',
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
      name: '',
      description: '',
      matchFrequency: MatchFrequency.WEEKLY,
      groupSize: 2,
      church: '',
      association: '',
      union: '',
      division: '',
    });
  };

  const clearFilters = () => {
    setFilters({
      division: '',
      union: '',
      association: '',
      church: '',
      clubId: '',
      status: 'all',
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.division) count++;
    if (filters.union) count++;
    if (filters.association) count++;
    if (filters.church) count++;
    if (filters.clubId) count++;
    if (filters.status !== 'all') count++;
    if (searchQuery) count++;
    return count;
  };

  // Get unique values for hierarchical filters (from clubs)
  const getUniqueClubValues = (field: string) => {
    let filteredClubs = clubs;

    // Apply hierarchical filtering based on the field
    if (field === 'union' && filters.division) {
      filteredClubs = clubs.filter((club) => club.division === filters.division);
    } else if (field === 'association' && filters.union) {
      filteredClubs = clubs.filter((club) => {
        if (filters.division && club.division !== filters.division) return false;
        if (club.union !== filters.union) return false;
        return true;
      });
    } else if (field === 'church' && filters.association) {
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
  const availableDivisions = getUniqueClubValues('division');
  const availableUnions = getUniqueClubValues('union');
  const availableAssociations = getUniqueClubValues('association');
  const availableChurches = getUniqueClubValues('church');

  // Auto-select when only one option exists and filter modal opens
  useEffect(() => {
    if (filterVisible) {
      // Auto-select division if only one exists
      if (availableDivisions.length === 1 && !filters.division) {
        setFilters((prev) => ({ ...prev, division: availableDivisions[0] }));
      }
      // Auto-select union if only one exists
      if (availableUnions.length === 1 && !filters.union) {
        setFilters((prev) => ({ ...prev, union: availableUnions[0] }));
      }
      // Auto-select association if only one exists
      if (availableAssociations.length === 1 && !filters.association) {
        setFilters((prev) => ({ ...prev, association: availableAssociations[0] }));
      }
      // Auto-select church if only one exists
      if (availableChurches.length === 1 && !filters.church) {
        setFilters((prev) => ({ ...prev, church: availableChurches[0] }));
      }
    }
  }, [filterVisible, availableDivisions, availableUnions, availableAssociations, availableChurches]);

  // Update filters with cascade logic
  const updateFilter = (field: string, value: string) => {
    const newFilters = { ...filters };
    
    // Update primary field
    if (field === 'division') {
      newFilters.division = value;
      // Clear dependent filters
      newFilters.union = '';
      newFilters.association = '';
      newFilters.church = '';
      
      // Validate union if set
      if (newFilters.union) {
        const validUnions = getUniqueClubValues('union');
        if (!validUnions.includes(newFilters.union)) {
          newFilters.union = '';
        }
      }
    } else if (field === 'union') {
      newFilters.union = value;
      // Clear dependent filters
      newFilters.association = '';
      newFilters.church = '';
      
      // Validate association if set
      if (newFilters.association) {
        const validAssociations = getUniqueClubValues('association');
        if (!validAssociations.includes(newFilters.association)) {
          newFilters.association = '';
        }
      }
    } else if (field === 'association') {
      newFilters.association = value;
      // Clear dependent filters
      newFilters.church = '';
      
      // Validate church if set
      if (newFilters.church) {
        const validChurches = getUniqueClubValues('church');
        if (!validChurches.includes(newFilters.church)) {
          newFilters.church = '';
        }
      }
    } else if (field === 'church') {
      newFilters.church = value;
    } else if (field === 'status') {
      newFilters.status = value;
    }
    
    setFilters(newFilters);
  };

  const filteredClubs = clubs.filter((club) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        club.name.toLowerCase().includes(query) ||
        club.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (filters.division && club.division !== filters.division) return false;
    if (filters.union && club.union !== filters.union) return false;
    if (filters.association && club.association !== filters.association) return false;
    if (filters.church && club.church !== filters.church) return false;
    if (filters.clubId && club.id !== filters.clubId) return false;
    if (filters.status === 'active' && !club.isActive) return false;
    if (filters.status === 'inactive' && club.isActive) return false;

    return true;
  });

  // Match Frequency options
  const matchFrequencyOptions = [
    {
      id: MatchFrequency.WEEKLY,
      title: 'Weekly',
      subtitle: 'Matches every week',
      icon: 'calendar-week',
      iconColor: colors.primary,
    },
    {
      id: MatchFrequency.BIWEEKLY,
      title: 'Biweekly',
      subtitle: 'Matches every two weeks',
      icon: 'calendar-range',
      iconColor: designTokens.colors.info,
    },
    {
      id: MatchFrequency.MONTHLY,
      title: 'Monthly',
      subtitle: 'Matches once a month',
      icon: 'calendar-month',
      iconColor: colors.warning,
    },
  ];

  // Get unique values for form hierarchy (for Create Club modal)
  const getFormUniqueValues = (field: string) => {
    let filteredClubs = clubs;

    // Apply hierarchical filtering based on current form selections
    if (field === 'union' && formData.division) {
      filteredClubs = clubs.filter((club) => club.division === formData.division);
    } else if (field === 'association' && formData.union) {
      filteredClubs = clubs.filter((club) => {
        if (formData.division && club.division !== formData.division) return false;
        if (club.union !== formData.union) return false;
        return true;
      });
    } else if (field === 'church' && formData.association) {
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
  const formAvailableDivisions = getFormUniqueValues('division');
  const formAvailableUnions = getFormUniqueValues('union');
  const formAvailableAssociations = getFormUniqueValues('association');
  const formAvailableChurches = getFormUniqueValues('church');

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
  }, [modalVisible, formAvailableDivisions, formAvailableUnions, formAvailableAssociations, formAvailableChurches]);

  // Handle hierarchy selection in form with cascading clear
  const handleFormFieldUpdate = (field: string, value: string) => {
    const newFormData = { ...formData };
    
    if (field === 'division') {
      newFormData.division = value;
      // Clear dependent fields
      newFormData.union = '';
      newFormData.association = '';
      newFormData.church = '';
    } else if (field === 'union') {
      newFormData.union = value;
      // Clear dependent fields
      newFormData.association = '';
      newFormData.church = '';
    } else if (field === 'association') {
      newFormData.association = value;
      // Clear dependent field
      newFormData.church = '';
    } else if (field === 'church') {
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
        title="Clubs Management"
        subtitle={`Showing ${filteredClubs.length} of ${clubs.length} clubs`}
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
          title="Create New Club"
          onPress={() => setModalVisible(true)}
          icon="plus"
        />

        {loading ? (
          <EmptyState
            icon="loading"
            title="Loading clubs..."
            description="Please wait"
          />
        ) : filteredClubs.length === 0 ? (
          <EmptyState
            icon="account-group-outline"
            title="No clubs found"
            description={clubs.length === 0 ? 'No clubs in the system' : 'Try adjusting your filters'}
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
        animationType={isMobile ? "slide" : "fade"}
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.backdrop }, isMobile && styles.modalOverlayMobile]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }, isMobile && styles.modalContentMobile]}>
            {/* Drag Handle - Mobile Only */}
            {isMobile && (
              <View style={[styles.dragHandle, { backgroundColor: colors.borderLight }]} />
            )}
            
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Filter Clubs</Text>
              <TouchableOpacity
                onPress={() => setFilterVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Hierarchical Filter Info */}
              <View style={[styles.hierarchyInfoBanner, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons name="information" size={16} color={colors.primary} />
                <Text style={[styles.hierarchyInfoText, { color: colors.primary }]}>
                  Navigate from general (Division) to specific (Church). Each level filters the next.
                </Text>
              </View>

              {/* Organization Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Organization</Text>

                {/* Division */}
                {availableDivisions.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="earth" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Division</Text>
                      <Text style={styles.hierarchyValue}>{availableDivisions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : (
                  <View>
                    <Text style={styles.hierarchyLabel}>Division</Text>
                    {availableDivisions.map((division) => (
                      <TouchableOpacity
                        key={division}
                        style={[
                          styles.filterOption,
                          filters.division === division && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter('division', division)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Union */}
                {availableUnions.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="domain" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Union</Text>
                      <Text style={styles.hierarchyValue}>{availableUnions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : availableUnions.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Union</Text>
                    {availableUnions.map((union) => (
                      <TouchableOpacity
                        key={union}
                        style={[
                          styles.filterOption,
                          filters.union === union && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter('union', union)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {/* Association */}
                {availableAssociations.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="office-building" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Association</Text>
                      <Text style={styles.hierarchyValue}>{availableAssociations[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : availableAssociations.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Association</Text>
                    {availableAssociations.map((association) => (
                      <TouchableOpacity
                        key={association}
                        style={[
                          styles.filterOption,
                          filters.association === association && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter('association', association)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {/* Church */}
                {availableChurches.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="church" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Church</Text>
                      <Text style={styles.hierarchyValue}>{availableChurches[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : availableChurches.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Church</Text>
                    {availableChurches.map((church) => (
                      <TouchableOpacity
                        key={church}
                        style={[
                          styles.filterOption,
                          filters.church === church && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter('church', church)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* Status Filter Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Club Status</Text>

                <TouchableOpacity
                  style={[styles.filterOption, filters.status === 'all' && styles.filterOptionActive]}
                  onPress={() => updateFilter('status', 'all')}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="account-group"
                      size={20}
                      color={filters.status === 'all' ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === 'all' && styles.filterOptionTextActive,
                      ]}
                    >
                      All Clubs
                    </Text>
                  </View>
                  {filters.status === 'all' && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, filters.status === 'active' && styles.filterOptionActive]}
                  onPress={() => updateFilter('status', 'active')}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={filters.status === 'active' ? colors.primary : colors.success}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === 'active' && styles.filterOptionTextActive,
                      ]}
                    >
                      Active Only
                    </Text>
                  </View>
                  {filters.status === 'active' && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, filters.status === 'inactive' && styles.filterOptionActive]}
                  onPress={() => updateFilter('status', 'inactive')}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="cancel"
                      size={20}
                      color={filters.status === 'inactive' ? colors.primary : colors.error}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === 'inactive' && styles.filterOptionTextActive,
                      ]}
                    >
                      Inactive Only
                    </Text>
                  </View>
                  {filters.status === 'inactive' && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <MaterialCommunityIcons name="filter-off" size={20} color={colors.textSecondary} />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterVisible(false)}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Club Modal */}
      <Modal
        visible={modalVisible}
        animationType={isMobile ? "slide" : "fade"}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.backdrop }, isMobile && styles.modalOverlayMobile]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }, isMobile && styles.modalContentMobile]}>
            {/* Drag Handle - Mobile Only */}
            {isMobile && (
              <View style={[styles.dragHandle, { backgroundColor: colors.borderLight }]} />
            )}
            
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create New Club</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Hierarchical Filter Info - Top of Modal */}
              <View style={[styles.hierarchyInfoBanner, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons name="information" size={16} color={colors.primary} />
                <Text style={[styles.hierarchyInfoText, { color: colors.primary }]}>
                  Navigate from general (Division) to specific (Church). Each level filters the next.
                </Text>
              </View>

              {/* Club Information Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Club Information</Text>
                
                <StandardInput
                  label="Club Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder={MESSAGES.PLACEHOLDERS.ENTER_CLUB_NAME}
                  icon="account-group"
                  required
                />

                <StandardInput
                  label="Description"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder={MESSAGES.PLACEHOLDERS.ENTER_CLUB_DESCRIPTION}
                  icon="text"
                  multiline
                  required
                />
              </View>

              {/* Organization Hierarchy Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Organization</Text>

                {/* Division */}
                {formAvailableDivisions.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="earth" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Division</Text>
                      <Text style={styles.hierarchyValue}>{formAvailableDivisions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : formAvailableDivisions.length > 0 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Division</Text>
                    {formAvailableDivisions.map((division) => (
                      <TouchableOpacity
                        key={division}
                        style={[
                          styles.filterOption,
                          formData.division === division && styles.filterOptionActive,
                        ]}
                        onPress={() => handleFormFieldUpdate('division', division)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>No divisions available. Contact system administrator.</Text>
                )}

                {/* Union */}
                {formAvailableUnions.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="domain" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Union</Text>
                      <Text style={styles.hierarchyValue}>{formAvailableUnions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : formAvailableUnions.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Union</Text>
                    {formAvailableUnions.map((union) => (
                      <TouchableOpacity
                        key={union}
                        style={[
                          styles.filterOption,
                          formData.union === union && styles.filterOptionActive,
                        ]}
                        onPress={() => handleFormFieldUpdate('union', union)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : formData.division ? (
                  <Text style={styles.noDataText}>No unions available under {formData.division}.</Text>
                ) : null}

                {/* Association */}
                {formAvailableAssociations.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="office-building" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Association</Text>
                      <Text style={styles.hierarchyValue}>{formAvailableAssociations[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : formAvailableAssociations.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Association</Text>
                    {formAvailableAssociations.map((association) => (
                      <TouchableOpacity
                        key={association}
                        style={[
                          styles.filterOption,
                          formData.association === association && styles.filterOptionActive,
                        ]}
                        onPress={() => handleFormFieldUpdate('association', association)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : formData.union ? (
                  <Text style={styles.noDataText}>No associations available under {formData.union}.</Text>
                ) : null}

                {/* Church */}
                {formAvailableChurches.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="church" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Church</Text>
                      <Text style={styles.hierarchyValue}>{formAvailableChurches[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : formAvailableChurches.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Church</Text>
                    {formAvailableChurches.map((church) => (
                      <TouchableOpacity
                        key={church}
                        style={[
                          styles.filterOption,
                          formData.church === church && styles.filterOptionActive,
                        ]}
                        onPress={() => handleFormFieldUpdate('church', church)}
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
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : formData.association ? (
                  <Text style={styles.noDataText}>No churches available under {formData.association}.</Text>
                ) : null}
              </View>

              {/* Club Settings Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Club Settings</Text>

                {/* Match Frequency */}
                <View>
                  <Text style={styles.hierarchyLabel}>Match Frequency</Text>
                  {matchFrequencyOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.filterOption,
                        formData.matchFrequency === option.id && styles.filterOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, matchFrequency: option.id as MatchFrequency })}
                    >
                      <View style={styles.filterOptionContent}>
                        <MaterialCommunityIcons
                          name={option.icon as any}
                          size={20}
                          color={formData.matchFrequency === option.id ? colors.primary : (option.iconColor || colors.textSecondary)}
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.filterOptionText,
                              formData.matchFrequency === option.id && styles.filterOptionTextActive,
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
                        <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <StandardInput
                  label="Group Size"
                  value={formData.groupSize.toString()}
                  onChangeText={(text) => setFormData({ ...formData, groupSize: parseInt(text) || 2 })}
                  placeholder={MESSAGES.PLACEHOLDERS.ENTER_GROUP_SIZE}
                  icon="account-multiple"
                  keyboardType="numeric"
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
                <MaterialCommunityIcons name="close-circle" size={20} color={colors.textSecondary} />
                <Text style={styles.clearButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={handleCreateClub}
              >
                <MaterialCommunityIcons name="plus-circle" size={20} color={designTokens.colors.textInverse} />
                <Text style={styles.applyButtonText}>Create Club</Text>
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
    flex: 1,
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
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginTop: designTokens.spacing.md,
  },
  filterOptionSubtitle: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
  },
  modalOverlayMobile: {
    justifyContent: 'flex-end',
    padding: 0,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xxl,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalContentMobile: {
    maxWidth: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: designTokens.borderRadius.xxl,
    borderTopRightRadius: designTokens.borderRadius.xxl,
  },
  modalBody: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: 'center',
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  hierarchyInfoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: designTokens.colors.primaryLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.lg,
    marginBottom: 0,
    gap: designTokens.spacing.sm,
  },
  hierarchyInfoText: {
    flex: 1,
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    lineHeight: 18,
  },
  filterSection: {
    padding: designTokens.spacing.lg,
  },
  filterSectionTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
  },
  hierarchyLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
  },
  hierarchyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  hierarchyInfo: {
    flex: 1,
  },
  hierarchyValue: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textPrimary,
    fontWeight: '600',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 56,
  },
  filterOptionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: designTokens.spacing.md,
  },
  filterOptionText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    flex: 1,
  },
  filterOptionTextActive: {
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
  },
  clearButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
  },
  applyButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textInverse,
  },
});

export default ClubsManagementScreen;
