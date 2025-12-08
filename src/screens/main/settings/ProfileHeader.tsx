import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { User, Club } from '../../../types';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS } from '../../../shared/constants';
import { styles } from './styles';

interface ProfileHeaderProps {
  user: User | null;
  club: Club | null;
  isActive: boolean;
  roleConfig: { label: string; icon: string };
  colors: Record<string, string>;
  t: (key: string) => string;
}

export function ProfileHeader({
  user,
  club,
  isActive,
  roleConfig,
  colors,
  t,
}: ProfileHeaderProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';
  const avatarContainerBg = `${colors.textInverse}20`;
  const emailColor = `${colors.textInverse}BB`;
  const badgeBg = `${colors.textInverse}25`;

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <View style={styles.headerContent}>
        <View style={[styles.avatarContainer, { backgroundColor: avatarContainerBg }]}>
          <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{initial}</Text>
          </View>
          {isActive && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.success, borderColor: colors.primary },
              ]}
            />
          )}
        </View>
        <Text style={[styles.userName, { color: colors.textInverse }]}>{user?.name}</Text>
        <Text style={[styles.userEmail, { color: emailColor }]}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: badgeBg }]}>
          <MaterialCommunityIcons
            name={roleConfig.icon as typeof ICONS.ACCOUNT}
            size={iconSizes.sm}
            color={colors.textInverse}
          />
          <Text style={[styles.roleText, { color: colors.textInverse }]}>{roleConfig.label}</Text>
        </View>
        {club && <HeaderStats club={club} isActive={isActive} colors={colors} t={t} />}
      </View>
    </View>
  );
}

interface HeaderStatsProps {
  club: Club;
  isActive: boolean;
  colors: Record<string, string>;
  t: (key: string) => string;
}

function HeaderStats({ club, isActive, colors, t }: HeaderStatsProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const borderColor = `${colors.textInverse}30`;
  const dotBg = `${colors.textInverse}50`;
  const statusColor = isActive ? colors.success : colors.warning;
  const statusText = isActive ? t('common.active') : t('common.paused');

  return (
    <View style={[styles.headerStats, { borderTopColor: borderColor }]}>
      <View style={styles.headerStat}>
        <MaterialCommunityIcons
          name={ICONS.CHURCH}
          size={iconSizes.md}
          color={colors.textInverse}
        />
        <Text style={[styles.headerStatText, { color: colors.textInverse }]}>{club.name}</Text>
      </View>
      <View style={[styles.headerStatDot, { backgroundColor: dotBg }]} />
      <View style={styles.headerStat}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.headerStatText, { color: colors.textInverse }]}>{statusText}</Text>
      </View>
    </View>
  );
}
