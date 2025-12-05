import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { mobileTypography, mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { ICONS, SAFE_AREA_EDGES, LOG_MESSAGES } from '../../shared/constants';
import { flexValues, shadowOffsetValues, typographyValues } from '../../shared/constants/layoutConstants';
import { logger } from '../../shared/utils/logger';

const PendingApprovalScreen = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  const isClubAdmin = user?.role === UserRole.CLUB_ADMIN;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.LOGOUT_ERROR, error as Error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={ICONS.CLOCK_ALERT_OUTLINE} size={designTokens.iconSize['4xl']} color={designTokens.colors.warning} />
        </View>

        <Text style={styles.title}>{t('screens.pendingApproval.title')}</Text>

        <Text style={styles.message}>
          {t('screens.pendingApproval.thankYouMessage', { name: user?.name })}
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name={ICONS.EMAIL} size={designTokens.iconSize.md} color={designTokens.colors.textSecondary} />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name={ICONS.WHATSAPP} size={designTokens.iconSize.md} color={designTokens.colors.textSecondary} />
            <Text style={styles.infoText}>{user?.whatsappNumber}</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialCommunityIcons name={ICONS.INFORMATION} size={designTokens.iconSize.lg} color={designTokens.colors.primary} />
            <Text style={styles.statusTitle}>{t('screens.pendingApproval.whatHappensNext')}</Text>
          </View>

          {isClubAdmin ? (
            <>
              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('screens.pendingApproval.adminStep1')}
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('screens.pendingApproval.adminStep2')}
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('screens.pendingApproval.adminStep3')}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('screens.pendingApproval.userStep1')}
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('screens.pendingApproval.userStep2')}
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  {t('screens.pendingApproval.userStep3')}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.noteCard}>
          <MaterialCommunityIcons name={ICONS.ALERT_CIRCLE} size={designTokens.iconSize.md} color={designTokens.colors.warning} />
          <Text style={styles.noteText}>
            {t('screens.pendingApproval.noteText', { 
              admin: isClubAdmin ? t('screens.pendingApproval.systemAdmin') : t('screens.pendingApproval.clubAdmin') 
            })}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name={ICONS.LOGOUT} size={designTokens.iconSize.md} color={designTokens.colors.textInverse} />
          <Text style={styles.logoutButtonText}>{t('screens.pendingApproval.logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  container: {
    flexGrow: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  content: {
    flex: flexValues.one,
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
    shadowOffset: shadowOffsetValues.md,
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
    flex: flexValues.one,
  },
  statusCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.xl,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: shadowOffsetValues.md,
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
    width: 28,
    height: 28,
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
    flex: flexValues.one,
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
    lineHeight: typographyValues.lineHeight.xl,
    marginTop: designTokens.spacing.xxs,
  },
  noteCard: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.warningLight,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xxl,
    gap: designTokens.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: designTokens.colors.warning,
  },
  noteText: {
    flex: flexValues.one,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
    lineHeight: typographyValues.lineHeight.lg,
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
