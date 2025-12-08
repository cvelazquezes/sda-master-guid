import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { UserRole } from '../../../types';
import { mobileFontSizes, designTokens, layoutConstants } from '../../theme';
import { logger } from '../../../shared/utils/logger';
import {
  ICONS,
  LOG_MESSAGES,
  SAFE_AREA_EDGES,
  FLEX,
  SHADOW_OFFSET,
  TYPOGRAPHY,
} from '../../../shared/constants';
import { SPACING, BORDER_WIDTH } from '../../../shared/constants/numbers';

// Step component for reuse
function StatusStep({ number, text }: { number: number; text: string }): React.JSX.Element {
  return (
    <View style={styles.statusStep}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

// Info row component
function InfoRow({ icon, text }: { icon: string; text?: string }): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons
        name={icon as never}
        size={designTokens.iconSize.md}
        color={designTokens.colors.textSecondary}
      />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

// Status steps content
function StatusStepsContent({
  isClubAdmin,
  t,
}: {
  isClubAdmin: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}): React.JSX.Element {
  const prefix = isClubAdmin ? 'adminStep' : 'userStep';
  return (
    <>
      <StatusStep number={1} text={t(`screens.pendingApproval.${prefix}1`)} />
      <StatusStep number={2} text={t(`screens.pendingApproval.${prefix}2`)} />
      <StatusStep number={3} text={t(`screens.pendingApproval.${prefix}3`)} />
    </>
  );
}

const PendingApprovalScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const isClubAdmin = user?.role === UserRole.CLUB_ADMIN;

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.LOGOUT_ERROR, error as Error);
    }
  };

  const adminLabel = isClubAdmin
    ? t('screens.pendingApproval.systemAdmin')
    : t('screens.pendingApproval.clubAdmin');

  return (
    <SafeAreaView style={styles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={ICONS.CLOCK_ALERT_OUTLINE}
              size={designTokens.iconSize['4xl']}
              color={designTokens.colors.warning}
            />
          </View>
          <Text style={styles.title}>{t('screens.pendingApproval.title')}</Text>
          <Text style={styles.message}>
            {t('screens.pendingApproval.thankYouMessage', { name: user?.name })}
          </Text>
          <View style={styles.infoCard}>
            <InfoRow icon={ICONS.EMAIL} text={user?.email} />
            <InfoRow icon={ICONS.WHATSAPP} text={user?.whatsappNumber} />
          </View>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <MaterialCommunityIcons
                name={ICONS.INFORMATION}
                size={designTokens.iconSize.lg}
                color={designTokens.colors.primary}
              />
              <Text style={styles.statusTitle}>{t('screens.pendingApproval.whatHappensNext')}</Text>
            </View>
            <StatusStepsContent isClubAdmin={isClubAdmin} t={t} />
          </View>
          <View style={styles.noteCard}>
            <MaterialCommunityIcons
              name={ICONS.ALERT_CIRCLE}
              size={designTokens.iconSize.md}
              color={designTokens.colors.warning}
            />
            <Text style={styles.noteText}>
              {t('screens.pendingApproval.noteText', { admin: adminLabel })}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons
              name={ICONS.LOGOUT}
              size={designTokens.iconSize.md}
              color={designTokens.colors.textInverse}
            />
            <Text style={styles.logoutButtonText}>{t('screens.pendingApproval.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  container: {
    flexGrow: FLEX.GROW_ENABLED,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  content: {
    flex: FLEX.ONE,
    padding: designTokens.spacing.xl,
    paddingTop: designTokens.spacing['6xl'],
  },
  iconContainer: {
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xxl,
  },
  title: {
    fontSize: mobileFontSizes['4xl'],
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
    textAlign: layoutConstants.textAlign.center,
    marginBottom: designTokens.spacing.lg,
  },
  message: {
    fontSize: mobileFontSizes.xl,
    color: designTokens.colors.textSecondary,
    textAlign: layoutConstants.textAlign.center,
    marginBottom: designTokens.spacing.xxl,
  },
  userName: {
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.primary,
  },
  infoCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xl,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: SHADOW_OFFSET.MD,
    shadowOpacity: designTokens.shadows.md.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
    elevation: designTokens.shadows.md.elevation,
  },
  infoRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  infoText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textPrimary,
    flex: FLEX.ONE,
  },
  statusCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.xl,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: SHADOW_OFFSET.MD,
    shadowOpacity: designTokens.shadows.md.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
    elevation: designTokens.shadows.md.elevation,
  },
  statusHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xl,
    gap: designTokens.spacing.md,
  },
  statusTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  statusStep: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  stepNumber: {
    width: SPACING.LG_PLUS, // 28
    height: SPACING.LG_PLUS, // 28
    borderRadius: designTokens.borderRadius['2xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  stepNumberText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
  },
  stepText: {
    flex: FLEX.ONE,
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.XL,
    marginTop: designTokens.spacing.xxs,
  },
  noteCard: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.warningLight,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xxl,
    gap: designTokens.spacing.md,
    borderLeftWidth: BORDER_WIDTH.HEAVY,
    borderLeftColor: designTokens.colors.warning,
  },
  noteText: {
    flex: FLEX.ONE,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.LG,
  },
  logoutButton: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.primary,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.sm,
  },
  logoutButtonText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
  },
});

export default PendingApprovalScreen;
