/**
 * StatCard Component
 * Displays statistics in a card format
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { mobileTypography, mobileIconSizes, mobileFontSizes } from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  onPress?: () => void;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  onPress,
  subtitle,
}) => {
  const { colors, isDark } = useTheme();

  const CardContent = (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOpacity: isDark ? 0.4 : 0.2,
        elevation: isDark ? 8 : 5,
      },
      onPress && styles.cardTouchable
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon as any} size={mobileIconSizes.xlarge} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{subtitle}</Text>}
      </View>
      {onPress && (
        <MaterialCommunityIcons name="chevron-right" size={mobileIconSizes.large} color={colors.textTertiary} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.touchable}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touchable}>{CardContent}</View>;
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  card: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
    // Shadow properties are applied via inline styles for theme-awareness
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  cardTouchable: {
    // Add visual hint for touchable cards
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  value: {
    ...mobileTypography.displaySmall,
    fontSize: mobileFontSizes['3xl'],
    marginBottom: 4,
  },
  label: {
    ...mobileTypography.labelBold,
  },
  subtitle: {
    ...mobileTypography.caption,
    marginTop: 4,
  },
});
