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
import { userService } from '../../services/userService';
import { clubService } from '../../services/clubService';
import { User, UserRole } from '../../types';
import { UserCard } from '../../components/UserCard';
import { UserDetailModal } from '../../components/UserDetailModal';

const UsersManagementScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    // Hierarchical filters (through clubs)
    division: '',
    union: '',
    association: '',
    church: '',
    // Direct filters
    role: 'all', // 'all', 'admin', 'club_admin', 'user'
    clubId: '',
    status: 'all', // 'all', 'active', 'inactive'
    paused: 'all', // 'all', 'paused', 'not_paused'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, clubsData] = await Promise.all([
        userService.getAllUsers(),
        clubService.getAllClubs(),
      ]);
      setUsers(usersData);
      setClubs(clubsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await userService.updateUser(userId, { isActive: !isActive });
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user status');
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(userId);
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const clearFilters = () => {
    setFilters({
      division: '',
      union: '',
      association: '',
      church: '',
      role: 'all',
      clubId: '',
      status: 'all',
      paused: 'all',
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.division) count++;
    if (filters.union) count++;
    if (filters.association) count++;
    if (filters.church) count++;
    if (filters.role !== 'all') count++;
    if (filters.clubId) count++;
    if (filters.status !== 'all') count++;
    if (filters.paused !== 'all') count++;
    if (searchQuery) count++;
    return count;
  };

  const getClubName = (clubId: string | null) => {
    if (!clubId) return 'No Club';
    const club = clubs.find((c) => c.id === clubId);
    return club ? club.name : 'Unknown Club';
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
    return ['', ...Array.from(new Set(values)).sort()];
  };

  // Update filters with cascade logic
  const updateFilter = (field: string, value: string) => {
    const newFilters = { ...filters };
    
    if (field === 'division') {
      newFilters.division = value;
      if (!value) {
        newFilters.union = '';
        newFilters.association = '';
        newFilters.church = '';
        newFilters.clubId = ''; // Clear specific club selection
      } else {
        const validUnions = getUniqueValuesForDivision('union', value);
        if (!validUnions.includes(newFilters.union)) {
          newFilters.union = '';
          newFilters.association = '';
          newFilters.church = '';
          newFilters.clubId = '';
        }
      }
    } else if (field === 'union') {
      newFilters.union = value;
      if (!value) {
        newFilters.association = '';
        newFilters.church = '';
        newFilters.clubId = '';
      } else {
        const validAssociations = getUniqueValuesForUnion('association', value);
        if (!validAssociations.includes(newFilters.association)) {
          newFilters.association = '';
          newFilters.church = '';
          newFilters.clubId = '';
        }
      }
    } else if (field === 'association') {
      newFilters.association = value;
      if (!value) {
        newFilters.church = '';
        newFilters.clubId = '';
      } else {
        const validChurches = getUniqueValuesForAssociation('church', value);
        if (!validChurches.includes(newFilters.church)) {
          newFilters.church = '';
          newFilters.clubId = '';
        }
      }
    } else if (field === 'church') {
      newFilters.church = value;
      if (!value) {
        newFilters.clubId = '';
      }
    } else if (field === 'role') {
      newFilters.role = value;
    } else if (field === 'clubId') {
      newFilters.clubId = value;
    } else if (field === 'status') {
      newFilters.status = value;
    } else if (field === 'paused') {
      newFilters.paused = value;
    }
    
    setFilters(newFilters);
  };

  // Helper functions for cascade validation (using clubs)
  const getUniqueValuesForDivision = (field: string, division: string) => {
    const filteredClubs = clubs.filter((club) => club.division === division);
    const values = filteredClubs.map((club) => club[field]).filter(Boolean);
    return Array.from(new Set(values));
  };

  const getUniqueValuesForUnion = (field: string, union: string) => {
    const filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) return false;
      return club.union === union;
    });
    const values = filteredClubs.map((club) => club[field]).filter(Boolean);
    return Array.from(new Set(values));
  };

  const getUniqueValuesForAssociation = (field: string, association: string) => {
    const filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) return false;
      if (filters.union && club.union !== filters.union) return false;
      return club.association === association;
    });
    const values = filteredClubs.map((club) => club[field]).filter(Boolean);
    return Array.from(new Set(values));
  };

  // Get user's club to derive hierarchy
  const getUserClub = (user: User) => {
    if (!user.clubId) return null;
    return clubs.find((club) => club.id === user.clubId);
  };

  const filteredUsers = users.filter((user) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Hierarchical filter (through user's club)
    const userClub = getUserClub(user);
    if (filters.division && (!userClub || userClub.division !== filters.division)) return false;
    if (filters.union && (!userClub || userClub.union !== filters.union)) return false;
    if (filters.association && (!userClub || userClub.association !== filters.association)) return false;
    if (filters.church && (!userClub || userClub.church !== filters.church)) return false;

    // Role filter
    if (filters.role !== 'all' && user.role !== filters.role) return false;

    // Specific club filter
    if (filters.clubId && user.clubId !== filters.clubId) return false;

    // Status filter
    if (filters.status === 'active' && !user.isActive) return false;
    if (filters.status === 'inactive' && user.isActive) return false;

    // Paused filter
    if (filters.paused === 'paused' && !user.isPaused) return false;
    if (filters.paused === 'not_paused' && user.isPaused) return false;

    return true;
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Users Management</Text>
        <Text style={styles.subtitle}>
          Showing {filteredUsers.length} of {users.length} users
        </Text>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
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

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <MaterialCommunityIcons name="filter-variant" size={20} color="#6200ee" />
          <Text style={styles.filterButtonText}>Filters</Text>
          {getActiveFilterCount() > 0 && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading users...</Text>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-off" size={48} color="#999" />
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>
              {users.length === 0 ? 'No users in the system' : 'Try adjusting your filters'}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onPress={() => {
                setSelectedUser(user);
                setDetailVisible(true);
              }}
              showAdminActions={true}
              onToggleStatus={() => handleToggleUserStatus(user.id, user.isActive)}
              onDelete={() => handleDeleteUser(user.id, user.name)}
            />
          ))
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
              <Text style={styles.modalTitle}>Filter Users</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterModalContent}>
              {/* Hierarchical Filter Info */}
              <View style={styles.hierarchyInfo}>
                <MaterialCommunityIcons name="information" size={16} color="#6200ee" />
                <Text style={styles.hierarchyInfoText}>
                  Filter users by their club's organizational hierarchy. Navigate from Division → Union → Association → Church (then optionally select specific club).
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
                  {getUniqueClubValues('division').map((division) => (
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
                    {getUniqueClubValues('union').map((union) => (
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
                    {getUniqueClubValues('association').map((association) => (
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
                    {getUniqueClubValues('church').map((church) => (
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

              {/* Independent Filters Section */}
              <Text style={styles.sectionTitle}>Additional Filters</Text>

              {/* Role Filter */}
              <View style={styles.filterSection}>
                <View style={styles.filterLabelContainer}>
                  <Text style={styles.filterLabel}>
                    <MaterialCommunityIcons name="shield-account" size={16} color="#666" /> 
                    {' '}Role
                  </Text>
                  <Text style={styles.hierarchyLevel}>Independent</Text>
                </View>
                <View style={styles.filterOptions}>
                  {['all', UserRole.ADMIN, UserRole.CLUB_ADMIN, UserRole.USER].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.filterOption,
                        filters.role === role && styles.filterOptionActive,
                      ]}
                      onPress={() => updateFilter('role', role)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.role === role && styles.filterOptionTextActive,
                        ]}
                      >
                        {role === 'all' ? 'All Roles' : role.replace('_', ' ').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Specific Club Filter (Optional - overrides hierarchy) */}
              <View style={styles.filterSection}>
                <View style={styles.filterLabelContainer}>
                  <Text style={styles.filterLabel}>
                    <MaterialCommunityIcons name="account-group" size={16} color="#666" /> 
                    {' '}Specific Club
                  </Text>
                  <Text style={styles.hierarchyLevel}>Optional</Text>
                </View>
                <Text style={styles.filterHint}>Select a specific club (overrides hierarchy filters)</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      filters.clubId === '' && styles.filterOptionActive,
                    ]}
                    onPress={() => updateFilter('clubId', '')}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.clubId === '' && styles.filterOptionTextActive,
                      ]}
                    >
                      Use Hierarchy
                    </Text>
                  </TouchableOpacity>
                  {clubs.map((club) => (
                    <TouchableOpacity
                      key={club.id}
                      style={[
                        styles.filterOption,
                        filters.clubId === club.id && styles.filterOptionActive,
                      ]}
                      onPress={() => updateFilter('clubId', club.id)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.clubId === club.id && styles.filterOptionTextActive,
                        ]}
                      >
                        {club.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status Filter */}
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

              {/* Paused Filter */}
              <View style={styles.filterSection}>
                <View style={styles.filterLabelContainer}>
                  <Text style={styles.filterLabel}>
                    <MaterialCommunityIcons name="pause-circle" size={16} color="#666" /> 
                    {' '}Match Status
                  </Text>
                  <Text style={styles.hierarchyLevel}>Independent</Text>
                </View>
                <View style={styles.filterOptions}>
                  {['all', 'paused', 'not_paused'].map((pausedStatus) => (
                    <TouchableOpacity
                      key={pausedStatus}
                      style={[
                        styles.filterOption,
                        filters.paused === pausedStatus && styles.filterOptionActive,
                      ]}
                      onPress={() => updateFilter('paused', pausedStatus)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filters.paused === pausedStatus && styles.filterOptionTextActive,
                        ]}
                      >
                        {pausedStatus === 'all'
                          ? 'All'
                          : pausedStatus === 'paused'
                          ? 'Paused'
                          : 'Active'}
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

      {/* User Detail Modal */}
      <UserDetailModal
        visible={detailVisible}
        user={selectedUser}
        onClose={() => {
          setDetailVisible(false);
          setSelectedUser(null);
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
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
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
  filterSeparator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSeparatorText: {
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
  content: {
    padding: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  filterHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
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

export default UsersManagementScreen;

