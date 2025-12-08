import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, IconButton } from '../../../components/primitives';
import { User } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';
import {
  ICONS,
  TEXT_LINES,
  COMPONENT_SIZE,
  MATH,
  LIST_SEPARATOR,
  ELLIPSIS,
  EMPTY_VALUE,
} from '../../../../shared/constants';
import { createPendingCardStyles } from './styles';

interface PendingMemberCardProps {
  member: User;
  onApprove: (memberId: string, memberName: string) => void;
  onReject: (memberId: string, memberName: string) => void;
  labels: { pending: string; reject: string; approve: string };
}

interface MetaItemProps {
  icon: string;
  color: string;
  children: string;
}

function MetaItem({ icon, color, children }: MetaItemProps): React.JSX.Element {
  const { spacing, typography, colors, iconSizes } = useTheme();
  const containerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xxs,
  };
  const textStyle = {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  };
  return (
    <View style={containerStyle}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.WHATSAPP}
        size={iconSizes.xs}
        color={color}
      />
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}

function PendingAvatar({
  initial,
  styles,
}: {
  initial: string;
  styles: ReturnType<typeof createPendingCardStyles>;
}): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initial}</Text>
      <View style={styles.badge}>
        <MaterialCommunityIcons name={ICONS.CLOCK} size={iconSizes.xxs} color={colors.warning} />
      </View>
    </View>
  );
}

interface PendingInfoProps {
  member: User;
  classesText: string | null;
  labels: PendingMemberCardProps['labels'];
  styles: ReturnType<typeof createPendingCardStyles>;
}

function PendingInfo({ member, classesText, labels, styles }: PendingInfoProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={styles.info}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={TEXT_LINES.single}>
          {member.name}
        </Text>
        <View style={styles.statusBadge}>
          <MaterialCommunityIcons
            name={ICONS.CLOCK_ALERT_OUTLINE}
            size={iconSizes.xs}
            color={colors.warning}
          />
          <Text style={styles.statusText}>{labels.pending}</Text>
        </View>
      </View>
      <Text style={styles.email} numberOfLines={TEXT_LINES.single}>
        {member.email}
      </Text>
      <View style={styles.detailsRow}>
        {member.whatsappNumber && (
          <MetaItem icon={ICONS.WHATSAPP} color={colors.success}>
            {member.whatsappNumber}
          </MetaItem>
        )}
        {classesText && (
          <MetaItem icon={ICONS.SCHOOL} color={colors.primary}>
            {classesText}
          </MetaItem>
        )}
      </View>
    </View>
  );
}

export function PendingMemberCard({
  member,
  onApprove,
  onReject,
  labels,
}: PendingMemberCardProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createPendingCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const initial = member.name.charAt(0).toUpperCase();
  const hasClasses = member.classes && member.classes.length > 0;
  const classesText = hasClasses
    ? member.classes.slice(0, MATH.HALF).join(LIST_SEPARATOR) +
      (member.classes.length > MATH.HALF ? ELLIPSIS : EMPTY_VALUE)
    : null;

  return (
    <View style={styles.card}>
      <PendingAvatar initial={initial} styles={styles} />
      <PendingInfo member={member} classesText={classesText} labels={labels} styles={styles} />
      <View style={styles.actionsContainer}>
        <IconButton
          icon={ICONS.CLOSE_CIRCLE}
          onPress={(): void => onReject(member.id, member.name)}
          size={COMPONENT_SIZE.md}
          color={colors.textInverse}
          style={styles.rejectButton}
          accessibilityLabel={labels.reject}
        />
        <IconButton
          icon={ICONS.CHECK_CIRCLE}
          onPress={(): void => onApprove(member.id, member.name)}
          size={COMPONENT_SIZE.md}
          color={colors.textInverse}
          style={styles.approveButton}
          accessibilityLabel={labels.approve}
        />
      </View>
    </View>
  );
}
