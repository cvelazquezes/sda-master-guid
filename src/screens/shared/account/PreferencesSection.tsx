import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, SectionHeader, Card } from '../../../shared/components';
import { ThemeSwitcher } from '../../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { designTokens } from '../../../shared/theme';
import { ICONS } from '../../../shared/constants';
import { styles } from './styles';

interface PreferencesSectionProps {
  timezone?: string;
  colors: { border: string; info: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
}

export function PreferencesSection({
  timezone,
  colors,
  t,
}: PreferencesSectionProps): React.JSX.Element {
  const iconBg = colors.info + '20';
  const displayTimezone = timezone || t('screens.profile.defaultTimezone');

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.account.preferences')} />
      <Card variant="elevated">
        <View style={styles.detailsContainer}>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
              <MaterialCommunityIcons
                name={ICONS.EARTH}
                size={designTokens.iconSize.md}
                color={colors.info}
              />
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
