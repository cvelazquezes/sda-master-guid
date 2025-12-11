import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettingsStyles } from './useSettingsStyles';
import { ICONS } from '../../../../shared/constants';
import { UserRole } from '../../../../types';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type QuickActionsProps = {
  userRole?: UserRole;
  isActive: boolean;
  onViewProfile: () => void;
  onToggleActive: () => void;
  onLogout: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
};

export function QuickActions({
  userRole,
  isActive,
  onViewProfile,
  onToggleActive,
  onLogout,
  colors,
  t,
}: QuickActionsProps): React.JSX.Element {
  const { quickActionStyles: styles } = useSettingsStyles();
  const activeIconBg = isActive ? `${colors.warning}15` : `${colors.success}15`;
  const activeIconColor = isActive ? colors.warning : colors.success;
  const activeLabel = isActive ? t('common.pause') : t('common.activate');

  return (
    <View style={styles.container}>
      <QuickActionButton
        icon={ICONS.ACCOUNT_CIRCLE}
        iconBg={`${colors.primary}15`}
        iconColor={colors.primary}
        label={t('screens.settings.viewProfile')}
        colors={colors}
        onPress={onViewProfile}
      />
      {userRole !== UserRole.ADMIN && (
        <QuickActionButton
          icon={isActive ? ICONS.PAUSE_CIRCLE : ICONS.PLAY_CIRCLE}
          iconBg={activeIconBg}
          iconColor={activeIconColor}
          label={activeLabel}
          colors={colors}
          onPress={onToggleActive}
        />
      )}
      <QuickActionButton
        icon={ICONS.LOGOUT}
        iconBg={`${colors.error}15`}
        iconColor={colors.error}
        label={t('screens.settings.signOut')}
        colors={colors}
        textColor={colors.error}
        onPress={onLogout}
      />
    </View>
  );
}

type QuickActionButtonProps = {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  onPress: () => void;
  colors: Record<string, string>;
  textColor?: string;
};

function QuickActionButton({
  icon,
  iconBg,
  iconColor,
  label,
  onPress,
  colors,
  textColor,
}: QuickActionButtonProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const { quickActionStyles: styles } = useSettingsStyles();
  const actionStyle = [styles.action, { backgroundColor: colors.surface }];
  const labelColor = textColor || colors.textPrimary;

  return (
    <TouchableOpacity
      style={actionStyle}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.ACCOUNT_CIRCLE}
          size={iconSizes.lg}
          color={iconColor}
        />
      </View>
      <Text style={[styles.actionText, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}
