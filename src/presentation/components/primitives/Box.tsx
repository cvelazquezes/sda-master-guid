/**
 * Box Primitive Component
 *
 * Themed View wrapper that provides background colors from the theme.
 * Use this instead of raw View when you need theme-aware backgrounds.
 *
 * @example
 * <Box bg="surface" padding="md" radius="lg">
 *   <Text>Content</Text>
 * </Box>
 */

import React, { useMemo, type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { designTokens } from '../../theme/designTokens';
import type {
  BackgroundColor,
  BorderColor,
  BorderWidthKey,
  RadiusKey,
  SpacingKey,
} from '../../../shared/types/theme';

export type BoxProps = {
  children?: ReactNode;
  bg?: BackgroundColor;
  padding?: SpacingKey;
  paddingX?: SpacingKey;
  paddingY?: SpacingKey;
  paddingTop?: SpacingKey;
  paddingBottom?: SpacingKey;
  paddingLeft?: SpacingKey;
  paddingRight?: SpacingKey;
  margin?: SpacingKey;
  marginX?: SpacingKey;
  marginY?: SpacingKey;
  marginTop?: SpacingKey;
  marginBottom?: SpacingKey;
  marginLeft?: SpacingKey;
  marginRight?: SpacingKey;
  radius?: RadiusKey;
  borderWidth?: BorderWidthKey;
  borderColor?: BorderColor;
  gap?: SpacingKey;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  flex?: number;
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

type PaddingProps = {
  padding?: SpacingKey;
  paddingX?: SpacingKey;
  paddingY?: SpacingKey;
  paddingTop?: SpacingKey;
  paddingBottom?: SpacingKey;
  paddingLeft?: SpacingKey;
  paddingRight?: SpacingKey;
};

type MarginProps = {
  margin?: SpacingKey;
  marginX?: SpacingKey;
  marginY?: SpacingKey;
  marginTop?: SpacingKey;
  marginBottom?: SpacingKey;
  marginLeft?: SpacingKey;
  marginRight?: SpacingKey;
};

function buildPaddingStyle(p: PaddingProps): ViewStyle {
  return {
    ...(p.padding !== undefined && { padding: designTokens.spacing[p.padding] }),
    ...(p.paddingX !== undefined && { paddingHorizontal: designTokens.spacing[p.paddingX] }),
    ...(p.paddingY !== undefined && { paddingVertical: designTokens.spacing[p.paddingY] }),
    ...(p.paddingTop !== undefined && { paddingTop: designTokens.spacing[p.paddingTop] }),
    ...(p.paddingBottom !== undefined && { paddingBottom: designTokens.spacing[p.paddingBottom] }),
    ...(p.paddingLeft !== undefined && { paddingLeft: designTokens.spacing[p.paddingLeft] }),
    ...(p.paddingRight !== undefined && { paddingRight: designTokens.spacing[p.paddingRight] }),
  };
}

function buildMarginStyle(m: MarginProps): ViewStyle {
  return {
    ...(m.margin !== undefined && { margin: designTokens.spacing[m.margin] }),
    ...(m.marginX !== undefined && { marginHorizontal: designTokens.spacing[m.marginX] }),
    ...(m.marginY !== undefined && { marginVertical: designTokens.spacing[m.marginY] }),
    ...(m.marginTop !== undefined && { marginTop: designTokens.spacing[m.marginTop] }),
    ...(m.marginBottom !== undefined && { marginBottom: designTokens.spacing[m.marginBottom] }),
    ...(m.marginLeft !== undefined && { marginLeft: designTokens.spacing[m.marginLeft] }),
    ...(m.marginRight !== undefined && { marginRight: designTokens.spacing[m.marginRight] }),
  };
}

type LayoutStyleProps = {
  gap?: SpacingKey;
  direction?: BoxProps['direction'];
  align?: BoxProps['align'];
  justify?: BoxProps['justify'];
  flex?: number;
  wrap?: BoxProps['wrap'];
};

function buildLayoutStyle(props: LayoutStyleProps): ViewStyle {
  const { gap, direction, align, justify, flex, wrap } = props;
  return {
    ...(gap !== undefined && { gap: designTokens.spacing[gap] }),
    ...(direction && { flexDirection: direction }),
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(flex !== undefined && { flex }),
    ...(wrap && { flexWrap: wrap }),
  };
}

export const Box: React.FC<BoxProps> = (props) => {
  const { children, bg, radius, borderWidth, borderColor, style, testID, accessibilityLabel } =
    props;
  const { getBackgroundColor, getBorderColor } = useThemeColor();

  const computedStyle = useMemo<ViewStyle>(() => {
    const paddingStyle = buildPaddingStyle(props);
    const marginStyle = buildMarginStyle(props);
    const layoutStyle = buildLayoutStyle(props);
    return {
      ...(bg && { backgroundColor: getBackgroundColor(bg) }),
      ...paddingStyle,
      ...marginStyle,
      ...(radius !== undefined && { borderRadius: designTokens.borderRadius[radius] }),
      ...(borderWidth !== undefined && { borderWidth: designTokens.borderWidth[borderWidth] }),
      ...(borderColor && { borderColor: getBorderColor(borderColor) }),
      ...layoutStyle,
    };
  }, [props, bg, radius, borderWidth, borderColor, getBackgroundColor, getBorderColor]);

  const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

  return (
    <View
      style={[computedStyle, flattenedStyle]}
      testID={testID}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

export default Box;
