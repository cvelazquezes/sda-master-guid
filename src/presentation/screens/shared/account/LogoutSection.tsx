import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createLogoutStyles, createStyles } from './styles';
import { ICONS, TOUCH_OPACITY } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type LogoutSectionProps = {
  onLogout: () => void;
  colors: { error: string; textPrimary: string };
  t: (key: string) => string;
};

export function LogoutSection({ onLogout, colors, t }: LogoutSectionProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography, iconSizes } = useTheme();
  const styles = useMemo(
    () => createStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );
  const logoutStyles = useMemo(
    () => createLogoutStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const buttonBg = (colors as Record<string, string>).errorAlpha20 ?? `${colors.error}20`;
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={[logoutStyles.button, { backgroundColor: buttonBg, borderColor: colors.error }]}
        activeOpacity={TOUCH_OPACITY.default}
        accessibilityRole="button"
        accessibilityLabel="Logout"
        onPress={onLogout}
      >
        <MaterialCommunityIcons name={ICONS.LOGOUT} size={iconSizes.md} color={colors.error} />
        <Text style={[logoutStyles.buttonText, { color: colors.textPrimary }]}>
          {t('auth.logout')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
