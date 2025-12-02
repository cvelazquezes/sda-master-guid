/**
 * Badge Component
 * Reusable badge component for status indicators, roles, and labels
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { designTokens } from '../theme/designTokens';
import { statusColors, roleColors } from '../theme/sdaColors';
import { mobileFontSizes } from '../theme';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';
type StatusType = keyof typeof statusColors;
type RoleType = keyof typeof roleColors;

interface BadgeProps {
  // Content
  label: string;
  icon?: string;
  
  // Styling
  variant?: BadgeVariant;
  size?: BadgeSize;
  status?: StatusType;
  role?: RoleType;
  
  // Custom colors (overrides variant)
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // Layout
  style?: ViewStyle;
  testID?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  variant = 'neutral',
  size = 'md',
  status,
  role,
  backgroundColor,
  textColor,
  borderColor,
  style,
  testID,
}) => {
  // Determine colors based on status/role or variant
  const getColors = () => {
    if (status) {
      return {
        bg: statusColors[status].light,
        text: statusColors[status].text,
        border: statusColors[status].primary,
      };
    }
    
    if (role) {
      return {
        bg: roleColors[role].light,
        text: roleColors[role].text,
        border: roleColors[role].primary,
      };
    }
    
    // Variant-based colors
    switch (variant) {
      case 'primary':
        return {
          bg: designTokens.colors.primaryLight,
          text: designTokens.colors.primary,
          border: designTokens.colors.primary,
        };
      case 'secondary':
        return {
          bg: designTokens.colors.secondaryLight,
          text: designTokens.colors.secondary,
          border: designTokens.colors.secondary,
        };
      case 'accent':
        return {
          bg: designTokens.colors.accentLight,
          text: designTokens.colors.accent,
          border: designTokens.colors.accent,
        };
      case 'success':
        return {
          bg: designTokens.colors.successLight,
          text: designTokens.colors.success,
          border: designTokens.colors.success,
        };
      case 'warning':
        return {
          bg: designTokens.colors.warningLight,
          text: designTokens.colors.warning,
          border: designTokens.colors.warning,
        };
      case 'error':
        return {
          bg: designTokens.colors.errorLight,
          text: designTokens.colors.error,
          border: designTokens.colors.error,
        };
      case 'info':
        return {
          bg: designTokens.colors.infoLight,
          text: designTokens.colors.info,
          border: designTokens.colors.info,
        };
      default:
        return {
          bg: designTokens.colors.backgroundTertiary,
          text: designTokens.colors.textSecondary,
          border: designTokens.colors.borderMedium,
        };
    }
  };

  const colors = getColors();
  
  const finalBackgroundColor = backgroundColor || colors.bg;
  const finalTextColor = textColor || colors.text;
  const finalBorderColor = borderColor || colors.border;

  // Size-based styles
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 2,
            paddingHorizontal: 6,
          },
          text: {
            fontSize: mobileFontSizes.xs,
            lineHeight: 14,
          },
          iconSize: 10,
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 6,
            paddingHorizontal: 12,
          },
          text: {
            fontSize: mobileFontSizes.xs,
            lineHeight: 18,
          },
          iconSize: 14,
        };
      default:
        return {
          container: {
            paddingVertical: 4,
            paddingHorizontal: 8,
          },
          text: {
            fontSize: mobileFontSizes.xs,
            lineHeight: 16,
          },
          iconSize: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: finalBackgroundColor,
          borderColor: finalBorderColor,
        },
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={sizeStyles.iconSize}
          color={finalTextColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          sizeStyles.text,
          { color: finalTextColor },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: designTokens.badge.borderRadius,
    borderWidth: 0,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: designTokens.badge.fontWeight,
    textTransform: designTokens.badge.textTransform,
    letterSpacing: designTokens.badge.letterSpacing,
  },
});

export default Badge;

