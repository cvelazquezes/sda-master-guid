import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStyles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { LanguageSwitcher } from '../../../components/features/LanguageSwitcher';
import { ThemeSwitcher } from '../../../components/features/ThemeSwitcher';
import { Card, SectionHeader, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type PreferencesSectionProps = {
  timezone?: string;
  colors: { border: string; info: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
};

export function PreferencesSection({
  timezone,
  colors,
  t,
}: PreferencesSectionProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography, iconSizes } = useTheme();
  const styles = useMemo(
    () => createStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );
  const iconBg = `${colors.info}20`;
  const displayTimezone = timezone || t('screens.profile.defaultTimezone');

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.account.preferences')} />
      <Card variant="elevated">
        <View style={styles.detailsContainer}>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
              <MaterialCommunityIcons name={ICONS.EARTH} size={iconSizes.md} color={colors.info} />
            </View>
            <View style={styles.detailText}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                {t('screens.account.timezone')}
              </Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                {displayTimezone}
              </Text>
            </View>
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <ThemeSwitcher showLabel />
          </View>
          <View style={styles.settingRow}>
            <LanguageSwitcher showLabel />
          </View>
        </View>
      </Card>
    </View>
  );
}
