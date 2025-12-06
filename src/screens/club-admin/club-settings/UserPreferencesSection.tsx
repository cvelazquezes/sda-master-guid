import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../shared/components';
import { ThemeSwitcher } from '../../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { designTokens, mobileTypography } from '../../../shared/theme';

interface UserPreferencesSectionProps {
  title: string;
  colors: { surface: string; textPrimary: string };
}

export function UserPreferencesSection({
  title,
  colors,
}: UserPreferencesSectionProps): React.JSX.Element {
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

const styles = StyleSheet.create({
  section: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.md,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.md,
  },
  preferenceItem: {
    marginBottom: designTokens.spacing.sm,
  },
});
