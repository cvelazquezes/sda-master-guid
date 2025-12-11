import React, { useMemo } from 'react';
import { View } from 'react-native';
import { createUserPreferencesStyles } from './styles';
import { LanguageSwitcher } from '../../../components/features/LanguageSwitcher';
import { ThemeSwitcher } from '../../../components/features/ThemeSwitcher';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type UserPreferencesSectionProps = {
  title: string;
  colors: { surface: string; textPrimary: string };
};

export function UserPreferencesSection({
  title,
  colors,
}: UserPreferencesSectionProps): React.JSX.Element {
  const { spacing, radii, typography } = useTheme();

  const styles = useMemo(
    () => createUserPreferencesStyles(spacing, radii, typography),
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
