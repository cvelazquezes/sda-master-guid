import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../shared/theme';
import { Text, Badge } from '../../shared/components';
import { formatViewDetailsLabel } from '../../shared/utils/formatters';
import {
  A11Y_ROLE,
  COMPONENT_NAMES,
  COMPONENT_SIZE,
  COMPONENT_VARIANT,
  TEXT_LINES,
  TOUCH_OPACITY,
} from '../../shared/constants';
import { UserCardProps } from './types';
import { getRoleConfig, getRoleLabel, getBalanceColor } from './utils';
import { UserAvatar } from './UserAvatar';
import { UserMetaInfo } from './UserMetaInfo';
import { UserBalanceSection } from './UserBalanceSection';
import { UserActions } from './UserActions';
import { styles } from './styles';

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

  const roleConfig = getRoleConfig(user.role, colors);
  const shadowConfig = isDark ? designTokens.shadowConfig.dark : designTokens.shadowConfig.light;
  const inactiveOpacity = designTokens.opacity.disabled + designTokens.opacity.medium;
  const balanceColor = getBalanceColor(balance, colors);

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.surface,
      shadowColor: colors.shadow || '#000000',
      shadowOpacity: shadowConfig.opacity,
      elevation: shadowConfig.elevation,
    },
    !user.isActive && { backgroundColor: colors.surfaceLight, opacity: inactiveOpacity },
  ];

  const CardContent = (
    <View style={cardStyle}>
      <UserAvatar
        name={user.name}
        isActive={user.isActive}
        backgroundColor={roleConfig.color}
        inactiveBackgroundColor={colors.surfaceLight}
        inactiveTextColor={colors.textTertiary}
      />
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text
            variant="body"
            weight="bold"
            color={user.isActive ? 'primary' : 'tertiary'}
            numberOfLines={TEXT_LINES.single}
            style={styles.userName}
          >
            {user.name}
          </Text>
          <Badge
            label={getRoleLabel(user.role, t)}
            variant={COMPONENT_VARIANT.neutral}
            size={COMPONENT_SIZE.sm}
            backgroundColor={user.isActive ? roleConfig.bg : colors.surfaceLight}
            textColor={user.isActive ? roleConfig.color : colors.textTertiary}
          />
        </View>
        <Text
          variant="bodySmall"
          color={user.isActive ? 'secondary' : 'tertiary'}
          numberOfLines={TEXT_LINES.single}
          style={styles.userEmail}
        >
          {user.email}
        </Text>
        <UserMetaInfo
          clubName={clubName}
          whatsappNumber={user.whatsappNumber}
          isActive={user.isActive}
          primaryColor={colors.primary}
          successColor={colors.success}
          textSecondaryColor={colors.textSecondary}
          textTertiaryColor={colors.textTertiary}
        />
        {balance && (
          <UserBalanceSection
            balance={balance}
            balanceColor={balanceColor}
            borderColor={colors.border}
            errorColor={colors.error}
            errorLightColor={colors.errorLight}
          />
        )}
      </View>
      <UserActions
        user={user}
        showAdminActions={showAdminActions}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onPress={onPress}
        errorColor={colors.error}
        successColor={colors.success}
        textTertiaryColor={colors.textTertiary}
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={TOUCH_OPACITY.default}
        accessible
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
