import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { UserDetailModal } from '../../components/UserDetailModal';
import { User, PathfinderClass, Club, PATHFINDER_CLASSES, MemberBalance, UserRole } from '../../types';
import { ClassSelectionModal } from '../../components/ClassSelectionModal';
import { 
  ScreenHeader, 
  SearchBar, 
  TabBar, 
  FilterModal, 
  EmptyState,
  IconButton,
  type FilterSection,
  type Tab 
} from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { Text } from 'react-native';
import { mobileTypography, mobileFontSizes } from '../../shared/theme/mobileTypography';
import { MESSAGES, dynamicMessages } from '../../shared/constants';

const ClubMembersScreen = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [club, setClub] = useState<Club | null>(null);
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [classFilter, setClassFilter] = useState<PathfinderClass[]>([]);
  const [classEditModalVisible, setClassEditModalVisible] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<User | null>(null);

  useEffect(() => {
    if (user?.clubId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const [membersData, clubData] = await Promise.all([
        clubService.getClubMembers(user.clubId),
        clubService.getClub(user.clubId),
      ]);
      setMembers(membersData);
      setClub(clubData);

      const approvedMemberIds = membersData
        .filter((m) => m.approvalStatus === 'approved')
        .map((m) => m.id);
      
      if (approvedMemberIds.length > 0) {
        const balancesData = await paymentService.getAllMembersBalances(
          user.clubId,
          approvedMemberIds
        );
        setBalances(balancesData);
      }
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DATA);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleToggleMemberStatus = async (memberId: string, isActive: boolean) => {
    try {
      await userService.updateUser(memberId, { isActive: !isActive });
      loadData();
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_MEMBER_STATUS);
    }
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    Alert.alert(MESSAGES.TITLES.DELETE_MEMBER, dynamicMessages.confirmDeleteMember(memberName), [
      { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
      {
        text: MESSAGES.BUTTONS.DELETE,
        style: 'destructive',
        onPress: async () => {
          try {
            await userService.deleteUser(memberId);
            loadData();
          } catch (error) {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_DELETE_MEMBER);
          }
        },
      },
    ]);
  };

  const handleApproveMember = async (memberId: string, memberName: string) => {
    Alert.alert(MESSAGES.TITLES.APPROVE_MEMBER, dynamicMessages.confirmApproveMember(memberName), [
      { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
      {
        text: MESSAGES.BUTTONS.APPROVE,
        onPress: async () => {
          try {
            await userService.approveUser(memberId);
            Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.memberApproved(memberName));
            loadData();
          } catch (error) {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_APPROVE_MEMBER);
          }
        },
      },
    ]);
  };

  const handleRejectMember = (memberId: string, memberName: string) => {
    Alert.alert(MESSAGES.TITLES.REJECT_MEMBER, dynamicMessages.confirmRejectMember(memberName), [
      { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
      {
        text: MESSAGES.BUTTONS.REJECT,
        style: 'destructive',
        onPress: async () => {
          try {
            await userService.rejectUser(memberId);
            Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.memberRejected(memberName));
            loadData();
          } catch (error) {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_REJECT_MEMBER);
          }
        },
      },
    ]);
  };

  const handleEditClasses = (member: User) => {
    setMemberToEdit(member);
    setClassEditModalVisible(true);
  };

  const handleSaveClasses = async (classes: PathfinderClass[]) => {
    if (!memberToEdit) return;

    try {
      await userService.updateUser(memberToEdit.id, { classes });
      Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.CLASSES_UPDATED);
      loadData();
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_CLASSES);
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setClassFilter([]);
    setPaymentFilter('all');
    setFilterModalVisible(false);
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Club admins should not see club_admin applications in their pending list
      // Those require system admin approval
      if (member.role === UserRole.CLUB_ADMIN) {
        return false;
      }

      const matchesApprovalStatus =
        (activeTab === 'approved' && member.approvalStatus === 'approved') ||
        (activeTab === 'pending' && member.approvalStatus === 'pending');

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower);

      const matchesStatus =
        activeTab === 'pending' ||
        statusFilter === 'all' ||
        (statusFilter === 'active' && member.isActive) ||
        (statusFilter === 'inactive' && !member.isActive);

      const matchesClass =
        classFilter.length === 0 ||
        (member.classes && member.classes.some((c) => classFilter.includes(c)));

      return matchesApprovalStatus && matchesSearch && matchesStatus && matchesClass;
    });
  }, [members, searchQuery, statusFilter, activeTab, classFilter]);

  const pendingCount = useMemo(() => {
    // Only count regular users pending approval, not club admins
    return members.filter((m) => m.approvalStatus === 'pending' && m.role !== UserRole.CLUB_ADMIN).length;
  }, [members]);

  const approvedCount = useMemo(() => {
    return members.filter((m) => m.approvalStatus === 'approved').length;
  }, [members]);

  const availableClasses = useMemo(() => {
    const classes = new Set<PathfinderClass>();
    members.forEach((member) => {
      if (member.classes) {
        member.classes.forEach((c) => classes.add(c));
      }
    });
    return Array.from(classes);
  }, [members]);

  // Filter active count
  const hasActiveFilters = statusFilter !== 'all' || classFilter.length > 0 || paymentFilter !== 'all';

  // Tab configuration
  const tabs: Tab[] = [
    {
      id: 'approved',
      label: `Approved (${approvedCount})`,
      icon: 'account-check',
    },
    {
      id: 'pending',
      label: `Pending (${pendingCount})`,
      icon: 'clock-alert-outline',
      badge: pendingCount,
    },
  ];

  // Filter sections configuration
  const filterSections: FilterSection[] = [
    {
      id: 'status',
      title: 'Member Status',
      selectedValue: statusFilter,
      options: [
        { id: 'all', label: 'All Members', value: 'all', icon: 'account-group' },
        { id: 'active', label: 'Active Only', value: 'active', icon: 'check-circle', color: designTokens.colors.success },
        { id: 'inactive', label: 'Inactive Only', value: 'inactive', icon: 'cancel', color: designTokens.colors.error },
      ],
    },
    {
      id: 'payment',
      title: 'Payment Status',
      selectedValue: paymentFilter,
      options: [
        { id: 'all', label: 'All Payments', value: 'all', icon: 'cash-multiple' },
        { id: 'paid', label: 'Paid Up', value: 'paid', icon: 'check-circle', color: designTokens.colors.success },
        { id: 'pending', label: 'Pending Payments', value: 'pending', icon: 'clock-alert-outline', color: designTokens.colors.warning },
        { id: 'overdue', label: 'Overdue Payments', value: 'overdue', icon: 'alert-circle', color: designTokens.colors.error },
      ],
    },
  ];

  if (availableClasses.length > 0) {
    filterSections.push({
      id: 'class',
      title: 'Pathfinder Class',
      selectedValue: classFilter,
      multiSelect: true,
      infoBanner: {
        icon: 'information',
        text: 'Select classes to filter. Members with at least one selected class will be shown.',
      },
      options: PATHFINDER_CLASSES.filter((c) => availableClasses.includes(c)).map((pathfinderClass) => ({
        id: pathfinderClass,
        label: pathfinderClass,
        value: pathfinderClass,
        icon: 'school',
      })),
    });
  }

  const handleFilterSelect = (sectionId: string, value: string) => {
    if (sectionId === 'status') {
      setStatusFilter(value as any);
    } else if (sectionId === 'payment') {
      setPaymentFilter(value as any);
    } else if (sectionId === 'class') {
      if (classFilter.includes(value as PathfinderClass)) {
        setClassFilter(classFilter.filter((c) => c !== value));
      } else {
        setClassFilter([...classFilter, value as PathfinderClass]);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader
        title="Club Members"
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
        placeholder="Search members..."
        onFilterPress={activeTab === 'approved' ? () => setFilterModalVisible(true) : undefined}
        filterActive={hasActiveFilters}
      />

      <View style={styles.content}>
        {filteredMembers.length > 0 ? (
          activeTab === 'pending' ? (
            filteredMembers.map((member) => (
              <View key={member.id} style={styles.pendingMemberCard}>
                <View style={styles.pendingAvatar}>
                  <Text style={styles.pendingAvatarText}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                  <View style={styles.pendingBadge}>
                    <MaterialCommunityIcons name="clock" size={10} color={designTokens.colors.warning} />
                  </View>
                </View>

                <View style={styles.pendingMemberInfo}>
                  <View style={styles.pendingHeader}>
                    <Text style={styles.pendingMemberName} numberOfLines={1}>
                      {member.name}
                    </Text>
                    <View style={styles.pendingStatusBadge}>
                      <MaterialCommunityIcons name="clock-alert-outline" size={12} color={designTokens.colors.warning} />
                      <Text style={styles.pendingStatusText}>Pending</Text>
                    </View>
                  </View>

                  <Text style={styles.pendingMemberEmail} numberOfLines={1}>
                    {member.email}
                  </Text>

                  <View style={styles.pendingDetailsRow}>
                    {member.whatsappNumber && (
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="whatsapp" size={12} color={designTokens.colors.success} />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {member.whatsappNumber}
                        </Text>
                      </View>
                    )}
                    {member.classes && member.classes.length > 0 && (
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="school" size={12} color={designTokens.colors.primary} />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {member.classes.slice(0, 2).join(', ')}{member.classes.length > 2 ? '...' : ''}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.pendingActionsContainer}>
                  <IconButton
                    icon="close-circle"
                    onPress={() => handleRejectMember(member.id, member.name)}
                    size="md"
                    color={designTokens.colors.textInverse}
                    style={styles.rejectButton}
                    accessibilityLabel="Reject member"
                  />
                  <IconButton
                    icon="check-circle"
                    onPress={() => handleApproveMember(member.id, member.name)}
                    size="md"
                    color={designTokens.colors.textInverse}
                    style={styles.approveButton}
                    accessibilityLabel="Approve member"
                  />
                </View>
              </View>
            ))
          ) : (
            filteredMembers.map((member) => {
              const memberBalance = balances.find((b) => b.userId === member.id);
              const balanceColor = memberBalance 
                ? (memberBalance.balance >= 0 
                    ? designTokens.colors.success 
                    : memberBalance.overdueCharges > 0 
                      ? designTokens.colors.error 
                      : designTokens.colors.warning)
                : designTokens.colors.textSecondary;

              return (
                <TouchableOpacity
                  key={member.id}
                  style={[styles.memberCard, !member.isActive && styles.memberCardInactive]}
                  onPress={() => {
                    setSelectedMember(member);
                    setDetailVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.avatar, { backgroundColor: member.isActive ? balanceColor : designTokens.colors.backgroundTertiary }]}>
                    <Text style={[styles.avatarText, !member.isActive && styles.avatarTextInactive]}>
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.memberInfo}>
                    <View style={styles.memberHeader}>
                      <Text style={[styles.memberName, !member.isActive && styles.textInactive]} numberOfLines={1}>
                        {member.name}
                      </Text>
                      <View style={styles.roleBadge}>
                        <Text style={[styles.roleText, !member.isActive && styles.roleTextInactive]}>
                          {member.role === 'club_admin' ? 'CLUB ADMIN' : 'USER'}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.memberEmail, !member.isActive && styles.textInactive]} numberOfLines={1}>
                      {member.email}
                    </Text>

                    <View style={styles.detailsRow}>
                      {member.classes && member.classes.length > 0 && (
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons 
                            name="school" 
                            size={12} 
                            color={member.isActive ? designTokens.colors.primary : designTokens.colors.textQuaternary} 
                          />
                          <Text style={[styles.metaText, !member.isActive && styles.textInactive]} numberOfLines={1}>
                            {member.classes.slice(0, 2).join(', ')}{member.classes.length > 2 ? '...' : ''}
                          </Text>
                        </View>
                      )}

                      {member.whatsappNumber && (
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons 
                            name="whatsapp" 
                            size={12} 
                            color={member.isActive ? designTokens.colors.success : designTokens.colors.textQuaternary} 
                          />
                          <Text style={[styles.metaText, !member.isActive && styles.textInactive]} numberOfLines={1}>
                            {member.whatsappNumber}
                          </Text>
                        </View>
                      )}

                      <View style={styles.statusBadge}>
                        <MaterialCommunityIcons
                          name={member.isActive ? 'check-circle' : 'cancel'}
                          size={12}
                          color={member.isActive ? designTokens.colors.success : designTokens.colors.error}
                        />
                        <Text style={styles.statusText}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>

                    {memberBalance && (
                      <View style={styles.balanceRow}>
                        <View style={[styles.balanceIndicator, { backgroundColor: balanceColor }]}>
                          <MaterialCommunityIcons name="cash" size={14} color={designTokens.colors.textInverse} />
                          <Text style={styles.balanceText}>
                            ${Math.abs(memberBalance.balance).toFixed(2)}
                          </Text>
                          {memberBalance.balance < 0 && (
                            <Text style={styles.balanceLabel}>
                              {memberBalance.overdueCharges > 0 ? 'OVERDUE' : 'PENDING'}
                            </Text>
                          )}
                          {memberBalance.balance >= 0 && (
                            <Text style={styles.balanceLabel}>PAID UP</Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.actionsContainer}>
                    <IconButton
                      icon="school-outline"
                      onPress={() => handleEditClasses(member)}
                      size="md"
                      color={designTokens.colors.primary}
                      accessibilityLabel="Edit classes"
                    />
                    <IconButton
                      icon={member.isActive ? 'cancel' : 'check-circle'}
                      onPress={() => handleToggleMemberStatus(member.id, member.isActive)}
                      size="md"
                      color={member.isActive ? designTokens.colors.error : designTokens.colors.success}
                      accessibilityLabel={member.isActive ? 'Deactivate member' : 'Activate member'}
                    />
                    <IconButton
                      icon="delete-outline"
                      onPress={() => handleDeleteMember(member.id, member.name)}
                      size="md"
                      color={designTokens.colors.error}
                      accessibilityLabel="Delete member"
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )
        ) : (
          <EmptyState
            icon={activeTab === 'pending' ? 'clock-check-outline' : 'account-search'}
            title={activeTab === 'pending' ? 'No pending approvals' : 'No members found'}
            description={
              activeTab === 'pending'
                ? 'All member registrations have been processed'
                : 'Try adjusting your search or filters'
            }
          />
        )}
      </View>

      <FilterModal
        visible={filterModalVisible}
        title="Filter Members"
        sections={filterSections}
        onClose={() => setFilterModalVisible(false)}
        onClear={clearFilters}
        onApply={applyFilters}
        onSelectOption={handleFilterSelect}
      />

      <UserDetailModal
        visible={detailVisible}
        user={selectedMember}
        onClose={() => {
          setDetailVisible(false);
          setSelectedMember(null);
        }}
      />

      <ClassSelectionModal
        visible={classEditModalVisible}
        initialClasses={memberToEdit?.classes || []}
        onSave={handleSaveClasses}
        onClose={() => {
          setClassEditModalVisible(false);
          setMemberToEdit(null);
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
  pendingMemberCard: {
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
  pendingMemberInfo: {
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
  pendingMemberName: {
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
  pendingStatusText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
    color: designTokens.colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pendingMemberEmail: {
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
  memberCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    minHeight: 80,
  },
  memberCardInactive: {
    backgroundColor: designTokens.colors.backgroundTertiary,
    opacity: 0.8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
    flexShrink: 0,
  },
  avatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  avatarTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  memberInfo: {
    flex: 1,
    marginRight: designTokens.spacing.md,
    minWidth: 0,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: designTokens.spacing.sm,
  },
  memberName: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: 1,
  },
  textInactive: {
    color: designTokens.colors.textQuaternary,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: designTokens.borderRadius.sm,
    backgroundColor: designTokens.colors.infoLight,
    flexShrink: 0,
  },
  roleText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
    color: designTokens.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  memberEmail: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  balanceRow: {
    marginTop: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: designTokens.borderRadius.lg,
    alignSelf: 'flex-start',
  },
  balanceText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textInverse,
  },
  balanceLabel: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '700',
    color: designTokens.colors.textInverse,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default ClubMembersScreen;
