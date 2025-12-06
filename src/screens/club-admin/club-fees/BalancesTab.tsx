import React from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { User, MemberBalance } from '../../../types';
import { designTokens } from '../../../shared/theme';
import { ICONS, EMPTY_VALUE } from '../../../shared/constants';
import { NUMERIC } from '../../../shared/constants/http';
import { styles, balanceStyles, emptyStyles } from './styles';

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
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: MemberBalance }): React.JSX.Element | null => {
    const member = members.find((m) => m.id === item.userId);
    if (!member) {
      return null;
    }
    return (
      <BalanceCard member={member} balance={item} onNotify={onNotifySingle} colors={colors} t={t} />
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
        ListEmptyComponent={<EmptyBalances t={t} />}
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
  const { colors } = useTheme();
  return (
    <View
      style={[
        balanceStyles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <View>
        <Text variant="h3" color="primary">
          {t('screens.clubFees.memberBalances')}
        </Text>
        <Text variant="caption" color="secondary">
          {t('screens.clubFees.membersCount', { count })}
        </Text>
      </View>
      <TouchableOpacity
        style={[balanceStyles.notifyAllButton, { backgroundColor: colors.primary }]}
        onPress={onNotifyAll}
      >
        <MaterialCommunityIcons
          name={ICONS.BELL_RING_OUTLINE}
          size={designTokens.iconSize.md}
          color={colors.textOnPrimary}
        />
        <Text variant="label" weight="semibold" color="onPrimary">
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
}: {
  member: User;
  statusColor: string;
  onPress: () => void;
  primaryColor: string;
}): React.JSX.Element {
  return (
    <View style={balanceStyles.cardHeader}>
      <View style={balanceStyles.memberInfo}>
        <View style={[balanceStyles.avatar, { backgroundColor: statusColor }]}>
          <Text variant="h3" color="onPrimary">
            {member.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={balanceStyles.memberTextInfo}>
          <Text variant="body" weight="semibold">
            {member.name}
          </Text>
          <Text variant="caption" color="secondary">
            {member.email}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={balanceStyles.notifyButton} onPress={onPress}>
        <MaterialCommunityIcons
          name={ICONS.BELL_OUTLINE}
          size={designTokens.iconSize.lg}
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
      />
      <View style={balanceStyles.details}>
        <View style={balanceStyles.row}>
          <Text variant="bodySmall" color="secondary">
            {t('screens.clubFees.totalOwed')}
          </Text>
          <Text variant="body" weight="semibold">
            ${balance.totalOwed.toFixed(NUMERIC.DECIMAL_PLACES)}
          </Text>
        </View>
        <View style={balanceStyles.row}>
          <Text variant="bodySmall" color="secondary">
            {t('screens.clubFees.totalPaid')}
          </Text>
          <Text variant="body" weight="semibold" style={{ color: colors.success }}>
            ${balance.totalPaid.toFixed(NUMERIC.DECIMAL_PLACES)}
          </Text>
        </View>
        <View
          style={[balanceStyles.row, balanceStyles.totalRow, { borderTopColor: colors.border }]}
        >
          <Text variant="body" weight="bold">
            {t('screens.clubFees.currentBalance')}
          </Text>
          <Text variant="h3" style={{ color: statusColor }}>
            ${Math.abs(balance.balance).toFixed(NUMERIC.DECIMAL_PLACES)} {statusText}
          </Text>
        </View>
        {balance.overdueCharges > 0 && (
          <View style={[balanceStyles.overdueNotice, { backgroundColor: colors.errorLight }]}>
            <MaterialCommunityIcons
              name={ICONS.ALERT_CIRCLE}
              size={designTokens.iconSize.sm}
              color={colors.error}
            />
            <Text variant="caption" weight="semibold" color="error">
              {t('screens.clubFees.overdueAmount', {
                amount: balance.overdueCharges.toFixed(NUMERIC.DECIMAL_PLACES),
              })}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function EmptyBalances({ t }: { t: (key: string) => string }): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={emptyStyles.container}>
      <MaterialCommunityIcons
        name={ICONS.WALLET_OUTLINE}
        size={designTokens.iconSize['4xl']}
        color={colors.border}
      />
      <Text variant="body" weight="semibold" color="tertiary" align="center">
        {t('screens.clubFees.noBalances')}
      </Text>
      <Text variant="bodySmall" color="tertiary" align="center" style={emptyStyles.subtext}>
        {t('screens.clubFees.generateFeesToSeeBalances')}
      </Text>
    </View>
  );
}
