/**
 * Text Primitive Component
 *
 * All text rendering MUST go through this component.
 * This is where typography, color, and platform quirks are handled.
 *
 * ❌ import { Text } from 'react-native';
 * ✅ import { Text } from '@yourorg/ui';
 *
 * @example
 * <Text variant="heading">Title</Text>
 * <Text variant="body" color="secondary">Description</Text>
 * <Text variant="caption" weight="bold">Label</Text>
 */

import React, { type ReactNode } from 'react';
import {
  Text as RNText,
  StyleSheet,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { HEADING_LEVEL } from '../../../shared/constants/components';
import { useTheme } from '../../state/ThemeContext';
import { typographyPrimitives } from '../../theme/tokens/primitives';
import { semanticTypography } from '../../theme/tokens/semantic';

// ============================================================================
// TYPES
// ============================================================================

export type TextVariant =
  // Display variants
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  // Heading variants
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'heading' // alias for h2
  // Body variants
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  // Label variants
  | 'labelLarge'
  | 'label'
  | 'labelSmall'
  // Caption variants
  | 'caption'
  | 'captionBold'
  // UI variants
  | 'button'
  | 'buttonSmall'
  | 'badge'
  | 'helper';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'disabled'
  | 'placeholder'
  | 'inverse'
  | 'onPrimary'
  | 'onSecondary'
  | 'onAccent'
  | 'link'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'inherit';

export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

export type TextAlign = 'left' | 'center' | 'right' | 'auto';

export type TextProps = {
  /** Text content */
  children: ReactNode;
  /** Typography variant - determines font size, weight, line height */
  variant?: TextVariant;
  /** Text color from semantic tokens */
  color?: TextColor;
  /** Override font weight */
  weight?: TextWeight;
  /** Text alignment */
  align?: TextAlign;
  /** Make text uppercase */
  uppercase?: boolean;
  /** Make text italic */
  italic?: boolean;
  /** Strike through text */
  strikethrough?: boolean;
  /** Underline text */
  underline?: boolean;
  /** Additional styles (use sparingly - prefer tokens) */
  style?: StyleProp<TextStyle>;
  /** Test ID for testing */
  testID?: string;
} & Omit<RNTextProps, 'style'>;

// ============================================================================
// VARIANT STYLES MAPPING
// ============================================================================

// eslint-disable-next-line complexity -- Many variant cases require multiple branches
const getVariantStyle = (variant: TextVariant): TextStyle => {
  const typography = semanticTypography;

  switch (variant) {
    // Display variants
    case 'displayLarge':
      return typography.display.large;
    case 'displayMedium':
      return typography.display.medium;
    case 'displaySmall':
      return typography.display.small;

    // Heading variants
    case 'h1':
      return typography.heading.h1;
    case 'h2':
    case 'heading':
      return typography.heading.h2;
    case 'h3':
      return typography.heading.h3;
    case 'h4':
      return typography.heading.h4;

    // Body variants
    case 'bodyLarge':
      return typography.body.large;
    case 'body':
      return typography.body.medium;
    case 'bodySmall':
      return typography.body.small;

    // Label variants
    case 'labelLarge':
      return typography.label.large;
    case 'label':
      return typography.label.medium;
    case 'labelSmall':
      return typography.label.small;

    // Caption variants
    case 'caption':
      return typography.caption.regular;
    case 'captionBold':
      return typography.caption.bold;

    // UI variants
    case 'button':
      return typography.ui.button;
    case 'buttonSmall':
      return typography.ui.buttonSmall;
    case 'badge':
      return typography.ui.badge;
    case 'helper':
      return typography.ui.helper;

    default:
      return typography.body.medium;
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  weight,
  align,
  uppercase = false,
  italic = false,
  strikethrough = false,
  underline = false,
  style,
  testID,
  ...props
}) => {
  const { colors } = useTheme();

  // Get color from semantic tokens
  const getTextColor = (): string => {
    switch (color) {
      case 'primary':
        return colors.textPrimary;
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'quaternary':
        return colors.textQuaternary || colors.textTertiary;
      case 'disabled':
        return colors.textDisabled;
      case 'placeholder':
        return colors.placeholder;
      case 'inverse':
        return colors.textInverse;
      case 'onPrimary':
        return colors.textOnPrimary;
      case 'onSecondary':
        return colors.textOnSecondary;
      case 'onAccent':
        return colors.textOnAccent;
      case 'link':
        return colors.link || colors.primary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      case 'inherit':
        return 'inherit' as unknown as string;
      default:
        return colors.textPrimary;
    }
  };

  // Get font weight
  const getFontWeight = (): TextStyle['fontWeight'] => {
    if (weight) {
      return typographyPrimitives.fontWeight[weight];
    }
    return undefined; // Use variant's default weight
  };

  // Build text decoration
  const getTextDecoration = (): TextStyle['textDecorationLine'] => {
    if (strikethrough && underline) {
      return 'underline line-through';
    }
    if (strikethrough) {
      return 'line-through';
    }
    if (underline) {
      return 'underline';
    }
    return undefined;
  };

  const variantStyle = getVariantStyle(variant);

  // Flatten style prop to handle arrays and nested styles
  const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

  const computedStyle: TextStyle = {
    ...variantStyle,
    color: getTextColor(),
    ...(getFontWeight() && { fontWeight: getFontWeight() }),
    ...(align && { textAlign: align }),
    ...(uppercase && { textTransform: 'uppercase' }),
    ...(italic && { fontStyle: 'italic' }),
    ...(getTextDecoration() && { textDecorationLine: getTextDecoration() }),
    ...flattenedStyle,
  };

  return (
    <RNText accessible style={computedStyle} testID={testID} {...props}>
      {children}
    </RNText>
  );
};

// ============================================================================
// CONVENIENT SUBCOMPONENTS
// ============================================================================

/** Heading text - use for section titles */
type HeadingLevel = (typeof HEADING_LEVEL)[keyof typeof HEADING_LEVEL];
const DEFAULT_HEADING_LEVEL: HeadingLevel = HEADING_LEVEL.H2;
export const Heading: React.FC<Omit<TextProps, 'variant'> & { level?: HeadingLevel }> = ({
  level = DEFAULT_HEADING_LEVEL,
  ...props
}) => {
  const variant = `h${level}` as TextVariant;
  return <Text variant={variant} {...props} />;
};

/** Body text - default for paragraphs */
export const Body: React.FC<
  Omit<TextProps, 'variant'> & { size?: 'large' | 'medium' | 'small' }
> = ({ size = 'medium', ...props }) => {
  const variant = size === 'medium' ? 'body' : size === 'large' ? 'bodyLarge' : 'bodySmall';
  return <Text variant={variant} {...props} />;
};

/** Label text - for form labels and small headings */
export const Label: React.FC<
  Omit<TextProps, 'variant'> & { size?: 'large' | 'medium' | 'small' }
> = ({ size = 'medium', ...props }) => {
  const variant = size === 'medium' ? 'label' : size === 'large' ? 'labelLarge' : 'labelSmall';
  return <Text variant={variant} {...props} />;
};

/** Caption text - for helper text and metadata */
export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => {
  return <Text variant="caption" color="secondary" {...props} />;
};

export default Text;
