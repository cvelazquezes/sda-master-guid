import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStyles } from './styles';
import { DATE_LOCALE_OPTIONS, ICONS } from '../../../../shared/constants';
import { ApprovalStatus, type Club } from '../../../../types';
import { Card, SectionHeader, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type ClubMembershipSectionProps = {
  club: Club | null;
  classes?: string[];
  createdAt?: string;
  approvalStatus?: string;
  approvalLabel: string;
  approvalColor: string;
  colors: {
    border: string;
    primary: string;
    info: string;
    textSecondary: string;
    textPrimary: string;
    textTertiary: string;
  };
  t: (key: string) => string;
};

export function ClubMembershipSection({
  club,
  classes,
  createdAt,
  approvalStatus,
  approvalLabel,
  approvalColor,
  colors,
  t,
}: ClubMembershipSectionProps): React.JSX.Element {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const formatDate = (ds: string | undefined): string => {
    if (!ds) {
      return t('common.notAvailable');
    }
    return new Date(ds).toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.LONG_DATE);
  };

  const getStatusIcon = (): string => {
    if (approvalStatus === ApprovalStatus.APPROVED) {
      return ICONS.CHECK_CIRCLE;
    }
    if (approvalStatus === ApprovalStatus.PENDING) {
      return ICONS.CLOCK_OUTLINE;
    }
    return ICONS.CLOSE_CIRCLE;
  };

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.account.clubMembership')} />
      <Card variant="elevated">
        <View style={styles.detailsContainer}>
          <ClubRow club={club} colors={colors} t={t} styles={styles} />
          {classes && classes.length > 0 && (
            <ClassesRow classes={classes} colors={colors} t={t} styles={styles} />
          )}
          <MemberSinceRow date={formatDate(createdAt)} colors={colors} t={t} styles={styles} />
          <StatusRow
            icon={getStatusIcon()}
            label={approvalLabel}
            color={approvalColor}
            colors={colors}
            t={t}
            styles={styles}
          />
        </View>
      </Card>
    </View>
  );
}

type ClubRowProps = {
  club: Club | null;
  colors: { border: string; primary: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
  styles: ReturnType<typeof createStyles>;
};

function ClubRow({ club, colors, t, styles }: ClubRowProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBg = `${colors.primary}20`;
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_GROUP}
          size={iconSizes.md}
          color={colors.primary}
        />
      </View>
      <View style={styles.detailText}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {t('screens.account.club')}
        </Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
          {club?.name || t('common.loading')}
        </Text>
      </View>
    </View>
  );
}

type ClassesRowProps = {
  classes: string[];
  colors: {
    border: string;
    info: string;
    primary: string;
    textSecondary: string;
    textPrimary: string;
  };
  t: (key: string) => string;
  styles: ReturnType<typeof createStyles>;
};

function ClassesRow({ classes, colors, t, styles }: ClassesRowProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBg = `${colors.info}20`;
  const badgeBg = (colors as Record<string, string>).primaryAlpha20 ?? `${colors.primary}20`;
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={ICONS.SCHOOL} size={iconSizes.md} color={colors.info} />
      </View>
      <View style={styles.detailText}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {t('screens.account.pathfinderClasses')}
        </Text>
        <View style={styles.classesContainer}>
          {classes.map((cls) => (
            <View key={cls} style={[styles.classBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.classBadgeText, { color: colors.textPrimary }]}>{cls}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

type MemberSinceRowProps = {
  date: string;
  colors: { border: string; textTertiary: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
  styles: ReturnType<typeof createStyles>;
};

function MemberSinceRow({ date, colors, t, styles }: MemberSinceRowProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBg = `${colors.textTertiary}20`;
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.CALENDAR_ACCOUNT}
          size={iconSizes.md}
          color={colors.textTertiary}
        />
      </View>
      <View style={styles.detailText}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {t('screens.account.memberSince')}
        </Text>
        <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{date}</Text>
      </View>
    </View>
  );
}

type StatusRowProps = {
  icon: string;
  label: string;
  color: string;
  colors: { textSecondary: string };
  t: (key: string) => string;
  styles: ReturnType<typeof createStyles>;
};

function StatusRow({ icon, label, color, colors, t, styles }: StatusRowProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const iconBg = `${color}20`;
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK_CIRCLE}
          size={iconSizes.md}
          color={color}
        />
      </View>
      <View style={styles.detailText}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {t('screens.account.membershipStatus')}
        </Text>
        <Text style={[styles.detailValue, { color }]}>{label}</Text>
      </View>
    </View>
  );
}
