import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { MemberPayment } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';
import { NUMERIC } from '../../../../shared/constants/http';
import { DATE_LOCALE_OPTIONS } from '../../../../shared/constants/formats';
import { createStyles, createItemStyles } from './styles';
import { getStatusConfig } from './statusUtils';

interface HistoryTabProps {
  payments: MemberPayment[];
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function HistoryTab({ payments, colors, t }: HistoryTabProps): React.JSX.Element {
  const { spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const itemStyles = useMemo(
    () => createItemStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          {t('screens.myFees.paymentHistory')}
        </Text>
      </View>
      {sortedPayments.map((payment, index) => (
        <HistoryItem
          key={payment.id}
          payment={payment}
          index={index}
          total={payments.length}
          colors={colors}
          t={t}
          itemStyles={itemStyles}
        />
      ))}
      {payments.length === 0 && <EmptyHistory colors={colors} t={t} styles={styles} />}
    </View>
  );
}

function HistoryItem({
  payment,
  index,
  total,
  colors,
  t,
  itemStyles,
}: {
  payment: MemberPayment;
  index: number;
  total: number;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  itemStyles: ReturnType<typeof createItemStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const config = getStatusConfig(payment.status, colors, t);
  const borderStyle =
    index < total - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : {};

  return (
    <View style={[itemStyles.historyItem, borderStyle]}>
      <View style={[itemStyles.historyIcon, { backgroundColor: config.bg }]}>
        <MaterialCommunityIcons
          name={config.icon as typeof ICONS.CHECK_CIRCLE}
          size={iconSizes.lg}
          color={config.color}
        />
      </View>
      <View style={itemStyles.historyInfo}>
        <Text style={[itemStyles.historyTitle, { color: colors.textPrimary }]}>
          {payment.notes || t('screens.myFees.monthlyFeeDefault')}
        </Text>
        <Text style={[itemStyles.historyMeta, { color: colors.textTertiary }]}>
          {new Date(payment.dueDate).toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.MEDIUM_DATE)}
        </Text>
        {payment.paidDate && (
          <Text style={[itemStyles.historyPaid, { color: colors.success }]}>
            {t('screens.myFees.paidOn', {
              date: new Date(payment.paidDate).toLocaleDateString(
                undefined,
                DATE_LOCALE_OPTIONS.MONTH_DAY
              ),
            })}
          </Text>
        )}
      </View>
      <View style={itemStyles.historyRight}>
        <Text style={[itemStyles.historyAmount, { color: colors.textPrimary }]}>
          ${payment.amount.toFixed(NUMERIC.DECIMAL_PLACES)}
        </Text>
        <View style={[itemStyles.historyBadge, { backgroundColor: config.bg }]}>
          <Text style={[itemStyles.historyBadgeText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>
    </View>
  );
}

function EmptyHistory({
  colors,
  t,
  styles,
}: {
  colors: Record<string, string>;
  t: (key: string) => string;
  styles: ReturnType<typeof createStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={ICONS.FILE_DOCUMENT_OUTLINE}
        size={iconSizes['3xl']}
        color={colors.border}
      />
      <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
        {t('screens.myFees.noPaymentHistory')}
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
        {t('screens.myFees.paymentHistoryWillAppear')}
      </Text>
    </View>
  );
}
