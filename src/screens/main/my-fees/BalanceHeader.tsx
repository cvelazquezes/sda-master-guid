import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { Club, MemberBalance } from '../../../types';
import { useTheme } from '../../../contexts/ThemeContext';
import { BALANCE_STATUS, ICONS } from '../../../shared/constants';
import { NUMERIC } from '../../../shared/constants/http';
import { styles } from './styles';

interface BalanceHeaderProps {
  club: Club | null;
  balance: MemberBalance | null;
  balanceStatus: { color: string; status: string };
  paidPayments: number;
  totalPayments: number;
  chargesCount: number;
  colors: Record<string, string>;
  t: (key: string) => string;
}

export function BalanceHeader({
  club,
  balance,
  balanceStatus,
  paidPayments,
  totalPayments,
  chargesCount,
  colors,
  t,
}: BalanceHeaderProps): React.JSX.Element {
  const headerBgColor =
    balanceStatus.status === BALANCE_STATUS.GOOD
      ? colors.success
      : balanceStatus.status === BALANCE_STATUS.OVERDUE
        ? colors.error
        : colors.primary;

  return (
    <View style={[styles.headerGradient, { backgroundColor: headerBgColor }]}>
      <View style={styles.headerContent}>
        <HeaderTop clubName={club?.name} colors={colors} t={t} />
        <BalanceCard
          balance={balance}
          paidPayments={paidPayments}
          totalPayments={totalPayments}
          chargesCount={chargesCount}
          colors={colors}
          t={t}
        />
      </View>
    </View>
  );
}

function HeaderTop({
  clubName,
  colors,
  t,
}: {
  clubName?: string;
  colors: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={styles.headerTop}>
      <View>
        <Text style={[styles.headerClubName, { color: `${colors.textInverse}CC` }]}>
          {clubName}
        </Text>
        <Text style={[styles.headerTitle, { color: colors.textInverse }]}>
          {t('screens.myFees.myFinances')}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.headerAction, { backgroundColor: `${colors.textInverse}20` }]}
      >
        <MaterialCommunityIcons
          name={ICONS.HISTORY}
          size={iconSizes.lg}
          color={colors.textInverse}
        />
      </TouchableOpacity>
    </View>
  );
}

function BalanceCard({
  balance,
  paidPayments,
  totalPayments,
  chargesCount,
  colors,
  t,
}: {
  balance: MemberBalance | null;
  paidPayments: number;
  totalPayments: number;
  chargesCount: number;
  colors: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element {
  return (
    <View style={[styles.balanceCard, { backgroundColor: `${colors.textInverse}20` }]}>
      <BalanceMain balance={balance} colors={colors} t={t} />
      <QuickStats
        balance={balance}
        paidPayments={paidPayments}
        totalPayments={totalPayments}
        chargesCount={chargesCount}
        colors={colors}
        t={t}
      />
    </View>
  );
}

function BalanceMain({
  balance,
  colors,
  t,
}: {
  balance: MemberBalance | null;
  colors: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element {
  const balanceVal = balance
    ? Math.abs(balance.balance).toFixed(NUMERIC.DECIMAL_PLACES)
    : t('screens.myFees.defaultAmount');
  return (
    <View style={styles.balanceMain}>
      <Text style={[styles.balanceLabel, { color: `${colors.textInverse}CC` }]}>
        {t('screens.myFees.currentBalance')}
      </Text>
      <Text style={[styles.balanceAmount, { color: colors.textInverse }]}>${balanceVal}</Text>
      <BalanceTag balance={balance} colors={colors} t={t} />
    </View>
  );
}

function BalanceTag({
  balance,
  colors,
  t,
}: {
  balance: MemberBalance | null;
  colors: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element | null {
  const { iconSizes } = useTheme();
  if (!balance) {
    return null;
  }
  const isNegative = balance.balance < 0;
  const icon = isNegative
    ? balance.overdueCharges > 0
      ? ICONS.ALERT
      : ICONS.CLOCK_OUTLINE
    : ICONS.CHECK_CIRCLE;
  const label = isNegative
    ? balance.overdueCharges > 0
      ? t('screens.myFees.paymentOverdue')
      : t('screens.myFees.paymentDue')
    : t('screens.myFees.allPaidUp');
  return (
    <View style={[styles.balanceTag, { backgroundColor: `${colors.textInverse}25` }]}>
      <MaterialCommunityIcons name={icon} size={iconSizes.xs} color={colors.textInverse} />
      <Text style={[styles.balanceTagText, { color: colors.textInverse }]}>{label}</Text>
    </View>
  );
}

function QuickStats({
  balance,
  paidPayments,
  totalPayments,
  chargesCount,
  colors,
  t,
}: {
  balance: MemberBalance | null;
  paidPayments: number;
  totalPayments: number;
  chargesCount: number;
  colors: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element {
  return (
    <View style={[styles.quickStats, { borderTopColor: `${colors.textInverse}30` }]}>
      <View style={styles.quickStat}>
        <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>
          ${balance?.totalPaid.toFixed(0) || '0'}
        </Text>
        <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>
          {t('screens.myFees.totalPaid')}
        </Text>
      </View>
      <View style={[styles.quickStatDivider, { backgroundColor: `${colors.textInverse}30` }]} />
      <View style={styles.quickStat}>
        <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>
          {paidPayments}/{totalPayments}
        </Text>
        <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>
          {t('screens.myFees.payments')}
        </Text>
      </View>
      <View style={[styles.quickStatDivider, { backgroundColor: `${colors.textInverse}30` }]} />
      <View style={styles.quickStat}>
        <Text style={[styles.quickStatValue, { color: colors.textInverse }]}>{chargesCount}</Text>
        <Text style={[styles.quickStatLabel, { color: `${colors.textInverse}CC` }]}>
          {t('screens.myFees.charges')}
        </Text>
      </View>
    </View>
  );
}
