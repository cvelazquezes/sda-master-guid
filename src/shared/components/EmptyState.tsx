/**
 * EmptyState Primitive Component
 *
 * Reusable empty state component for lists and screens.
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 *
 * @example
 * <EmptyState
 *   icon="inbox-outline"
 *   title={t('emptyState.noData')}
 *   description={t('emptyState.noDataDescription')}
 * />
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { StandardButton } from './StandardButton';
import {
  A11Y_ROLE,
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  ICONS,
  DIMENSIONS,
  FLEX,
  TEXT_VARIANT,
  TEXT_ALIGN,
  TEXT_COLOR,
} from '../constants';
import { Text } from './Text';

export interface EmptyStateProps {
  // Content
  icon?: string;
  title: string;
  description?: string;

  // Action
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;

  // Custom content
  children?: ReactNode;

  // Styling
  iconColor?: string;
  style?: ViewStyle;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = ICONS.INBOX_OUTLINE,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  children,
  iconColor,
  style,
  testID,
}) => {
  const { colors, spacing, radii, iconSizes, opacity } = useTheme();
  const finalIconColor = iconColor || colors.textTertiary;

  const containerStyle: ViewStyle = {
    flex: FLEX.ONE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
  };

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityLabel={`${title}${description ? `. ${description}` : EMPTY_VALUE}`}
      accessibilityRole={A11Y_ROLE.TEXT}
    >
      {/* Icon */}
      <View style={{ marginBottom: spacing.lg, opacity: opacity.high }}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK}
          size={iconSizes['4xl']}
          color={finalIconColor}
        />
      </View>

      {/* Title */}
      <Text
        variant={TEXT_VARIANT.H3}
        align={TEXT_ALIGN.CENTER}
        style={{ marginBottom: spacing.sm }}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          variant={TEXT_VARIANT.BODY_SMALL}
          color={TEXT_COLOR.SECONDARY}
          align={TEXT_ALIGN.CENTER}
          style={{ maxWidth: DIMENSIONS.MAX_WIDTH.MESSAGE, marginBottom: spacing.lg }}
        >
          {description}
        </Text>
      )}

      {/* Custom children */}
      {children}

      {/* Action button */}
      {actionLabel && onAction && (
        <View style={{ marginTop: spacing.md }}>
          <StandardButton
            title={actionLabel}
            onPress={onAction}
            icon={actionIcon}
            variant={COMPONENT_VARIANT.primary}
            size={BUTTON_SIZE.medium}
          />
        </View>
      )}
    </View>
  );
};

export default EmptyState;
