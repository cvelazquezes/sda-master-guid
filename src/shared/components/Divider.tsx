/**
 * Divider Component
 * Reusable divider component for separating content
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { designTokens } from '../theme/designTokens';

type DividerOrientation = 'horizontal' | 'vertical';

interface DividerProps {
  orientation?: DividerOrientation;
  spacing?: keyof typeof designTokens.spacing;
  color?: string;
  thickness?: number;
  style?: ViewStyle;
  testID?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing = 'md',
  color = designTokens.divider.color,
  thickness = designTokens.divider.thickness,
  style,
  testID,
}) => {
  const spacingValue = designTokens.spacing[spacing];

  const dividerStyle: ViewStyle = orientation === 'horizontal'
    ? {
        height: thickness,
        width: '100%',
        marginVertical: spacingValue,
        backgroundColor: color,
      }
    : {
        width: thickness,
        height: '100%',
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

