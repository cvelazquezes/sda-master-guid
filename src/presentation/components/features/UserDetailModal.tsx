import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../primitives';
import { User, Club, UserRole } from '../../../types';
import { OrganizationHierarchy } from './OrganizationHierarchy';
import { clubService } from '../../../infrastructure/repositories/clubService';
import { Modal } from '../primitives';
import { useTheme } from '../../state/ThemeContext';
import {
  mobileTypography,
  mobileIconSizes,
  mobileFontSizes,
  layoutConstants,
} from '../../theme';
import { designTokens } from '../../theme/designTokens';
import { logger } from '../../../shared/utils/logger';
import { ACTIVITY_INDICATOR_SIZE, ICONS, LOG_MESSAGES, FLEX } from '../../../shared/constants';

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ visible, user, onClose }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(false);

  const loadClub = useCallback(async (): Promise<void> => {
    if (!user?.clubId) {
      return;
    }
    setLoading(true);
    try {
      const clubData = await clubService.getClub(user.clubId);
      setClub(clubData);
    } catch (error) {
      logger.error(LOG_MESSAGES.COMPONENTS.USER_DETAIL_MODAL.FAILED_TO_LOAD_CLUB, error as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.clubId]);

  useEffect(() => {
    if (visible && user?.clubId) {
      loadClub();
    }
  }, [visible, user?.clubId, loadClub]);

  if (!user) {
    return null;
  }

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return t('components.userCard.roles.admin');
      case UserRole.CLUB_ADMIN:
        return t('components.userCard.roles.clubAdmin');
      default:
        return t('components.userCard.roles.user');
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={user.name}
      subtitle={t('components.userDetailModal.subtitle')}
    >
      {/* Personal Information */}
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('components.userDetailModal.personalInformation')}
        </Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT}
            size={mobileIconSizes.medium}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.userDetailModal.name')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.EMAIL}
            size={mobileIconSizes.medium}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.userDetailModal.email')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{user.email}</Text>
          </View>
        </View>

        {user.whatsappNumber && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name={ICONS.WHATSAPP}
              size={mobileIconSizes.medium}
              color={colors.success}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t('components.userDetailModal.whatsApp')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {user.whatsappNumber}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.SHIELD_ACCOUNT}
            size={mobileIconSizes.medium}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {t('components.userDetailModal.role')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {getRoleLabel(user.role)}
            </Text>
          </View>
        </View>
      </View>

      {/* Pathfinder Classes */}
      {user.role !== UserRole.ADMIN && user.classes && user.classes.length > 0 && (
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('components.userDetailModal.pathfinderClasses')}
          </Text>
          <View style={styles.classesContainer}>
            {user.classes.map((pathfinderClass) => (
              <View
                key={pathfinderClass}
                style={[styles.classBadge, { backgroundColor: colors.primaryAlpha20 }]}
              >
                <MaterialCommunityIcons
                  name={ICONS.SCHOOL}
                  size={mobileIconSizes.small}
                  color={colors.primary}
                />
                <Text style={[styles.classBadgeText, { color: colors.textPrimary }]}>
                  {pathfinderClass}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Status */}
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('components.userDetailModal.status')}
        </Text>

        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name={user.isActive ? ICONS.CHECK_CIRCLE : ICONS.CANCEL}
            size={mobileIconSizes.medium}
            color={user.isActive ? colors.success : colors.error}
          />
          <Text style={[styles.statusText, { color: colors.textPrimary }]}>
            {user.isActive
              ? t('components.userDetailModal.active')
              : t('components.userDetailModal.inactive')}
          </Text>
        </View>
      </View>

      {/* Organizational Hierarchy */}
      {user.role !== UserRole.ADMIN && club && (
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('components.userDetailModal.organizationAndClub')}
          </Text>
          <OrganizationHierarchy
            data={{
              division: club.division,
              union: club.union,
              association: club.association,
              church: club.church,
              clubName: club.name,
            }}
            title={t('components.userDetailModal.organizationalHierarchy')}
            initialExpanded
          />
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.small} color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('components.userDetailModal.loadingClubInfo')}
          </Text>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  avatarIcon: {
    width: designTokens.avatarSize.lg,
    height: designTokens.avatarSize.lg,
    borderRadius: designTokens.borderRadius.full,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  avatarText: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
  },
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
  statusRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.md,
  },
  statusText: {
    ...mobileTypography.bodyLargeBold,
    marginLeft: designTokens.spacing.md,
  },
  loadingContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing.xl,
  },
  loadingText: {
    ...mobileTypography.bodySmall,
    marginLeft: designTokens.spacing.md,
  },
  classesContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.md,
  },
  classBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius['2xl'],
    gap: designTokens.spacing.sm,
  },
  classBadgeText: {
    ...mobileTypography.labelBold,
  },
});
