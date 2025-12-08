import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../primitives';
import { Club } from '../../../types';
import { OrganizationHierarchy } from './OrganizationHierarchy';
import { Modal } from '../primitives';
import { useTheme } from '../../state/ThemeContext';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../theme';
import { designTokens } from '../../theme/designTokens';
import { formatMatchFrequency, formatMembersCount } from '../../../shared/utils/formatters';
import { ICONS, FLEX } from '../../../shared/constants';

interface ClubDetailModalProps {
  visible: boolean;
  club: Club | null;
  onClose: () => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({ visible, club, onClose }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (!club) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={club.name}
      subtitle={t('components.clubDetail.subtitle')}
      icon={ICONS.ACCOUNT_GROUP}
      iconColor={colors.primary}
      iconBackgroundColor={colors.primaryLight}
    >
      {/* Basic Information */}
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('components.clubDetail.basicInfo')}
        </Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.LABEL}
            size={mobileIconSizes.medium}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.clubDetail.name')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{club.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.TEXT}
            size={mobileIconSizes.medium}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.clubDetail.description')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {club.description}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={club.isActive ? ICONS.CHECK_CIRCLE : ICONS.CANCEL}
            size={mobileIconSizes.medium}
            color={club.isActive ? colors.success : colors.error}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.clubDetail.status')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {club.isActive
                ? t('components.clubDetail.active')
                : t('components.clubDetail.inactive')}
            </Text>
          </View>
        </View>
      </View>

      {/* Activity Settings */}
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('components.clubDetail.activitySettings')}
        </Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_CLOCK}
            size={mobileIconSizes.medium}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.clubDetail.activityFrequency')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {formatMatchFrequency(club.matchFrequency, t)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_MULTIPLE}
            size={mobileIconSizes.medium}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.clubDetail.groupSize')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {club.groupSize} {t('components.clubDetail.peoplePerActivity')}
            </Text>
          </View>
        </View>

        {club.memberCount !== undefined && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_GROUP}
              size={mobileIconSizes.medium}
              color={colors.primary}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t('components.clubDetail.members')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {formatMembersCount(club.memberCount, t)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Organizational Hierarchy */}
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('components.clubDetail.organizationalHierarchy')}
        </Text>
        <OrganizationHierarchy
          data={{
            division: club.division,
            union: club.union,
            association: club.association,
            church: club.church,
          }}
          title={t('components.clubDetail.clubOrganization')}
          initialExpanded
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  sectionTitle: {
    ...mobileTypography.heading4,
    marginBottom: designTokens.spacing.lg,
  },
  infoRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.lg,
  },
  infoContent: {
    marginLeft: designTokens.spacing.md,
    flex: FLEX.ONE,
  },
  infoLabel: {
    ...mobileTypography.label,
    marginBottom: designTokens.spacing.sm,
  },
  infoValue: {
    ...mobileTypography.bodyLargeBold,
  },
});
