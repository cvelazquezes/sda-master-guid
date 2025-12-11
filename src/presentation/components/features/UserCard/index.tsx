/* eslint-disable max-lines-per-function -- Complex card component with multiple sections */
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { UserActions } from './UserActions';
import { UserAvatar } from './UserAvatar';
import { UserBalanceSection } from './UserBalanceSection';
import { UserMetaInfo } from './UserMetaInfo';
import { getRoleConfig, getRoleLabel, getBalanceColor } from './utils';
import {
  COMPONENT_NAMES,
  COMPONENT_SIZE,
  COMPONENT_VARIANT,
  TEXT_LINES,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  TEXT_COLOR,
  TEST_IDS,
} from '../../../../shared/constants';
import { formatViewDetailsLabel } from '../../../../shared/utils/formatters';
import { useTheme } from '../../../state/ThemeContext';
import { Text, Badge } from '../../primitives';
import {
  EntityCard,
  type EntityCardRenderProps,
  type EntityCardActionProps,
} from '../../primitives/EntityCard';
import type { ThemeColors as UserThemeColors, UserCardProps } from './types';
import type { User } from '../../../../types';

const UserCardComponent: React.FC<UserCardProps> = ({
  user,
  clubName,
  balance,
  onPress,
  showAdminActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const { t } = useTranslation();
  // Get theme colors directly for type-safe access
  const { colors } = useTheme();
  const themeColors = colors as unknown as UserThemeColors;

  // Render avatar using render prop pattern
  const renderIcon = useCallback(
    ({ isActive }: EntityCardRenderProps<User>) => {
      const roleConfig = getRoleConfig(user.role, themeColors);
      return (
        <UserAvatar
          name={user.name}
          isActive={isActive}
          backgroundColor={roleConfig.color}
          inactiveBackgroundColor={themeColors.surfaceLight}
          inactiveTextColor={themeColors.textTertiary}
        />
      );
    },
    [user.name, user.role, themeColors]
  );

  // Render user info section
  const renderInfo = useCallback(
    ({ entity, isActive }: EntityCardRenderProps<User>) => {
      const roleConfig = getRoleConfig(entity.role, themeColors);
      const balanceColor = getBalanceColor(balance, themeColors);

      return (
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text
              variant={TEXT_VARIANT.BODY}
              weight={TEXT_WEIGHT.BOLD}
              color={isActive ? TEXT_COLOR.PRIMARY : TEXT_COLOR.TERTIARY}
              numberOfLines={TEXT_LINES.single}
              style={styles.userName}
            >
              {entity.name}
            </Text>
            <Badge
              label={getRoleLabel(entity.role, t)}
              variant={COMPONENT_VARIANT.neutral}
              size={COMPONENT_SIZE.sm}
              backgroundColor={isActive ? roleConfig.bg : themeColors.surfaceLight}
              textColor={isActive ? roleConfig.color : themeColors.textTertiary}
            />
          </View>
          <Text
            variant={TEXT_VARIANT.BODY_SMALL}
            color={isActive ? TEXT_COLOR.SECONDARY : TEXT_COLOR.TERTIARY}
            numberOfLines={TEXT_LINES.single}
            style={styles.userEmail}
          >
            {entity.email}
          </Text>
          <UserMetaInfo
            clubName={clubName}
            whatsappNumber={entity.whatsappNumber}
            isActive={isActive}
            primaryColor={themeColors.primary}
            successColor={themeColors.success}
            textSecondaryColor={themeColors.textSecondary}
            textTertiaryColor={themeColors.textTertiary}
          />
          {balance && (
            <UserBalanceSection
              balance={balance}
              balanceColor={balanceColor}
              borderColor={themeColors.border}
              errorColor={themeColors.error}
              errorLightColor={themeColors.errorAlpha20}
            />
          )}
        </View>
      );
    },
    [clubName, balance, t, themeColors]
  );

  // Render actions section
  const renderActions = useCallback(
    ({ entity, onPress: cardOnPress }: EntityCardActionProps<User>) => (
      <UserActions
        user={entity}
        showAdminActions={showAdminActions}
        errorColor={themeColors.error}
        successColor={themeColors.success}
        textTertiaryColor={themeColors.textTertiary}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onPress={cardOnPress}
      />
    ),
    [showAdminActions, onToggleStatus, onDelete, themeColors]
  );

  return (
    <EntityCard
      entity={user}
      isActive={user.isActive}
      renderIcon={renderIcon}
      renderInfo={renderInfo}
      renderActions={renderActions}
      accessibilityLabel={formatViewDetailsLabel(user.name, t)}
      accessibilityHint={t('accessibility.doubleTapToOpenUserDetails')}
      style={styles.card}
      testID={TEST_IDS.USER_CARD(user.id)}
      onPress={onPress}
    />
  );
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
