import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getRoleColor, getRoleIcon, getRoleLabel } from './profileUtils';
import { createProfileHeaderStyles } from './styles';
import {
  COMPONENT_VARIANT,
  ICONS,
  TEXT_ALIGN,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../../shared/constants';
import { UserRole, type User } from '../../../../types';
import { Card, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type ProfileHeaderProps = {
  user: User | null;
  isActive: boolean;
  colors: { primary: string };
  t: (key: string, options?: Record<string, unknown>) => string;
};

export function ProfileHeader({
  user,
  isActive,
  colors,
  t,
}: ProfileHeaderProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createProfileHeaderStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );
  const roleColor = getRoleColor(user?.role, colors.primary);
  const cardStyle = [styles.profileCard, { backgroundColor: roleColor }];
  const overlayLightStrong = 'rgba(255, 255, 255, 0.8)';

  return (
    <View style={styles.headerSection}>
      <Card variant={COMPONENT_VARIANT.elevated} style={cardStyle}>
        <View style={styles.profileHeader}>
          <AvatarSection roleColor={roleColor} role={user?.role} styles={styles} />
          <Text
            variant={TEXT_VARIANT.H2}
            style={{ color: themeColors.textOnPrimary }}
            align={TEXT_ALIGN.CENTER}
          >
            {user?.name || t('roles.user')}
          </Text>
          <Text
            variant={TEXT_VARIANT.BODY}
            style={{ color: overlayLightStrong }}
            align={TEXT_ALIGN.CENTER}
          >
            {user?.email || t('screens.account.defaultEmail')}
          </Text>
          <RoleBadge role={user?.role} t={t} styles={styles} />
          {user?.role !== UserRole.ADMIN && (
            <StatsRow user={user} isActive={isActive} t={t} styles={styles} />
          )}
        </View>
      </Card>
    </View>
  );
}

function AvatarSection({
  roleColor,
  role,
  styles,
}: {
  roleColor: string;
  role: UserRole | undefined;
  styles: ReturnType<typeof createProfileHeaderStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const overlayLight = 'rgba(255, 255, 255, 0.2)';
  const overlayLightStrong = 'rgba(255, 255, 255, 0.8)';
  return (
    <View style={styles.avatarWrapper}>
      <View style={[styles.avatarOuter, { backgroundColor: overlayLight }]}>
        <View style={[styles.avatarInner, { backgroundColor: overlayLightStrong }]}>
          <MaterialCommunityIcons
            name={getRoleIcon(role)}
            size={iconSizes['3xl']}
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
  styles,
}: {
  role: UserRole | undefined;
  t: (key: string) => string;
  styles: ReturnType<typeof createProfileHeaderStyles>;
}): React.JSX.Element {
  const { colors: themeColors, iconSizes } = useTheme();
  const overlayLightStrong = 'rgba(255, 255, 255, 0.8)';
  return (
    <View style={styles.roleBadge}>
      <MaterialCommunityIcons
        name={getRoleIcon(role)}
        size={iconSizes.xs}
        color={overlayLightStrong}
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
  styles,
}: {
  user: User | null;
  isActive: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
  styles: ReturnType<typeof createProfileHeaderStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const overlayLightStrong = 'rgba(255, 255, 255, 0.8)';
  const statusText = isActive ? t('common.active') : t('screens.profile.inactive');
  const hasClasses = user?.classes && user.classes.length > 0;
  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <MaterialCommunityIcons
          name={ICONS.CHECK_CIRCLE}
          size={iconSizes.md}
          color={overlayLightStrong}
        />
        <Text style={styles.statText}>{statusText}</Text>
      </View>
      {hasClasses && (
        <>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name={ICONS.SCHOOL}
              size={iconSizes.md}
              color={overlayLightStrong}
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
