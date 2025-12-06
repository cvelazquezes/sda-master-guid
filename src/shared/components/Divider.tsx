/**
 * Divider Primitive Component
 *
 * Themed divider component that reads colors from the theme.
 * Use this for separating content with proper theme support.
 *
 * @example
 * <Divider />
 * <Divider orientation="vertical" color="borderMedium" />
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { ORIENTATION, SPACING_KEY, dimensionValues } from '../constants';
import { DividerColor, SpacingKey } from '../types/theme';

// ============================================================================
// TYPES
// ============================================================================

type DividerOrientation = typeof ORIENTATION.HORIZONTAL | typeof ORIENTATION.VERTICAL;

export interface DividerProps {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Spacing around the divider */
  spacing?: SpacingKey;
  /** Color from theme (defaults to border color) */
  color?: DividerColor;
  /** Thickness in pixels */
  thickness?: number;
  /** Additional styles */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Divider: React.FC<DividerProps> = ({
  orientation = ORIENTATION.HORIZONTAL,
  spacing = SPACING_KEY.MD,
  color = 'border',
  thickness = designTokens.divider.thickness,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  // Get color from theme
  const getDividerColor = (): string => {
    const colorMap: Record<DividerColor, string | undefined> = {
      border: colors.border,
      borderLight: colors.borderLight,
      borderMedium: colors.borderMedium,
      borderDark: colors.borderDark,
      divider: colors.border, // Fallback to border if divider not defined
      surface: colors.surface,
      surfaceLight: colors.surfaceLight,
    };

    return colorMap[color] || colors.border;
  };

  const spacingValue = designTokens.spacing[spacing];

  const dividerStyle: ViewStyle =
    orientation === ORIENTATION.HORIZONTAL
      ? {
          height: thickness,
          width: dimensionValues.width.full,
          marginVertical: spacingValue,
          backgroundColor: getDividerColor(),
        }
      : {
          width: thickness,
          height: dimensionValues.width.full,
          marginHorizontal: spacingValue,
          backgroundColor: getDividerColor(),
        };

  return <View style={[dividerStyle, style]} testID={testID} accessible={false} />;
};

export default Divider;
