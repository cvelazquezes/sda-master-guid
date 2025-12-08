import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Card } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { createStyles } from './styles';

interface ProfileHeaderProps {
  name: string;
  email: string;
  roleLabel: string;
  roleIcon: string;
  roleColor: string;
  colors: { textPrimary: string; textSecondary: string };
  t: (key: string) => string;
}

export function ProfileHeader({
  name,
  email,
  roleLabel,
  roleIcon,
  roleColor,
  colors,
  t,
}: ProfileHeaderProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography, iconSizes } = useTheme();
  const styles = useMemo(
    () => createStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  return (
    <View style={styles.section}>
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: roleColor + '20' }]}>
            <MaterialCommunityIcons
              name={roleIcon as typeof MaterialCommunityIcons.glyphMap.account}
              size={iconSizes.xxl}
              color={roleColor}
            />
          </View>
          <Text style={[styles.profileName, { color: colors.textPrimary }]}>
            {name || t('roles.user')}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            {email || t('screens.account.defaultEmail')}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}>
            <MaterialCommunityIcons
              name={roleIcon as typeof MaterialCommunityIcons.glyphMap.account}
              size={iconSizes.sm}
              color={roleColor}
            />
            <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}
