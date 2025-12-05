/**
 * Divider Component
 * Reusable divider component for separating content
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { designTokens } from '../theme/designTokens';
import { dimensionValues } from '../constants/layoutConstants';
import { ORIENTATION, SPACING_KEY } from '../constants';

type DividerOrientation = typeof ORIENTATION.HORIZONTAL | typeof ORIENTATION.VERTICAL;

interface DividerProps {
  orientation?: DividerOrientation;
  spacing?: keyof typeof designTokens.spacing;
  color?: string;
  thickness?: number;
  style?: ViewStyle;
  testID?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = ORIENTATION.HORIZONTAL,
  spacing = SPACING_KEY.MD,
  color = designTokens.divider.color,
  thickness = designTokens.divider.thickness,
  style,
  testID,
}) => {
  const spacingValue = designTokens.spacing[spacing];

  const dividerStyle: ViewStyle = orientation === ORIENTATION.HORIZONTAL
    ? {
        height: thickness,
        width: dimensionValues.width.full,
        marginVertical: spacingValue,
        backgroundColor: color,
      }
    : {
        width: thickness,
        height: dimensionValues.width.full,
        marginHorizontal: spacingValue,
        backgroundColor: color,
      };

  return (
    <View
      style={[dividerStyle, style]}
      testID={testID}
      accessible={false}
    />
  );
};

export default Divider;

