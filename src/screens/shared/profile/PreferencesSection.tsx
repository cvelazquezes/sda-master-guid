import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Card, SectionHeader } from '../../../shared/components';
import { ThemeSwitcher } from '../../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { designTokens } from '../../../shared/theme';
import { ICONS, COMPONENT_VARIANT, TOUCH_OPACITY } from '../../../shared/constants';
import { preferencesStyles as styles } from './styles';

interface PreferencesSectionProps {
  timezone?: string;
  colors: {
    border: string;
    info: string;
    textSecondary: string;
    textPrimary: string;
    textTertiary: string;
  };
  t: (key: string) => string;
}

function TimezoneRow({ timezone, colors, t }: PreferencesSectionProps): React.JSX.Element {
  const iconBg = { backgroundColor: colors.info + '20' };
  const value = timezone || t('screens.profile.defaultTimezone');

  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={TOUCH_OPACITY.default}>
      <View style={[styles.menuIconContainer, iconBg]}>
        <MaterialCommunityIcons
          name={ICONS.EARTH}
          size={designTokens.iconSize.lg}
          color={colors.info}
        />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>
          {t('screens.profile.timezone')}
        </Text>
        <Text style={[styles.menuValue, { color: colors.textPrimary }]}>{value}</Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={designTokens.iconSize.lg}
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
          <TimezoneRow timezone={timezone} colors={colors} t={t} />
        </Card>
      </View>
    </>
  );
}
