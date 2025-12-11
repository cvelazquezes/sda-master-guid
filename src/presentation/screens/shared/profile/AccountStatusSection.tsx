import React, { useMemo } from 'react';
import { Switch, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createAccountStatusStyles } from './styles';
import { COMPONENT_VARIANT, ICONS, OPACITY_HEX } from '../../../../shared/constants';
import { Card, SectionHeader, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type AccountStatusSectionProps = {
  isActive: boolean;
  loading: boolean;
  onToggle: (value: boolean) => void;
  colors: {
    success: string;
    textTertiary: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    surface: string;
  };
  t: (key: string) => string;
};

function StatusIcon({
  isActive,
  colors,
  styles,
}: {
  isActive: boolean;
  colors: { success: string; textTertiary: string };
  styles: ReturnType<typeof createAccountStatusStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBgColor = isActive
    ? `${colors.success}${OPACITY_HEX.LIGHT}`
    : `${colors.textTertiary}${OPACITY_HEX.LIGHT}`;
  const iconColor = isActive ? colors.success : colors.textTertiary;
  const iconName = isActive ? ICONS.ACCOUNT_CHECK : ICONS.ACCOUNT_OFF;

  return (
    <View style={[styles.statusIconContainer, { backgroundColor: iconBgColor }]}>
      <MaterialCommunityIcons name={iconName} size={iconSizes.lg} color={iconColor} />
    </View>
  );
}

export function AccountStatusSection({
  isActive,
  loading,
  onToggle,
  colors,
  t,
}: AccountStatusSectionProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createAccountStatusStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const statusLabel = isActive
    ? t('screens.profile.participating')
    : t('screens.profile.notParticipating');
  const statusDesc = isActive
    ? t('screens.profile.activeInActivities')
    : t('screens.profile.notInActivities');

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.profile.activityStatus')} />
      <Card variant={COMPONENT_VARIANT.elevated}>
        <View style={styles.statusContainer}>
          <View style={styles.statusInfo}>
            <StatusIcon isActive={isActive} colors={colors} styles={styles} />
            <View style={styles.statusText}>
              <Text style={[styles.statusLabel, { color: colors.textPrimary }]}>{statusLabel}</Text>
              <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                {statusDesc}
              </Text>
            </View>
          </View>
          <Switch
            value={isActive}
            disabled={loading}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.surface}
            accessibilityLabel="Account status toggle"
            onValueChange={onToggle}
          />
        </View>
      </Card>
    </View>
  );
}
