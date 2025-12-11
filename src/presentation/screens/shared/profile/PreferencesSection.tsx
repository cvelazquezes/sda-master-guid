import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createPreferencesStyles } from './styles';
import { COMPONENT_VARIANT, ICONS, TOUCH_OPACITY } from '../../../../shared/constants';
import { LanguageSwitcher } from '../../../components/features/LanguageSwitcher';
import { ThemeSwitcher } from '../../../components/features/ThemeSwitcher';
import { Card, SectionHeader, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type PreferencesSectionProps = {
  timezone?: string;
  colors: {
    border: string;
    info: string;
    textSecondary: string;
    textPrimary: string;
    textTertiary: string;
  };
  t: (key: string) => string;
};

function TimezoneRow({
  timezone,
  colors,
  t,
  styles,
}: PreferencesSectionProps & {
  styles: ReturnType<typeof createPreferencesStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBg = { backgroundColor: `${colors.info}20` };
  const value = timezone || t('screens.profile.defaultTimezone');

  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={TOUCH_OPACITY.default}
      accessibilityRole="button"
      accessibilityLabel="Timezone preferences"
    >
      <View style={[styles.menuIconContainer, iconBg]}>
        <MaterialCommunityIcons name={ICONS.EARTH} size={iconSizes.lg} color={colors.info} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>
          {t('screens.profile.timezone')}
        </Text>
        <Text style={[styles.menuValue, { color: colors.textPrimary }]}>{value}</Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={iconSizes.lg}
        color={colors.textTertiary}
      />
    </TouchableOpacity>
  );
}

export function PreferencesSection({
  timezone,
  colors,
  t,
}: PreferencesSectionProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createPreferencesStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  return (
    <>
      <View style={styles.section}>
        <SectionHeader title={t('screens.profile.preferences')} />
        <Card variant={COMPONENT_VARIANT.elevated}>
          <View style={styles.settingsContainer}>
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <ThemeSwitcher showLabel />
            </View>
            <View style={styles.settingRow}>
              <LanguageSwitcher showLabel />
            </View>
          </View>
        </Card>
      </View>
      <View style={styles.section}>
        <Card variant={COMPONENT_VARIANT.elevated}>
          <TimezoneRow timezone={timezone} colors={colors} t={t} styles={styles} />
        </Card>
      </View>
    </>
  );
}
