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
import { View, type ViewStyle } from 'react-native';
import { ORIENTATION, SPACING_KEY, DIMENSIONS } from '../../../shared/constants';
import { useThemeColor } from '../../hooks/useThemeColor';
import { designTokens } from '../../theme/designTokens';
import type { DividerColor, SpacingKey } from '../../../shared/types/theme';

// ============================================================================
// TYPES
// ============================================================================

type DividerOrientation = typeof ORIENTATION.HORIZONTAL | typeof ORIENTATION.VERTICAL;

export type DividerProps = {
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
};

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
  // Use centralized theme color hook
  const { getDividerColor } = useThemeColor();

  const spacingValue = designTokens.spacing[spacing];
  const dividerColor = getDividerColor(color);

  const dividerStyle: ViewStyle =
    orientation === ORIENTATION.HORIZONTAL
      ? {
          height: thickness,
          width: DIMENSIONS.WIDTH.FULL,
          marginVertical: spacingValue,
          backgroundColor: dividerColor,
        }
      : {
          width: thickness,
          height: DIMENSIONS.WIDTH.FULL,
          marginHorizontal: spacingValue,
          backgroundColor: dividerColor,
        };

  return <View style={[dividerStyle, style]} testID={testID} accessible={false} />;
};

export default Divider;
