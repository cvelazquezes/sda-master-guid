import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { Club, MatchFrequency } from '../../types';
import { ClubCard } from '../../components/ClubCard';
import { ClubDetailModal } from '../../components/ClubDetailModal';

const ClubsManagementScreen = () => {
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
    status: 'all', // 'all', 'active', 'inactive'
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
      Alert.alert('Error', 'Failed to load clubs');
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
      Alert.alert('Error', 'Please fill in all required fields');
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
      setModalVisible(false);
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
      loadClubs();
      Alert.alert('Success', 'Club created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create club');
    }
  };

  const handleToggleClubStatus = async (clubId: string, isActive: boolean) => {
    try {
      await clubService.updateClub(clubId, { isActive: !isActive });
      loadClubs();
    } catch (error) {
      Alert.alert('Error', 'Failed to update club status');
    }
  };

  const handleDeleteClub = (clubId: string, clubName: string) => {
    Alert.alert(
      'Delete Club',
      `Are you sure you want to delete ${clubName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await clubService.deleteClub(clubId);
              loadClubs();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete club');
            }
          },
        },
      ]
    );
  };

  // Get unique values for hierarchical filters
  const getUniqueValues = (field: keyof Club) => {
    let filteredClubs = clubs;

    // Apply hierarchical filtering based on the field
    if (field === 'union' && filters.division) {
      // Only show unions from the selected division
      filteredClubs = clubs.filter((club) => club.division === filters.division);
    } else if (field === 'association' && filters.union) {
      // Only show associations from the selected union (and division if set)
      filteredClubs = clubs.filter((club) => {
        if (filters.division && club.division !== filters.division) return false;
        if (club.union !== filters.union) return false;
        return true;
      });
    } else if (field === 'church' && filters.association) {
      // Only show churches from the selected association (and parent levels)
      filteredClubs = clubs.filter((club) => {
        if (filters.division && club.division !== filters.division) return false;
        if (filters.union && club.union !== filters.union) return false;
        if (club.association !== filters.association) return false;
        return true;
      });
    }

    const values = filteredClubs.map((club) => club[field] as string).filter(Boolean);
    return ['', ...Array.from(new Set(values)).sort()];
  };

  // Update filters with cascade logic
  const updateFilter = (field: string, value: string) => {
    const newFilters = { ...filters };
    
    if (field === 'division') {
      newFilters.division = value;
      // Clear dependent filters when division changes
      if (!value) {
        newFilters.union = '';
        newFilters.association = '';
        newFilters.church = '';
      } else {
        // Check if current union is valid for new division
        const validUnions = getUniqueValuesForDivision('union', value);
        if (!validUnions.includes(newFilters.union)) {
          newFilters.union = '';
          newFilters.association = '';
          newFilters.church = '';
        }
      }
    } else if (field === 'union') {
      newFilters.union = value;
      // Clear dependent filters when union changes
      if (!value) {
        newFilters.association = '';
        newFilters.church = '';
      } else {
        // Check if current association is valid for new union
        const validAssociations = getUniqueValuesForUnion('association', value);
        if (!validAssociations.includes(newFilters.association)) {
          newFilters.association = '';
          newFilters.church = '';
        }
      }
    } else if (field === 'association') {
      newFilters.association = value;
      // Clear dependent filters when association changes
      if (!value) {
        newFilters.church = '';
      } else {
        // Check if current church is valid for new association
        const validChurches = getUniqueValuesForAssociation('church', value);
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

  // Helper functions for cascade validation
  const getUniqueValuesForDivision = (field: string, division: string) => {
    const filteredClubs = clubs.filter((club) => club.division === division);
    const values = filteredClubs.map((club) => club[field as keyof Club] as string).filter(Boolean);
    return Array.from(new Set(values));
  };

  const getUniqueValuesForUnion = (field: string, union: string) => {
    const filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) return false;
      return club.union === union;
    });
    const values = filteredClubs.map((club) => club[field as keyof Club] as string).filter(Boolean);
    return Array.from(new Set(values));
  };

  const getUniqueValuesForAssociation = (field: string, association: string) => {
    const filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) return false;
      if (filters.union && club.union !== filters.union) return false;
      return club.association === association;
    });
    const values = filteredClubs.map((club) => club[field as keyof Club] as string).filter(Boolean);
    return Array.from(new Set(values));
  };

  const clearFilters = () => {
    setFilters({
      division: '',
      union: '',
      association: '',
      church: '',
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
    if (filters.status !== 'all') count++;
    if (searchQuery) count++;
    return count;
  };

  // Filter clubs based on search and filters
  const filteredClubs = clubs.filter((club) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        club.name.toLowerCase().includes(query) ||
        club.description.toLowerCase().includes(query) ||
        club.church.toLowerCase().includes(query) ||
        club.association.toLowerCase().includes(query) ||
        club.union.toLowerCase().includes(query) ||
        club.division.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Hierarchical filters
    if (filters.division && club.division !== filters.division) return false;
    if (filters.union && club.union !== filters.union) return false;
    if (filters.association && club.association !== filters.association) return false;
    if (filters.church && club.church !== filters.church) return false;

    // Status filter
    if (filters.status === 'active' && !club.isActive) return false;
    if (filters.status === 'inactive' && club.isActive) return false;

    return true;
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Clubs Management</Text>
        <Text style={styles.subtitle}>
          Showing {filteredClubs.length} of {clubs.length} clubs
        </Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clubs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Action Buttons Section */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <MaterialCommunityIcons name="filter-variant" size={20} color="#6200ee" />
          <Text style={styles.filterButtonText}>Filters</Text>
          {getActiveFilterCount() > 0 && <View style={styles.filterBadge} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create Club</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {filteredClubs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-group-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>No clubs found</Text>
            <Text style={styles.emptySubtext}>
              {clubs.length === 0 ? 'Create your first club to get started' : 'Try adjusting your filters'}
            </Text>
          </View>
        ) : (
          <View>
            {filteredClubs.map((club) => (
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
            ))}
          </View>
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Clubs</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterModalContent}>
              {/* Hierarchical Filter Info */}
              <View style={styles.hierarchyInfo}>
                <MaterialCommunityIcons name="information" size={16} color="#6200ee" />
                <Text style={styles.hierarchyInfoText}>
                  Navigate from general (Division) to specific (Church). Each level filters the next.
                </Text>
              </View>

              {/* Division Filter - Level 1 */}
              <View style={styles.filterSection}>
                <View style={styles.filterLabelContainer}>
                  <Text style={styles.filterLabel}>
                    <MaterialCommunityIcons name="earth" size={16} color="#666" /> 
                    {' '}Division
                  </Text>
                  <Text style={styles.hierarchyLevel}>Level 1 - General</Text>
                </View>
                <View style={styles.filterOptions}>
                  {getUniqueValues('division').map((division) => (
                    <TouchableOpacity
                      key={division || 'all'}
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
                        {division || 'All Divisions'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Union Filter - Level 2 */}
              <View style={[styles.filterSection, !filters.division && styles.filterSectionDisabled]}>
                <View style={styles.filterLabelContainer}>
                  <Text style={[styles.filterLabel, !filters.division && styles.filterLabelDisabled]}>
                    <MaterialCommunityIcons name="domain" size={16} color={filters.division ? "#666" : "#ccc"} /> 
                    {' '}Union
                  </Text>
                  <Text style={styles.hierarchyLevel}>Level 2</Text>
                </View>
                {!filters.division ? (
                  <Text style={styles.disabledHint}>↑ Select Division first</Text>
                ) : (
                  <View style={styles.filterOptions}>
                    {getUniqueValues('union').map((union) => (
                      <TouchableOpacity
                        key={union || 'all'}
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
                          {union || 'All Unions'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Association Filter - Level 3 */}
              <View style={[styles.filterSection, !filters.union && styles.filterSectionDisabled]}>
                <View style={styles.filterLabelContainer}>
                  <Text style={[styles.filterLabel, !filters.union && styles.filterLabelDisabled]}>
                    <MaterialCommunityIcons name="office-building" size={16} color={filters.union ? "#666" : "#ccc"} /> 
                    {' '}Association
                  </Text>
                  <Text style={styles.hierarchyLevel}>Level 3</Text>
                </View>
                {!filters.union ? (
                  <Text style={styles.disabledHint}>↑ Select Union first</Text>
                ) : (
                  <View style={styles.filterOptions}>
                    {getUniqueValues('association').map((association) => (
                      <TouchableOpacity
                        key={association || 'all'}
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
                          {association || 'All Associations'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Church Filter - Level 4 */}
              <View style={[styles.filterSection, !filters.association && styles.filterSectionDisabled]}>
                <View style={styles.filterLabelContainer}>
                  <Text style={[styles.filterLabel, !filters.association && styles.filterLabelDisabled]}>
                    <MaterialCommunityIcons name="church" size={16} color={filters.association ? "#666" : "#ccc"} /> 
                    {' '}Church
                  </Text>
                  <Text style={styles.hierarchyLevel}>Level 4 - Specific</Text>
                </View>
                {!filters.association ? (
                  <Text style={styles.disabledHint}>↑ Select Association first</Text>
                ) : (
                  <View style={styles.filterOptions}>
                    {getUniqueValues('church').map((church) => (
                      <TouchableOpacity
                        key={church || 'all'}
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
                          {church || 'All Churches'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Divider */}
              <View style={styles.filterDivider} />

              {/* Status Filter - Independent */}
              <View style={styles.filterSection}>
                <View style={styles.filterLabelContainer}>
                  <Text style={styles.filterLabel}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#666" /> 
                    {' '}Status
                  </Text>
                  <Text style={styles.hierarchyLevel}>Independent</Text>
                </View>
                <View style={styles.filterOptions}>
                  {['all', 'active', 'inactive'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.filterOption,
                        filters.status === status && styles.filterOptionActive,
                      ]}
                      onPress={() => updateFilter('status', status)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.status === status && styles.filterOptionTextActive,
                        ]}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.filterModalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  clearFilters();
                  setFilterVisible(false);
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setFilterVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Club Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Club</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Club Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.sectionTitle}>Organizational Hierarchy</Text>

            <TextInput
              style={styles.input}
              placeholder="Church Name *"
              value={formData.church}
              onChangeText={(text) => setFormData({ ...formData, church: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Association *"
              value={formData.association}
              onChangeText={(text) => setFormData({ ...formData, association: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Union *"
              value={formData.union}
              onChangeText={(text) => setFormData({ ...formData, union: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Division *"
              value={formData.division}
              onChangeText={(text) => setFormData({ ...formData, division: text })}
            />

            <Text style={styles.sectionTitle}>Match Settings</Text>

            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Match Frequency</Text>
              <View style={styles.selectOptions}>
                {Object.values(MatchFrequency).map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.selectOption,
                      formData.matchFrequency === freq && styles.selectOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, matchFrequency: freq })}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        formData.matchFrequency === freq && styles.selectOptionTextActive,
                      ]}
                    >
                      {freq.replace('_', '-')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Group Size</Text>
              <View style={styles.selectOptions}>
                {[2, 3].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.selectOption,
                      formData.groupSize === size && styles.selectOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, groupSize: size })}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        formData.groupSize === size && styles.selectOptionTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleCreateClub}>
              <Text style={styles.submitButtonText}>Create Club</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchWrapper: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 6,
    position: 'relative',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ee',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 6,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  activeFilters: {
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8def8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
  },
  filterChipHierarchy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8def8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  filterChipText: {
    color: '#6200ee',
    fontSize: 12,
    fontWeight: '600',
  },
  hierarchyArrow: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearFiltersChip: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearFiltersText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  selectOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectOptionActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
  },
  filterModalContent: {
    maxHeight: '70%',
  },
  hierarchyInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0e6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  hierarchyInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#6200ee',
    lineHeight: 18,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionDisabled: {
    opacity: 0.5,
  },
  filterLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabelDisabled: {
    color: '#999',
  },
  hierarchyLevel: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  disabledHint: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  filterDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ClubsManagementScreen;

