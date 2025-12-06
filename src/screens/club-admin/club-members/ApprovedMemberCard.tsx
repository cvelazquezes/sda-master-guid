import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, IconButton } from '../../../shared/components';
import { User, UserRole, MemberBalance } from '../../../types';
import { designTokens } from '../../../shared/theme';
import {
  ICONS,
  TEXT_LINES,
  COMPONENT_SIZE,
  TOUCH_OPACITY,
  MATH,
  LIST_SEPARATOR,
  ELLIPSIS,
  EMPTY_VALUE,
} from '../../../shared/constants';
import { NUMERIC } from '../../../shared/constants/http';
import { memberCardStyles as styles } from './styles';

interface ApprovedMemberCardProps {
  member: User;
  balance?: MemberBalance;
  onPress: () => void;
  onEditClasses: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  labels: {
    clubAdmin: string;
    user: string;
    active: string;
    inactive: string;
    overdue: string;
    pending: string;
    paidUp: string;
    editClasses: string;
    deactivate: string;
    activate: string;
    delete: string;
  };
}

function getBalanceColor(balance?: MemberBalance): string {
  if (!balance) {
    return designTokens.colors.textSecondary;
  }
  if (balance.balance >= 0) {
    return designTokens.colors.success;
  }
  if (balance.overdueCharges > 0) {
    return designTokens.colors.error;
  }
  return designTokens.colors.warning;
}

export function ApprovedMemberCard({
  member,
  balance,
  onPress,
  onEditClasses,
  onToggleStatus,
  onDelete,
  labels,
}: ApprovedMemberCardProps): React.JSX.Element {
  const balanceColor = getBalanceColor(balance);
  const isActive = member.isActive;
  const cardStyle = [styles.card, !isActive && styles.cardInactive];
  const avatarBg = isActive ? balanceColor : designTokens.colors.backgroundTertiary;
  const roleLabel = member.role === UserRole.CLUB_ADMIN ? labels.clubAdmin : labels.user;

  return (
    <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={TOUCH_OPACITY.default}>
      <Avatar initial={member.name.charAt(0)} color={avatarBg} isActive={isActive} />
      <View style={styles.info}>
        <MemberHeader name={member.name} role={roleLabel} isActive={isActive} />
        <Text
          style={[styles.email, !isActive && styles.textInactive]}
          numberOfLines={TEXT_LINES.single}
        >
          {member.email}
        </Text>
        <MemberDetails member={member} isActive={isActive} labels={labels} />
        {balance && <BalanceRow balance={balance} color={balanceColor} labels={labels} />}
      </View>
      <MemberActions
        isActive={isActive}
        onEditClasses={onEditClasses}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        labels={labels}
      />
    </TouchableOpacity>
  );
}

function Avatar({
  initial,
  color,
  isActive,
}: {
  initial: string;
  color: string;
  isActive: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.avatar, { backgroundColor: color }]}>
      <Text style={[styles.avatarText, !isActive && styles.avatarTextInactive]}>
        {initial.toUpperCase()}
      </Text>
    </View>
  );
}

function MemberHeader({
  name,
  role,
  isActive,
}: {
  name: string;
  role: string;
  isActive: boolean;
}): React.JSX.Element {
  return (
    <View style={styles.header}>
      <Text
        style={[styles.name, !isActive && styles.textInactive]}
        numberOfLines={TEXT_LINES.single}
      >
        {name}
      </Text>
      <View style={styles.roleBadge}>
        <Text style={[styles.roleText, !isActive && styles.roleTextInactive]}>{role}</Text>
      </View>
    </View>
  );
}

interface MemberDetailsProps {
  member: User;
  isActive: boolean;
  labels: ApprovedMemberCardProps['labels'];
}

function MemberDetails({ member, isActive, labels }: MemberDetailsProps): React.JSX.Element {
  const hasClasses = member.classes && member.classes.length > 0;
  const classesText = hasClasses
    ? member.classes.slice(0, MATH.HALF).join(LIST_SEPARATOR) +
      (member.classes.length > MATH.HALF ? ELLIPSIS : EMPTY_VALUE)
    : null;
  const getIconColor = (active: string): string =>
    isActive ? active : designTokens.colors.textQuaternary;
  const statusIcon = isActive ? ICONS.CHECK_CIRCLE : ICONS.CANCEL;
  const statusColor = isActive ? designTokens.colors.success : designTokens.colors.error;

  return (
    <View style={styles.detailsRow}>
      {classesText && (
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name={ICONS.SCHOOL}
            size={designTokens.iconSize.xs}
            color={getIconColor(designTokens.colors.primary)}
          />
          <Text
            style={[styles.metaText, !isActive && styles.textInactive]}
            numberOfLines={TEXT_LINES.single}
          >
            {classesText}
          </Text>
        </View>
      )}
      {member.whatsappNumber && (
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name={ICONS.WHATSAPP}
            size={designTokens.iconSize.xs}
            color={getIconColor(designTokens.colors.success)}
          />
          <Text
            style={[styles.metaText, !isActive && styles.textInactive]}
            numberOfLines={TEXT_LINES.single}
          >
            {member.whatsappNumber}
          </Text>
        </View>
      )}
      <View style={styles.statusBadge}>
        <MaterialCommunityIcons
          name={statusIcon}
          size={designTokens.iconSize.xs}
          color={statusColor}
        />
        <Text style={styles.statusText}>{isActive ? labels.active : labels.inactive}</Text>
      </View>
    </View>
  );
}

function BalanceRow({
  balance,
  color,
  labels,
}: {
  balance: MemberBalance;
  color: string;
  labels: ApprovedMemberCardProps['labels'];
}): React.JSX.Element {
  const isNegative = balance.balance < 0;
  const statusLabel = isNegative
    ? balance.overdueCharges > 0
      ? labels.overdue
      : labels.pending
    : labels.paidUp;
  return (
    <View style={styles.balanceRow}>
      <View style={[styles.balanceIndicator, { backgroundColor: color }]}>
        <MaterialCommunityIcons
          name={ICONS.CASH}
          size={designTokens.iconSize.xs}
          color={designTokens.colors.textInverse}
        />
        <Text style={styles.balanceText}>
          ${Math.abs(balance.balance).toFixed(NUMERIC.DECIMAL_PLACES)}
        </Text>
        <Text style={styles.balanceLabel}>{statusLabel}</Text>
      </View>
    </View>
  );
}

interface MemberActionsProps {
  isActive: boolean;
  onEditClasses: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  labels: ApprovedMemberCardProps['labels'];
}

function MemberActions({
  isActive,
  onEditClasses,
  onToggleStatus,
  onDelete,
  labels,
}: MemberActionsProps): React.JSX.Element {
  const toggleIcon = isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE;
  const toggleColor = isActive ? designTokens.colors.error : designTokens.colors.success;
  const toggleLabel = isActive ? labels.deactivate : labels.activate;

  return (
    <View style={styles.actionsContainer}>
      <IconButton
        icon={ICONS.SCHOOL_OUTLINE}
        onPress={onEditClasses}
        size={COMPONENT_SIZE.md}
        color={designTokens.colors.primary}
        accessibilityLabel={labels.editClasses}
      />
      <IconButton
        icon={toggleIcon}
        onPress={onToggleStatus}
        size={COMPONENT_SIZE.md}
        color={toggleColor}
        accessibilityLabel={toggleLabel}
      />
      <IconButton
        icon={ICONS.DELETE_OUTLINE}
        onPress={onDelete}
        size={COMPONENT_SIZE.md}
        color={designTokens.colors.error}
        accessibilityLabel={labels.delete}
      />
    </View>
  );
}
