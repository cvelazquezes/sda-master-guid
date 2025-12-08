import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS, IconName, TOUCH_OPACITY } from '../../../shared/constants';
import { menuItemStyles as styles } from './styles';

interface MenuColors {
  border: string;
  error: string;
  primary: string;
  textPrimary: string;
  textTertiary: string;
}

interface MenuItemProps {
  icon: IconName;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
  colors: MenuColors;
  noBorder?: boolean;
}

interface MenuItemColors {
  iconBg: string;
  iconColor: string;
  titleColor: string;
}

function getColors(danger: boolean, colors: MenuColors): MenuItemColors {
  const color = danger ? colors.error : colors.primary;
  return {
    iconBg: `${color}15`,
    iconColor: color,
    titleColor: danger ? colors.error : colors.textPrimary,
  };
}

export function MenuItem({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  rightComponent,
  onPress,
  showChevron = true,
  danger = false,
  colors,
  noBorder = false,
}: MenuItemProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const defaults = getColors(danger, colors);
  const borderStyle = noBorder ? { borderBottomWidth: 0 } : undefined;
  const hasInteraction = Boolean(onPress || rightComponent);

  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }, borderStyle]}
      onPress={onPress}
      disabled={!hasInteraction}
      activeOpacity={onPress ? TOUCH_OPACITY.default : 1}
    >
      <View style={[styles.menuIcon, { backgroundColor: iconBg ?? defaults.iconBg }]}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK}
          size={iconSizes.md}
          color={iconColor ?? defaults.iconColor}
        />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: defaults.titleColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
        )}
      </View>
      {rightComponent}
      {showChevron && onPress && (
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_RIGHT}
          size={iconSizes.lg}
          color={colors.textTertiary}
        />
      )}
    </TouchableOpacity>
  );
}
