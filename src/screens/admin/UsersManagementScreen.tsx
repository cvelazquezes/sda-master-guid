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
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/userService';
import { clubService } from '../../services/clubService';
import { useTheme } from '../../contexts/ThemeContext';
import { User, UserRole, ApprovalStatus, UserStatus, Club } from '../../types';
import { UserCard } from '../../components/UserCard';
import { UserDetailModal } from '../../components/UserDetailModal';
import {
  ScreenHeader,
  SearchBar,
  EmptyState,
  TabBar,
  IconButton,
  type Tab,
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
  COMPONENT_SIZE,
  ELLIPSIS,
  EMPTY_VALUE,
  FILTER_STATUS,
  HIERARCHY_FIELDS,
  ICONS,
  LIST_SEPARATOR,
  MESSAGES,
  TEXT_LINES,
  borderValues,
  dimensionValues,
  dynamicMessages,
  flexValues,
  textTransformValues,
  typographyValues,
} from '../../shared/constants';

const UsersManagementScreen = () => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = windowWidth < BREAKPOINTS.MOBILE;

  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [filters, setFilters] = useState({
    division: EMPTY_VALUE,
    union: EMPTY_VALUE,
    association: EMPTY_VALUE,
    church: EMPTY_VALUE,
    clubId: EMPTY_VALUE,
    role: FILTER_STATUS.ALL,
    status: FILTER_STATUS.ALL,
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
    const roleLabel =
      userRole === UserRole.CLUB_ADMIN
        ? t('screens.usersManagement.roleClubAdmin')
        : t('screens.usersManagement.roleUser');
    Alert.alert(
      MESSAGES.TITLES.APPROVE_USER,
      dynamicMessages.confirmApproveUser(userName, roleLabel),
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
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
    Alert.alert(MESSAGES.TITLES.REJECT_USER, dynamicMessages.confirmRejectUser(userName), [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.REJECT,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
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
    ]);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(MESSAGES.TITLES.DELETE_USER, dynamicMessages.confirmDeleteUser(userName), [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.DELETE,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: async () => {
          try {
            await userService.deleteUser(userId);
            loadData();
          } catch (error) {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_DELETE_USER);
          }
        },
      },
    ]);
  };

  const clearFilters = () => {
    setFilters({
      division: EMPTY_VALUE,
      union: EMPTY_VALUE,
      association: EMPTY_VALUE,
      church: EMPTY_VALUE,
      clubId: EMPTY_VALUE,
      role: FILTER_STATUS.ALL,
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
    if (filters.role !== FILTER_STATUS.ALL) count++;
    if (filters.status !== FILTER_STATUS.ALL) count++;
    if (searchQuery) count++;
    return count;
  };

  const getClubName = (clubId: string | null) => {
    if (!clubId) return t('screens.usersManagement.noClub');
    const club = clubs.find((c) => c.id === clubId);
    return club ? club.name : t('screens.usersManagement.unknownClub');
  };

  // Get unique values for hierarchical filters (from clubs)
  const getUniqueClubValues = (field: string) => {
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

  // Get available clubs based on the selected church
  const getAvailableClubs = () => {
    if (!filters.church) return [];

    return clubs
      .filter((club) => {
        if (filters.division && club.division !== filters.division) return false;
        if (filters.union && club.union !== filters.union) return false;
        if (filters.association && club.association !== filters.association) return false;
        if (club.church !== filters.church) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
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
  }, [
    filterVisible,
    availableDivisions,
    availableUnions,
    availableAssociations,
    availableChurches,
    availableClubs,
    filters.church,
  ]);

  // Update filters with cascade logic
  const updateFilter = (field: string, value: string) => {
    const newFilters = { ...filters };

    if (field === HIERARCHY_FIELDS.DIVISION) {
      newFilters.division = value;
      if (!value) {
        newFilters.union = EMPTY_VALUE;
        newFilters.association = EMPTY_VALUE;
        newFilters.church = EMPTY_VALUE;
      } else {
        const validUnions = getUniqueValuesForDivision(HIERARCHY_FIELDS.UNION, value);
        if (!validUnions.includes(newFilters.union)) {
          newFilters.union = EMPTY_VALUE;
          newFilters.association = EMPTY_VALUE;
          newFilters.church = EMPTY_VALUE;
        }
      }
    } else if (field === HIERARCHY_FIELDS.UNION) {
      newFilters.union = value;
      if (!value) {
        newFilters.association = EMPTY_VALUE;
        newFilters.church = EMPTY_VALUE;
      } else {
        const validAssociations = getUniqueValuesForUnion(HIERARCHY_FIELDS.ASSOCIATION, value);
        if (!validAssociations.includes(newFilters.association)) {
          newFilters.association = EMPTY_VALUE;
          newFilters.church = EMPTY_VALUE;
        }
      }
    } else if (field === HIERARCHY_FIELDS.ASSOCIATION) {
      newFilters.association = value;
      if (!value) {
        newFilters.church = EMPTY_VALUE;
        newFilters.clubId = EMPTY_VALUE;
      } else {
        const validChurches = getUniqueValuesForAssociation(HIERARCHY_FIELDS.CHURCH, value);
        if (!validChurches.includes(newFilters.church)) {
          newFilters.church = EMPTY_VALUE;
          newFilters.clubId = EMPTY_VALUE;
        }
      }
    } else if (field === HIERARCHY_FIELDS.CHURCH) {
      newFilters.church = value;
      // Clear clubId when church changes
      if (!value) {
        newFilters.clubId = EMPTY_VALUE;
      } else {
        // Check if current clubId is valid for new church
        const validClubs = getAvailableClubsForChurch(value);
        if (!validClubs.find((c) => c.id === newFilters.clubId)) {
          newFilters.clubId = EMPTY_VALUE;
        }
      }
    } else if (field === HIERARCHY_FIELDS.CLUB_ID) {
      newFilters.clubId = value;
    } else if (field === HIERARCHY_FIELDS.ROLE) {
      newFilters.role = value;
    } else if (field === HIERARCHY_FIELDS.STATUS) {
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
    return clubs
      .filter((club) => {
        if (filters.division && club.division !== filters.division) return false;
        if (filters.union && club.union !== filters.union) return false;
        if (filters.association && club.association !== filters.association) return false;
        return club.church === church;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Get user's club to derive hierarchy
  const getUserClub = (user: User) => {
    if (!user.clubId) return null;
    return clubs.find((club) => club.id === user.clubId);
  };

  const filteredUsers = users.filter((user) => {
    // Approval status filter based on active tab
    const matchesApprovalStatus =
      (activeTab === ApprovalStatus.APPROVED && user.approvalStatus === ApprovalStatus.APPROVED) ||
      (activeTab === ApprovalStatus.PENDING && user.approvalStatus === ApprovalStatus.PENDING);

    if (!matchesApprovalStatus) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Hierarchical filter (through user's club)
    const userClub = getUserClub(user);
    if (filters.division && (!userClub || userClub.division !== filters.division)) return false;
    if (filters.union && (!userClub || userClub.union !== filters.union)) return false;
    if (filters.association && (!userClub || userClub.association !== filters.association))
      return false;
    if (filters.church && (!userClub || userClub.church !== filters.church)) return false;

    // Specific club filter (nested under church)
    if (filters.clubId && user.clubId !== filters.clubId) return false;

    // Role filter
    if (filters.role !== FILTER_STATUS.ALL && user.role !== filters.role) return false;

    // Status filter (only applies to approved tab)
    if (activeTab === ApprovalStatus.APPROVED) {
      if (filters.status === UserStatus.ACTIVE && !user.isActive) return false;
      if (filters.status === UserStatus.INACTIVE && user.isActive) return false;
    }

    return true;
  });

  const pendingCount = users.filter((u) => u.approvalStatus === ApprovalStatus.PENDING).length;
  const approvedCount = users.filter((u) => u.approvalStatus === ApprovalStatus.APPROVED).length;

  // Tab configuration
  const tabs: Tab[] = [
    {
      id: ApprovalStatus.APPROVED,
      label: t('screens.usersManagement.approvedTab', { count: approvedCount }),
      icon: ICONS.ACCOUNT_CHECK,
    },
    {
      id: ApprovalStatus.PENDING,
      label: t('screens.usersManagement.pendingTab', { count: pendingCount }),
      icon: ICONS.CLOCK_ALERT_OUTLINE,
      badge: pendingCount,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader
        title={t('screens.usersManagement.title')}
        subtitle={t('screens.usersManagement.subtitle', {
          approved: approvedCount,
          pending: pendingCount,
        })}
      />

      <TabBar
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={(tabId) =>
          setActiveTab(tabId as ApprovalStatus.APPROVED | ApprovalStatus.PENDING)
        }
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('screens.usersManagement.searchPlaceholder')}
        onFilterPress={
          activeTab === ApprovalStatus.APPROVED ? () => setFilterVisible(true) : undefined
        }
        filterActive={getActiveFilterCount() > 0}
      />

      <View style={styles.content}>
        {filteredUsers.length > 0 ? (
          activeTab === ApprovalStatus.PENDING ? (
            filteredUsers.map((user) => (
              <View
                key={user.id}
                style={[
                  styles.pendingUserCard,
                  { backgroundColor: colors.warningAlpha10, borderColor: colors.warning },
                ]}
              >
                <View style={[styles.pendingAvatar, { backgroundColor: colors.warningAlpha20 }]}>
                  <Text style={[styles.pendingAvatarText, { color: colors.warning }]}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                  <View style={[styles.pendingBadge, { backgroundColor: colors.warning }]}>
                    <MaterialCommunityIcons
                      name={ICONS.CLOCK}
                      size={designTokens.iconSize.xxs}
                      color={colors.textInverse}
                    />
                  </View>
                </View>

                <View style={styles.pendingUserInfo}>
                  <View style={styles.pendingHeader}>
                    <Text
                      style={[styles.pendingUserName, { color: colors.textPrimary }]}
                      numberOfLines={TEXT_LINES.single}
                    >
                      {user.name}
                    </Text>
                    <View
                      style={[
                        styles.pendingStatusBadge,
                        { backgroundColor: colors.warningLight },
                        user.role === UserRole.CLUB_ADMIN && styles.clubAdminBadge,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={
                          user.role === UserRole.CLUB_ADMIN
                            ? ICONS.SHIELD_ACCOUNT
                            : ICONS.CLOCK_ALERT_OUTLINE
                        }
                        size={designTokens.iconSize.xs}
                        color={colors.warning}
                      />
                      <Text
                        style={[
                          styles.pendingStatusText,
                          user.role === UserRole.CLUB_ADMIN && styles.clubAdminText,
                        ]}
                      >
                        {user.role === UserRole.CLUB_ADMIN
                          ? t('screens.usersManagement.clubAdminLabel')
                          : t('screens.usersManagement.pendingLabel')}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[styles.pendingUserEmail, { color: colors.textSecondary }]}
                    numberOfLines={TEXT_LINES.single}
                  >
                    {user.email}
                  </Text>

                  <View style={styles.pendingDetailsRow}>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name={ICONS.DOMAIN}
                        size={designTokens.iconSize.xs}
                        color={colors.primary}
                      />
                      <Text
                        style={[styles.metaText, { color: colors.textSecondary }]}
                        numberOfLines={TEXT_LINES.single}
                      >
                        {getClubName(user.clubId)}
                      </Text>
                    </View>
                    {user.whatsappNumber && (
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons
                          name={ICONS.WHATSAPP}
                          size={designTokens.iconSize.xs}
                          color={colors.success}
                        />
                        <Text
                          style={[styles.metaText, { color: colors.textSecondary }]}
                          numberOfLines={TEXT_LINES.single}
                        >
                          {user.whatsappNumber}
                        </Text>
                      </View>
                    )}
                    {user.classes && user.classes.length > 0 && (
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons
                          name={ICONS.SCHOOL}
                          size={designTokens.iconSize.xs}
                          color={colors.primary}
                        />
                        <Text
                          style={[styles.metaText, { color: colors.textSecondary }]}
                          numberOfLines={TEXT_LINES.single}
                        >
                          {user.classes.slice(0, 2).join(LIST_SEPARATOR)}
                          {user.classes.length > 2 ? ELLIPSIS : EMPTY_VALUE}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.pendingActionsContainer}>
                  <IconButton
                    icon={ICONS.CLOSE_CIRCLE}
                    onPress={() => handleRejectUser(user.id, user.name)}
                    size={COMPONENT_SIZE.md}
                    color={colors.textInverse}
                    style={[styles.rejectButton, { backgroundColor: colors.error }]}
                    accessibilityLabel={t('screens.usersManagement.rejectUser')}
                  />
                  <IconButton
                    icon={ICONS.CHECK_CIRCLE}
                    onPress={() => handleApproveUser(user.id, user.name, user.role)}
                    size={COMPONENT_SIZE.md}
                    color={colors.textInverse}
                    style={styles.approveButton}
                    accessibilityLabel={t('screens.usersManagement.approveUser')}
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
            icon={
              activeTab === ApprovalStatus.PENDING
                ? ICONS.ACCOUNT_CLOCK
                : ICONS.ACCOUNT_GROUP_OUTLINE
            }
            title={
              activeTab === ApprovalStatus.PENDING
                ? t('screens.usersManagement.noPendingApprovals')
                : t('screens.usersManagement.noUsersFound')
            }
            description={
              activeTab === ApprovalStatus.PENDING
                ? t('screens.usersManagement.allApplicationsProcessed')
                : users.length === 0
                  ? t('screens.usersManagement.noUsersRegistered')
                  : t('screens.usersManagement.noUsersMatchingFilters')
            }
          />
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
                {t('screens.usersManagement.filterUsers')}
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
                  {t('screens.usersManagement.filterDescription')}
                </Text>
              </View>

              {/* Organization Section */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.textPrimary }]}>
                  {t('screens.usersManagement.organizationSection')}
                </Text>

                {/* Division */}
                {availableDivisions.length === 1 ? (
                  <View style={[styles.hierarchyItem, { backgroundColor: colors.surfaceLight }]}>
                    <MaterialCommunityIcons
                      name={ICONS.EARTH}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={[styles.hierarchyLabel, { color: colors.textSecondary }]}>
                        {t('components.organizationHierarchy.levels.division')}
                      </Text>
                      <Text style={[styles.hierarchyValue, { color: colors.textPrimary }]}>
                        {availableDivisions[0]}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : (
                  <View>
                    <Text style={[styles.hierarchyLabel, { color: colors.textSecondary }]}>
                      {t('components.organizationHierarchy.levels.division')}
                    </Text>
                    {availableDivisions.map((division) => (
                      <TouchableOpacity
                        key={division}
                        style={[
                          styles.filterOption,
                          { backgroundColor: colors.surfaceLight },
                          filters.division === division && [
                            styles.filterOptionActive,
                            { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                          ],
                        ]}
                        onPress={() => updateFilter(HIERARCHY_FIELDS.DIVISION, division)}
                      >
                        <Text
                          style={[
                            styles.filterOptionText,
                            { color: colors.textSecondary },
                            filters.division === division && [
                              styles.filterOptionTextActive,
                              { color: colors.primary },
                            ],
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

                {/* Clubs - Level 5 (nested under church) */}
                {availableClubs.length === 1 ? (
                  <View style={styles.hierarchyItem}>
                    <MaterialCommunityIcons
                      name={ICONS.ACCOUNT_GROUP}
                      size={designTokens.iconSize.sm}
                      color={colors.primary}
                    />
                    <View style={styles.hierarchyInfo}>
                      <Text style={styles.hierarchyLabel}>
                        {t('components.organizationHierarchy.levels.club')}
                      </Text>
                      <Text style={styles.hierarchyValue}>{availableClubs[0].name}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.success}
                    />
                  </View>
                ) : availableClubs.length > 1 ? (
                  <View>
                    <Text style={styles.hierarchyLabel}>
                      {t('screens.usersManagement.clubOptional')}
                    </Text>
                    <TouchableOpacity
                      style={[styles.filterOption, !filters.clubId && styles.filterOptionActive]}
                      onPress={() => updateFilter(HIERARCHY_FIELDS.CLUB_ID, EMPTY_VALUE)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          !filters.clubId && styles.filterOptionTextActive,
                        ]}
                      >
                        {t('screens.usersManagement.allClubsIn', { church: filters.church })}
                      </Text>
                      {!filters.clubId && (
                        <MaterialCommunityIcons
                          name={ICONS.CHECK}
                          size={designTokens.iconSize.md}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                    {availableClubs.map((club) => (
                      <TouchableOpacity
                        key={club.id}
                        style={[
                          styles.filterOption,
                          filters.clubId === club.id && styles.filterOptionActive,
                        ]}
                        onPress={() => updateFilter(HIERARCHY_FIELDS.CLUB_ID, club.id)}
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
                            <Text style={styles.clubInactiveLabel}>
                              {t('screens.usersManagement.inactive')}
                            </Text>
                          )}
                        </View>
                        {filters.clubId === club.id && (
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

              {/* Role Filter Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.usersManagement.roleSection')}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    filters.role === FILTER_STATUS.ALL && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.ROLE, FILTER_STATUS.ALL)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.ACCOUNT_GROUP}
                      size={designTokens.iconSize.md}
                      color={
                        filters.role === FILTER_STATUS.ALL ? colors.primary : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === FILTER_STATUS.ALL && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.usersManagement.allRoles')}
                    </Text>
                  </View>
                  {filters.role === FILTER_STATUS.ALL && (
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
                    filters.role === UserRole.ADMIN && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.ROLE, UserRole.ADMIN)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.SHIELD_CROWN}
                      size={designTokens.iconSize.md}
                      color={filters.role === UserRole.ADMIN ? colors.primary : colors.error}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === UserRole.ADMIN && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.usersManagement.adminFilterLabel')}
                    </Text>
                  </View>
                  {filters.role === UserRole.ADMIN && (
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
                    filters.role === UserRole.CLUB_ADMIN && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.ROLE, UserRole.CLUB_ADMIN)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.SHIELD_ACCOUNT}
                      size={designTokens.iconSize.md}
                      color={filters.role === UserRole.CLUB_ADMIN ? colors.primary : colors.warning}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === UserRole.CLUB_ADMIN && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.usersManagement.clubAdminFilterLabel')}
                    </Text>
                  </View>
                  {filters.role === UserRole.CLUB_ADMIN && (
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
                    filters.role === UserRole.USER && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.ROLE, UserRole.USER)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.ACCOUNT}
                      size={designTokens.iconSize.md}
                      color={filters.role === UserRole.USER ? colors.primary : colors.info}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === UserRole.USER && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.usersManagement.userFilterLabel')}
                    </Text>
                  </View>
                  {filters.role === UserRole.USER && (
                    <MaterialCommunityIcons
                      name={ICONS.CHECK}
                      size={designTokens.iconSize.md}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {/* Status Filter Section */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t('screens.usersManagement.userStatusSection')}
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
                      {t('screens.usersManagement.allUsers')}
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
                    filters.status === UserStatus.ACTIVE && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.STATUS, FILTER_STATUS.ACTIVE)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.CHECK_CIRCLE}
                      size={designTokens.iconSize.md}
                      color={filters.status === UserStatus.ACTIVE ? colors.primary : colors.success}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === UserStatus.ACTIVE && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.usersManagement.activeOnly')}
                    </Text>
                  </View>
                  {filters.status === UserStatus.ACTIVE && (
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
                    filters.status === UserStatus.INACTIVE && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter(HIERARCHY_FIELDS.STATUS, FILTER_STATUS.INACTIVE)}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name={ICONS.CANCEL}
                      size={designTokens.iconSize.md}
                      color={filters.status === UserStatus.INACTIVE ? colors.primary : colors.error}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === UserStatus.INACTIVE && styles.filterOptionTextActive,
                      ]}
                    >
                      {t('screens.usersManagement.inactiveOnly')}
                    </Text>
                  </View>
                  {filters.status === UserStatus.INACTIVE && (
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
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  clearFilters();
                  setFilterVisible(false);
                }}
              >
                <MaterialCommunityIcons
                  name={ICONS.FILTER_OFF}
                  size={designTokens.iconSize.md}
                  color={colors.textSecondary}
                />
                <Text style={styles.clearButtonText}>{t('screens.usersManagement.clearAll')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterVisible(false)}>
                <Text style={styles.applyButtonText}>
                  {t('screens.usersManagement.applyFilters')}
                </Text>
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
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  activeFilters: {
    marginBottom: designTokens.spacing.md,
  },
  filterChip: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.xl,
    marginRight: designTokens.spacing.sm,
    gap: designTokens.spacing.xs,
  },
  filterChipHierarchy: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.sm,
  },
  filterChipText: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
  },
  hierarchyArrow: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
  },
  filterSeparator: {
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  filterSeparatorText: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
  },
  clearFiltersChip: {
    backgroundColor: designTokens.colors.errorLight,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.xl,
  },
  clearFiltersText: {
    color: designTokens.colors.error,
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
  },
  resultsCount: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.sm,
  },
  content: {
    padding: designTokens.spacing.lg,
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
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  modalBody: {
    maxHeight: dimensionValues.maxHeight.modalBodySmall,
  },
  hierarchyInfoBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    backgroundColor: designTokens.colors.primaryLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    margin: designTokens.spacing.lg,
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
    fontWeight: designTokens.fontWeight.medium,
    textTransform: textTransformValues.uppercase,
    marginBottom: designTokens.spacing.xxs,
  },
  hierarchyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
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
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  filterOptionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.primary,
  },
  filterOptionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  filterOptionText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
  },
  filterOptionTextActive: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
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
  },
  applyButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
  clubInactiveLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.error,
    marginLeft: designTokens.spacing.sm,
    fontStyle: layoutConstants.fontStyle.italic,
  },
  pendingUserCard: {
    backgroundColor: designTokens.colors.warningLight,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: dimensionValues.minHeight.cardContent,
    borderLeftWidth: 3,
    borderLeftColor: designTokens.colors.warning,
  },
  pendingAvatar: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    backgroundColor: designTokens.colors.warningLight,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
    flexShrink: flexValues.shrinkDisabled,
    position: layoutConstants.position.relative,
  },
  pendingAvatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.warning,
  },
  pendingBadge: {
    position: layoutConstants.position.absolute,
    bottom: dimensionValues.offset.badgeNegative,
    right: dimensionValues.offset.badgeNegative,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xl,
    width: dimensionValues.size.badgeSmall,
    height: dimensionValues.size.badgeSmall,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.warningLight,
  },
  pendingUserInfo: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  pendingHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  pendingUserName: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
  },
  pendingStatusBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xxs,
    backgroundColor: designTokens.colors.warningLight,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.sm,
    flexShrink: flexValues.shrinkDisabled,
  },
  clubAdminBadge: {
    backgroundColor: designTokens.colors.warningLight,
  },
  pendingStatusText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.warning,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  clubAdminText: {
    color: designTokens.colors.warning,
  },
  pendingUserEmail: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  pendingDetailsRow: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  metaItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    marginRight: designTokens.spacing.sm,
  },
  metaText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  pendingActionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
    flexShrink: flexValues.shrinkDisabled,
  },
  rejectButton: {
    backgroundColor: designTokens.colors.error,
  },
  approveButton: {
    backgroundColor: designTokens.colors.success,
  },
});

export default UsersManagementScreen;
