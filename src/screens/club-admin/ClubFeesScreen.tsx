import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  FlatList,
  RefreshControl,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { paymentService } from '../../services/paymentService';
import {
  User,
  Club,
  ClubFeeSettings,
  MemberBalance,
  CustomCharge,
} from '../../types';
import { mobileTypography, mobileIconSizes, mobileFontSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { MESSAGES, DATE_FORMATS, VALIDATION, FORMAT_REGEX, LIMITS } from '../../shared/constants';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ClubFeesScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Calculate responsive modal width
  const getModalWidth = () => {
    if (windowWidth > 768) return Math.min(550, windowWidth * 0.6);
    if (windowWidth > 480) return windowWidth * 0.85;
    return windowWidth * 0.9;
  };
  const modalWidth = getModalWidth();

  // Fee Settings State
  const [feeAmount, setFeeAmount] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [feeSettingsActive, setFeeSettingsActive] = useState(false);

  // Custom Charge Modal State
  const [chargeModalVisible, setChargeModalVisible] = useState(false);
  const [chargeDescription, setChargeDescription] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [chargeDueDate, setChargeDueDate] = useState('');
  const [chargeApplyToAll, setChargeApplyToAll] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Current view
  const [activeTab, setActiveTab] = useState<'settings' | 'balances' | 'charges'>(
    'settings'
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      setLoading(true);
      const [clubData, membersData, chargesData] = await Promise.all([
        clubService.getClub(user.clubId),
        clubService.getClubMembers(user.clubId),
        paymentService.getClubCustomCharges(user.clubId),
      ]);

      setClub(clubData);
      setMembers(membersData.filter((m) => m.approvalStatus === 'approved'));
      setCustomCharges(chargesData);

      // Load fee settings
      if (clubData.feeSettings) {
        setFeeAmount(clubData.feeSettings.monthlyFeeAmount.toString());
        setCurrency(clubData.feeSettings.currency);
        setSelectedMonths(clubData.feeSettings.activeMonths);
        setFeeSettingsActive(clubData.feeSettings.isActive);
      }

      // Load member balances
      const approvedMemberIds = membersData
        .filter((m) => m.approvalStatus === 'approved')
        .map((m) => m.id);
      const balancesData = await paymentService.getAllMembersBalances(
        user.clubId,
        approvedMemberIds
      );
      setBalances(balancesData);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, 'Failed to load fee data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ============================================
  // Fee Settings Actions
  // ============================================

  const toggleMonth = (monthIndex: number) => {
    if (selectedMonths.includes(monthIndex)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== monthIndex));
    } else {
      setSelectedMonths([...selectedMonths, monthIndex].sort((a, b) => a - b));
    }
  };

  const selectAllMonths = () => {
    setSelectedMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  };

  const clearAllMonths = () => {
    setSelectedMonths([]);
  };

  const saveFeeSettings = async () => {
    if (!user?.clubId || !club) return;

    const amount = parseFloat(feeAmount);
    if (isNaN(amount) || amount < VALIDATION.NUMBERS.MIN_AMOUNT) {
      Alert.alert(MESSAGES.TITLES.INVALID_AMOUNT, 'Please enter a valid fee amount');
      return;
    }

    if (selectedMonths.length === LIMITS.MIN_ARRAY_LENGTH && feeSettingsActive) {
      Alert.alert(MESSAGES.TITLES.NO_MONTHS_SELECTED_TITLE, MESSAGES.ERRORS.NO_MONTHS_SELECTED);
      return;
    }

    try {
      const feeSettings: ClubFeeSettings = {
        monthlyFeeAmount: amount,
        currency,
        activeMonths: selectedMonths,
        isActive: feeSettingsActive,
      };

      const updatedClub = { ...club, feeSettings };
      await clubService.updateClub(club.id, updatedClub);

      setClub(updatedClub);
      Alert.alert(MESSAGES.TITLES.SUCCESS, 'Fee settings saved successfully');
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, 'Failed to save fee settings');
    }
  };

  const generateFeesForYear = async () => {
    if (!user?.clubId || !club?.feeSettings) return;

    const currentYear = new Date().getFullYear();

    Alert.alert(
      'Generate Fees',
      `Generate monthly fees for all members for ${currentYear}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            try {
              await paymentService.generateMonthlyFees(
                user.clubId!,
                members,
                club.feeSettings!,
                currentYear
              );

              Alert.alert(MESSAGES.TITLES.SUCCESS, 'Fees generated successfully');
              loadData(); // Reload balances
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, 'Failed to generate fees');
            }
          },
        },
      ]
    );
  };

  // ============================================
  // Custom Charge Actions
  // ============================================

  const openChargeModal = () => {
    setChargeDescription('');
    setChargeAmount('');
    setChargeDueDate('');
    setChargeApplyToAll(true);
    setSelectedMemberIds([]);
    setChargeModalVisible(true);
  };

  const createCustomCharge = async () => {
    if (!user?.clubId) return;

    const amount = parseFloat(chargeAmount);
    if (isNaN(amount) || amount <= VALIDATION.NUMBERS.MIN_AMOUNT) {
      Alert.alert(MESSAGES.TITLES.INVALID_AMOUNT, MESSAGES.ERRORS.INVALID_AMOUNT);
      return;
    }

    if (!chargeDescription.trim()) {
      Alert.alert(MESSAGES.TITLES.MISSING_DESCRIPTION, MESSAGES.ERRORS.MISSING_DESCRIPTION);
      return;
    }

    if (!chargeDueDate) {
      Alert.alert(MESSAGES.TITLES.MISSING_DATE, MESSAGES.ERRORS.MISSING_DATE);
      return;
    }

    // Validate date format
    if (!FORMAT_REGEX.DATE.ISO.test(chargeDueDate)) {
      Alert.alert(MESSAGES.TITLES.INVALID_DATE, MESSAGES.ERRORS.INVALID_DATE_FORMAT);
      return;
    }

    try {
      const targetUserIds = chargeApplyToAll
        ? members.map((m) => m.id)
        : selectedMemberIds;

      if (targetUserIds.length === 0) {
        Alert.alert(MESSAGES.TITLES.NO_MEMBERS_SELECTED, MESSAGES.ERRORS.NO_MEMBERS_SELECTED);
        return;
      }

      await paymentService.createCustomCharge(
        user.clubId,
        chargeDescription,
        amount,
        chargeDueDate,
        targetUserIds,
        user.id
      );

      const memberText = chargeApplyToAll 
        ? 'all members' 
        : `${targetUserIds.length} member${targetUserIds.length > 1 ? 's' : ''}`;
      
      Alert.alert(
        MESSAGES.TITLES.SUCCESS, 
        `Custom charge of $${amount.toFixed(2)} created for ${memberText}`
      );
      
      setChargeModalVisible(false);
      setChargeDescription('');
      setChargeAmount('');
      setChargeDueDate('');
      setChargeApplyToAll(true);
      setSelectedMemberIds([]);
      
      loadData();
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_CREATE_CHARGE);
    }
  };

  // ============================================
  // Notification Actions
  // ============================================

  const notifyAllMembers = async () => {
    if (!user?.clubId) return;

    Alert.alert(
      'Notify All Members',
      'Send balance notification to all members via WhatsApp?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              let notificationCount = 0;

              for (const member of members) {
                const balance = balances.find((b) => b.userId === member.id);
                if (balance) {
                  const message = await paymentService.getNotificationMessage(
                    balance,
                    member.name
                  );

                  // Here you would integrate with your notification service
                  console.log(
                    `Notification to ${member.name} (${member.whatsappNumber}):`
                  );
                  console.log(message);
                  notificationCount++;
                }
              }

              // Update last notification date
              if (club && club.feeSettings) {
                const updatedSettings = {
                  ...club.feeSettings,
                  lastNotificationDate: new Date().toISOString(),
                };
                await clubService.updateClub(club.id, {
                  ...club,
                  feeSettings: updatedSettings,
                });
              }

              Alert.alert(
                'Success',
                `Notifications sent to ${notificationCount} members`
              );
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, 'Failed to send notifications');
            }
          },
        },
      ]
    );
  };

  const notifySingleMember = async (member: User, balance: MemberBalance) => {
    Alert.alert(
      'Notify Member',
      `Send balance notification to ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              const message = await paymentService.getNotificationMessage(
                balance,
                member.name
              );

              // Here you would integrate with your notification service
              console.log(
                `Notification to ${member.name} (${member.whatsappNumber}):`
              );
              console.log(message);

              Alert.alert(MESSAGES.TITLES.SUCCESS, 'Notification sent');
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, 'Failed to send notification');
            }
          },
        },
      ]
    );
  };

  // ============================================
  // Render Functions
  // ============================================

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        {/* Header Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <MaterialCommunityIcons name="information" size={20} color="{colors.primary}" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Configure Monthly Fees</Text>
            <Text style={styles.infoText}>
              Set up recurring monthly fees for your club members. Choose the months that require payment and the amount.
            </Text>
          </View>
        </View>

        {/* Active Toggle */}
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>Enable Monthly Fees</Text>
              <Text style={styles.settingSubtext}>
                Turn on to activate monthly fee collection
              </Text>
            </View>
            <Switch
              value={feeSettingsActive}
              onValueChange={setFeeSettingsActive}
              trackColor={{ false: designTokens.colors.borderLight, true: colors.primary }}
              thumbColor={feeSettingsActive ? colors.primary : designTokens.colors.backgroundSecondary}
            />
          </View>
        </View>

        {/* Amount Configuration */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Monthly Fee Amount</Text>
          <Text style={styles.inputSubtext}>Set the recurring monthly amount</Text>
          <View style={styles.amountRow}>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={feeAmount}
                onChangeText={setFeeAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={styles.currencyInputContainer}>
              <TextInput
                style={styles.currencyInput}
                value={currency}
                onChangeText={setCurrency}
                placeholder="USD"
                placeholderTextColor={colors.textTertiary}
                maxLength={3}
              />
            </View>
          </View>
        </View>

        {/* Month Selection */}
        <View style={styles.inputCard}>
          <View style={styles.monthHeaderRow}>
            <View>
              <Text style={styles.inputLabel}>Active Months</Text>
              <Text style={styles.inputSubtext}>Select months that require payment</Text>
            </View>
            <View style={styles.monthActions}>
              <TouchableOpacity onPress={selectAllMonths} style={styles.monthActionBtn}>
                <Text style={styles.monthActionText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearAllMonths} style={styles.monthActionBtn}>
                <Text style={styles.monthActionText}>None</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.monthGrid}>
            {MONTHS.map((month, index) => {
              const monthNumber = index + 1;
              const isSelected = selectedMonths.includes(monthNumber);

              return (
                <TouchableOpacity
                  key={monthNumber}
                  style={[styles.monthChip, isSelected && styles.monthChipSelected]}
                  onPress={() => toggleMonth(monthNumber)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.monthChipText,
                      isSelected && styles.monthChipTextSelected,
                    ]}
                  >
                    {month.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={saveFeeSettings}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="content-save" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Save Settings</Text>
          </TouchableOpacity>

          {feeSettingsActive && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={generateFeesForYear}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="calendar-plus" size={20} color="{colors.primary}" />
              <Text style={styles.secondaryButtonText}>
                Generate Fees for Current Year
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );

  const renderBalancesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.balancesHeader}>
        <View>
          <Text style={styles.balancesTitle}>Member Balances</Text>
          <Text style={styles.balancesSubtitle}>{balances.length} members</Text>
        </View>
        <TouchableOpacity style={styles.notifyAllButton} onPress={notifyAllMembers}>
          <MaterialCommunityIcons name="bell-ring-outline" size={18} color="white" />
          <Text style={styles.notifyAllButtonText}>Notify All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={balances}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const member = members.find((m) => m.id === item.userId);
          if (!member) return null;

          const statusColor =
            item.balance >= 0
              ? colors.success
              : item.overdueCharges > 0
              ? colors.error
              : colors.warning;

          return (
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <View style={styles.memberInfo}>
                  <View style={[styles.balanceAvatar, { backgroundColor: statusColor }]}>
                    <Text style={styles.balanceAvatarText}>
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.memberTextInfo}>
                    <Text style={styles.balanceName}>{member.name}</Text>
                    <Text style={styles.balanceEmail}>{member.email}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.notifyButton}
                  onPress={() => notifySingleMember(member, item)}
                >
                  <MaterialCommunityIcons name="bell-outline" size={22} color="{colors.primary}" />
                </TouchableOpacity>
              </View>

              <View style={styles.balanceDetails}>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>Total Owed:</Text>
                  <Text style={styles.balanceValue}>
                    ${item.totalOwed.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>Total Paid:</Text>
                  <Text style={[styles.balanceValue, { color: colors.success }]}>
                    ${item.totalPaid.toFixed(2)}
                  </Text>
                </View>

                <View style={[styles.balanceRow, styles.balanceTotalRow]}>
                  <Text style={styles.balanceTotalLabel}>Current Balance:</Text>
                  <Text style={[styles.balanceTotalValue, { color: statusColor }]}>
                    ${Math.abs(item.balance).toFixed(2)}{' '}
                    {item.balance < 0 ? '(owes)' : item.balance > 0 ? '(credit)' : ''}
                  </Text>
                </View>

                {item.overdueCharges > 0 && (
                  <View style={styles.overdueNotice}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={16}
                      color="{colors.error}"
                    />
                    <Text style={styles.overdueText}>
                      ${item.overdueCharges.toFixed(2)} overdue
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="wallet-outline" size={64} color={designTokens.colors.borderLight} />
            <Text style={styles.emptyStateText}>No balances to display</Text>
            <Text style={styles.emptyStateSubtext}>
              Generate fees to see member balances
            </Text>
          </View>
        }
      />
    </View>
  );

  const renderChargesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.chargesHeader}>
        <View>
          <Text style={styles.chargesTitle}>Custom Charges</Text>
          <Text style={styles.chargesSubtitle}>{customCharges.length} active charges</Text>
        </View>
        <TouchableOpacity style={styles.addChargeButton} onPress={openChargeModal}>
          <MaterialCommunityIcons name="plus" size={18} color="white" />
          <Text style={styles.addChargeButtonText}>New Charge</Text>
        </TouchableOpacity>
      </View>

      {customCharges.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-document-outline" size={64} color={designTokens.colors.borderLight} />
          <Text style={styles.emptyStateText}>No custom charges</Text>
          <Text style={styles.emptyStateSubtext}>
            Create charges for special events or one-time fees
          </Text>
        </View>
      ) : (
        <FlatList
          data={customCharges}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.chargeCard}>
              <View style={styles.chargeHeader}>
                <Text style={styles.chargeDescription}>{item.description}</Text>
                <Text style={styles.chargeAmount}>${item.amount.toFixed(2)}</Text>
              </View>

              <View style={styles.chargeDetails}>
                <View style={styles.chargeDetailRow}>
                  <MaterialCommunityIcons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.chargeDetailText}>
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.chargeDetailRow}>
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.chargeDetailText}>
                    {item.appliedToUserIds.length === 0
                      ? 'All members'
                      : `${item.appliedToUserIds.length} member${item.appliedToUserIds.length > 1 ? 's' : ''}`}
                  </Text>
                </View>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="loading" size={48} color="{colors.primary}" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fee Management</Text>
          <Text style={styles.headerSubtitle}>{club?.name}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={20}
            color={activeTab === 'settings' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'settings' && styles.tabTextActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'balances' && styles.tabActive]}
          onPress={() => setActiveTab('balances')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="wallet-outline"
            size={20}
            color={activeTab === 'balances' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[styles.tabText, activeTab === 'balances' && styles.tabTextActive]}
          >
            Balances
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'charges' && styles.tabActive]}
          onPress={() => setActiveTab('charges')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="file-document-outline"
            size={20}
            color={activeTab === 'charges' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[styles.tabText, activeTab === 'charges' && styles.tabTextActive]}
          >
            Charges
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'settings' && renderSettingsTab()}
      {activeTab === 'balances' && renderBalancesTab()}
      {activeTab === 'charges' && renderChargesTab()}

      {/* Custom Charge Modal */}
      <Modal
        visible={chargeModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setChargeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: modalWidth, maxHeight: windowHeight * 0.85 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Custom Charge</Text>
              <TouchableOpacity
                onPress={() => setChargeModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Description */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Description *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={chargeDescription}
                  onChangeText={setChargeDescription}
                  placeholder="e.g., Summer Camp, Special Event"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Amount */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Amount *</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.amountInput, {paddingLeft: 0}]}
                    value={chargeAmount}
                    onChangeText={setChargeAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              {/* Due Date */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Due Date *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={chargeDueDate}
                  onChangeText={setChargeDueDate}
                  placeholder={DATE_FORMATS.ISO_DATE}
                  placeholderTextColor={colors.textTertiary}
                />
                <Text style={styles.modalHint}>Format: 2025-12-31</Text>
              </View>

              {/* Apply To */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Apply To</Text>
                <View style={styles.applyToContainer}>
                  <TouchableOpacity
                    style={[
                      styles.applyToOption,
                      chargeApplyToAll && styles.applyToOptionActive,
                    ]}
                    onPress={() => {
                      setChargeApplyToAll(true);
                      setSelectedMemberIds([]);
                    }}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="account-group"
                      size={20}
                      color={chargeApplyToAll ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.applyToText,
                        chargeApplyToAll && styles.applyToTextActive,
                      ]}
                    >
                      All Members
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.applyToOption,
                      !chargeApplyToAll && styles.applyToOptionActive,
                    ]}
                    onPress={() => setChargeApplyToAll(false)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="account-multiple-check"
                      size={20}
                      color={!chargeApplyToAll ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.applyToText,
                        !chargeApplyToAll && styles.applyToTextActive,
                      ]}
                    >
                      Select Members
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Member Selection */}
                {!chargeApplyToAll && (
                  <View style={styles.memberSelectionContainer}>
                    <View style={styles.memberSelectionHeader}>
                      <Text style={styles.memberSelectionTitle}>
                        {selectedMemberIds.length} of {members.length} selected
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (selectedMemberIds.length === members.length) {
                            setSelectedMemberIds([]);
                          } else {
                            setSelectedMemberIds(members.map(m => m.id));
                          }
                        }}
                        style={styles.selectAllButton}
                      >
                        <Text style={styles.selectAllText}>
                          {selectedMemberIds.length === members.length ? 'Clear All' : 'Select All'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.membersList}>
                      {members.map((member) => {
                        const isSelected = selectedMemberIds.includes(member.id);
                        return (
                          <TouchableOpacity
                            key={member.id}
                            style={[
                              styles.memberItem,
                              isSelected && styles.memberItemSelected,
                            ]}
                            onPress={() => {
                              if (isSelected) {
                                setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
                              } else {
                                setSelectedMemberIds([...selectedMemberIds, member.id]);
                              }
                            }}
                            activeOpacity={0.7}
                          >
                            <View style={styles.memberItemLeft}>
                              <View style={[
                                styles.checkbox,
                                isSelected && styles.checkboxSelected,
                              ]}>
                                {isSelected && (
                                  <MaterialCommunityIcons name="check" size={16} color="white" />
                                )}
                              </View>
                              <View style={styles.memberItemInfo}>
                                <Text style={styles.memberItemName}>{member.name}</Text>
                                <Text style={styles.memberItemEmail}>{member.email}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setChargeModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={createCustomCharge}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="plus-circle" size={20} color="white" />
                <Text style={styles.modalCreateText}>Create Charge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
  },
  header: {
    backgroundColor: designTokens.colors.primary,
    padding: designTokens.spacing.xl,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: mobileFontSizes['4xl'],
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: mobileFontSizes.sm,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
    elevation: 2,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: designTokens.colors.primary,
  },
  tabText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  section: {
    padding: designTokens.spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.primaryLight,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: designTokens.colors.primary,
  },
  infoIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    lineHeight: 18,
  },
  settingCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: 16,
    elevation: 2,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    marginBottom: 4,
  },
  settingSubtext: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
  },
  inputCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: 16,
    elevation: 2,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  inputLabel: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    marginBottom: 4,
  },
  inputSubtext: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: mobileFontSizes.xl,
    fontWeight: '600',
    color: designTokens.colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    padding: 14, // Custom spacing
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  currencyInputContainer: {
    width: 100,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
    borderRadius: 10,
  },
  currencyInput: {
    padding: 14, // Custom spacing
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    textAlign: 'center',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  monthActions: {
    flexDirection: 'row',
    gap: 12,
  },
  monthActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.sm,
  },
  monthActionText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  monthChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: designTokens.colors.borderLight,
    minWidth: 70,
    alignItems: 'center',
  },
  monthChipSelected: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  monthChipText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    fontWeight: '500',
  },
  monthChipTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: designTokens.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    gap: 10,
    elevation: 3,
    shadowColor: designTokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    gap: 10,
    borderWidth: 2,
    borderColor: designTokens.colors.primary,
  },
  secondaryButtonText: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
  },
  balancesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  balancesTitle: {
    fontSize: mobileFontSizes.xl,
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
  },
  balancesSubtitle: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  chargesTitle: {
    fontSize: mobileFontSizes.xl,
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
  },
  chargesSubtitle: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  notifyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: designTokens.borderRadius.md,
    gap: 8,
    elevation: 2,
    shadowColor: designTokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  notifyAllButtonText: {
    color: 'white',
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
  },
  listContainer: {
    padding: designTokens.spacing.lg,
  },
  balanceCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: 12,
    elevation: 2,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  balanceAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceAvatarText: {
    color: 'white',
    fontSize: mobileFontSizes.xl,
    fontWeight: 'bold',
  },
  memberTextInfo: {
    flex: 1,
  },
  balanceName: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    marginBottom: 2,
  },
  balanceEmail: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
  },
  notifyButton: {
    padding: designTokens.spacing.sm,
  },
  balanceDetails: {
    gap: 10,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
  },
  balanceValue: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  balanceTotalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
  },
  balanceTotalLabel: {
    fontSize: mobileFontSizes.md,
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
  },
  balanceTotalValue: {
    fontSize: mobileFontSizes.xl,
    fontWeight: 'bold',
  },
  overdueNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.errorLight,
    padding: 10, // Custom spacing
    borderRadius: designTokens.borderRadius.md,
    gap: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: designTokens.colors.error,
  },
  overdueText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.error,
    fontWeight: '600',
  },
  chargesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  addChargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: designTokens.borderRadius.md,
    gap: 6,
    elevation: 2,
    shadowColor: designTokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addChargeButtonText: {
    color: 'white',
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
  },
  chargeCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: 12,
    elevation: 2,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: designTokens.colors.primary,
  },
  chargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chargeDescription: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  chargeAmount: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: 'bold',
    color: designTokens.colors.primary,
  },
  chargeDetails: {
    gap: 8,
  },
  chargeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chargeDetailText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: mobileFontSizes.lg, // Using design token
    fontWeight: '600',
    color: designTokens.colors.textTertiary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.borderLight,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xxl,
    elevation: 5,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  modalTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
  },
  modalCloseButton: {
    padding: designTokens.spacing.xs,
  },
  modalBody: {
    padding: designTokens.spacing.xl,
    maxHeight: 600,
  },
  modalInputGroup: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
    borderRadius: 10,
    padding: 14, // Custom spacing
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textPrimary,
  },
  modalHint: {
    fontSize: mobileFontSizes.xs, // Using design token (minimum readable)
    color: designTokens.colors.textTertiary,
    marginTop: 6,
  },
  applyToContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  applyToOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: designTokens.colors.borderLight,
    borderRadius: 10,
  },
  applyToOptionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  applyToText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
    color: designTokens.colors.textSecondary,
  },
  applyToTextActive: {
    color: designTokens.colors.primary,
  },
  memberSelectionContainer: {
    marginTop: 16,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    maxHeight: 250,
  },
  memberSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  memberSelectionTitle: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  selectAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: designTokens.colors.infoLight,
    borderRadius: designTokens.borderRadius.sm,
  },
  selectAllText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
    color: designTokens.colors.info,
  },
  membersList: {
    gap: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: designTokens.colors.borderLight,
  },
  memberItemSelected: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  memberItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: 2,
    borderColor: designTokens.colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  checkboxSelected: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  memberItemInfo: {
    flex: 1,
  },
  memberItemName: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    marginBottom: 2,
  },
  memberItemEmail: {
    fontSize: mobileFontSizes.xs, // Using design token (minimum readable)
    color: designTokens.colors.textSecondary,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: designTokens.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: designTokens.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textSecondary,
  },
  modalCreateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: designTokens.colors.primary,
    elevation: 2,
    shadowColor: designTokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalCreateText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: 'white',
  },
});

export default ClubFeesScreen;
