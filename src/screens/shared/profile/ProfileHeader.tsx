import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Card } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { User, UserRole } from '../../../types';
import { designTokens } from '../../../shared/theme';
import {
  ICONS,
  COMPONENT_VARIANT,
  TEXT_ALIGN,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../shared/constants';
import { getRoleIcon, getRoleLabel, getRoleColor } from './profileUtils';
import { profileHeaderStyles as styles } from './styles';

interface ProfileHeaderProps {
  user: User | null;
  isActive: boolean;
  colors: { primary: string };
  t: (key: string, options?: Record<string, unknown>) => string;
}

export function ProfileHeader({
  user,
  isActive,
  colors,
  t,
}: ProfileHeaderProps): React.JSX.Element {
  const { colors: themeColors } = useTheme();
  const roleColor = getRoleColor(user?.role, colors.primary);
  const cardStyle = [styles.profileCard, { backgroundColor: roleColor }];

  return (
    <View style={styles.headerSection}>
      <Card variant={COMPONENT_VARIANT.elevated} style={cardStyle}>
        <View style={styles.profileHeader}>
          <AvatarSection roleColor={roleColor} role={user?.role} />
          <Text
            variant={TEXT_VARIANT.H2}
            style={{ color: themeColors.textOnPrimary }}
            align={TEXT_ALIGN.CENTER}
          >
            {user?.name || t('roles.user')}
          </Text>
          <Text
            variant={TEXT_VARIANT.BODY}
            style={{ color: designTokens.overlay.lightStrong }}
            align={TEXT_ALIGN.CENTER}
          >
            {user?.email || t('screens.account.defaultEmail')}
          </Text>
          <RoleBadge role={user?.role} t={t} />
          {user?.role !== UserRole.ADMIN && <StatsRow user={user} isActive={isActive} t={t} />}
        </View>
      </Card>
    </View>
  );
}

function AvatarSection({
  roleColor,
  role,
}: {
  roleColor: string;
  role: UserRole | undefined;
}): React.JSX.Element {
  return (
    <View style={styles.avatarWrapper}>
      <View style={[styles.avatarOuter, { backgroundColor: designTokens.overlay.light }]}>
        <View style={[styles.avatarInner, { backgroundColor: designTokens.overlay.lightStrong }]}>
          <MaterialCommunityIcons
            name={getRoleIcon(role)}
            size={designTokens.iconSize['3xl']}
            color={roleColor}
          />
        </View>
      </View>
    </View>
  );
}

function RoleBadge({
  role,
  t,
}: {
  role: UserRole | undefined;
  t: (key: string) => string;
}): React.JSX.Element {
  const { colors: themeColors } = useTheme();
  return (
    <View style={styles.roleBadge}>
      <MaterialCommunityIcons
        name={getRoleIcon(role)}
        size={designTokens.iconSize.xs}
        color={designTokens.overlay.lightStrong}
      />
      <Text
        variant={TEXT_VARIANT.CAPTION}
        weight={TEXT_WEIGHT.BOLD}
        style={{ color: themeColors.textOnPrimary }}
      >
        {getRoleLabel(role, t)}
      </Text>
    </View>
  );
}

function StatsRow({
  user,
  isActive,
  t,
}: {
  user: User | null;
  isActive: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
}): React.JSX.Element {
  const statusText = isActive ? t('common.active') : t('screens.profile.inactive');
  const hasClasses = user?.classes && user.classes.length > 0;
  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <MaterialCommunityIcons
          name={ICONS.CHECK_CIRCLE}
          size={designTokens.iconSize.md}
          color={designTokens.overlay.lightStrong}
        />
        <Text style={styles.statText}>{statusText}</Text>
      </View>
      {hasClasses && (
        <>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name={ICONS.SCHOOL}
              size={designTokens.iconSize.md}
              color={designTokens.overlay.lightStrong}
            />
            <Text style={styles.statText}>
              {t('screens.profile.classCount', { count: user.classes.length })}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
