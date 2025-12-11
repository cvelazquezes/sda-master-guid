import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStatusConfig } from './statusUtils';
import { createItemStyles, createStyles } from './styles';
import {
  DEFAULT_DISPLAY,
  DISPLAY_LIMITS,
  EMPTY_VALUE,
  ICONS,
  MY_FEES_TAB,
  SINGLE_SPACE,
} from '../../../../shared/constants';
import { DATE_LOCALE_OPTIONS } from '../../../../shared/constants/formats';
import { MATH } from '../../../../shared/constants/numbers';
import { NUMERIC } from '../../../../shared/constants/validation';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { MyFeesTabValue } from './types';
import type { Club, MemberBalance, MemberPayment } from '../../../../types';

type OverviewTabProps = {
  club: Club | null;
  balance: MemberBalance | null;
  payments: MemberPayment[];
  paidPayments: number;
  totalPayments: number;
  paymentProgress: number;
  setSelectedTab: (tab: MyFeesTabValue) => void;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
};

export function OverviewTab({
  club,
  balance,
  payments,
  paidPayments,
  totalPayments,
  paymentProgress,
  setSelectedTab,
  colors,
  t,
}: OverviewTabProps): React.JSX.Element {
  const { spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const itemStyles = useMemo(
    () => createItemStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  return (
    <>
      <PaymentProgressCard
        balance={balance}
        paidPayments={paidPayments}
        totalPayments={totalPayments}
        paymentProgress={paymentProgress}
        colors={colors}
        t={t}
        styles={styles}
      />
      {club?.feeSettings?.isActive && (
        <MonthlyFeeInfo club={club} colors={colors} t={t} styles={styles} />
      )}
      <RecentActivity
        payments={payments}
        setSelectedTab={setSelectedTab}
        colors={colors}
        t={t}
        styles={styles}
        itemStyles={itemStyles}
      />
    </>
  );
}

function PaymentProgressCard({
  balance,
  paidPayments,
  totalPayments,
  paymentProgress,
  colors,
  t,
  styles,
}: {
  balance: MemberBalance | null;
  paidPayments: number;
  totalPayments: number;
  paymentProgress: number;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <MaterialCommunityIcons
            name={ICONS.CHART_DONUT}
            size={iconSizes.lg}
            color={colors.primary}
          />
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
              { width: `${paymentProgress}%`, backgroundColor: colors.success },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {t('screens.myFees.percentComplete', { percent: paymentProgress.toFixed(0) })}
        </Text>
      </View>
      <SummaryGrid balance={balance} colors={colors} t={t} styles={styles} />
    </View>
  );
}

function SummaryGrid({
  balance,
  colors,
  t,
  styles,
}: {
  balance: MemberBalance | null;
  colors: Record<string, string>;
  t: (key: string) => string;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  const totalPaid =
    balance?.totalPaid.toFixed(NUMERIC.DECIMAL_PLACES) || t('screens.myFees.defaultAmount');
  const pending =
    balance?.pendingCharges.toFixed(NUMERIC.DECIMAL_PLACES) || t('screens.myFees.defaultAmount');
  const overdue =
    balance?.overdueCharges.toFixed(NUMERIC.DECIMAL_PLACES) || t('screens.myFees.defaultAmount');
  return (
    <View style={styles.summaryGrid}>
      <SummaryItem
        icon={ICONS.CHECK_CIRCLE}
        color={colors.success}
        bgColor={colors.successAlpha20 || `${colors.success}20`}
        value={`$${totalPaid}`}
        label={t('screens.myFees.totalPaid')}
        colors={colors}
        styles={styles}
      />
      <SummaryItem
        icon={ICONS.CLOCK_OUTLINE}
        color={colors.warning}
        bgColor={colors.warningAlpha20 || `${colors.warning}20`}
        value={`$${pending}`}
        label={t('screens.myFees.statusPending')}
        colors={colors}
        styles={styles}
      />
      <SummaryItem
        icon={ICONS.ALERT_CIRCLE}
        color={colors.error}
        bgColor={colors.errorAlpha20 || `${colors.error}20`}
        value={`$${overdue}`}
        label={t('screens.myFees.overdue')}
        colors={colors}
        styles={styles}
      />
    </View>
  );
}

function SummaryItem({
  icon,
  color,
  bgColor,
  value,
  label,
  colors,
  styles,
}: {
  icon: string;
  color: string;
  bgColor: string;
  value: string;
  label: string;
  colors: Record<string, string>;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[styles.summaryItem, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.CHECK_CIRCLE}
        size={iconSizes.xl}
        color={color}
      />
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function MonthlyFeeInfo({
  club,
  colors,
  t,
  styles,
}: {
  club: Club;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View
      style={[
        styles.card,
        styles.infoCard,
        { backgroundColor: colors.infoAlpha20 || `${colors.info}20` },
      ]}
    >
      <View style={styles.infoCardContent}>
        <View style={[styles.infoIconContainer, { backgroundColor: colors.info }]}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_MONTH}
            size={iconSizes.lg}
            color={colors.textInverse}
          />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
            {t('screens.myFees.monthlyFee')}
          </Text>
          <Text style={[styles.infoAmount, { color: colors.textPrimary }]}>
            $
            {club.feeSettings?.monthlyFeeAmount.toFixed(NUMERIC.DECIMAL_PLACES) ??
              DEFAULT_DISPLAY.AMOUNT_ZERO}
            {SINGLE_SPACE}
            {club.feeSettings?.currency ?? EMPTY_VALUE}
          </Text>
          <Text style={[styles.infoSubtext, { color: colors.textTertiary }]}>
            {t('screens.myFees.activeMonths', {
              count: club.feeSettings?.activeMonths.length ?? 0,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

function RecentActivity({
  payments,
  setSelectedTab,
  colors,
  t,
  styles,
  itemStyles,
}: {
  payments: MemberPayment[];
  setSelectedTab: (tab: MyFeesTabValue) => void;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  styles: ReturnType<typeof createStyles>;
  itemStyles: ReturnType<typeof createItemStyles>;
}): React.JSX.Element {
  const { spacing } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          {t('screens.myFees.recentActivity')}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="See all history"
          onPress={(): void => setSelectedTab(MY_FEES_TAB.HISTORY)}
        >
          <Text style={[styles.seeAllLink, { color: colors.primary }]}>
            {t('screens.myFees.seeAll')}
          </Text>
        </TouchableOpacity>
      </View>
      {payments.slice(0, DISPLAY_LIMITS.MAX_PREVIEW_ITEMS).map((payment, index) => (
        <ActivityItem
          key={payment.id}
          payment={payment}
          index={index}
          colors={colors}
          t={t}
          itemStyles={itemStyles}
          spacing={spacing}
        />
      ))}
      {payments.length === 0 && <EmptyActivity colors={colors} t={t} itemStyles={itemStyles} />}
    </View>
  );
}

function ActivityItem({
  payment,
  index,
  colors,
  t,
  itemStyles,
  spacing,
}: {
  payment: MemberPayment;
  index: number;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  itemStyles: ReturnType<typeof createItemStyles>;
  spacing: { xs: number };
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const config = getStatusConfig(payment.status, colors, t);
  // eslint-disable-next-line no-magic-numbers -- Thin border width divider
  const borderDivider = 8;
  const borderStyle =
    index < MATH.HALF
      ? { borderBottomWidth: spacing.xs / borderDivider, borderBottomColor: colors.border }
      : {};
  return (
    <View style={[itemStyles.activityItem, borderStyle]}>
      <View style={[itemStyles.activityIcon, { backgroundColor: config.bg }]}>
        <MaterialCommunityIcons
          name={config.icon as typeof ICONS.CHECK_CIRCLE}
          size={iconSizes.md}
          color={config.color}
        />
      </View>
      <View style={itemStyles.activityInfo}>
        <Text style={[itemStyles.activityTitle, { color: colors.textPrimary }]}>
          {payment.notes ||
            t('screens.myFees.monthlyFeeNote', { month: payment.month, year: payment.year })}
        </Text>
        <Text style={[itemStyles.activityDate, { color: colors.textTertiary }]}>
          {new Date(payment.dueDate).toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.SHORT_DATE)}
        </Text>
      </View>
      <View style={itemStyles.activityAmount}>
        <Text style={[itemStyles.activityPrice, { color: colors.textPrimary }]}>
          ${payment.amount.toFixed(NUMERIC.DECIMAL_PLACES)}
        </Text>
        <View style={[itemStyles.activityBadge, { backgroundColor: config.bg }]}>
          <Text style={[itemStyles.activityBadgeText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

function EmptyActivity({
  colors,
  t,
  itemStyles,
}: {
  colors: Record<string, string>;
  t: (key: string) => string;
  itemStyles: ReturnType<typeof createItemStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={itemStyles.emptyActivity}>
      <MaterialCommunityIcons
        name={ICONS.INBOX_OUTLINE}
        size={iconSizes.xxl}
        color={colors.border}
      />
      <Text style={[itemStyles.emptyActivityText, { color: colors.textTertiary }]}>
        {t('screens.myFees.noRecentActivity')}
      </Text>
    </View>
  );
}
