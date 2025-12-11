/**
 * PageHeader Primitive Component
 *
 * Unified header for all screens with title, subtitle, and action buttons.
 * Replaces both React Navigation header and custom welcome headers.
 *
 * @example
 * <PageHeader
 *   title={t('screens.home.welcomeBack', { name: user.name })}
 *   subtitle={t('screens.home.clubHappenings')}
 *   showActions
 * />
 */

import React, { type ReactNode } from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from './Badge';
import { Text } from './Text';
import {
  FLEX,
  ICONS,
  SCREENS,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  COMPONENT_SIZE,
} from '../../../shared/constants';
import { BORDER_WIDTH } from '../../../shared/constants/numbers';
import { useTheme } from '../../state/ThemeContext';

type PageHeaderProps = {
  /** Main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Show My Account and Notifications action buttons */
  showActions?: boolean;
  /** Show back button instead of action buttons */
  showBack?: boolean;
  /** Custom action buttons (overrides default actions) */
  actions?: ReactNode;
  /** Number of unread notifications (badge) */
  notificationCount?: number;
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showActions = true,
  showBack = false,
  actions,
  notificationCount = 0,
  style,
  testID,
}) => {
  const { colors, spacing, iconSizes } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleAccountPress = (): void => {
    navigation.navigate(SCREENS.ACCOUNT as never);
  };

  const handleNotificationsPress = (): void => {
    navigation.navigate(SCREENS.NOTIFICATIONS as never);
  };

  const handleBackPress = (): void => {
    navigation.goBack();
  };

  const containerStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderBottomWidth: BORDER_WIDTH.THIN,
    borderBottomColor: colors.border,
    paddingTop: insets.top > 0 ? insets.top : spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  };

  const headerRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleContainerStyle: ViewStyle = {
    flex: FLEX.ONE,
    marginRight: spacing.md,
  };

  const actionsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  };

  const actionButtonStyle: ViewStyle = {
    padding: spacing.sm,
    borderRadius: spacing.lg,
    backgroundColor: colors.surfaceElevated || colors.surface,
  };

  const notificationButtonStyle: ViewStyle = {
    ...actionButtonStyle,
    position: 'relative',
  };

  const badgeContainerStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
  };

  const renderActions = (): ReactNode => {
    if (actions) {
      return actions;
    }

    if (showBack) {
      return (
        <TouchableOpacity
          style={actionButtonStyle}
          accessibilityLabel="Go back"
          onPress={handleBackPress}
        >
          <MaterialCommunityIcons
            name={ICONS.ARROW_LEFT}
            size={iconSizes.md}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      );
    }

    if (showActions) {
      return (
        <View style={actionsContainerStyle}>
          <TouchableOpacity
            style={actionButtonStyle}
            accessibilityLabel="My Account"
            onPress={handleAccountPress}
          >
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_CIRCLE}
              size={iconSizes.md}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={notificationButtonStyle}
            accessibilityLabel="Notifications"
            onPress={handleNotificationsPress}
          >
            <MaterialCommunityIcons
              name={ICONS.BELL}
              size={iconSizes.md}
              color={colors.textSecondary}
            />
            {notificationCount > 0 && (
              <View style={badgeContainerStyle}>
                <Badge
                  // eslint-disable-next-line no-magic-numbers -- UI display threshold
                  label={notificationCount > 99 ? '99+' : String(notificationCount)}
                  variant="error"
                  size={COMPONENT_SIZE.sm}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[containerStyle, style]} testID={testID}>
      <View style={headerRowStyle}>
        <View style={titleContainerStyle}>
          <Text variant={TEXT_VARIANT.H2} weight={TEXT_WEIGHT.BOLD}>
            {title}
          </Text>
          {subtitle && (
            <View style={{ marginTop: spacing.xxs }}>
              <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
                {subtitle}
              </Text>
            </View>
          )}
        </View>
        {renderActions()}
      </View>
    </View>
  );
};

export default PageHeader;
