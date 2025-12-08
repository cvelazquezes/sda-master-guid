import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS, TOUCH_OPACITY } from '../../../shared/constants';
import { styles, logoutStyles } from './styles';

interface LogoutSectionProps {
  onLogout: () => void;
  colors: { error: string };
  t: (key: string) => string;
}

export function LogoutSection({ onLogout, colors, t }: LogoutSectionProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const buttonBg = colors.error + '15';
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={[logoutStyles.button, { backgroundColor: buttonBg, borderColor: colors.error }]}
        onPress={onLogout}
        activeOpacity={TOUCH_OPACITY.default}
      >
        <MaterialCommunityIcons name={ICONS.LOGOUT} size={iconSizes.md} color={colors.error} />
        <Text style={[logoutStyles.buttonText, { color: colors.error }]}>{t('auth.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}
