import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { User, Club, UserRole } from '../types';
import { OrganizationHierarchy } from './OrganizationHierarchy';
import { clubService } from '../services/clubService';
import { StandardModal } from '../shared/components/StandardModal';
import {
  mobileTypography,
  mobileIconSizes,
  mobileFontSizes,
  layoutConstants,
} from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';
import { logger } from '../shared/utils/logger';
import { ACTIVITY_INDICATOR_SIZE, ICONS, LOG_MESSAGES, flexValues } from '../shared/constants';

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ visible, user, onClose }) => {
  const { t } = useTranslation();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user?.clubId) {
      loadClub();
    }
  }, [visible, user]);

  const loadClub = async () => {
    if (!user?.clubId) return;
    setLoading(true);
    try {
      const clubData = await clubService.getClub(user.clubId);
      setClub(clubData);
    } catch (error) {
      logger.error(LOG_MESSAGES.COMPONENTS.USER_DETAIL_MODAL.FAILED_TO_LOAD_CLUB, error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
    <StandardModal
      visible={visible}
      onClose={onClose}
      title={user.name}
      subtitle={t('components.userDetailModal.subtitle')}
    >
      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('components.userDetailModal.personalInformation')}
        </Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT}
            size={mobileIconSizes.medium}
            color={designTokens.colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t('components.userDetailModal.name')}</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.EMAIL}
            size={mobileIconSizes.medium}
            color={designTokens.colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t('components.userDetailModal.email')}</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>

        {user.whatsappNumber && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name={ICONS.WHATSAPP}
              size={mobileIconSizes.medium}
              color={designTokens.colors.success}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('components.userDetailModal.whatsApp')}</Text>
              <Text style={styles.infoValue}>{user.whatsappNumber}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name={ICONS.SHIELD_ACCOUNT}
            size={mobileIconSizes.medium}
            color={designTokens.colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t('components.userDetailModal.role')}</Text>
            <Text style={styles.infoValue}>{getRoleLabel(user.role)}</Text>
          </View>
        </View>
      </View>

      {/* Pathfinder Classes */}
      {user.role !== UserRole.ADMIN && user.classes && user.classes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('components.userDetailModal.pathfinderClasses')}
          </Text>
          <View style={styles.classesContainer}>
            {user.classes.map((pathfinderClass, index) => (
              <View key={index} style={styles.classBadge}>
                <MaterialCommunityIcons
                  name={ICONS.SCHOOL}
                  size={mobileIconSizes.small}
                  color={designTokens.colors.primary}
                />
                <Text style={styles.classBadgeText}>{pathfinderClass}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('components.userDetailModal.status')}</Text>

        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name={user.isActive ? ICONS.CHECK_CIRCLE : ICONS.CANCEL}
            size={mobileIconSizes.medium}
            color={user.isActive ? designTokens.colors.success : designTokens.colors.error}
          />
          <Text style={styles.statusText}>
            {user.isActive
              ? t('components.userDetailModal.active')
              : t('components.userDetailModal.inactive')}
          </Text>
        </View>
      </View>

      {/* Organizational Hierarchy */}
      {user.role !== UserRole.ADMIN && club && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
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
            initialExpanded={true}
          />
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size={ACTIVITY_INDICATOR_SIZE.small}
            color={designTokens.colors.primary}
          />
          <Text style={styles.loadingText}>{t('components.userDetailModal.loadingClubInfo')}</Text>
        </View>
      )}
    </StandardModal>
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
    color: designTokens.colors.textInverse,
  },
  section: {
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
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
    flex: flexValues.one,
  },
  infoLabel: {
    ...mobileTypography.label,
    color: designTokens.colors.textSecondary,
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
    color: designTokens.colors.textSecondary,
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
    backgroundColor: designTokens.colors.primaryLight,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xxl,
    gap: designTokens.spacing.sm,
  },
  classBadgeText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
});
