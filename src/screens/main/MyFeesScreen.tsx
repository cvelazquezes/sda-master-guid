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
import { mobileTypography, mobileFontSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';

const MyFeesScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [club, setClub] = useState<Club | null>(null);
  const [balance, setBalance] = useState<MemberBalance | null>(null);
  const [payments, setPayments] = useState<MemberPayment[]>([]);
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'history' | 'charges'>('overview');
  
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
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
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
      console.error('Failed to load fee data:', error);
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
      case 'paid':
        return { 
          color: colors.success, 
          bg: colors.successLight || `${colors.success}15`, 
          icon: 'check-circle' as const,
          label: 'Paid'
        };
      case 'overdue':
        return { 
          color: colors.error, 
          bg: colors.errorLight || `${colors.error}15`, 
          icon: 'alert-circle' as const,
          label: 'Overdue'
        };
      case 'pending':
        return { 
          color: colors.warning, 
          bg: colors.warningLight || `${colors.warning}15`, 
          icon: 'clock-outline' as const,
          label: 'Pending'
        };
      default:
        return { 
          color: colors.textSecondary, 
          bg: `${colors.textSecondary}15`, 
          icon: 'help-circle' as const,
          label: 'Unknown'
        };
    }
  };

  const getBalanceStatus = () => {
    if (!balance) return { color: colors.textSecondary, status: 'neutral' };
    if (balance.balance >= 0) return { color: colors.success, status: 'good' };
    if (balance.overdueCharges > 0) return { color: colors.error, status: 'overdue' };
    return { color: colors.warning, status: 'pending' };
  };

  const paidPayments = payments.filter(p => p.status === 'paid').length;
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
            <MaterialCommunityIcons name="account-off-outline" size={64} color={`${colors.textInverse}50`} />
            <Text style={[styles.emptyHeaderTitle, { color: colors.textInverse }]}>Not a Club Member</Text>
            <Text style={[styles.emptyHeaderSubtitle, { color: `${colors.textInverse}80` }]}>
              Join a club to view your fees and payments
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
        { backgroundColor: balanceStatus.status === 'good' ? colors.success : 
          balanceStatus.status === 'overdue' ? colors.error : colors.primary }
      ]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerClubName, { color: `${colors.textInverse}CC` }]}>{club?.name}</Text>
              <Text style={[styles.headerTitle, { color: colors.textInverse }]}>My Finances</Text>
            </View>
            <TouchableOpacity style={[styles.headerAction, { backgroundColor: `${colors.textInverse}20` }]}>
              <MaterialCommunityIcons name="history" size={24} color={colors.textInverse} />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={[styles.balanceCard, { backgroundColor: `${colors.textInverse}20` }]}>
            <View style={styles.balanceMain}>
              <Text style={[styles.balanceLabel, { color: `${colors.textInverse}CC` }]}>Current Balance</Text>
              <Text style={[styles.balanceAmount, { color: colors.textInverse }]}>
                ${balance ? Math.abs(balance.balance).toFixed(2) : '0.00'}
              </Text>
              {balance && balance.balance < 0 && (
                <View style={[styles.balanceTag, { backgroundColor: `${colors.textInverse}25` }]}>
                  <MaterialCommunityIcons 
                    name={balance.overdueCharges > 0 ? 'alert' : 'clock-outline'} 
                    size={14} 
                    color={colors.textInverse} 
                  />
                  <Text style={[styles.balanceTagText, { color: colors.textInverse }]}>
                    {balance.overdueCharges > 0 ? 'Payment Overdue' : 'Payment Due'}
                  </Text>
                </View>
              )}
              {balance && balance.balance >= 0 && (
                <View style={[styles.balanceTag, { backgroundColor: `${colors.textInverse}25` }]}>
                  <MaterialCommunityIcons name="check-circle" size={14} color={colors.textInverse} />
                  <Text style={[styles.balanceTagText, { color: colors.textInverse }]}>
                    All Paid Up
                  </Text>
                </View>
              )}
            </View>
            
            {/* Quick Stats */}
            <View style={[styles.quickStats, { borderTopColor: `${colors.textInverse}30` }]}>
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>${balance?.totalPaid.toFixed(0) || '0'}</Text>
                <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>Total Paid</Text>
              </View>
              <View style={[styles.quickStatDivider, { backgroundColor: `${colors.textInverse}30` }]} />
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>{paidPayments}/{totalPayments}</Text>
                <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>Payments</Text>
              </View>
              <View style={[styles.quickStatDivider, { backgroundColor: `${colors.textInverse}30` }]} />
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>{customCharges.length}</Text>
                <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>Charges</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {(['overview', 'history', 'charges'] as const).map((tab) => (
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
                tab === 'overview' ? 'view-dashboard-outline' :
                tab === 'history' ? 'history' : 'receipt'
              }
              size={20}
              color={selectedTab === tab ? colors.primary : colors.textTertiary}
            />
            <Text style={[
              styles.tabText,
              { color: selectedTab === tab ? colors.primary : colors.textTertiary }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
          {selectedTab === 'overview' && (
            <>
              {/* Payment Progress Card */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons name="chart-donut" size={24} color={colors.primary} />
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                      Payment Progress
                    </Text>
                  </View>
                  <Text style={[styles.cardSubtitle, { color: colors.textTertiary }]}>
                    {paidPayments} of {totalPayments} payments completed
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
                    {paymentProgress.toFixed(0)}% Complete
                  </Text>
                </View>

                {/* Summary Stats */}
                <View style={styles.summaryGrid}>
                  <View style={[styles.summaryItem, { backgroundColor: colors.successLight || `${colors.success}15` }]}>
                    <MaterialCommunityIcons name="check-circle" size={28} color={colors.success} />
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                      ${balance?.totalPaid.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                      Total Paid
                    </Text>
                  </View>
                  <View style={[styles.summaryItem, { backgroundColor: colors.warningLight || `${colors.warning}15` }]}>
                    <MaterialCommunityIcons name="clock-outline" size={28} color={colors.warning} />
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>
                      ${balance?.pendingCharges.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                      Pending
                    </Text>
                  </View>
                  <View style={[styles.summaryItem, { backgroundColor: colors.errorLight || `${colors.error}15` }]}>
                    <MaterialCommunityIcons name="alert-circle" size={28} color={colors.error} />
                    <Text style={[styles.summaryValue, { color: colors.error }]}>
                      ${balance?.overdueCharges.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                      Overdue
                    </Text>
                  </View>
                </View>
              </View>

              {/* Monthly Fee Info */}
              {club?.feeSettings && club.feeSettings.isActive && (
                <View style={[styles.card, styles.infoCard, { backgroundColor: colors.infoLight || `${colors.info}15` }]}>
                  <View style={styles.infoCardContent}>
                    <View style={[styles.infoIconContainer, { backgroundColor: colors.info }]}>
                      <MaterialCommunityIcons name="calendar-month" size={24} color={colors.textInverse} />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                        Monthly Fee
                      </Text>
                      <Text style={[styles.infoAmount, { color: colors.info }]}>
                        ${club.feeSettings.monthlyFeeAmount.toFixed(2)} {club.feeSettings.currency}
                      </Text>
                      <Text style={[styles.infoSubtext, { color: colors.textTertiary }]}>
                        Active {club.feeSettings.activeMonths.length} months/year
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Recent Activity */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                    Recent Activity
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedTab('history')}>
                    <Text style={[styles.seeAllLink, { color: colors.primary }]}>See All</Text>
                  </TouchableOpacity>
                </View>
                
                {payments.slice(0, 3).map((payment, index) => {
                  const config = getStatusConfig(payment.status);
                  return (
                    <View 
                      key={payment.id} 
                      style={[
                        styles.activityItem,
                        index < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                      ]}
                    >
                      <View style={[styles.activityIcon, { backgroundColor: config.bg }]}>
                        <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
                          {payment.notes || `Monthly Fee - ${payment.month}/${payment.year}`}
                        </Text>
                        <Text style={[styles.activityDate, { color: colors.textTertiary }]}>
                          {new Date(payment.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
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
                    <MaterialCommunityIcons name="inbox-outline" size={48} color={colors.border} />
                    <Text style={[styles.emptyActivityText, { color: colors.textTertiary }]}>
                      No recent activity
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* History Tab */}
          {selectedTab === 'history' && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Payment History
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
                        index < payments.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                      ]}
                    >
                      <View style={[styles.historyIcon, { backgroundColor: config.bg }]}>
                        <MaterialCommunityIcons name={config.icon} size={24} color={config.color} />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={[styles.historyTitle, { color: colors.textPrimary }]}>
                          {payment.notes || `Monthly Fee`}
                        </Text>
                        <Text style={[styles.historyMeta, { color: colors.textTertiary }]}>
                          {new Date(payment.dueDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Text>
                        {payment.paidDate && (
                          <Text style={[styles.historyPaid, { color: colors.success }]}>
                            ✓ Paid on {new Date(payment.paidDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
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
                  <MaterialCommunityIcons name="file-document-outline" size={64} color={colors.border} />
                  <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
                    No Payment History
                  </Text>
                  <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
                    Your payment history will appear here
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Charges Tab */}
          {selectedTab === 'charges' && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Custom Charges
                </Text>
              </View>
              
              {customCharges.map((charge, index) => (
                <View 
                  key={charge.id} 
                  style={[
                    styles.chargeItem,
                    index < customCharges.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                  ]}
                >
                  <View style={[styles.chargeIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.chargeInfo}>
                    <Text style={[styles.chargeTitle, { color: colors.textPrimary }]}>
                      {charge.description}
                    </Text>
                    <Text style={[styles.chargeMeta, { color: colors.textTertiary }]}>
                      Due: {new Date(charge.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <Text style={[styles.chargeAmount, { color: colors.primary }]}>
                    ${charge.amount.toFixed(2)}
                  </Text>
                </View>
              ))}

              {customCharges.length === 0 && (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="check-circle-outline" size={64} color={colors.success} />
                  <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
                    No Custom Charges
                  </Text>
                  <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
                    You don't have any additional charges
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Help Card */}
          <View style={[styles.helpCard, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="lifebuoy" size={24} color={colors.primary} />
            <View style={styles.helpContent}>
              <Text style={[styles.helpTitle, { color: colors.textPrimary }]}>
                Need Help?
              </Text>
              <Text style={[styles.helpText, { color: colors.textTertiary }]}>
                Contact your club administrator for questions about fees
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textTertiary} />
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerContent: {},
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: designTokens.spacing.xxl,
  },
  headerClubName: {
    fontSize: mobileFontSizes.sm,
    marginBottom: designTokens.spacing.xs,
  },
  headerTitle: {
    fontSize: mobileFontSizes['3xl'],
    fontWeight: '700',
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
  },
  balanceMain: {
    alignItems: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  balanceLabel: {
    fontSize: mobileFontSizes.sm,
    marginBottom: designTokens.spacing.sm,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: designTokens.spacing.md,
  },
  balanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  balanceTagText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: 1,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '700',
  },
  quickStatLabel: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xs,
  },
  quickStatDivider: {
    width: 1,
    height: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: designTokens.spacing.lg,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.lg,
  },
  card: {
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  cardTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: mobileFontSizes.sm,
    marginTop: designTokens.spacing.xs,
  },
  seeAllLink: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  progressBar: {
    height: 8,
    borderRadius: designTokens.borderRadius.full,
    overflow: 'hidden',
    marginBottom: designTokens.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: designTokens.borderRadius.full,
  },
  progressText: {
    fontSize: mobileFontSizes.xs,
    textAlign: 'right',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
  },
  summaryValue: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '700',
    marginTop: designTokens.spacing.sm,
  },
  summaryLabel: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xs,
  },
  infoCard: {
    borderWidth: 0,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.lg,
  },
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: mobileFontSizes.sm,
    marginBottom: designTokens.spacing.xs,
  },
  infoAmount: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: '700',
  },
  infoSubtext: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xxs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.md,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    marginBottom: designTokens.spacing.xs,
  },
  activityDate: {
    fontSize: mobileFontSizes.xs,
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityPrice: {
    fontSize: mobileFontSizes.md,
    fontWeight: '700',
    marginBottom: designTokens.spacing.xs,
  },
  activityBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.sm,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing['3xl'],
  },
  emptyActivityText: {
    fontSize: mobileFontSizes.sm,
    marginTop: designTokens.spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    marginBottom: designTokens.spacing.xs,
  },
  historyMeta: {
    fontSize: mobileFontSizes.xs,
  },
  historyPaid: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xs,
    fontWeight: '500',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '700',
    marginBottom: designTokens.spacing.sm,
  },
  historyBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.sm,
  },
  historyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chargeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  chargeIcon: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargeInfo: {
    flex: 1,
  },
  chargeTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    marginBottom: designTokens.spacing.xs,
  },
  chargeMeta: {
    fontSize: mobileFontSizes.xs,
  },
  chargeAmount: {
    fontSize: mobileFontSizes.xl,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing['4xl'],
  },
  emptyStateTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    marginTop: designTokens.spacing.lg,
  },
  emptyStateText: {
    fontSize: mobileFontSizes.sm,
    marginTop: designTokens.spacing.sm,
    textAlign: 'center',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.md,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    marginBottom: designTokens.spacing.xs,
  },
  helpText: {
    fontSize: mobileFontSizes.xs,
  },
  // Skeleton styles
  skeletonHeader: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing['4xl'],
  },
  skeletonContent: {
    padding: designTokens.spacing.lg,
  },
  skeleton: {
    borderRadius: designTokens.borderRadius.md,
  },
  skeletonTitle: {
    width: 200,
    height: 32,
    marginBottom: designTokens.spacing.sm,
  },
  skeletonSubtitle: {
    width: 150,
    height: 20,
  },
  skeletonCard: {
    height: 120,
    marginBottom: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
  },
  // Empty header styles
  emptyHeader: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing['5xl'],
  },
  emptyHeaderTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: '700',
    marginTop: designTokens.spacing.lg,
  },
  emptyHeaderSubtitle: {
    fontSize: mobileFontSizes.md,
    marginTop: designTokens.spacing.sm,
    textAlign: 'center',
  },
});

export default MyFeesScreen;
