/**
 * ScreenHeader Component
 * Standard header for screens with title and subtitle
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { mobileTypography } from '../theme/mobileTypography';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  children,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        style
      ]} 
      testID={testID}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  textContainer: {
    marginBottom: designTokens.spacing.sm,
  },
  title: {
    ...mobileTypography.displayMedium,
  },
  subtitle: {
    ...mobileTypography.bodyLarge,
    marginTop: 4,
  },
});

export default ScreenHeader;
