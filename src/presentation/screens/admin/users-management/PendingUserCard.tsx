import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createPendingStyles } from './styles';
import {
  ICONS,
  TEXT_LINES,
  COMPONENT_SIZE,
  LIST_SEPARATOR,
  ELLIPSIS,
  EMPTY_VALUE,
} from '../../../../shared/constants';
import { MATH } from '../../../../shared/constants/numbers';
import { type User, type Club, UserRole } from '../../../../types';
import { Text, IconButton } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type PendingUserCardProps = {
  user: User;
  clubs: Club[];
  onApprove: (userId: string, userName: string, userRole: UserRole) => void;
  onReject: (userId: string, userName: string) => void;
  colors: {
    warning: string;
    warningAlpha10: string;
    warningAlpha20: string;
    textInverse: string;
    primary: string;
    success: string;
    textPrimary: string;
    textSecondary: string;
    error: string;
  };
  t: (key: string) => string;
};

function getClubName(clubId: string | null, clubs: Club[], t: (k: string) => string): string {
  if (!clubId) {
    return t('screens.usersManagement.noClub');
  }
  return clubs.find((c) => c.id === clubId)?.name ?? t('screens.usersManagement.unknownClub');
}

export function PendingUserCard({
  user,
  clubs,
  onApprove,
  onReject,
  colors,
  t,
}: PendingUserCardProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const pendingStyles = useMemo(
    () => createPendingStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const cardStyle = [
    pendingStyles.card,
    { backgroundColor: colors.warningAlpha10, borderColor: colors.warning },
  ];
  return (
    <View style={cardStyle}>
      <PendingAvatar name={user.name} colors={colors} pendingStyles={pendingStyles} />
      <PendingInfo user={user} clubs={clubs} colors={colors} t={t} pendingStyles={pendingStyles} />
      <PendingActions
        user={user}
        colors={colors}
        t={t}
        pendingStyles={pendingStyles}
        onApprove={onApprove}
        onReject={onReject}
      />
    </View>
  );
}

function PendingAvatar({
  name,
  colors,
  pendingStyles,
}: {
  name: string;
  colors: PendingUserCardProps['colors'];
  pendingStyles: ReturnType<typeof createPendingStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[pendingStyles.avatar, { backgroundColor: colors.warningAlpha20 }]}>
      <Text style={[pendingStyles.avatarText, { color: colors.warning }]}>
        {name.charAt(0).toUpperCase()}
      </Text>
      <View style={[pendingStyles.badge, { backgroundColor: colors.warning }]}>
        <MaterialCommunityIcons
          name={ICONS.CLOCK}
          size={iconSizes.xxs}
          color={colors.textInverse}
        />
      </View>
    </View>
  );
}

function PendingInfo({
  user,
  clubs,
  colors,
  t,
  pendingStyles,
}: Omit<PendingUserCardProps, 'onApprove' | 'onReject'> & {
  pendingStyles: ReturnType<typeof createPendingStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const isClubAdmin = user.role === UserRole.CLUB_ADMIN;
  const statusIcon = isClubAdmin ? ICONS.SHIELD_ACCOUNT : ICONS.CLOCK_ALERT_OUTLINE;
  const statusLabel = isClubAdmin
    ? t('screens.usersManagement.clubAdminLabel')
    : t('screens.usersManagement.pendingLabel');

  return (
    <View style={pendingStyles.userInfo}>
      <View style={pendingStyles.header}>
        <Text
          style={[pendingStyles.userName, { color: colors.textPrimary }]}
          numberOfLines={TEXT_LINES.single}
        >
          {user.name}
        </Text>
        <View style={pendingStyles.statusBadge}>
          <MaterialCommunityIcons name={statusIcon} size={iconSizes.xs} color={colors.warning} />
          <Text style={pendingStyles.statusText}>{statusLabel}</Text>
        </View>
      </View>
      <Text
        style={[pendingStyles.userEmail, { color: colors.textSecondary }]}
        numberOfLines={TEXT_LINES.single}
      >
        {user.email}
      </Text>
      <MetaDetails user={user} clubs={clubs} colors={colors} t={t} pendingStyles={pendingStyles} />
    </View>
  );
}

function MetaDetails({
  user,
  clubs,
  colors,
  t,
  pendingStyles,
}: Omit<PendingUserCardProps, 'onApprove' | 'onReject'> & {
  pendingStyles: ReturnType<typeof createPendingStyles>;
}): React.JSX.Element {
  const classesText =
    user.classes && user.classes.length > 0
      ? user.classes.slice(0, MATH.HALF).join(LIST_SEPARATOR) +
        (user.classes.length > MATH.HALF ? ELLIPSIS : EMPTY_VALUE)
      : null;

  return (
    <View style={pendingStyles.detailsRow}>
      <MetaItem
        icon={ICONS.DOMAIN}
        color={colors.primary}
        text={getClubName(user.clubId, clubs, t)}
        textColor={colors.textSecondary}
        pendingStyles={pendingStyles}
      />
      {user.whatsappNumber && (
        <MetaItem
          icon={ICONS.WHATSAPP}
          color={colors.success}
          text={user.whatsappNumber}
          textColor={colors.textSecondary}
          pendingStyles={pendingStyles}
        />
      )}
      {classesText && (
        <MetaItem
          icon={ICONS.SCHOOL}
          color={colors.primary}
          text={classesText}
          textColor={colors.textSecondary}
          pendingStyles={pendingStyles}
        />
      )}
    </View>
  );
}

function MetaItem({
  icon,
  color,
  text,
  textColor,
  pendingStyles,
}: {
  icon: string;
  color: string;
  text: string;
  textColor: string;
  pendingStyles: ReturnType<typeof createPendingStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={pendingStyles.metaItem}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.DOMAIN}
        size={iconSizes.xs}
        color={color}
      />
      <Text
        style={[pendingStyles.metaText, { color: textColor }]}
        numberOfLines={TEXT_LINES.single}
      >
        {text}
      </Text>
    </View>
  );
}

function PendingActions({
  user,
  onApprove,
  onReject,
  colors,
  t,
  pendingStyles,
}: Omit<PendingUserCardProps, 'clubs'> & {
  pendingStyles: ReturnType<typeof createPendingStyles>;
}): React.JSX.Element {
  return (
    <View style={pendingStyles.actionsContainer}>
      <IconButton
        icon={ICONS.CLOSE_CIRCLE}
        size={COMPONENT_SIZE.md}
        color={colors.textInverse}
        style={[pendingStyles.rejectButton, { backgroundColor: colors.error }]}
        accessibilityLabel={t('screens.usersManagement.rejectUser')}
        onPress={(): void => onReject(user.id, user.name)}
      />
      <IconButton
        icon={ICONS.CHECK_CIRCLE}
        size={COMPONENT_SIZE.md}
        color={colors.textInverse}
        style={pendingStyles.approveButton}
        accessibilityLabel={t('screens.usersManagement.approveUser')}
        onPress={(): void => onApprove(user.id, user.name, user.role)}
      />
    </View>
  );
}
