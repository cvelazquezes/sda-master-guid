import React, { useMemo } from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { User, MemberBalance } from '../../../../types';
import {
  ICONS,
  EMPTY_VALUE,
  TEXT_ALIGN,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../../shared/constants';
import { NUMERIC } from '../../../../shared/constants/validation';
import { createStyles, createBalanceStyles, createEmptyStyles } from './styles';

interface BalancesTabProps {
  balances: MemberBalance[];
  members: User[];
  refreshing: boolean;
  onRefresh: () => void;
  onNotifyAll: () => void;
  onNotifySingle: (member: User, balance: MemberBalance) => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function BalancesTab({
  balances,
  members,
  refreshing,
  onRefresh,
  onNotifyAll,
  onNotifySingle,
  t,
}: BalancesTabProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );
  const balanceStyles = useMemo(
    () => createBalanceStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const emptyStyles = useMemo(
    () => createEmptyStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );

  const renderItem = ({ item }: { item: MemberBalance }): React.JSX.Element | null => {
    const member = members.find((m) => m.id === item.userId);
    if (!member) {
      return null;
    }
    return (
      <BalanceCard member={member} balance={item} onNotify={onNotifySingle} colors={colors} t={t} balanceStyles={balanceStyles} />
    );
  };

  return (
    <View style={styles.tabContent}>
      <BalancesHeader count={balances.length} onNotifyAll={onNotifyAll} t={t} />
      <FlatList
        data={balances}
        keyExtractor={(item): string => item.userId}
        contentContainerStyle={balanceStyles.listContainer}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyBalances t={t} emptyStyles={emptyStyles} />}
      />
    </View>
  );
}

interface BalancesHeaderProps {
  count: number;
  onNotifyAll: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

function BalancesHeader({ count, onNotifyAll, t }: BalancesHeaderProps): React.JSX.Element {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();
  const balanceStyles = useMemo(
    () => createBalanceStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  return (
    <View
      style={[
        balanceStyles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <View>
        <Text variant={TEXT_VARIANT.H3} color={TEXT_COLOR.PRIMARY}>
          {t('screens.clubFees.memberBalances')}
        </Text>
        <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.SECONDARY}>
          {t('screens.clubFees.membersCount', { count })}
        </Text>
      </View>
      <TouchableOpacity
        style={[balanceStyles.notifyAllButton, { backgroundColor: colors.primary }]}
        onPress={onNotifyAll}
      >
        <MaterialCommunityIcons
          name={ICONS.BELL_RING_OUTLINE}
          size={iconSizes.md}
          color={colors.textOnPrimary}
        />
        <Text
          variant={TEXT_VARIANT.LABEL}
          weight={TEXT_WEIGHT.SEMIBOLD}
          color={TEXT_COLOR.ON_PRIMARY}
        >
          {t('screens.clubFees.notifyAll')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface BalanceCardProps {
  member: User;
  balance: MemberBalance;
  onNotify: (m: User, b: MemberBalance) => void;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  balanceStyles: ReturnType<typeof createBalanceStyles>;
}

function getBalanceStatusColor(balance: MemberBalance, colors: Record<string, string>): string {
  if (balance.balance >= 0) {
    return colors.success;
  }
  return balance.overdueCharges > 0 ? colors.error : colors.warning;
}

function CardHeader({
  member,
  statusColor,
  onPress,
  primaryColor,
  balanceStyles,
}: {
  member: User;
  statusColor: string;
  onPress: () => void;
  primaryColor: string;
  balanceStyles: ReturnType<typeof createBalanceStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={balanceStyles.cardHeader}>
      <View style={balanceStyles.memberInfo}>
        <View style={[balanceStyles.avatar, { backgroundColor: statusColor }]}>
          <Text variant={TEXT_VARIANT.H3} color={TEXT_COLOR.ON_PRIMARY}>
            {member.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={balanceStyles.memberTextInfo}>
          <Text variant={TEXT_VARIANT.BODY} weight={TEXT_WEIGHT.SEMIBOLD}>
            {member.name}
          </Text>
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.SECONDARY}>
            {member.email}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={balanceStyles.notifyButton} onPress={onPress}>
        <MaterialCommunityIcons
          name={ICONS.BELL_OUTLINE}
          size={iconSizes.lg}
          color={primaryColor}
        />
      </TouchableOpacity>
    </View>
  );
}

function BalanceCard({
  member,
  balance,
  onNotify,
  colors,
  t,
  balanceStyles,
}: BalanceCardProps): React.JSX.Element {
  const statusColor = getBalanceStatusColor(balance, colors);
  const statusText =
    balance.balance < 0
      ? t('screens.clubFees.owes')
      : balance.balance > 0
        ? t('screens.clubFees.credit')
        : EMPTY_VALUE;

  return (
    <View style={[balanceStyles.card, { backgroundColor: colors.surface }]}>
      <CardHeader
        member={member}
        statusColor={statusColor}
        onPress={(): void => onNotify(member, balance)}
        primaryColor={colors.primary}
        balanceStyles={balanceStyles}
      />
      <View style={balanceStyles.details}>
        <View style={balanceStyles.row}>
          <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
            {t('screens.clubFees.totalOwed')}
          </Text>
          <Text variant={TEXT_VARIANT.BODY} weight={TEXT_WEIGHT.SEMIBOLD}>
            ${balance.totalOwed.toFixed(NUMERIC.DECIMAL_PLACES)}
          </Text>
        </View>
        <View style={balanceStyles.row}>
          <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
            {t('screens.clubFees.totalPaid')}
          </Text>
          <Text
            variant={TEXT_VARIANT.BODY}
            weight={TEXT_WEIGHT.SEMIBOLD}
            style={{ color: colors.success }}
          >
            ${balance.totalPaid.toFixed(NUMERIC.DECIMAL_PLACES)}
          </Text>
        </View>
        <View
          style={[balanceStyles.row, balanceStyles.totalRow, { borderTopColor: colors.border }]}
        >
          <Text variant={TEXT_VARIANT.BODY} weight={TEXT_WEIGHT.BOLD}>
            {t('screens.clubFees.currentBalance')}
          </Text>
          <Text variant={TEXT_VARIANT.H3} style={{ color: statusColor }}>
            ${Math.abs(balance.balance).toFixed(NUMERIC.DECIMAL_PLACES)} {statusText}
          </Text>
        </View>
        {balance.overdueCharges > 0 && <OverdueNotice balance={balance} colors={colors} t={t} balanceStyles={balanceStyles} />}
      </View>
    </View>
  );
}

function OverdueNotice({
  balance,
  colors,
  t,
  balanceStyles,
}: {
  balance: MemberBalance;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
  balanceStyles: ReturnType<typeof createBalanceStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[balanceStyles.overdueNotice, { backgroundColor: colors.errorLight }]}>
      <MaterialCommunityIcons name={ICONS.ALERT_CIRCLE} size={iconSizes.sm} color={colors.error} />
      <Text variant={TEXT_VARIANT.CAPTION} weight={TEXT_WEIGHT.SEMIBOLD} color={TEXT_COLOR.ERROR}>
        {t('screens.clubFees.overdueAmount', {
          amount: balance.overdueCharges.toFixed(NUMERIC.DECIMAL_PLACES),
        })}
      </Text>
    </View>
  );
}

function EmptyBalances({
  t,
  emptyStyles,
}: {
  t: (key: string) => string;
  emptyStyles: ReturnType<typeof createEmptyStyles>;
}): React.JSX.Element {
  const { colors, iconSizes } = useTheme();
  return (
    <View style={emptyStyles.container}>
      <MaterialCommunityIcons
        name={ICONS.WALLET_OUTLINE}
        size={iconSizes['4xl']}
        color={colors.border}
      />
      <Text
        variant={TEXT_VARIANT.BODY}
        weight={TEXT_WEIGHT.SEMIBOLD}
        color={TEXT_COLOR.TERTIARY}
        align={TEXT_ALIGN.CENTER}
      >
        {t('screens.clubFees.noBalances')}
      </Text>
      <Text
        variant={TEXT_VARIANT.BODY_SMALL}
        color={TEXT_COLOR.TERTIARY}
        align={TEXT_ALIGN.CENTER}
        style={emptyStyles.subtext}
      >
        {t('screens.clubFees.generateFeesToSeeBalances')}
      </Text>
    </View>
  );
}
