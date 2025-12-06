import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Card } from '../../../shared/components';
import { designTokens } from '../../../shared/theme';
import { styles } from './styles';

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
  return (
    <View style={styles.section}>
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: roleColor + '20' }]}>
            <MaterialCommunityIcons
              name={roleIcon as typeof MaterialCommunityIcons.glyphMap.account}
              size={designTokens.iconSize.xxl}
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
              size={designTokens.iconSize.sm}
              color={roleColor}
            />
            <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}
