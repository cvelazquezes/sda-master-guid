import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { User, UserRole, MemberBalance } from '../types';
import { mobileTypography, mobileFontSizes, designTokens, layoutConstants } from '../shared/theme';
import { Badge, StatusIndicator, IconButton } from '../shared/components';
import { formatViewDetailsLabel, formatDeleteLabel } from '../shared/utils/formatters';
import {
  A11Y_ROLE,
  COMPONENT_NAMES,
  COMPONENT_SIZE,
  COMPONENT_VARIANT,
  ICONS,
  STATUS,
  TEXT_LINES,
  TOUCH_OPACITY,
  flexValues,
} from '../shared/constants';

interface UserCardProps {
  user: User;
  clubName?: string | null;
  balance?: MemberBalance;
  onPress?: () => void;
  showAdminActions?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

const UserCardComponent: React.FC<UserCardProps> = ({
  user,
  clubName,
  balance,
  onPress,
  showAdminActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return { color: colors.error, bg: colors.errorLight };
      case UserRole.CLUB_ADMIN:
        return { color: colors.warning, bg: colors.warningLight };
      default:
        return { color: colors.info, bg: colors.infoLight };
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return t('components.userCard.roles.admin');
      case UserRole.CLUB_ADMIN:
        return t('components.userCard.roles.clubAdmin');
      default:
        return t('components.userCard.roles.user');
    }
  };

  const getBalanceColor = () => {
    if (!balance) return colors.textSecondary;
    if (balance.balance >= 0) return colors.success;
    if (balance.overdueCharges > 0) return colors.error;
    return colors.warning;
  };

  const roleConfig = getRoleConfig(user.role);

  const shadowConfig = isDark ? designTokens.shadowConfig.dark : designTokens.shadowConfig.light;

  const inactiveOpacity = designTokens.opacity.disabled + designTokens.opacity.medium;

  const CardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: designTokens.colors.black,
          shadowOpacity: shadowConfig.opacity,
          elevation: shadowConfig.elevation,
        },
        !user.isActive && {
          backgroundColor: colors.surfaceLight,
          opacity: inactiveOpacity,
        },
      ]}
    >
      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: user.isActive ? roleConfig.color : colors.surfaceLight,
          },
        ]}
      >
        <Text
          style={[
            styles.avatarText,
            { color: designTokens.colors.white },
            !user.isActive && { color: colors.textTertiary },
          ]}
        >
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text
            style={[
              styles.userName,
              { color: colors.textPrimary },
              !user.isActive && { color: colors.textTertiary },
            ]}
            numberOfLines={TEXT_LINES.single}
          >
            {user.name}
          </Text>
          <Badge
            label={getRoleLabel(user.role)}
            variant={COMPONENT_VARIANT.neutral}
            size={COMPONENT_SIZE.sm}
            backgroundColor={user.isActive ? roleConfig.bg : colors.surfaceLight}
            textColor={user.isActive ? roleConfig.color : colors.textTertiary}
          />
        </View>

        <Text
          style={[
            styles.userEmail,
            { color: colors.textSecondary },
            !user.isActive && { color: colors.textTertiary },
          ]}
          numberOfLines={TEXT_LINES.single}
        >
          {user.email}
        </Text>

        <View style={styles.detailsRow}>
          {/* Club Name */}
          {clubName && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name={ICONS.ACCOUNT_GROUP}
                size={designTokens.icon.sizes.xs}
                color={user.isActive ? colors.primary : colors.textTertiary}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: colors.textSecondary },
                  !user.isActive && { color: colors.textTertiary },
                ]}
                numberOfLines={TEXT_LINES.single}
              >
                {clubName}
              </Text>
            </View>
          )}

          {/* WhatsApp */}
          {user.whatsappNumber && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name={ICONS.WHATSAPP}
                size={designTokens.icon.sizes.xs}
                color={user.isActive ? colors.success : colors.textTertiary}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: colors.textSecondary },
                  !user.isActive && { color: colors.textTertiary },
                ]}
                numberOfLines={TEXT_LINES.single}
              >
                {user.whatsappNumber}
              </Text>
            </View>
          )}

          {/* Status Indicator */}
          <StatusIndicator status={user.isActive ? STATUS.active : STATUS.inactive} showIcon />
        </View>

        {/* Payment Balance */}
        {balance && (
          <View style={[styles.balanceSection, { borderTopColor: colors.border }]}>
            <View style={styles.balanceRow}>
              <MaterialCommunityIcons
                name={ICONS.WALLET}
                size={designTokens.icon.sizes.sm}
                color={getBalanceColor()}
              />
              <Text style={[styles.balanceText, { color: getBalanceColor() }]}>
                {t('components.userCard.balance.label')}: ${Math.abs(balance.balance).toFixed(2)}{' '}
                {balance.balance < 0 ? t('components.userCard.balance.owes') : ''}
              </Text>
            </View>
            {balance.overdueCharges > 0 && (
              <View style={[styles.overdueWarning, { backgroundColor: colors.errorLight }]}>
                <MaterialCommunityIcons
                  name={ICONS.ALERT_CIRCLE}
                  size={designTokens.icon.sizes.xs}
                  color={colors.error}
                />
                <Text style={[styles.overdueWarningText, { color: colors.error }]}>
                  ${balance.overdueCharges.toFixed(2)} {t('components.userCard.balance.overdue')}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Actions */}
      {showAdminActions && (onToggleStatus || onDelete) ? (
        <View style={styles.actionsContainer}>
          {onToggleStatus && (
            <IconButton
              icon={user.isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE}
              onPress={onToggleStatus}
              size={COMPONENT_SIZE.md}
              color={user.isActive ? colors.error : colors.success}
              accessibilityLabel={
                user.isActive ? t('accessibility.deactivateUser') : t('accessibility.activateUser')
              }
            />
          )}
          {onDelete && (
            <IconButton
              icon={ICONS.DELETE_OUTLINE}
              onPress={onDelete}
              size={COMPONENT_SIZE.md}
              color={colors.error}
              accessibilityLabel={formatDeleteLabel(user.name, t)}
            />
          )}
        </View>
      ) : onPress ? (
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_RIGHT}
          size={designTokens.icon.sizes.lg}
          color={colors.textTertiary}
          style={styles.chevron}
        />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={TOUCH_OPACITY.default}
        accessible={true}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={formatViewDetailsLabel(user.name, t)}
        accessibilityHint={t('accessibility.doubleTapToOpenUserDetails')}
        accessibilityState={{ disabled: !user.isActive }}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

// Memoize component with custom comparison for performance
export const UserCard = memo(UserCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.user.isActive === nextProps.user.isActive &&
    prevProps.user.role === nextProps.user.role &&
    prevProps.clubName === nextProps.clubName &&
    prevProps.showAdminActions === nextProps.showAdminActions &&
    prevProps.balance?.balance === nextProps.balance?.balance &&
    prevProps.balance?.overdueCharges === nextProps.balance?.overdueCharges
  );
});

UserCard.displayName = COMPONENT_NAMES.USER_CARD;

const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    shadowOffset: { width: 0, height: designTokens.spacing.xxs },
    shadowRadius: designTokens.shadows.md.shadowRadius,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: designTokens.componentSizes.cardMinHeight.md,
  },
  cardInactive: {
    backgroundColor: designTokens.colors.backgroundTertiary,
    opacity: designTokens.opacity.high,
  },
  avatar: {
    width: designTokens.avatarSize.lg,
    height: designTokens.avatarSize.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
    flexShrink: flexValues.shrinkDisabled,
  },
  avatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  avatarTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  userInfo: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  userHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  userName: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
  },
  textInactive: {
    color: designTokens.colors.textQuaternary,
  },
  roleText: {
    ...mobileTypography.badge,
    fontSize: mobileFontSizes.xs,
  },
  userEmail: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  detailsRow: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  metaItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  metaText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    flexShrink: flexValues.shrinkDisabled,
  },
  chevron: {
    flexShrink: flexValues.shrinkDisabled,
  },
  balanceSection: {
    marginTop: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
    gap: designTokens.spacing.xs,
  },
  balanceRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs + designTokens.spacing.xxs,
  },
  balanceText: {
    ...mobileTypography.labelBold,
  },
  overdueWarning: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    backgroundColor: designTokens.colors.errorLight,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs + designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.sm,
  },
  overdueWarningText: {
    ...mobileTypography.caption,
    color: designTokens.colors.error,
    fontWeight: designTokens.fontWeight.semibold,
  },
});
