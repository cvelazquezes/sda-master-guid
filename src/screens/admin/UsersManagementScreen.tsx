import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { userService } from '../../services/userService';
import { clubService } from '../../services/clubService';
import { useTheme } from '../../contexts/ThemeContext';
import { User, UserRole } from '../../types';
import { UserCard } from '../../components/UserCard';
import { UserDetailModal } from '../../components/UserDetailModal';
import { ScreenHeader, SearchBar, EmptyState, TabBar, IconButton, type Tab } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileIconSizes, mobileTypography, mobileFontSizes } from '../../shared/theme';
import { MESSAGES, dynamicMessages } from '../../shared/constants';

const UsersManagementScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = windowWidth < 768;
  
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [filters, setFilters] = useState({
    division: '',
    union: '',
    association: '',
    church: '',
    clubId: '',
    role: 'all',
    status: 'all',
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
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DATA);
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
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_USER_STATUS);
    }
  };

  const handleApproveUser = async (userId: string, userName: string, userRole: UserRole) => {
    const roleLabel = userRole === UserRole.CLUB_ADMIN ? 'club admin' : 'user';
    Alert.alert(
      MESSAGES.TITLES.APPROVE_USER,
      dynamicMessages.confirmApproveUser(userName, roleLabel),
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: MESSAGES.BUTTONS.APPROVE,
          onPress: async () => {
            try {
              await userService.approveUser(userId);
              Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.userApproved(userName));
              loadData();
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_APPROVE_USER);
            }
          },
        },
      ]
    );
  };

  const handleRejectUser = (userId: string, userName: string) => {
    Alert.alert(
      MESSAGES.TITLES.REJECT_USER,
      dynamicMessages.confirmRejectUser(userName),
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: MESSAGES.BUTTONS.REJECT,
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.rejectUser(userId);
              Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.userRejected(userName));
              loadData();
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_REJECT_USER);
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      MESSAGES.TITLES.DELETE_USER,
      dynamicMessages.confirmDeleteUser(userName),
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: MESSAGES.BUTTONS.DELETE,
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(userId);
              loadData();
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_DELETE_USER);
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
      clubId: '',
      role: 'all',
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
    if (filters.role !== 'all') count++;
    if (filters.status !== 'all') count++;
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
    return Array.from(new Set(values)).sort();
  };

  // Get available options without empty string for smart auto-selection
  const availableDivisions = getUniqueClubValues('division');
  const availableUnions = getUniqueClubValues('union');
  const availableAssociations = getUniqueClubValues('association');
  const availableChurches = getUniqueClubValues('church');
  
  // Get available clubs based on the selected church
  const getAvailableClubs = () => {
    if (!filters.church) return [];
    
    return clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) return false;
      if (filters.union && club.union !== filters.union) return false;
      if (filters.association && club.association !== filters.association) return false;
      if (club.church !== filters.church) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  };
  
  const availableClubs = getAvailableClubs();

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
      // Auto-select club if only one exists in selected church
      if (availableClubs.length === 1 && !filters.clubId && filters.church) {
        setFilters((prev) => ({ ...prev, clubId: availableClubs[0].id }));
      }
    }
  }, [filterVisible, availableDivisions, availableUnions, availableAssociations, availableChurches, availableClubs, filters.church]);

  // Update filters with cascade logic
  const updateFilter = (field: string, value: string) => {
    const newFilters = { ...filters };
    
    if (field === 'division') {
      newFilters.division = value;
      if (!value) {
        newFilters.union = '';
        newFilters.association = '';
        newFilters.church = '';
      } else {
        const validUnions = getUniqueValuesForDivision('union', value);
        if (!validUnions.includes(newFilters.union)) {
          newFilters.union = '';
          newFilters.association = '';
          newFilters.church = '';
        }
      }
    } else if (field === 'union') {
      newFilters.union = value;
      if (!value) {
        newFilters.association = '';
        newFilters.church = '';
      } else {
        const validAssociations = getUniqueValuesForUnion('association', value);
        if (!validAssociations.includes(newFilters.association)) {
          newFilters.association = '';
          newFilters.church = '';
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
      // Clear clubId when church changes
      if (!value) {
        newFilters.clubId = '';
      } else {
        // Check if current clubId is valid for new church
        const validClubs = getAvailableClubsForChurch(value);
        if (!validClubs.find(c => c.id === newFilters.clubId)) {
          newFilters.clubId = '';
        }
      }
    } else if (field === 'clubId') {
      newFilters.clubId = value;
    } else if (field === 'role') {
      newFilters.role = value;
    } else if (field === 'status') {
      newFilters.status = value;
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
  
  const getAvailableClubsForChurch = (church: string) => {
    return clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) return false;
      if (filters.union && club.union !== filters.union) return false;
      if (filters.association && club.association !== filters.association) return false;
      return club.church === church;
    }).sort((a, b) => a.name.localeCompare(b.name));
  };

  // Get user's club to derive hierarchy
  const getUserClub = (user: User) => {
    if (!user.clubId) return null;
    return clubs.find((club) => club.id === user.clubId);
  };

  const filteredUsers = users.filter((user) => {
    // Approval status filter based on active tab
    const matchesApprovalStatus =
      (activeTab === 'approved' && user.approvalStatus === 'approved') ||
      (activeTab === 'pending' && user.approvalStatus === 'pending');
    
    if (!matchesApprovalStatus) return false;

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
    
    // Specific club filter (nested under church)
    if (filters.clubId && user.clubId !== filters.clubId) return false;

    // Role filter
    if (filters.role !== 'all' && user.role !== filters.role) return false;

    // Status filter (only applies to approved tab)
    if (activeTab === 'approved') {
      if (filters.status === 'active' && !user.isActive) return false;
      if (filters.status === 'inactive' && user.isActive) return false;
    }

    return true;
  });

  const pendingCount = users.filter((u) => u.approvalStatus === 'pending').length;
  const approvedCount = users.filter((u) => u.approvalStatus === 'approved').length;

  // Tab configuration
  const tabs: Tab[] = [
    {
      id: 'approved',
      label: `Approved (${approvedCount})`,
      icon: 'account-check',
    },
    {
      id: 'pending',
      label: `Pending Approval (${pendingCount})`,
      icon: 'clock-alert-outline',
      badge: pendingCount,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader
        title="Users Management"
        subtitle={`${approvedCount} approved • ${pendingCount} pending`}
      />

      <TabBar
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'approved' | 'pending')}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search users..."
        onFilterPress={activeTab === 'approved' ? () => setFilterVisible(true) : undefined}
        filterActive={getActiveFilterCount() > 0}
      />

      <View style={styles.content}>
        {filteredUsers.length > 0 ? (
          activeTab === 'pending' ? (
            filteredUsers.map((user) => (
            <View key={user.id} style={[styles.pendingUserCard, { backgroundColor: colors.warningAlpha10, borderColor: colors.warning }]}>
              <View style={[styles.pendingAvatar, { backgroundColor: colors.warningAlpha20 }]}>
                <Text style={[styles.pendingAvatarText, { color: colors.warning }]}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
                <View style={[styles.pendingBadge, { backgroundColor: colors.warning }]}>
                  <MaterialCommunityIcons name="clock" size={10} color={colors.textInverse} />
                </View>
              </View>

              <View style={styles.pendingUserInfo}>
                <View style={styles.pendingHeader}>
                  <Text style={[styles.pendingUserName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <View style={[
                    styles.pendingStatusBadge,
                    { backgroundColor: colors.warningLight },
                    user.role === UserRole.CLUB_ADMIN && styles.clubAdminBadge
                  ]}>
                    <MaterialCommunityIcons 
                      name={user.role === UserRole.CLUB_ADMIN ? 'shield-account' : 'clock-alert-outline'}
                      size={12} 
                      color={colors.warning}
                    />
                    <Text style={[
                      styles.pendingStatusText,
                      user.role === UserRole.CLUB_ADMIN && styles.clubAdminText
                    ]}>
                      {user.role === UserRole.CLUB_ADMIN ? 'Club Admin' : 'Pending'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.pendingUserEmail, { color: colors.textSecondary }]} numberOfLines={1}>
                  {user.email}
                </Text>

                <View style={styles.pendingDetailsRow}>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="domain" size={12} color={colors.primary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                      {getClubName(user.clubId)}
                    </Text>
                  </View>
                  {user.whatsappNumber && (
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons name="whatsapp" size={12} color={colors.success} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                        {user.whatsappNumber}
                      </Text>
                    </View>
                  )}
                  {user.classes && user.classes.length > 0 && (
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons name="school" size={12} color={colors.primary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                        {user.classes.slice(0, 2).join(', ')}{user.classes.length > 2 ? '...' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.pendingActionsContainer}>
                <IconButton
                  icon="close-circle"
                  onPress={() => handleRejectUser(user.id, user.name)}
                  size="md"
                  color={colors.textInverse}
                  style={[styles.rejectButton, { backgroundColor: colors.error }]}
                  accessibilityLabel="Reject user"
                />
                <IconButton
                  icon="check-circle"
                  onPress={() => handleApproveUser(user.id, user.name, user.role)}
                  size="md"
                  color={colors.textInverse}
                  style={styles.approveButton}
                  accessibilityLabel="Approve user"
                />
              </View>
            </View>
          ))
          ) : (
            // Approved users - show normal user cards
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                clubName={getClubName(user.clubId)}
                onPress={() => {
                  setSelectedUser(user);
                  setDetailVisible(true);
                }}
                showAdminActions={true}
                onToggleStatus={() => handleToggleUserStatus(user.id, user.isActive)}
                onDelete={() => handleDeleteUser(user.id, user.name)}
              />
            ))
          )
        ) : (
          <EmptyState
            icon={activeTab === 'pending' ? 'account-clock' : 'account-group-outline'}
            title={activeTab === 'pending' ? 'No pending approvals' : 'No users found'}
            description={
              activeTab === 'pending'
                ? 'All user applications have been processed'
                : users.length === 0
                ? 'No users in the system'
                : 'Try adjusting your filters'
            }
          />
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
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Filter Users</Text>
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
                  Navigate from general (Division) to specific (Club). Each level filters the next.
                </Text>
              </View>

              {/* Organization Section */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary }]}>Organization</Text>

                {/* Division */}
                {availableDivisions.length === 1 ? (
                  <View style={[styles.hierarchyItem, { backgroundColor: colors.surfaceLight }]}>
                    <MaterialCommunityIcons name="earth" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={[styles.hierarchyLabel, { color: colors.textSecondary }]}>Division</Text>
                      <Text style={[styles.hierarchyValue, { color: colors.textPrimary }]}>{availableDivisions[0]}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : (
                  <View>
                    <Text style={[styles.hierarchyLabel, { color: colors.textSecondary }]}>Division</Text>
                    {availableDivisions.map((division) => (
                      <TouchableOpacity
                        key={division}
                        style={[
                          styles.filterOption,
                          { backgroundColor: colors.surfaceLight },
                          filters.division === division && [styles.filterOptionActive, { backgroundColor: colors.primaryLight, borderColor: colors.primary }],
                        ]}
                        onPress={() => updateFilter('division', division)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            { color: colors.textSecondary },
                            filters.division === division && [styles.filterOptionTextActive, { color: colors.primary }],
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
                
                {/* Clubs - Level 5 (nested under church) */}
                {availableClubs.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons name="account-group" size={18} color={colors.primary} />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>Club</Text>
                      <Text style={styles.hierarchyValue}>{availableClubs[0].name}</Text>
                    </View>
                    <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                  </View>
                ) : availableClubs.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>Club (Optional)</Text>
                    <TouchableOpacity
                      style={[
                        styles.filterOption,
                        !filters.clubId && styles.filterOptionActive,
                      ]}
                      onPress={() => updateFilter('clubId', '')}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          !filters.clubId && styles.filterOptionTextActive,
                        ]}
                      >
                        All Clubs in {filters.church}
                      </Text>
                      {!filters.clubId && (
                        <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                    {availableClubs.map((club) => (
                      <TouchableOpacity
                        key={club.id}
                        style={[
                          styles.filterOption,
                          filters.clubId === club.id && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter('clubId', club.id)}
                      >
                        <View style={styles.filterOptionContent}>
                          <Text
                            style={[
                              styles.filterOptionText,
                              filters.clubId === club.id && styles.filterOptionTextActive,
                            ]}
                          >
                            {club.name}
                          </Text>
                          {!club.isActive && (
                            <Text style={styles.clubInactiveLabel}>(Inactive)</Text>
                          )}
                        </View>
                        {filters.clubId === club.id && (
                          <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* Role Filter Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Role</Text>

                <TouchableOpacity
                  style={[styles.filterOption, filters.role === 'all' && styles.filterOptionActive]}
                  onPress={() => updateFilter('role', 'all')}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="account-group"
                      size={20}
                      color={filters.role === 'all' ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === 'all' && styles.filterOptionTextActive,
                      ]}
                    >
                      All Roles
                    </Text>
                  </View>
                  {filters.role === 'all' && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, filters.role === UserRole.ADMIN && styles.filterOptionActive]}
                  onPress={() => updateFilter('role', UserRole.ADMIN)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="shield-crown"
                      size={20}
                      color={filters.role === UserRole.ADMIN ? colors.primary : colors.error}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === UserRole.ADMIN && styles.filterOptionTextActive,
                      ]}
                    >
                      ADMIN
                    </Text>
                  </View>
                  {filters.role === UserRole.ADMIN && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, filters.role === UserRole.CLUB_ADMIN && styles.filterOptionActive]}
                  onPress={() => updateFilter('role', UserRole.CLUB_ADMIN)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="shield-account"
                      size={20}
                      color={filters.role === UserRole.CLUB_ADMIN ? colors.primary : colors.warning}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === UserRole.CLUB_ADMIN && styles.filterOptionTextActive,
                      ]}
                    >
                      CLUB ADMIN
                    </Text>
                  </View>
                  {filters.role === UserRole.CLUB_ADMIN && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, filters.role === UserRole.USER && styles.filterOptionActive]}
                  onPress={() => updateFilter('role', UserRole.USER)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="account"
                      size={20}
                      color={filters.role === UserRole.USER ? colors.primary : colors.info}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === UserRole.USER && styles.filterOptionTextActive,
                      ]}
                    >
                      USER
                    </Text>
                  </View>
                  {filters.role === UserRole.USER && (
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Status Filter Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>User Status</Text>

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
                      All Users
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
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  clearFilters();
                  setFilterVisible(false);
                }}
              >
                <MaterialCommunityIcons name="filter-off" size={20} color={colors.textSecondary} />
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
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  activeFilters: {
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: designTokens.borderRadius.xl,
    marginRight: 8,
    gap: 4,
  },
  filterChipHierarchy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: designTokens.borderRadius.xl,
    gap: 6,
  },
  filterChipText: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
  },
  hierarchyArrow: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.sm,
    fontWeight: 'bold',
  },
  filterSeparator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSeparatorText: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.sm,
    fontWeight: 'bold',
  },
  clearFiltersChip: {
    backgroundColor: designTokens.colors.errorLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: designTokens.borderRadius.xl,
  },
  clearFiltersText: {
    color: designTokens.colors.error,
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
    marginBottom: 8,
  },
  content: {
    padding: designTokens.spacing.lg,
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
    fontSize: mobileFontSizes['2xl'],
    fontWeight: 'bold',
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  modalBody: {
    maxHeight: 400,
  },
  hierarchyInfoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: designTokens.colors.primaryLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    margin: designTokens.spacing.lg,
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
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  hierarchyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: 8,
    gap: 12,
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
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  filterOptionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderWidth: 2,
    borderColor: designTokens.colors.primary,
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  filterOptionText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
  },
  filterOptionTextActive: {
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
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
  },
  applyButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textInverse,
  },
  clubInactiveLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.error,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  pendingUserCard: {
    backgroundColor: designTokens.colors.warningLight,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    minHeight: 80,
    borderLeftWidth: 3,
    borderLeftColor: designTokens.colors.warning,
  },
  pendingAvatar: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius['3xl'],
    backgroundColor: designTokens.colors.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
    flexShrink: 0,
    position: 'relative',
  },
  pendingAvatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.warning,
  },
  pendingBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: designTokens.colors.warningLight,
  },
  pendingUserInfo: {
    flex: 1,
    marginRight: designTokens.spacing.md,
    minWidth: 0,
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: designTokens.spacing.sm,
  },
  pendingUserName: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: 1,
  },
  pendingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: designTokens.colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: designTokens.borderRadius.sm,
    flexShrink: 0,
  },
  clubAdminBadge: {
    backgroundColor: designTokens.colors.warningLight,
  },
  pendingStatusText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
    color: designTokens.colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clubAdminText: {
    color: designTokens.colors.warning,
  },
  pendingUserEmail: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: 4,
  },
  pendingDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: designTokens.spacing.sm,
  },
  metaText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  pendingActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  rejectButton: {
    backgroundColor: designTokens.colors.error,
  },
  approveButton: {
    backgroundColor: designTokens.colors.success,
  },
});

export default UsersManagementScreen;

