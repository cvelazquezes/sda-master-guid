import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../../../components/primitives';
import { ThemeSwitcher } from '../../../components/features/ThemeSwitcher';
import { LanguageSwitcher } from '../../../components/features/LanguageSwitcher';
import { useTheme } from '../../../state/ThemeContext';

interface UserPreferencesSectionProps {
  title: string;
  colors: { surface: string; textPrimary: string };
}

export function UserPreferencesSection({
  title,
  colors,
}: UserPreferencesSectionProps): React.JSX.Element {
  const { spacing, radii, typography } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          padding: spacing.lg,
          borderRadius: radii.md,
          marginBottom: spacing.md,
        } as ViewStyle,
        sectionTitle: {
          fontSize: typography.fontSizes.lg,
          fontWeight: typography.fontWeights.bold,
          marginBottom: spacing.md,
        } as TextStyle,
        preferenceItem: {
          marginBottom: spacing.sm,
        } as ViewStyle,
      }),
    [spacing, radii, typography]
  );

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      <View style={styles.preferenceItem}>
        <ThemeSwitcher showLabel />
      </View>
      <View style={styles.preferenceItem}>
        <LanguageSwitcher showLabel />
      </View>
    </View>
  );
}
