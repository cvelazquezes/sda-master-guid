import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { User, UserRole, MemberBalance } from '../types';
import { mobileTypography, mobileFontSizes } from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';
import { Badge, StatusIndicator, IconButton } from '../shared/components';

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

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { color: colors.error, bg: colors.errorLight };
      case 'club_admin':
        return { color: colors.warning, bg: colors.warningLight };
      default:
        return { color: colors.info, bg: colors.infoLight };
    }
  };

  const getBalanceColor = () => {
    if (!balance) return colors.textSecondary;
    if (balance.balance >= 0) return colors.success;
    if (balance.overdueCharges > 0) return colors.error;
    return colors.warning;
  };

  const roleConfig = getRoleConfig(user.role);

  const CardContent = (
    <View style={[
      styles.card,
      { 
        backgroundColor: colors.surface, 
        shadowColor: '#000',
        shadowOpacity: isDark ? 0.4 : 0.2,
        elevation: isDark ? 8 : 5,
      },
      !user.isActive && { backgroundColor: colors.surfaceLight, opacity: 0.8 }
    ]}>
      {/* Avatar */}
      <View style={[
        styles.avatar,
        { backgroundColor: user.isActive ? roleConfig.color : colors.surfaceLight }
      ]}>
        <Text style={[styles.avatarText, { color: '#fff' }, !user.isActive && { color: colors.textTertiary }]}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={[styles.userName, { color: colors.textPrimary }, !user.isActive && { color: colors.textTertiary }]} numberOfLines={1}>
            {user.name}
          </Text>
          <Badge
            label={user.role === 'club_admin' ? 'CLUB ADMIN' : user.role.toUpperCase()}
            variant="neutral"
            size="sm"
            backgroundColor={user.isActive ? roleConfig.bg : colors.surfaceLight}
            textColor={user.isActive ? roleConfig.color : colors.textTertiary}
          />
        </View>

        <Text style={[styles.userEmail, { color: colors.textSecondary }, !user.isActive && { color: colors.textTertiary }]} numberOfLines={1}>
          {user.email}
        </Text>

        <View style={styles.detailsRow}>
          {/* Club Name */}
          {clubName && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="account-group"
                size={designTokens.icon.sizes.xs}
                color={user.isActive ? colors.primary : colors.textTertiary}
              />
              <Text style={[styles.metaText, { color: colors.textSecondary }, !user.isActive && { color: colors.textTertiary }]} numberOfLines={1}>
                {clubName}
              </Text>
            </View>
          )}

          {/* WhatsApp */}
          {user.whatsappNumber && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="whatsapp"
                size={designTokens.icon.sizes.xs}
                color={user.isActive ? colors.success : colors.textTertiary}
              />
              <Text style={[styles.metaText, { color: colors.textSecondary }, !user.isActive && { color: colors.textTertiary }]} numberOfLines={1}>
                {user.whatsappNumber}
              </Text>
            </View>
          )}

          {/* Status Indicator */}
          <StatusIndicator
            status={user.isActive ? 'active' : 'inactive'}
            showIcon
          />
        </View>

        {/* Payment Balance */}
        {balance && (
          <View style={[styles.balanceSection, { borderTopColor: colors.border }]}>
            <View style={styles.balanceRow}>
              <MaterialCommunityIcons
                name="wallet"
                size={designTokens.icon.sizes.sm}
                color={getBalanceColor()}
              />
              <Text style={[styles.balanceText, { color: getBalanceColor() }]}>
                Saldo: ${Math.abs(balance.balance).toFixed(2)} {balance.balance < 0 ? '(debe)' : ''}
              </Text>
            </View>
            {balance.overdueCharges > 0 && (
              <View style={[styles.overdueWarning, { backgroundColor: colors.errorLight }]}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={designTokens.icon.sizes.xs}
                  color={colors.error}
                />
                <Text style={[styles.overdueWarningText, { color: colors.error }]}>
                  ${balance.overdueCharges.toFixed(2)} vencidos
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
              icon={user.isActive ? 'cancel' : 'check-circle'}
              onPress={onToggleStatus}
              size="md"
              color={user.isActive ? colors.error : colors.success}
              accessibilityLabel={user.isActive ? 'Deactivate user' : 'Activate user'}
            />
          )}
          {onDelete && (
            <IconButton
              icon="delete-outline"
              onPress={onDelete}
              size="md"
              color={colors.error}
              accessibilityLabel={`Delete ${user.name}`}
            />
          )}
        </View>
      ) : onPress ? (
        <MaterialCommunityIcons
          name="chevron-right"
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
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${user.name}`}
        accessibilityHint="Double tap to open user details"
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

UserCard.displayName = 'UserCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    minHeight: 80,
  },
  cardInactive: {
    backgroundColor: designTokens.colors.backgroundTertiary,
    opacity: 0.8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
    flexShrink: 0,
  },
  avatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  avatarTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  userInfo: {
    flex: 1,
    marginRight: designTokens.spacing.md,
    minWidth: 0,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: designTokens.spacing.sm,
  },
  userName: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: 1,
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
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  chevron: {
    flexShrink: 0,
  },
  balanceSection: {
    marginTop: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
    gap: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceText: {
    ...mobileTypography.labelBold,
  },
  overdueWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: designTokens.colors.errorLight,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: 6,
    borderRadius: designTokens.borderRadius.sm,
  },
  overdueWarningText: {
    ...mobileTypography.caption,
    color: designTokens.colors.error,
    fontWeight: '600',
  },
});
