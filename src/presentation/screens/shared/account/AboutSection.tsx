import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStyles } from './styles';
import { APP_VERSION, ICONS, TOUCH_OPACITY } from '../../../../shared/constants';
import { Card, SectionHeader, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type AboutSectionProps = {
  colors: {
    border: string;
    primary: string;
    textTertiary: string;
    textSecondary: string;
    textPrimary: string;
  };
  t: (key: string) => string;
};

export function AboutSection({ colors, t }: AboutSectionProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.account.about')} />
      <Card variant="elevated">
        <View style={styles.detailsContainer}>
          <VersionRow colors={colors} t={t} styles={styles} />
          <PrivacyRow colors={colors} t={t} styles={styles} />
        </View>
      </Card>
    </View>
  );
}

type VersionRowProps = {
  colors: AboutSectionProps['colors'];
  t: (key: string) => string;
  styles: ReturnType<typeof createStyles>;
};

function VersionRow({ colors, t, styles }: VersionRowProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBg = `${colors.textTertiary}20`;
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.INFORMATION_OUTLINE}
          size={iconSizes.md}
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

function PrivacyRow({ colors, t, styles }: VersionRowProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBg = `${colors.primary}20`;
  return (
    <TouchableOpacity
      style={styles.detailRow}
      activeOpacity={TOUCH_OPACITY.default}
      accessibilityRole="button"
      accessibilityLabel="Privacy policy"
    >
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.SHIELD_CHECK_OUTLINE}
          size={iconSizes.md}
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
        size={iconSizes.md}
        color={colors.textTertiary}
      />
    </TouchableOpacity>
  );
}
