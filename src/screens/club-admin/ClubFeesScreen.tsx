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
import { useTranslation } from 'react-i18next';
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
  ApprovalStatus,
} from '../../types';
import { mobileTypography, mobileIconSizes, mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { ANIMATION, ICONS, MESSAGES, DATE_FORMATS, VALIDATION, FORMAT_REGEX, LIMITS, TOUCH_OPACITY, TEXT_LINES, flexValues, dimensionValues, shadowOffsetValues, ALERT_BUTTON_STYLE, KEYBOARD_TYPE, EMPTY_VALUE, FEE_TABS, LOG_MESSAGES, ALL_MONTHS } from '../../shared/constants';
import { logger } from '../../shared/utils/logger';

// Use designTokens for all visual values - no magic numbers

// Month keys for i18n translation
const MONTH_KEYS = [
  'screens.clubFees.months.january',
  'screens.clubFees.months.february',
  'screens.clubFees.months.march',
  'screens.clubFees.months.april',
  'screens.clubFees.months.may',
  'screens.clubFees.months.june',
  'screens.clubFees.months.july',
  'screens.clubFees.months.august',
  'screens.clubFees.months.september',
  'screens.clubFees.months.october',
  'screens.clubFees.months.november',
  'screens.clubFees.months.december',
] as const;

const ClubFeesScreen = () => {
  const { t } = useTranslation();
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
  const [feeAmount, setFeeAmount] = useState(t('screens.clubFees.defaultAmount'));
  const [currency, setCurrency] = useState(t('screens.clubFees.defaultCurrency'));
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [feeSettingsActive, setFeeSettingsActive] = useState(false);

  // Custom Charge Modal State
  const [chargeModalVisible, setChargeModalVisible] = useState(false);
  const [chargeDescription, setChargeDescription] = useState(EMPTY_VALUE);
  const [chargeAmount, setChargeAmount] = useState(EMPTY_VALUE);
  const [chargeDueDate, setChargeDueDate] = useState(EMPTY_VALUE);
  const [chargeApplyToAll, setChargeApplyToAll] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Current view
  const [activeTab, setActiveTab] = useState<typeof FEE_TABS[keyof typeof FEE_TABS]>(
    FEE_TABS.SETTINGS
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
      setMembers(membersData.filter((m) => m.approvalStatus === ApprovalStatus.APPROVED));
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
        .filter((m) => m.approvalStatus === ApprovalStatus.APPROVED)
        .map((m) => m.id);
      const balancesData = await paymentService.getAllMembersBalances(
        user.clubId,
        approvedMemberIds
      );
      setBalances(balancesData);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, t('screens.clubFees.failedToLoad'));
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
    setSelectedMonths([...ALL_MONTHS]);
  };

  const clearAllMonths = () => {
    setSelectedMonths([]);
  };

  const saveFeeSettings = async () => {
    if (!user?.clubId || !club) return;

    const amount = parseFloat(feeAmount);
    if (isNaN(amount) || amount < VALIDATION.NUMBERS.MIN_AMOUNT) {
      Alert.alert(MESSAGES.TITLES.INVALID_AMOUNT, t('screens.clubFees.invalidFeeAmount'));
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
      Alert.alert(MESSAGES.TITLES.SUCCESS, t('screens.clubFees.settingsSaved'));
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, t('screens.clubFees.failedToSave'));
    }
  };

  const generateFeesForYear = async () => {
    if (!user?.clubId || !club?.feeSettings) return;

    const currentYear = new Date().getFullYear();

    Alert.alert(
      t('screens.clubFees.generateFees'),
      t('screens.clubFees.generateFeesConfirm', { year: currentYear }),
      [
        { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: t('screens.clubFees.generate'),
          onPress: async () => {
            try {
              await paymentService.generateMonthlyFees(
                user.clubId!,
                members,
                club.feeSettings!,
                currentYear
              );

              Alert.alert(MESSAGES.TITLES.SUCCESS, t('screens.clubFees.feesGenerated'));
              loadData(); // Reload balances
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, t('screens.clubFees.failedToGenerate'));
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
    setChargeDescription(EMPTY_VALUE);
    setChargeAmount(EMPTY_VALUE);
    setChargeDueDate(EMPTY_VALUE);
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
        ? t('screens.clubFees.allMembers') 
        : t('screens.clubFees.memberCount', { count: targetUserIds.length });
      
      Alert.alert(
        MESSAGES.TITLES.SUCCESS, 
        t('screens.clubFees.chargeCreated', { amount: amount.toFixed(2), members: memberText })
      );
      
      setChargeModalVisible(false);
      setChargeDescription(EMPTY_VALUE);
      setChargeAmount(EMPTY_VALUE);
      setChargeDueDate(EMPTY_VALUE);
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
      t('screens.clubFees.notifyAllMembers'),
      t('screens.clubFees.notifyAllConfirm'),
      [
        { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: t('screens.clubFees.send'),
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
                  logger.debug(LOG_MESSAGES.SCREENS.CLUB_FEES.NOTIFICATION_TO_MEMBER, { 
                    name: member.name, 
                    whatsappNumber: member.whatsappNumber,
                    message 
                  });
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
                MESSAGES.TITLES.SUCCESS,
                t('screens.clubFees.notificationsSent', { count: notificationCount })
              );
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, t('screens.clubFees.failedToSendNotifications'));
            }
          },
        },
      ]
    );
  };

  const notifySingleMember = async (member: User, balance: MemberBalance) => {
    Alert.alert(
      t('screens.clubFees.notifyMember'),
      t('screens.clubFees.notifyMemberConfirm', { name: member.name }),
      [
        { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: t('screens.clubFees.send'),
          onPress: async () => {
            try {
              const message = await paymentService.getNotificationMessage(
                balance,
                member.name
              );

              // Here you would integrate with your notification service
              logger.debug(LOG_MESSAGES.SCREENS.CLUB_FEES.NOTIFICATION_TO_MEMBER, { 
                name: member.name, 
                whatsappNumber: member.whatsappNumber,
                message 
              });

              Alert.alert(MESSAGES.TITLES.SUCCESS, t('screens.clubFees.notificationSent'));
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, t('screens.clubFees.failedToSendNotification'));
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
            <MaterialCommunityIcons name={ICONS.INFORMATION} size={designTokens.iconSize.md} color={colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>{t('screens.clubFees.configureMonthlyFees')}</Text>
            <Text style={styles.infoText}>
              {t('screens.clubFees.setupDescription')}
            </Text>
          </View>
        </View>

        {/* Active Toggle */}
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>{t('screens.clubFees.enableMonthlyFees')}</Text>
              <Text style={styles.settingSubtext}>
                {t('screens.clubFees.activateFeeCollection')}
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
          <Text style={styles.inputLabel}>{t('screens.clubFees.monthlyFeeAmount')}</Text>
          <Text style={styles.inputSubtext}>{t('screens.clubFees.setRecurringAmount')}</Text>
          <View style={styles.amountRow}>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={feeAmount}
                onChangeText={setFeeAmount}
                keyboardType={KEYBOARD_TYPE.DECIMAL_PAD}
                placeholder={t('screens.clubFees.amountPlaceholder')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={styles.currencyInputContainer}>
              <TextInput
                style={styles.currencyInput}
                value={currency}
                onChangeText={setCurrency}
                placeholder={t('screens.clubFees.currencyPlaceholder')}
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
              <Text style={styles.inputLabel}>{t('screens.clubFees.activeMonths')}</Text>
              <Text style={styles.inputSubtext}>{t('screens.clubFees.selectMonthsPayment')}</Text>
            </View>
            <View style={styles.monthActions}>
              <TouchableOpacity onPress={selectAllMonths} style={styles.monthActionBtn}>
                <Text style={styles.monthActionText}>{t('screens.clubFees.all')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearAllMonths} style={styles.monthActionBtn}>
                <Text style={styles.monthActionText}>{t('screens.clubFees.none')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.monthGrid}>
            {MONTH_KEYS.map((monthKey, index) => {
              const monthNumber = index + 1;
              const isSelected = selectedMonths.includes(monthNumber);
              const monthName = t(monthKey);

              return (
                <TouchableOpacity
                  key={monthNumber}
                  style={[styles.monthChip, isSelected && styles.monthChipSelected]}
                  onPress={() => toggleMonth(monthNumber)}
                  activeOpacity={TOUCH_OPACITY.default}
                >
                  <Text
                    style={[
                      styles.monthChipText,
                      isSelected && styles.monthChipTextSelected,
                    ]}
                  >
                    {monthName.substring(0, 3)}
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
            activeOpacity={TOUCH_OPACITY.light}
          >
            <MaterialCommunityIcons name={ICONS.CONTENT_SAVE} size={designTokens.iconSize.md} color={designTokens.colors.white} />
            <Text style={styles.primaryButtonText}>{t('screens.clubFees.saveSettings')}</Text>
          </TouchableOpacity>

          {feeSettingsActive && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={generateFeesForYear}
              activeOpacity={TOUCH_OPACITY.light}
            >
              <MaterialCommunityIcons name={ICONS.CALENDAR_PLUS} size={designTokens.iconSize.md} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>
                {t('screens.clubFees.generateFeesCurrentYear')}
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
          <Text style={styles.balancesTitle}>{t('screens.clubFees.memberBalances')}</Text>
          <Text style={styles.balancesSubtitle}>{t('screens.clubFees.membersCount', { count: balances.length })}</Text>
        </View>
        <TouchableOpacity style={styles.notifyAllButton} onPress={notifyAllMembers}>
          <MaterialCommunityIcons name={ICONS.BELL_RING_OUTLINE} size={designTokens.iconSize.md} color={designTokens.colors.white} />
          <Text style={styles.notifyAllButtonText}>{t('screens.clubFees.notifyAll')}</Text>
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
                  <MaterialCommunityIcons name={ICONS.BELL_OUTLINE} size={designTokens.iconSize.lg} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.balanceDetails}>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>{t('screens.clubFees.totalOwed')}</Text>
                  <Text style={styles.balanceValue}>
                    ${item.totalOwed.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>{t('screens.clubFees.totalPaid')}</Text>
                  <Text style={[styles.balanceValue, { color: colors.success }]}>
                    ${item.totalPaid.toFixed(2)}
                  </Text>
                </View>

                <View style={[styles.balanceRow, styles.balanceTotalRow]}>
                  <Text style={styles.balanceTotalLabel}>{t('screens.clubFees.currentBalance')}</Text>
                  <Text style={[styles.balanceTotalValue, { color: statusColor }]}>
                    ${Math.abs(item.balance).toFixed(2)}{' '}
                    {item.balance < 0 ? t('screens.clubFees.owes') : item.balance > 0 ? t('screens.clubFees.credit') : EMPTY_VALUE}
                  </Text>
                </View>

                {item.overdueCharges > 0 && (
                  <View style={styles.overdueNotice}>
                    <MaterialCommunityIcons
                      name={ICONS.ALERT_CIRCLE}
                      size={designTokens.iconSize.sm}
                      color={colors.error}
                    />
                    <Text style={styles.overdueText}>
                      {t('screens.clubFees.overdueAmount', { amount: item.overdueCharges.toFixed(2) })}
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
            <MaterialCommunityIcons name={ICONS.WALLET_OUTLINE} size={designTokens.iconSize['4xl']} color={designTokens.colors.borderLight} />
            <Text style={styles.emptyStateText}>{t('screens.clubFees.noBalances')}</Text>
            <Text style={styles.emptyStateSubtext}>
              {t('screens.clubFees.generateFeesToSeeBalances')}
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
          <Text style={styles.chargesTitle}>{t('screens.clubFees.customCharges')}</Text>
          <Text style={styles.chargesSubtitle}>{customCharges.length} active charges</Text>
        </View>
        <TouchableOpacity style={styles.addChargeButton} onPress={openChargeModal}>
          <MaterialCommunityIcons name={ICONS.PLUS} size={designTokens.iconSize.md} color={designTokens.colors.white} />
          <Text style={styles.addChargeButtonText}>{t('screens.clubFees.newCharge')}</Text>
        </TouchableOpacity>
      </View>

      {customCharges.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name={ICONS.FILE_DOCUMENT_OUTLINE} size={designTokens.iconSize['4xl']} color={designTokens.colors.borderLight} />
          <Text style={styles.emptyStateText}>{t('screens.clubFees.noCustomCharges')}</Text>
          <Text style={styles.emptyStateSubtext}>
            {t('screens.clubFees.createChargesDescription')}
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
                  <MaterialCommunityIcons name={ICONS.CALENDAR_OUTLINE} size={designTokens.iconSize.sm} color={colors.textSecondary} />
                  <Text style={styles.chargeDetailText}>
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.chargeDetailRow}>
                  <MaterialCommunityIcons
                    name={ICONS.ACCOUNT_GROUP_OUTLINE}
                    size={designTokens.iconSize.sm}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.chargeDetailText}>
                    {item.appliedToUserIds.length === 0
                      ? t('screens.clubFees.allMembers')
                      : t('screens.clubFees.memberCount', { count: item.appliedToUserIds.length })}
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
        <MaterialCommunityIcons name={ICONS.LOADING} size={designTokens.iconSize['4xl']} color={colors.primary} />
        <Text style={styles.loadingText}>{t('screens.clubFees.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('screens.clubFees.title')}</Text>
          <Text style={styles.headerSubtitle}>{club?.name}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === FEE_TABS.SETTINGS && styles.tabActive]}
          onPress={() => setActiveTab(FEE_TABS.SETTINGS)}
          activeOpacity={TOUCH_OPACITY.default}
        >
          <MaterialCommunityIcons
            name={ICONS.COG_OUTLINE}
            size={designTokens.iconSize.md}
            color={activeTab === FEE_TABS.SETTINGS ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === FEE_TABS.SETTINGS && styles.tabTextActive,
            ]}
          >
            {t('screens.clubFees.tabs.settings')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === FEE_TABS.BALANCES && styles.tabActive]}
          onPress={() => setActiveTab(FEE_TABS.BALANCES)}
          activeOpacity={TOUCH_OPACITY.default}
        >
          <MaterialCommunityIcons
            name={ICONS.WALLET_OUTLINE}
            size={designTokens.iconSize.md}
            color={activeTab === FEE_TABS.BALANCES ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[styles.tabText, activeTab === FEE_TABS.BALANCES && styles.tabTextActive]}
          >
            {t('screens.clubFees.tabs.balances')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === FEE_TABS.CHARGES && styles.tabActive]}
          onPress={() => setActiveTab(FEE_TABS.CHARGES)}
          activeOpacity={TOUCH_OPACITY.default}
        >
          <MaterialCommunityIcons
            name={ICONS.FILE_DOCUMENT_OUTLINE}
            size={designTokens.iconSize.md}
            color={activeTab === FEE_TABS.CHARGES ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[styles.tabText, activeTab === FEE_TABS.CHARGES && styles.tabTextActive]}
          >
            {t('screens.clubFees.tabs.charges')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === FEE_TABS.SETTINGS && renderSettingsTab()}
      {activeTab === FEE_TABS.BALANCES && renderBalancesTab()}
      {activeTab === FEE_TABS.CHARGES && renderChargesTab()}

      {/* Custom Charge Modal */}
      <Modal
        visible={chargeModalVisible}
        animationType={ANIMATION.FADE}
        transparent={true}
        onRequestClose={() => setChargeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: modalWidth, maxHeight: windowHeight * 0.85 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('screens.clubFees.createCustomCharge')}</Text>
              <TouchableOpacity
                onPress={() => setChargeModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons name={ICONS.CLOSE} size={designTokens.iconSize.lg} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Description */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t('screens.clubFees.description')}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={chargeDescription}
                  onChangeText={setChargeDescription}
                  placeholder={t('screens.clubFees.descriptionPlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={TEXT_LINES.double}
                />
              </View>

              {/* Amount */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t('screens.clubFees.amount')}</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.amountInput, {paddingLeft: designTokens.spacing.none}]}
                    value={chargeAmount}
                    onChangeText={setChargeAmount}
                    keyboardType={KEYBOARD_TYPE.DECIMAL_PAD}
                    placeholder={t('screens.clubFees.amountPlaceholder')}
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              {/* Due Date */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t('screens.clubFees.dueDateLabel')}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={chargeDueDate}
                  onChangeText={setChargeDueDate}
                  placeholder={DATE_FORMATS.ISO_DATE}
                  placeholderTextColor={colors.textTertiary}
                />
                <Text style={styles.modalHint}>{t('screens.clubFees.dueDateFormat')}</Text>
              </View>

              {/* Apply To */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t('screens.clubFees.applyTo')}</Text>
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
                    activeOpacity={TOUCH_OPACITY.default}
                  >
                    <MaterialCommunityIcons
                      name={ICONS.ACCOUNT_GROUP}
                      size={designTokens.iconSize.md}
                      color={chargeApplyToAll ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.applyToText,
                        chargeApplyToAll && styles.applyToTextActive,
                      ]}
                    >
                      {t('screens.clubFees.allMembersOption')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.applyToOption,
                      !chargeApplyToAll && styles.applyToOptionActive,
                    ]}
                    onPress={() => setChargeApplyToAll(false)}
                    activeOpacity={TOUCH_OPACITY.default}
                  >
                    <MaterialCommunityIcons
                      name={ICONS.ACCOUNT_MULTIPLE_CHECK}
                      size={designTokens.iconSize.md}
                      color={!chargeApplyToAll ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.applyToText,
                        !chargeApplyToAll && styles.applyToTextActive,
                      ]}
                    >
                      {t('screens.clubFees.selectMembersOption')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Member Selection */}
                {!chargeApplyToAll && (
                  <View style={styles.memberSelectionContainer}>
                    <View style={styles.memberSelectionHeader}>
                      <Text style={styles.memberSelectionTitle}>
                        {t('screens.clubFees.selectedOfTotal', { selected: selectedMemberIds.length, total: members.length })}
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
                          {selectedMemberIds.length === members.length ? t('screens.clubFees.clearAll') : t('screens.clubFees.selectAll')}
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
                            activeOpacity={TOUCH_OPACITY.default}
                          >
                            <View style={styles.memberItemLeft}>
                              <View style={[
                                styles.checkbox,
                                isSelected && styles.checkboxSelected,
                              ]}>
                                {isSelected && (
                                  <MaterialCommunityIcons name={ICONS.CHECK} size={designTokens.iconSize.sm} color={designTokens.colors.white} />
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
                activeOpacity={TOUCH_OPACITY.default}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={createCustomCharge}
                activeOpacity={TOUCH_OPACITY.light}
              >
                <MaterialCommunityIcons name={ICONS.PLUS_CIRCLE} size={designTokens.iconSize.md} color={designTokens.colors.white} />
                <Text style={styles.modalCreateText}>{t('screens.clubFees.createCharge')}</Text>
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
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: flexValues.one,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  loadingText: {
    marginTop: designTokens.spacing.lg,
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
  },
  header: {
    backgroundColor: designTokens.colors.primary,
    padding: designTokens.spacing.xl,
    paddingTop: designTokens.spacing['6xl'],
    paddingBottom: designTokens.spacing['2xl'],
  },
  headerTitle: {
    fontSize: mobileFontSizes['4xl'],
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.white,
    marginBottom: designTokens.spacing.xs,
  },
  headerSubtitle: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.overlay.lightOpaque,
  },
  tabs: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
    elevation: designTokens.shadows.sm.elevation,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: shadowOffsetValues.md,
    shadowOpacity: designTokens.shadows.sm.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
  },
  tab: {
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
    borderBottomWidth: designTokens.borderWidth.thick,
    borderBottomColor: designTokens.colors.transparent,
  },
  tabActive: {
    borderBottomColor: designTokens.colors.primary,
  },
  tabText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.fontWeight.medium,
  },
  tabTextActive: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  tabContent: {
    flex: flexValues.one,
  },
  section: {
    padding: designTokens.spacing.lg,
  },
  infoCard: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.primaryLight,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xl,
    borderLeftWidth: designTokens.borderWidth.heavy,
    borderLeftColor: designTokens.colors.primary,
  },
  infoIconContainer: {
    marginRight: designTokens.spacing.md,
    marginTop: designTokens.spacing.xxs,
  },
  infoTextContainer: {
    flex: flexValues.one,
  },
  infoTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.primary,
    marginBottom: designTokens.spacing.xs,
  },
  infoText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    lineHeight: designTokens.spacing.lg + designTokens.spacing.xxs,
  },
  settingCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadow.sm,
  },
  settingRow: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
  },
  settingLabelContainer: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.lg,
  },
  settingLabel: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xs,
  },
  settingSubtext: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
  },
  inputCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadow.sm,
  },
  inputLabel: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xs,
  },
  inputSubtext: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
  },
  amountRow: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  amountInputContainer: {
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.radius.lg,
    paddingHorizontal: designTokens.spacing.lg,
  },
  currencySymbol: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.primary,
    marginRight: designTokens.spacing.sm,
  },
  amountInput: {
    flex: flexValues.one,
    padding: designTokens.spacing.md + designTokens.spacing.xxs,
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  currencyInputContainer: {
    width: designTokens.spacing['8xl'] + designTokens.spacing.xs,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.radius.lg,
  },
  currencyInput: {
    padding: designTokens.spacing.md + designTokens.spacing.xxs,
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    textAlign: layoutConstants.textAlign.center,
  },
  monthHeaderRow: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.lg,
  },
  monthActions: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  monthActionBtn: {
    paddingVertical: designTokens.spacing.xs + designTokens.spacing.xxs,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.sm,
  },
  monthActionText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  monthGrid: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.sm + designTokens.spacing.xxs,
  },
  monthChip: {
    paddingVertical: designTokens.spacing.sm + designTokens.spacing.xxs,
    paddingHorizontal: designTokens.spacing.lg + designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.borderLight,
    minWidth: designTokens.spacing['6xl'] + designTokens.spacing.xs,
    alignItems: layoutConstants.alignItems.center,
  },
  monthChipSelected: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  monthChipText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.fontWeight.medium,
  },
  monthChipTextSelected: {
    color: designTokens.colors.white,
    fontWeight: designTokens.fontWeight.semibold,
  },
  actionButtonsContainer: {
    gap: designTokens.spacing.md,
    marginTop: designTokens.spacing.sm,
  },
  primaryButton: {
    backgroundColor: designTokens.colors.primary,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.radius.lg,
    gap: designTokens.spacing.sm + designTokens.spacing.xxs,
    ...designTokens.shadow.md,
  },
  primaryButtonText: {
    color: designTokens.colors.white,
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.radius.lg,
    gap: designTokens.spacing.sm + designTokens.spacing.xxs,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.primary,
  },
  secondaryButtonText: {
    color: designTokens.colors.primary,
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
  },
  balancesHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  balancesTitle: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  balancesSubtitle: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
  chargesTitle: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  chargesSubtitle: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
  notifyAllButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.sm + designTokens.spacing.xxs,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    gap: designTokens.spacing.sm,
    ...designTokens.shadow.sm,
  },
  notifyAllButtonText: {
    color: designTokens.colors.white,
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
  },
  listContainer: {
    padding: designTokens.spacing.lg,
  },
  balanceCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadow.sm,
  },
  balanceHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
  },
  memberInfo: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
    flex: flexValues.one,
  },
  balanceAvatar: {
    width: designTokens.touchTarget.minimum,
    height: designTokens.touchTarget.minimum,
    borderRadius: designTokens.touchTarget.minimum / 2,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  balanceAvatarText: {
    color: designTokens.colors.white,
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
  },
  memberTextInfo: {
    flex: flexValues.one,
  },
  balanceName: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xxs,
  },
  balanceEmail: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
  },
  notifyButton: {
    padding: designTokens.spacing.sm,
  },
  balanceDetails: {
    gap: designTokens.spacing.sm + designTokens.spacing.xxs,
  },
  balanceRow: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
  },
  balanceLabel: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
  },
  balanceValue: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  balanceTotalRow: {
    marginTop: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  balanceTotalLabel: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  balanceTotalValue: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
  },
  overdueNotice: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.errorLight,
    padding: designTokens.spacing.sm + designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.md,
    gap: designTokens.spacing.sm,
    marginTop: designTokens.spacing.sm,
    borderLeftWidth: designTokens.borderWidth.thick,
    borderLeftColor: designTokens.colors.error,
  },
  overdueText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.error,
    fontWeight: designTokens.fontWeight.semibold,
  },
  chargesHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  addChargeButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.sm + designTokens.spacing.xxs,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    gap: designTokens.spacing.xs + designTokens.spacing.xxs,
    ...designTokens.shadow.sm,
  },
  addChargeButtonText: {
    color: designTokens.colors.white,
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
  },
  chargeCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadow.sm,
    borderLeftWidth: designTokens.borderWidth.heavy,
    borderLeftColor: designTokens.colors.primary,
  },
  chargeHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.md,
  },
  chargeDescription: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
  },
  chargeAmount: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.primary,
  },
  chargeDetails: {
    gap: designTokens.spacing.sm,
  },
  chargeDetailRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  chargeDetailText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
  },
  emptyState: {
    flex: flexValues.one,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['6xl'],
    paddingHorizontal: designTokens.spacing['4xl'],
  },
  emptyStateText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textTertiary,
    marginTop: designTokens.spacing.lg,
    textAlign: layoutConstants.textAlign.center,
  },
  emptyStateSubtext: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.borderLight,
    marginTop: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
    lineHeight: designTokens.spacing.xl,
  },
  // Modal styles
  modalOverlay: {
    flex: flexValues.one,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xxl,
    ...designTokens.shadow['2xl'],
  },
  modalHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  modalTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  modalCloseButton: {
    padding: designTokens.spacing.xs,
  },
  modalBody: {
    padding: designTokens.spacing.xl,
    maxHeight: dimensionValues.maxHeight.modalBodyLarge,
  },
  modalInputGroup: {
    marginBottom: designTokens.spacing['2xl'],
  },
  modalLabel: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.sm,
  },
  modalInput: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.radius.lg,
    padding: designTokens.spacing.md + designTokens.spacing.xxs,
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textPrimary,
  },
  modalHint: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    marginTop: designTokens.spacing.xs + designTokens.spacing.xxs,
  },
  applyToContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  applyToOption: {
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.md + designTokens.spacing.xxs,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.radius.lg,
  },
  applyToOptionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  applyToText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
  },
  applyToTextActive: {
    color: designTokens.colors.primary,
  },
  memberSelectionContainer: {
    marginTop: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    maxHeight: designTokens.spacing['8xl'] * 2 + designTokens.spacing['6xl'],
  },
  memberSelectionHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.md,
    paddingBottom: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  memberSelectionTitle: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  selectAllButton: {
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.infoLight,
    borderRadius: designTokens.borderRadius.sm,
  },
  selectAllText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.info,
  },
  membersList: {
    gap: designTokens.spacing.sm,
  },
  memberItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.radius.lg,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.borderLight,
  },
  memberItemSelected: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  memberItemLeft: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
    flex: flexValues.one,
  },
  checkbox: {
    width: designTokens.spacing['2xl'],
    height: designTokens.spacing['2xl'],
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.borderLight,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  checkboxSelected: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  memberItemInfo: {
    flex: flexValues.one,
  },
  memberItemName: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xxs,
  },
  memberItemEmail: {
    fontSize: mobileFontSizes.xs, // Using design token (minimum readable)
    color: designTokens.colors.textSecondary,
  },
  modalFooter: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
    padding: designTokens.spacing.xl,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  modalCancelButton: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md + designTokens.spacing.xxs,
    borderRadius: designTokens.radius.lg,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.borderLight,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  modalCancelText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
  },
  modalCreateButton: {
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.md + designTokens.spacing.xxs,
    borderRadius: designTokens.radius.lg,
    backgroundColor: designTokens.colors.primary,
    ...designTokens.shadow.sm,
  },
  modalCreateText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.white,
  },
});

export default ClubFeesScreen;
