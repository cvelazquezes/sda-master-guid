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
import { useTranslation } from 'react-i18next';
import {
  User,
  PathfinderClass,
  Club,
  PATHFINDER_CLASSES,
  MemberBalance,
  UserRole,
  ApprovalStatus,
} from '../../types';
import { ClassSelectionModal } from '../../components/ClassSelectionModal';
import {
  ScreenHeader,
  SearchBar,
  TabBar,
  FilterModal,
  EmptyState,
  IconButton,
  type FilterSection,
  type Tab,
} from '../../shared/components';
import { Text } from 'react-native';
import {
  mobileTypography,
  mobileFontSizes,
  designTokens,
  layoutConstants,
} from '../../shared/theme';
import {
  MESSAGES,
  dynamicMessages,
  ICONS,
  TOUCH_OPACITY,
  TEXT_LINES,
  COMPONENT_SIZE,
  flexValues,
  ALERT_BUTTON_STYLE,
  FILTER_STATUS,
  EMPTY_VALUE,
  textTransformValues,
  typographyValues,
  dimensionValues,
  ELLIPSIS,
  LIST_SEPARATOR,
  PAYMENT_STATUS,
  MEMBER_TAB,
  FILTER_SECTION,
  STATUS,
} from '../../shared/constants';

const ClubMembersScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [, setClub] = useState<Club | null>(null);
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    typeof FILTER_STATUS.ALL | typeof STATUS.active | typeof STATUS.inactive
  >(FILTER_STATUS.ALL);
  const [paymentFilter, setPaymentFilter] = useState<
    | typeof FILTER_STATUS.ALL
    | typeof PAYMENT_STATUS.PAID
    | typeof PAYMENT_STATUS.PENDING
    | typeof PAYMENT_STATUS.OVERDUE
  >(FILTER_STATUS.ALL);
  const [activeTab, setActiveTab] = useState<
    typeof MEMBER_TAB.APPROVED | typeof MEMBER_TAB.PENDING
  >(MEMBER_TAB.APPROVED);
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
        .filter((m) => m.approvalStatus === ApprovalStatus.APPROVED)
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
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.DELETE,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
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
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
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
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.REJECT,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
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
    setStatusFilter(FILTER_STATUS.ALL);
    setClassFilter([]);
    setPaymentFilter(FILTER_STATUS.ALL);
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
        (activeTab === MEMBER_TAB.APPROVED && member.approvalStatus === ApprovalStatus.APPROVED) ||
        (activeTab === MEMBER_TAB.PENDING && member.approvalStatus === ApprovalStatus.PENDING);

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower);

      const matchesStatus =
        activeTab === MEMBER_TAB.PENDING ||
        statusFilter === FILTER_STATUS.ALL ||
        (statusFilter === STATUS.active && member.isActive) ||
        (statusFilter === STATUS.inactive && !member.isActive);

      const matchesClass =
        classFilter.length === 0 ||
        (member.classes && member.classes.some((c) => classFilter.includes(c)));

      return matchesApprovalStatus && matchesSearch && matchesStatus && matchesClass;
    });
  }, [members, searchQuery, statusFilter, activeTab, classFilter]);

  const pendingCount = useMemo(() => {
    // Only count regular users pending approval, not club admins
    return members.filter(
      (m) => m.approvalStatus === ApprovalStatus.PENDING && m.role !== UserRole.CLUB_ADMIN
    ).length;
  }, [members]);

  const approvedCount = useMemo(() => {
    return members.filter((m) => m.approvalStatus === ApprovalStatus.APPROVED).length;
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
  const hasActiveFilters =
    statusFilter !== FILTER_STATUS.ALL ||
    classFilter.length > 0 ||
    paymentFilter !== FILTER_STATUS.ALL;

  // Tab configuration
  const tabs: Tab[] = [
    {
      id: MEMBER_TAB.APPROVED,
      label: t('screens.clubMembers.approvedTab', { count: approvedCount }),
      icon: ICONS.ACCOUNT_CHECK,
    },
    {
      id: MEMBER_TAB.PENDING,
      label: t('screens.clubMembers.pendingTab', { count: pendingCount }),
      icon: ICONS.CLOCK_ALERT_OUTLINE,
      badge: pendingCount,
    },
  ];

  // Filter sections configuration
  const filterSections: FilterSection[] = [
    {
      id: FILTER_SECTION.STATUS,
      title: t('screens.clubMembers.memberStatus'),
      selectedValue: statusFilter,
      options: [
        {
          id: FILTER_STATUS.ALL,
          label: t('screens.clubMembers.allMembers'),
          value: FILTER_STATUS.ALL,
          icon: ICONS.ACCOUNT_GROUP,
        },
        {
          id: STATUS.active,
          label: t('screens.clubMembers.activeOnly'),
          value: STATUS.active,
          icon: ICONS.CHECK_CIRCLE,
          color: designTokens.colors.success,
        },
        {
          id: STATUS.inactive,
          label: t('screens.clubMembers.inactiveOnly'),
          value: STATUS.inactive,
          icon: ICONS.CANCEL,
          color: designTokens.colors.error,
        },
      ],
    },
    {
      id: FILTER_SECTION.PAYMENT,
      title: t('screens.clubMembers.paymentStatus'),
      selectedValue: paymentFilter,
      options: [
        {
          id: FILTER_STATUS.ALL,
          label: t('screens.clubMembers.allPayments'),
          value: FILTER_STATUS.ALL,
          icon: ICONS.CASH_MULTIPLE,
        },
        {
          id: PAYMENT_STATUS.PAID,
          label: t('screens.clubMembers.paidUpFilter'),
          value: PAYMENT_STATUS.PAID,
          icon: ICONS.CHECK_CIRCLE,
          color: designTokens.colors.success,
        },
        {
          id: PAYMENT_STATUS.PENDING,
          label: t('screens.clubMembers.pendingPayments'),
          value: PAYMENT_STATUS.PENDING,
          icon: ICONS.CLOCK_ALERT_OUTLINE,
          color: designTokens.colors.warning,
        },
        {
          id: PAYMENT_STATUS.OVERDUE,
          label: t('screens.clubMembers.overduePayments'),
          value: PAYMENT_STATUS.OVERDUE,
          icon: ICONS.ALERT_CIRCLE,
          color: designTokens.colors.error,
        },
      ],
    },
  ];

  if (availableClasses.length > 0) {
    filterSections.push({
      id: FILTER_SECTION.CLASS,
      title: t('screens.clubMembers.pathfinderClass'),
      selectedValue: classFilter,
      multiSelect: true,
      infoBanner: {
        icon: ICONS.INFORMATION,
        text: t('screens.clubMembers.classFilterInfo'),
      },
      options: PATHFINDER_CLASSES.filter((c) => availableClasses.includes(c)).map(
        (pathfinderClass) => ({
          id: pathfinderClass,
          label: pathfinderClass,
          value: pathfinderClass,
          icon: ICONS.SCHOOL_OUTLINE,
        })
      ),
    });
  }

  const handleFilterSelect = (sectionId: string, value: string): void => {
    if (sectionId === FILTER_SECTION.STATUS) {
      setStatusFilter(
        value as typeof FILTER_STATUS.ALL | typeof STATUS.active | typeof STATUS.inactive
      );
    } else if (sectionId === FILTER_SECTION.PAYMENT) {
      setPaymentFilter(
        value as
          | typeof FILTER_STATUS.ALL
          | typeof PAYMENT_STATUS.PAID
          | typeof PAYMENT_STATUS.PENDING
          | typeof PAYMENT_STATUS.OVERDUE
      );
    } else if (sectionId === FILTER_SECTION.CLASS) {
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
        title={t('screens.clubMembers.title')}
        subtitle={t('screens.clubMembers.subtitle', {
          approved: approvedCount,
          pending: pendingCount,
        })}
      />

      <TabBar
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={(tabId) =>
          setActiveTab(tabId as typeof MEMBER_TAB.APPROVED | typeof MEMBER_TAB.PENDING)
        }
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('placeholders.searchMembers')}
        onFilterPress={
          activeTab === MEMBER_TAB.APPROVED ? () => setFilterModalVisible(true) : undefined
        }
        filterActive={hasActiveFilters}
      />

      <View style={styles.content}>
        {filteredMembers.length > 0 ? (
          activeTab === MEMBER_TAB.PENDING ? (
            filteredMembers.map((member) => (
              <View key={member.id} style={styles.pendingMemberCard}>
                <View style={styles.pendingAvatar}>
                  <Text style={styles.pendingAvatarText}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                  <View style={styles.pendingBadge}>
                    <MaterialCommunityIcons
                      name={ICONS.CLOCK}
                      size={designTokens.iconSize.xxs}
                      color={designTokens.colors.warning}
                    />
                  </View>
                </View>

                <View style={styles.pendingMemberInfo}>
                  <View style={styles.pendingHeader}>
                    <Text style={styles.pendingMemberName} numberOfLines={TEXT_LINES.single}>
                      {member.name}
                    </Text>
                    <View style={styles.pendingStatusBadge}>
                      <MaterialCommunityIcons
                        name={ICONS.CLOCK_ALERT_OUTLINE}
                        size={designTokens.iconSize.xs}
                        color={designTokens.colors.warning}
                      />
                      <Text style={styles.pendingStatusText}>
                        {t('screens.usersManagement.pendingLabel')}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.pendingMemberEmail} numberOfLines={TEXT_LINES.single}>
                    {member.email}
                  </Text>

                  <View style={styles.pendingDetailsRow}>
                    {member.whatsappNumber && (
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons
                          name={ICONS.WHATSAPP}
                          size={designTokens.iconSize.xs}
                          color={designTokens.colors.success}
                        />
                        <Text style={styles.metaText} numberOfLines={TEXT_LINES.single}>
                          {member.whatsappNumber}
                        </Text>
                      </View>
                    )}
                    {member.classes && member.classes.length > 0 && (
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons
                          name={ICONS.SCHOOL}
                          size={designTokens.iconSize.xs}
                          color={designTokens.colors.primary}
                        />
                        <Text style={styles.metaText} numberOfLines={TEXT_LINES.single}>
                          {member.classes.slice(0, 2).join(LIST_SEPARATOR)}
                          {member.classes.length > 2 ? ELLIPSIS : EMPTY_VALUE}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.pendingActionsContainer}>
                  <IconButton
                    icon={ICONS.CLOSE_CIRCLE}
                    onPress={() => handleRejectMember(member.id, member.name)}
                    size={COMPONENT_SIZE.md}
                    color={designTokens.colors.textInverse}
                    style={styles.rejectButton}
                    accessibilityLabel={t('screens.clubMembers.rejectMember')}
                  />
                  <IconButton
                    icon={ICONS.CHECK_CIRCLE}
                    onPress={() => handleApproveMember(member.id, member.name)}
                    size={COMPONENT_SIZE.md}
                    color={designTokens.colors.textInverse}
                    style={styles.approveButton}
                    accessibilityLabel={t('screens.clubMembers.approveMember')}
                  />
                </View>
              </View>
            ))
          ) : (
            filteredMembers.map((member) => {
              const memberBalance = balances.find((b) => b.userId === member.id);
              const balanceColor = memberBalance
                ? memberBalance.balance >= 0
                  ? designTokens.colors.success
                  : memberBalance.overdueCharges > 0
                    ? designTokens.colors.error
                    : designTokens.colors.warning
                : designTokens.colors.textSecondary;

              return (
                <TouchableOpacity
                  key={member.id}
                  style={[styles.memberCard, !member.isActive && styles.memberCardInactive]}
                  onPress={() => {
                    setSelectedMember(member);
                    setDetailVisible(true);
                  }}
                  activeOpacity={TOUCH_OPACITY.default}
                >
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: member.isActive
                          ? balanceColor
                          : designTokens.colors.backgroundTertiary,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.avatarText, !member.isActive && styles.avatarTextInactive]}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.memberInfo}>
                    <View style={styles.memberHeader}>
                      <Text
                        style={[styles.memberName, !member.isActive && styles.textInactive]}
                        numberOfLines={TEXT_LINES.single}
                      >
                        {member.name}
                      </Text>
                      <View style={styles.roleBadge}>
                        <Text
                          style={[styles.roleText, !member.isActive && styles.roleTextInactive]}
                        >
                          {member.role === UserRole.CLUB_ADMIN
                            ? t('components.userCard.roles.clubAdmin')
                            : t('components.userCard.roles.user')}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[styles.memberEmail, !member.isActive && styles.textInactive]}
                      numberOfLines={TEXT_LINES.single}
                    >
                      {member.email}
                    </Text>

                    <View style={styles.detailsRow}>
                      {member.classes && member.classes.length > 0 && (
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons
                            name={ICONS.SCHOOL}
                            size={designTokens.iconSize.xs}
                            color={
                              member.isActive
                                ? designTokens.colors.primary
                                : designTokens.colors.textQuaternary
                            }
                          />
                          <Text
                            style={[styles.metaText, !member.isActive && styles.textInactive]}
                            numberOfLines={TEXT_LINES.single}
                          >
                            {member.classes.slice(0, 2).join(LIST_SEPARATOR)}
                            {member.classes.length > 2 ? ELLIPSIS : EMPTY_VALUE}
                          </Text>
                        </View>
                      )}

                      {member.whatsappNumber && (
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons
                            name={ICONS.WHATSAPP}
                            size={designTokens.iconSize.xs}
                            color={
                              member.isActive
                                ? designTokens.colors.success
                                : designTokens.colors.textQuaternary
                            }
                          />
                          <Text
                            style={[styles.metaText, !member.isActive && styles.textInactive]}
                            numberOfLines={TEXT_LINES.single}
                          >
                            {member.whatsappNumber}
                          </Text>
                        </View>
                      )}

                      <View style={styles.statusBadge}>
                        <MaterialCommunityIcons
                          name={member.isActive ? ICONS.CHECK_CIRCLE : ICONS.CANCEL}
                          size={designTokens.iconSize.xs}
                          color={
                            member.isActive
                              ? designTokens.colors.success
                              : designTokens.colors.error
                          }
                        />
                        <Text style={styles.statusText}>
                          {member.isActive
                            ? t('screens.clubMembers.active')
                            : t('screens.clubMembers.inactive')}
                        </Text>
                      </View>
                    </View>

                    {memberBalance && (
                      <View style={styles.balanceRow}>
                        <View style={[styles.balanceIndicator, { backgroundColor: balanceColor }]}>
                          <MaterialCommunityIcons
                            name={ICONS.CASH}
                            size={designTokens.iconSize.xs}
                            color={designTokens.colors.textInverse}
                          />
                          <Text style={styles.balanceText}>
                            ${Math.abs(memberBalance.balance).toFixed(2)}
                          </Text>
                          {memberBalance.balance < 0 && (
                            <Text style={styles.balanceLabel}>
                              {memberBalance.overdueCharges > 0
                                ? t('screens.clubMembers.overdue')
                                : t('screens.clubMembers.pendingStatus')}
                            </Text>
                          )}
                          {memberBalance.balance >= 0 && (
                            <Text style={styles.balanceLabel}>{t('screens.members.paidUp')}</Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.actionsContainer}>
                    <IconButton
                      icon={ICONS.SCHOOL_OUTLINE}
                      onPress={() => handleEditClasses(member)}
                      size={COMPONENT_SIZE.md}
                      color={designTokens.colors.primary}
                      accessibilityLabel={t('screens.clubMembers.editClasses')}
                    />
                    <IconButton
                      icon={member.isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE}
                      onPress={() => handleToggleMemberStatus(member.id, member.isActive)}
                      size={COMPONENT_SIZE.md}
                      color={
                        member.isActive ? designTokens.colors.error : designTokens.colors.success
                      }
                      accessibilityLabel={
                        member.isActive
                          ? t('screens.clubMembers.deactivateMember')
                          : t('screens.clubMembers.activateMember')
                      }
                    />
                    <IconButton
                      icon={ICONS.DELETE_OUTLINE}
                      onPress={() => handleDeleteMember(member.id, member.name)}
                      size={COMPONENT_SIZE.md}
                      color={designTokens.colors.error}
                      accessibilityLabel={t('screens.clubMembers.deleteMember')}
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )
        ) : (
          <EmptyState
            icon={
              activeTab === MEMBER_TAB.PENDING ? ICONS.CLOCK_CHECK_OUTLINE : ICONS.ACCOUNT_SEARCH
            }
            title={
              activeTab === MEMBER_TAB.PENDING
                ? t('screens.clubMembers.noPendingApprovals')
                : t('screens.clubMembers.noMembersFound')
            }
            description={
              activeTab === MEMBER_TAB.PENDING
                ? t('screens.clubMembers.allRegistrationsProcessed')
                : t('screens.clubMembers.tryAdjustingFilters')
            }
          />
        )}
      </View>

      <FilterModal
        visible={filterModalVisible}
        title={t('screens.clubMembers.filterMembers')}
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
    flex: flexValues.one,
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
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: dimensionValues.minHeight.cardContent,
    borderLeftWidth: designTokens.borderWidth.medium,
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
  pendingMemberInfo: {
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
  pendingMemberName: {
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
  pendingStatusText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.warning,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  pendingMemberEmail: {
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
  memberCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: dimensionValues.minHeight.cardContent,
  },
  memberCardInactive: {
    backgroundColor: designTokens.colors.backgroundTertiary,
    opacity: designTokens.opacity.high,
  },
  avatar: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
    flexShrink: flexValues.shrinkDisabled,
  },
  avatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  avatarTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  memberInfo: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  memberHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  memberName: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
  },
  textInactive: {
    color: designTokens.colors.textQuaternary,
  },
  roleBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.sm,
    backgroundColor: designTokens.colors.infoLight,
    flexShrink: flexValues.shrinkDisabled,
  },
  roleText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  roleTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  memberEmail: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  detailsRow: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  metaItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  metaText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  statusBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xxs,
  },
  statusText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.fontWeight.medium,
  },
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    flexShrink: flexValues.shrinkDisabled,
  },
  balanceRow: {
    marginTop: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  balanceIndicator: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
    alignSelf: layoutConstants.alignSelf.flexStart,
  },
  balanceText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textInverse,
  },
  balanceLabel: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textInverse,
    marginLeft: designTokens.spacing.xs,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
});

export default ClubMembersScreen;
