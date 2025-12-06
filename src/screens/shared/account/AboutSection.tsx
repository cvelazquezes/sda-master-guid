import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, SectionHeader, Card } from '../../../shared/components';
import { designTokens } from '../../../shared/theme';
import { ICONS, APP_VERSION, TOUCH_OPACITY } from '../../../shared/constants';
import { styles } from './styles';

interface AboutSectionProps {
  colors: {
    border: string;
    primary: string;
    textTertiary: string;
    textSecondary: string;
    textPrimary: string;
  };
  t: (key: string) => string;
}

export function AboutSection({ colors, t }: AboutSectionProps): React.JSX.Element {
  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.account.about')} />
      <Card variant="elevated">
        <View style={styles.detailsContainer}>
          <VersionRow colors={colors} t={t} />
          <PrivacyRow colors={colors} t={t} />
        </View>
      </Card>
    </View>
  );
}

function VersionRow({ colors, t }: AboutSectionProps): React.JSX.Element {
  const iconBg = colors.textTertiary + '20';
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.INFORMATION_OUTLINE}
          size={designTokens.iconSize.md}
          color={colors.textTertiary}
        />
      </View>
      <View style={styles.detailText}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {t('screens.account.appVersion')}
        </Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{APP_VERSION}</Text>
      </View>
    </View>
  );
}

function PrivacyRow({ colors, t }: AboutSectionProps): React.JSX.Element {
  const iconBg = colors.primary + '20';
  return (
    <TouchableOpacity style={styles.detailRow} activeOpacity={TOUCH_OPACITY.default}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.SHIELD_CHECK_OUTLINE}
          size={designTokens.iconSize.md}
          color={colors.primary}
        />
      </View>
      <View style={styles.detailText}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {t('screens.account.privacy')}
        </Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
          {t('screens.account.privacyPolicy')}
        </Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={designTokens.iconSize.md}
        color={colors.textTertiary}
      />
    </TouchableOpacity>
  );
}
