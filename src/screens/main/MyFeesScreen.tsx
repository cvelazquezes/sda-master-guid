import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { clubService } from '../../services/clubService';
import { paymentService } from '../../services/paymentService';
import {
  Club,
  MemberBalance,
  MemberPayment,
  CustomCharge,
} from '../../types';
import { mobileTypography, mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { ICONS, PAYMENT_STATUS, BALANCE_STATUS, MY_FEES_TAB, ANIMATION_DURATION } from '../../shared/constants';
import { flexValues, dimensionValues, borderValues } from '../../shared/constants/layoutConstants';
import { DATE_LOCALE_OPTIONS } from '../../shared/constants/formats';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';
import { logger } from '../../shared/utils/logger';

const MyFeesScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [club, setClub] = useState<Club | null>(null);
  const [balance, setBalance] = useState<MemberBalance | null>(null);
  const [payments, setPayments] = useState<MemberPayment[]>([]);
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<typeof MY_FEES_TAB.OVERVIEW | typeof MY_FEES_TAB.HISTORY | typeof MY_FEES_TAB.CHARGES>(MY_FEES_TAB.OVERVIEW);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION.SLOW,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION.SLOW,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      setLoading(true);
      const [clubData, balanceData, paymentsData, chargesData] = await Promise.all([
        clubService.getClub(user.clubId),
        paymentService.getMemberBalance(user.id, user.clubId),
        paymentService.getMemberPayments(user.id, user.clubId),
        paymentService.getClubCustomCharges(user.clubId),
      ]);

      setClub(clubData);
      setBalance(balanceData);
      setPayments(paymentsData);
      
      const userCharges = chargesData.filter(
        (charge) =>
          charge.appliedToUserIds.length === 0 ||
          charge.appliedToUserIds.includes(user.id)
      );
      setCustomCharges(userCharges);
    } catch (error) {
      logger.error(LOG_MESSAGES.MY_FEES.FAILED_TO_LOAD_DATA, error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return { 
          color: colors.success, 
          bg: colors.successLight || `${colors.success}15`, 
          icon: ICONS.CHECK_CIRCLE as const,
          label: t('screens.myFees.statusPaid')
        };
      case PAYMENT_STATUS.OVERDUE:
        return { 
          color: colors.error, 
          bg: colors.errorLight || `${colors.error}15`, 
          icon: ICONS.ALERT_CIRCLE as const,
          label: t('screens.myFees.statusOverdue')
        };
      case PAYMENT_STATUS.PENDING:
        return { 
          color: colors.warning, 
          bg: colors.warningLight || `${colors.warning}15`, 
          icon: ICONS.CLOCK_OUTLINE as const,
          label: t('screens.myFees.statusPending')
        };
      default:
        return { 
          color: colors.textSecondary, 
          bg: `${colors.textSecondary}15`, 
          icon: ICONS.HELP_CIRCLE as const,
          label: t('screens.myFees.statusUnknown')
        };
    }
  };

  const getBalanceStatus = () => {
    if (!balance) return { color: colors.textSecondary, status: BALANCE_STATUS.NEUTRAL };
    if (balance.balance >= 0) return { color: colors.success, status: BALANCE_STATUS.GOOD };
    if (balance.overdueCharges > 0) return { color: colors.error, status: BALANCE_STATUS.OVERDUE };
    return { color: colors.warning, status: BALANCE_STATUS.PENDING };
  };

  const paidPayments = payments.filter(p => p.status === PAYMENT_STATUS.PAID).length;
  const totalPayments = payments.length;
  const paymentProgress = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0;

  // Loading State
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.headerGradient, { backgroundColor: colors.primary }]}>
          <View style={styles.skeletonHeader}>
            <View style={[styles.skeleton, styles.skeletonTitle, { backgroundColor: `${colors.textInverse}30` }]} />
            <View style={[styles.skeleton, styles.skeletonSubtitle, { backgroundColor: `${colors.textInverse}20` }]} />
          </View>
        </View>
        <View style={styles.skeletonContent}>
          <View style={[styles.skeleton, styles.skeletonCard, { backgroundColor: colors.border }]} />
          <View style={[styles.skeleton, styles.skeletonCard, { backgroundColor: colors.border }]} />
        </View>
      </View>
    );
  }

  // Not a member state
  if (!user?.clubId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.headerGradient, { backgroundColor: colors.textTertiary }]}>
          <View style={styles.emptyHeader}>
            <MaterialCommunityIcons name={ICONS.ACCOUNT_OFF_OUTLINE} size={designTokens.iconSize['3xl']} color={`${colors.textInverse}50`} />
            <Text style={[styles.emptyHeaderTitle, { color: colors.textInverse }]}>{t('screens.myFees.notAClubMember')}</Text>
            <Text style={[styles.emptyHeaderSubtitle, { color: `${colors.textInverse}80` }]}>
              {t('screens.myFees.joinClubToViewFees')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const balanceStatus = getBalanceStatus();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Balance */}
      <View style={[
        styles.headerGradient, 
        { backgroundColor: balanceStatus.status === BALANCE_STATUS.GOOD ? colors.success : 
          balanceStatus.status === BALANCE_STATUS.OVERDUE ? colors.error : colors.primary }
      ]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerClubName, { color: `${colors.textInverse}CC` }]}>{club?.name}</Text>
              <Text style={[styles.headerTitle, { color: colors.textInverse }]}>{t('screens.myFees.myFinances')}</Text>
            </View>
            <TouchableOpacity style={[styles.headerAction, { backgroundColor: `${colors.textInverse}20` }]}>
              <MaterialCommunityIcons name={ICONS.HISTORY} size={designTokens.iconSize.lg} color={colors.textInverse} />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={[styles.balanceCard, { backgroundColor: `${colors.textInverse}20` }]}>
            <View style={styles.balanceMain}>
              <Text style={[styles.balanceLabel, { color: `${colors.textInverse}CC` }]}>{t('screens.myFees.currentBalance')}</Text>
              <Text style={[styles.balanceAmount, { color: colors.textInverse }]}>
                ${balance ? Math.abs(balance.balance).toFixed(2) : t('screens.myFees.defaultAmount')}
              </Text>
              {balance && balance.balance < 0 && (
                <View style={[styles.balanceTag, { backgroundColor: `${colors.textInverse}25` }]}>
                  <MaterialCommunityIcons 
                    name={balance.overdueCharges > 0 ? ICONS.ALERT : ICONS.CLOCK_OUTLINE} 
                    size={designTokens.iconSize.xs} 
                    color={colors.textInverse} 
                  />
                  <Text style={[styles.balanceTagText, { color: colors.textInverse }]}>
                    {balance.overdueCharges > 0 ? t('screens.myFees.paymentOverdue') : t('screens.myFees.paymentDue')}
                  </Text>
                </View>
              )}
              {balance && balance.balance >= 0 && (
                <View style={[styles.balanceTag, { backgroundColor: `${colors.textInverse}25` }]}>
                  <MaterialCommunityIcons name={ICONS.CHECK_CIRCLE} size={designTokens.iconSize.xs} color={colors.textInverse} />
                  <Text style={[styles.balanceTagText, { color: colors.textInverse }]}>
                    {t('screens.myFees.allPaidUp')}
                  </Text>
                </View>
              )}
            </View>
            
            {/* Quick Stats */}
            <View style={[styles.quickStats, { borderTopColor: `${colors.textInverse}30` }]}>
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>${balance?.totalPaid.toFixed(0) || '0'}</Text>
                <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>{t('screens.myFees.totalPaid')}</Text>
              </View>
              <View style={[styles.quickStatDivider, { backgroundColor: `${colors.textInverse}30` }]} />
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>{paidPayments}/{totalPayments}</Text>
                <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>{t('screens.myFees.payments')}</Text>
              </View>
              <View style={[styles.quickStatDivider, { backgroundColor: `${colors.textInverse}30` }]} />
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>{customCharges.length}</Text>
                <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>{t('screens.myFees.charges')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {([MY_FEES_TAB.OVERVIEW, MY_FEES_TAB.HISTORY, MY_FEES_TAB.CHARGES] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && [styles.tabActive, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <MaterialCommunityIcons
              name={
                tab === MY_FEES_TAB.OVERVIEW ? ICONS.VIEW_DASHBOARD_OUTLINE :
                tab === MY_FEES_TAB.HISTORY ? ICONS.HISTORY : ICONS.RECEIPT
              }
              size={designTokens.iconSize.md}
              color={selectedTab === tab ? colors.primary : colors.textTertiary}
            />
            <Text style={[
              styles.tabText,
              { color: selectedTab === tab ? colors.primary : colors.textTertiary }
            ]}>
              {t(`screens.myFees.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Overview Tab */}
          {selectedTab === MY_FEES_TAB.OVERVIEW && (
            <>
              {/* Payment Progress Card */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons name={ICONS.CHART_DONUT} size={designTokens.iconSize.lg} color={colors.primary} />
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                      {t('screens.myFees.paymentProgress')}
                    </Text>
                  </View>
                  <Text style={[styles.cardSubtitle, { color: colors.textTertiary }]}>
                    {t('screens.myFees.paymentsCompleted', { paid: paidPayments, total: totalPayments })}
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${paymentProgress}%`, backgroundColor: colors.success }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    {t('screens.myFees.percentComplete', { percent: paymentProgress.toFixed(0) })}
                  </Text>
                </View>

                {/* Summary Stats */}
                <View style={styles.summaryGrid}>
                  <View style={[styles.summaryItem, { backgroundColor: colors.successLight || `${colors.success}15` }]}>
                    <MaterialCommunityIcons name={ICONS.CHECK_CIRCLE} size={designTokens.iconSize.xl} color={colors.success} />
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                      ${balance?.totalPaid.toFixed(2) || t('screens.myFees.defaultAmount')}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                      {t('screens.myFees.totalPaid')}
                    </Text>
                  </View>
                  <View style={[styles.summaryItem, { backgroundColor: colors.warningLight || `${colors.warning}15` }]}>
                    <MaterialCommunityIcons name={ICONS.CLOCK_OUTLINE} size={designTokens.iconSize.xl} color={colors.warning} />
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>
                      ${balance?.pendingCharges.toFixed(2) || t('screens.myFees.defaultAmount')}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                      {t('screens.myFees.statusPending')}
                    </Text>
                  </View>
                  <View style={[styles.summaryItem, { backgroundColor: colors.errorLight || `${colors.error}15` }]}>
                    <MaterialCommunityIcons name={ICONS.ALERT_CIRCLE} size={designTokens.iconSize.xl} color={colors.error} />
                    <Text style={[styles.summaryValue, { color: colors.error }]}>
                      ${balance?.overdueCharges.toFixed(2) || t('screens.myFees.defaultAmount')}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                      {t('screens.myFees.overdue')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Monthly Fee Info */}
              {club?.feeSettings && club.feeSettings.isActive && (
                <View style={[styles.card, styles.infoCard, { backgroundColor: colors.infoLight || `${colors.info}15` }]}>
                  <View style={styles.infoCardContent}>
                    <View style={[styles.infoIconContainer, { backgroundColor: colors.info }]}>
                      <MaterialCommunityIcons name={ICONS.CALENDAR_MONTH} size={designTokens.iconSize.lg} color={colors.textInverse} />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                        {t('screens.myFees.monthlyFee')}
                      </Text>
                      <Text style={[styles.infoAmount, { color: colors.info }]}>
                        ${club.feeSettings.monthlyFeeAmount.toFixed(2)} {club.feeSettings.currency}
                      </Text>
                      <Text style={[styles.infoSubtext, { color: colors.textTertiary }]}>
                        {t('screens.myFees.activeMonths', { count: club.feeSettings.activeMonths.length })}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Recent Activity */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                    {t('screens.myFees.recentActivity')}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedTab(MY_FEES_TAB.HISTORY)}>
                    <Text style={[styles.seeAllLink, { color: colors.primary }]}>{t('screens.myFees.seeAll')}</Text>
                  </TouchableOpacity>
                </View>
                
                {payments.slice(0, 3).map((payment, index) => {
                  const config = getStatusConfig(payment.status);
                  return (
                    <View 
                      key={payment.id} 
                      style={[
                        styles.activityItem,
                        index < 2 && { borderBottomWidth: designTokens.borderWidth.thin, borderBottomColor: colors.border }
                      ]}
                    >
                      <View style={[styles.activityIcon, { backgroundColor: config.bg }]}>
                        <MaterialCommunityIcons name={config.icon} size={designTokens.iconSize.md} color={config.color} />
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
                          {payment.notes || t('screens.myFees.monthlyFeeNote', { month: payment.month, year: payment.year })}
                        </Text>
                        <Text style={[styles.activityDate, { color: colors.textTertiary }]}>
                          {new Date(payment.dueDate).toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.SHORT_DATE)}
                        </Text>
                      </View>
                      <View style={styles.activityAmount}>
                        <Text style={[styles.activityPrice, { color: colors.textPrimary }]}>
                          ${payment.amount.toFixed(2)}
                        </Text>
                        <View style={[styles.activityBadge, { backgroundColor: config.bg }]}>
                          <Text style={[styles.activityBadgeText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

                {payments.length === 0 && (
                  <View style={styles.emptyActivity}>
                    <MaterialCommunityIcons name={ICONS.INBOX_OUTLINE} size={designTokens.iconSize['2xl']} color={colors.border} />
                    <Text style={[styles.emptyActivityText, { color: colors.textTertiary }]}>
                      {t('screens.myFees.noRecentActivity')}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* History Tab */}
          {selectedTab === MY_FEES_TAB.HISTORY && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {t('screens.myFees.paymentHistory')}
                </Text>
              </View>
              
              {payments
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((payment, index) => {
                  const config = getStatusConfig(payment.status);
                  return (
                    <View 
                      key={payment.id} 
                      style={[
                        styles.historyItem,
                        index < payments.length - 1 && { borderBottomWidth: designTokens.borderWidth.thin, borderBottomColor: colors.border }
                      ]}
                    >
                      <View style={[styles.historyIcon, { backgroundColor: config.bg }]}>
                        <MaterialCommunityIcons name={config.icon} size={designTokens.iconSize.lg} color={config.color} />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={[styles.historyTitle, { color: colors.textPrimary }]}>
                          {payment.notes || t('screens.myFees.monthlyFeeDefault')}
                        </Text>
                        <Text style={[styles.historyMeta, { color: colors.textTertiary }]}>
                          {new Date(payment.dueDate).toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.MEDIUM_DATE)}
                        </Text>
                        {payment.paidDate && (
                          <Text style={[styles.historyPaid, { color: colors.success }]}>
                            {t('screens.myFees.paidOn', { date: new Date(payment.paidDate).toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.MONTH_DAY) })}
                          </Text>
                        )}
                      </View>
                      <View style={styles.historyRight}>
                        <Text style={[styles.historyAmount, { color: colors.textPrimary }]}>
                          ${payment.amount.toFixed(2)}
                        </Text>
                        <View style={[styles.historyBadge, { backgroundColor: config.bg }]}>
                          <Text style={[styles.historyBadgeText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

              {payments.length === 0 && (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name={ICONS.FILE_DOCUMENT_OUTLINE} size={designTokens.iconSize['3xl']} color={colors.border} />
                  <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
                    {t('screens.myFees.noPaymentHistory')}
                  </Text>
                  <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
                    {t('screens.myFees.paymentHistoryWillAppear')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Charges Tab */}
          {selectedTab === MY_FEES_TAB.CHARGES && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {t('screens.myFees.customCharges')}
                </Text>
              </View>
              
              {customCharges.map((charge, index) => (
                <View 
                  key={charge.id} 
                  style={[
                    styles.chargeItem,
                    index < customCharges.length - 1 && { borderBottomWidth: designTokens.borderWidth.thin, borderBottomColor: colors.border }
                  ]}
                >
                  <View style={[styles.chargeIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <MaterialCommunityIcons name={ICONS.FILE_DOCUMENT_OUTLINE} size={designTokens.iconSize.lg} color={colors.primary} />
                  </View>
                  <View style={styles.chargeInfo}>
                    <Text style={[styles.chargeTitle, { color: colors.textPrimary }]}>
                      {charge.description}
                    </Text>
                    <Text style={[styles.chargeMeta, { color: colors.textTertiary }]}>
                      {t('screens.myFees.due', { date: new Date(charge.dueDate).toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.SHORT_DATE) })}
                    </Text>
                  </View>
                  <Text style={[styles.chargeAmount, { color: colors.primary }]}>
                    ${charge.amount.toFixed(2)}
                  </Text>
                </View>
              ))}

              {customCharges.length === 0 && (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name={ICONS.CHECK_CIRCLE_OUTLINE} size={designTokens.iconSize['3xl']} color={colors.success} />
                  <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
                    {t('screens.myFees.noCustomCharges')}
                  </Text>
                  <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
                    {t('screens.myFees.noAdditionalCharges')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Help Card */}
          <View style={[styles.helpCard, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name={ICONS.LIFEBUOY} size={designTokens.iconSize.lg} color={colors.primary} />
            <View style={styles.helpContent}>
              <Text style={[styles.helpTitle, { color: colors.textPrimary }]}>
                {t('screens.myFees.needHelp')}
              </Text>
              <Text style={[styles.helpText, { color: colors.textTertiary }]}>
                {t('screens.myFees.contactAdminForQuestions')}
              </Text>
            </View>
            <MaterialCommunityIcons name={ICONS.CHEVRON_RIGHT} size={designTokens.iconSize.lg} color={colors.textTertiary} />
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
  },
  headerGradient: {
    paddingTop: designTokens.spacing['6xl'],
    paddingBottom: designTokens.spacing.xxl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerContent: {},
  headerTop: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.xxl,
  },
  headerClubName: {
    fontSize: mobileFontSizes.sm,
    marginBottom: designTokens.spacing.xs,
  },
  headerTitle: {
    fontSize: mobileFontSizes['3xl'],
    fontWeight: designTokens.fontWeight.bold,
  },
  headerAction: {
    width: dimensionValues.size.touchTarget,
    height: dimensionValues.size.touchTarget,
    borderRadius: designTokens.borderRadius['4xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  balanceCard: {
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
  },
  balanceMain: {
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
  },
  balanceLabel: {
    fontSize: mobileFontSizes.sm,
    marginBottom: designTokens.spacing.sm,
  },
  balanceAmount: {
    fontSize: designTokens.fontSize['5xl'],
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.md,
  },
  balanceTag: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  balanceTagText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
  },
  quickStats: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceAround,
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: designTokens.borderWidth.thin,
  },
  quickStat: {
    alignItems: layoutConstants.alignItems.center,
  },
  quickStatValue: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
  },
  quickStatLabel: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xs,
  },
  quickStatDivider: {
    width: borderValues.width.thin,
    height: dimensionValues.height.divider,
  },
  tabContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    paddingHorizontal: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  tab: {
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
    borderBottomWidth: designTokens.borderWidth.medium,
    borderBottomColor: borderValues.color.transparent,
  },
  tabActive: {
    borderBottomWidth: designTokens.borderWidth.medium,
  },
  tabText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
  },
  content: {
    flex: flexValues.one,
    padding: designTokens.spacing.lg,
  },
  card: {
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadows.sm,
  },
  cardHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
  },
  cardTitleRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  cardTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
  },
  cardSubtitle: {
    fontSize: mobileFontSizes.sm,
    marginTop: designTokens.spacing.xs,
  },
  seeAllLink: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
  },
  progressContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  progressBar: {
    height: dimensionValues.progressBar.standard,
    borderRadius: designTokens.borderRadius.full,
    overflow: layoutConstants.overflow.hidden,
    marginBottom: designTokens.spacing.sm,
  },
  progressFill: {
    height: dimensionValues.maxHeightPercent.full,
    borderRadius: designTokens.borderRadius.full,
  },
  progressText: {
    fontSize: mobileFontSizes.xs,
    textAlign: layoutConstants.textAlign.right,
  },
  summaryGrid: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  summaryItem: {
    flex: flexValues.one,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
  },
  summaryValue: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
    marginTop: designTokens.spacing.sm,
  },
  summaryLabel: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xs,
  },
  infoCard: {
    borderWidth: designTokens.borderWidth.none,
  },
  infoCardContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.lg,
  },
  infoIconContainer: {
    width: dimensionValues.size.avatarMedium,
    height: dimensionValues.size.avatarMedium,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  infoTextContainer: {
    flex: flexValues.one,
  },
  infoTitle: {
    fontSize: mobileFontSizes.sm,
    marginBottom: designTokens.spacing.xs,
  },
  infoAmount: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
  },
  infoSubtext: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xxs,
  },
  activityItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.md,
  },
  activityIcon: {
    width: dimensionValues.size.touchTarget,
    height: dimensionValues.size.touchTarget,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  activityInfo: {
    flex: flexValues.one,
  },
  activityTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  activityDate: {
    fontSize: mobileFontSizes.xs,
  },
  activityAmount: {
    alignItems: layoutConstants.alignItems.flexEnd,
  },
  activityPrice: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.xs,
  },
  activityBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.sm,
  },
  activityBadgeText: {
    fontSize: designTokens.fontSize['2xs'],
    fontWeight: designTokens.fontWeight.semibold,
  },
  emptyActivity: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['3xl'],
  },
  emptyActivityText: {
    fontSize: mobileFontSizes.sm,
    marginTop: designTokens.spacing.md,
  },
  historyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  historyIcon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  historyInfo: {
    flex: flexValues.one,
  },
  historyTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  historyMeta: {
    fontSize: mobileFontSizes.xs,
  },
  historyPaid: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xs,
    fontWeight: designTokens.fontWeight.medium,
  },
  historyRight: {
    alignItems: layoutConstants.alignItems.flexEnd,
  },
  historyAmount: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.sm,
  },
  historyBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.sm,
  },
  historyBadgeText: {
    fontSize: designTokens.fontSize['2xs'],
    fontWeight: designTokens.fontWeight.semibold,
  },
  chargeItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  chargeIcon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  chargeInfo: {
    flex: flexValues.one,
  },
  chargeTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  chargeMeta: {
    fontSize: mobileFontSizes.xs,
  },
  chargeAmount: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
  },
  emptyState: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['4xl'],
  },
  emptyStateTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    marginTop: designTokens.spacing.lg,
  },
  emptyStateText: {
    fontSize: mobileFontSizes.sm,
    marginTop: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
  helpCard: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.md,
  },
  helpContent: {
    flex: flexValues.one,
  },
  helpTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  helpText: {
    fontSize: mobileFontSizes.xs,
  },
  // Skeleton styles
  skeletonHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['4xl'],
  },
  skeletonContent: {
    padding: designTokens.spacing.lg,
  },
  skeleton: {
    borderRadius: designTokens.borderRadius.md,
  },
  skeletonTitle: {
    width: dimensionValues.skeleton.titleWidth,
    height: dimensionValues.skeleton.titleHeight,
    marginBottom: designTokens.spacing.sm,
  },
  skeletonSubtitle: {
    width: dimensionValues.skeleton.subtitleWidth,
    height: dimensionValues.skeleton.subtitleHeight,
  },
  skeletonCard: {
    height: dimensionValues.size.iconContainerLarge,
    marginBottom: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
  },
  // Empty header styles
  emptyHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['5xl'],
  },
  emptyHeaderTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    marginTop: designTokens.spacing.lg,
  },
  emptyHeaderSubtitle: {
    fontSize: mobileFontSizes.md,
    marginTop: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
});

export default MyFeesScreen;
