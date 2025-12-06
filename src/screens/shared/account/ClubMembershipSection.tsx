import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, SectionHeader, Card } from '../../../shared/components';
import { designTokens } from '../../../shared/theme';
import { ICONS, DATE_LOCALE_OPTIONS } from '../../../shared/constants';
import { ApprovalStatus, Club } from '../../../types';
import { styles } from './styles';

interface ClubMembershipSectionProps {
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
}

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
          <ClubRow club={club} colors={colors} t={t} />
          {classes && classes.length > 0 && <ClassesRow classes={classes} colors={colors} t={t} />}
          <MemberSinceRow date={formatDate(createdAt)} colors={colors} t={t} />
          <StatusRow
            icon={getStatusIcon()}
            label={approvalLabel}
            color={approvalColor}
            colors={colors}
            t={t}
          />
        </View>
      </Card>
    </View>
  );
}

interface ClubRowProps {
  club: Club | null;
  colors: { border: string; primary: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
}

function ClubRow({ club, colors, t }: ClubRowProps): React.JSX.Element {
  const iconBg = colors.primary + '20';
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_GROUP}
          size={designTokens.iconSize.md}
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

interface ClassesRowProps {
  classes: string[];
  colors: { border: string; info: string; primary: string; textSecondary: string };
  t: (key: string) => string;
}

function ClassesRow({ classes, colors, t }: ClassesRowProps): React.JSX.Element {
  const iconBg = colors.info + '20';
  const badgeBg = colors.primary + '15';
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.SCHOOL}
          size={designTokens.iconSize.md}
          color={colors.info}
        />
      </View>
      <View style={styles.detailText}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {t('screens.account.pathfinderClasses')}
        </Text>
        <View style={styles.classesContainer}>
          {classes.map((cls) => (
            <View key={cls} style={[styles.classBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.classBadgeText, { color: colors.primary }]}>{cls}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

interface MemberSinceRowProps {
  date: string;
  colors: { border: string; textTertiary: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
}

function MemberSinceRow({ date, colors, t }: MemberSinceRowProps): React.JSX.Element {
  const iconBg = colors.textTertiary + '20';
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={ICONS.CALENDAR_ACCOUNT}
          size={designTokens.iconSize.md}
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

interface StatusRowProps {
  icon: string;
  label: string;
  color: string;
  colors: { textSecondary: string };
  t: (key: string) => string;
}

function StatusRow({ icon, label, color, colors, t }: StatusRowProps): React.JSX.Element {
  const iconBg = color + '20';
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK_CIRCLE}
          size={designTokens.iconSize.md}
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
