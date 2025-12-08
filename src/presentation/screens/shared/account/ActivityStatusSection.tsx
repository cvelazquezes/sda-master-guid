import React from 'react';
import { View, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, SectionHeader, Card } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';
import { styles, statusStyles } from './styles';

interface ActivityStatusSectionProps {
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
}

export function ActivityStatusSection({
  isActive,
  loading,
  onToggle,
  colors,
  t,
}: ActivityStatusSectionProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const activeColor = isActive ? colors.success : colors.textTertiary;
  const iconBg = activeColor + '20';
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
            onValueChange={onToggle}
            disabled={loading}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.surface}
          />
        </View>
      </Card>
    </View>
  );
}
