/**
 * SectionHeader Component
 * Reusable section header with title and optional badge/action
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../theme/mobileTypography';

interface SectionHeaderProps {
  title: string;
  badge?: string | number;
  action?: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  badge,
  action,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        {badge !== undefined && (
          <View style={[styles.badge, { backgroundColor: colors.primaryAlpha10 }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{badge}</Text>
          </View>
        )}
      </View>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
    flex: 1,
  },
  title: {
    ...mobileTypography.heading2,
  },
  badge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: designTokens.borderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...mobileTypography.captionBold,
    fontSize: mobileFontSizes.xs,
  },
  actionContainer: {
    marginLeft: designTokens.spacing.md,
  },
});

export default SectionHeader;
