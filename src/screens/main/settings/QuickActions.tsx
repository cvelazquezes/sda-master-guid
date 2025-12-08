import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { UserRole } from '../../../types';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS } from '../../../shared/constants';
import { quickActionStyles as styles } from './styles';

interface QuickActionsProps {
  userRole?: UserRole;
  isActive: boolean;
  onViewProfile: () => void;
  onToggleActive: () => void;
  onLogout: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}

export function QuickActions({
  userRole,
  isActive,
  onViewProfile,
  onToggleActive,
  onLogout,
  colors,
  t,
}: QuickActionsProps): React.JSX.Element {
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
        onPress={onViewProfile}
        colors={colors}
      />
      {userRole !== UserRole.ADMIN && (
        <QuickActionButton
          icon={isActive ? ICONS.PAUSE_CIRCLE : ICONS.PLAY_CIRCLE}
          iconBg={activeIconBg}
          iconColor={activeIconColor}
          label={activeLabel}
          onPress={onToggleActive}
          colors={colors}
        />
      )}
      <QuickActionButton
        icon={ICONS.LOGOUT}
        iconBg={`${colors.error}15`}
        iconColor={colors.error}
        label={t('screens.settings.signOut')}
        onPress={onLogout}
        colors={colors}
        textColor={colors.error}
      />
    </View>
  );
}

interface QuickActionButtonProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  onPress: () => void;
  colors: Record<string, string>;
  textColor?: string;
}

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
  const actionStyle = [styles.action, { backgroundColor: colors.surface }];
  const labelColor = textColor || colors.textPrimary;

  return (
    <TouchableOpacity style={actionStyle} onPress={onPress}>
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
