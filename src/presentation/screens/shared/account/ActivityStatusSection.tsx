import React, { useMemo } from 'react';
import { Switch, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStatusStyles, createStyles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { Card, SectionHeader, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type ActivityStatusSectionProps = {
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

export function ActivityStatusSection({
  isActive,
  loading,
  onToggle,
  colors,
  t,
}: ActivityStatusSectionProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography, iconSizes } = useTheme();
  const styles = useMemo(
    () => createStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );
  const statusStyles = useMemo(
    () => createStatusStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const activeColor = isActive ? colors.success : colors.textTertiary;
  const iconBg = `${activeColor}20`;
  const iconName = isActive ? ICONS.ACCOUNT_CHECK : ICONS.ACCOUNT_OFF;
  const label = isActive ? t('common.active') : t('screens.profile.inactive');
  const desc = isActive
    ? t('screens.profile.activeInActivities')
    : t('screens.profile.notInActivities');

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.account.activityStatus')} />
      <Card variant="elevated">
        <View style={statusStyles.container}>
          <View style={statusStyles.info}>
            <View style={[statusStyles.iconContainer, { backgroundColor: iconBg }]}>
              <MaterialCommunityIcons name={iconName} size={iconSizes.lg} color={activeColor} />
            </View>
            <View style={statusStyles.text}>
              <Text style={[statusStyles.label, { color: colors.textPrimary }]}>{label}</Text>
              <Text style={[statusStyles.description, { color: colors.textSecondary }]}>
                {desc}
              </Text>
            </View>
          </View>
          <Switch
            value={isActive}
            disabled={loading}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.surface}
            accessibilityLabel="Activity status toggle"
            onValueChange={onToggle}
          />
        </View>
      </Card>
    </View>
  );
}
