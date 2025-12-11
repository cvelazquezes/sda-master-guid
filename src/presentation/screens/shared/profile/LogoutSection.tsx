import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createLogoutStyles } from './styles';
import { ICONS, TOUCH_OPACITY } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type LogoutSectionProps = {
  onLogout: () => void;
  colors: { error: string };
  labels: { signOut: string; appName: string; version: string };
};

export function LogoutSection({ onLogout, colors, labels }: LogoutSectionProps): React.JSX.Element {
  const { iconSizes, colors: themeColors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createLogoutStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );
  const buttonStyle = [
    styles.logoutButton,
    { backgroundColor: `${colors.error}12`, borderColor: colors.error },
  ];

  return (
    <>
      <View style={styles.section}>
        <TouchableOpacity
          style={buttonStyle}
          activeOpacity={TOUCH_OPACITY.default}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={onLogout}
        >
          <MaterialCommunityIcons name={ICONS.LOGOUT} size={iconSizes.lg} color={colors.error} />
          <Text style={[styles.logoutButtonText, { color: colors.error }]}>{labels.signOut}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.versionSection}>
        <Text style={[styles.versionText, { color: themeColors.textTertiary }]}>
          {labels.appName} • {labels.version}
        </Text>
      </View>
    </>
  );
}
