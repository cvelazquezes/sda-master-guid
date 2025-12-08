import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, IconButton } from '../../../shared/components';
import { User, UserRole, MemberBalance } from '../../../types';
import { useTheme } from '../../../contexts/ThemeContext';
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
import { NUMERIC } from '../../../shared/constants/validation';
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

interface ThemeColors {
  textSecondary: string;
  success: string;
  error: string;
  warning: string;
  backgroundTertiary: string;
  primary: string;
  textQuaternary: string;
  textInverse: string;
}

function getBalanceColor(balance: MemberBalance | undefined, colors: ThemeColors): string {
  if (!balance) {
    return colors.textSecondary;
  }
  if (balance.balance >= 0) {
    return colors.success;
  }
  if (balance.overdueCharges > 0) {
    return colors.error;
  }
  return colors.warning;
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
  const { colors, iconSizes } = useTheme();
  const themeColors: ThemeColors = {
    textSecondary: colors.textSecondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    backgroundTertiary: colors.backgroundTertiary,
    primary: colors.primary,
    textQuaternary: colors.textQuaternary,
    textInverse: colors.textInverse,
  };
  const balanceColor = getBalanceColor(balance, themeColors);
  const isActive = member.isActive;
  const cardStyle = [styles.card, !isActive && styles.cardInactive];
  const avatarBg = isActive ? balanceColor : colors.backgroundTertiary;
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
        <MemberDetails
          member={member}
          isActive={isActive}
          labels={labels}
          colors={themeColors}
          iconSizes={iconSizes}
        />
        {balance && (
          <BalanceRow
            balance={balance}
            color={balanceColor}
            labels={labels}
            colors={themeColors}
            iconSizes={iconSizes}
          />
        )}
      </View>
      <MemberActions
        isActive={isActive}
        onEditClasses={onEditClasses}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        labels={labels}
        colors={themeColors}
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
  colors: ThemeColors;
  iconSizes: Record<string, number>;
}

function MemberDetails({
  member,
  isActive,
  labels,
  colors,
  iconSizes,
}: MemberDetailsProps): React.JSX.Element {
  const hasClasses = member.classes && member.classes.length > 0;
  const classesText = hasClasses
    ? member.classes.slice(0, MATH.HALF).join(LIST_SEPARATOR) +
      (member.classes.length > MATH.HALF ? ELLIPSIS : EMPTY_VALUE)
    : null;
  const getIconColor = (active: string): string => (isActive ? active : colors.textQuaternary);
  const statusIcon = isActive ? ICONS.CHECK_CIRCLE : ICONS.CANCEL;
  const statusColor = isActive ? colors.success : colors.error;

  return (
    <View style={styles.detailsRow}>
      {classesText && (
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name={ICONS.SCHOOL}
            size={iconSizes.xs}
            color={getIconColor(colors.primary)}
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
            size={iconSizes.xs}
            color={getIconColor(colors.success)}
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
        <MaterialCommunityIcons name={statusIcon} size={iconSizes.xs} color={statusColor} />
        <Text style={styles.statusText}>{isActive ? labels.active : labels.inactive}</Text>
      </View>
    </View>
  );
}

function BalanceRow({
  balance,
  color,
  labels,
  colors,
  iconSizes,
}: {
  balance: MemberBalance;
  color: string;
  labels: ApprovedMemberCardProps['labels'];
  colors: ThemeColors;
  iconSizes: Record<string, number>;
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
        <MaterialCommunityIcons name={ICONS.CASH} size={iconSizes.xs} color={colors.textInverse} />
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
  colors: ThemeColors;
}

function MemberActions({
  isActive,
  onEditClasses,
  onToggleStatus,
  onDelete,
  labels,
  colors,
}: MemberActionsProps): React.JSX.Element {
  const toggleIcon = isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE;
  const toggleColor = isActive ? colors.error : colors.success;
  const toggleLabel = isActive ? labels.deactivate : labels.activate;

  return (
    <View style={styles.actionsContainer}>
      <IconButton
        icon={ICONS.SCHOOL_OUTLINE}
        onPress={onEditClasses}
        size={COMPONENT_SIZE.md}
        color={colors.primary}
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
        color={colors.error}
        accessibilityLabel={labels.delete}
      />
    </View>
  );
}
