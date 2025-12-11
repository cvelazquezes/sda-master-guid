import React, { useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createScreenStyles,
  createTextStyles,
  createInfoCardStyles,
  createStatusCardStyles,
  createNoteCardStyles,
  createButtonStyles,
} from './pending-approval/styles';
import { ICONS, LOG_MESSAGES, SAFE_AREA_EDGES } from '../../../shared/constants';
import { logger } from '../../../shared/utils/logger';
import { UserRole } from '../../../types';
import { Text } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { useTheme } from '../../state/ThemeContext';

type StatusStepProps = {
  number: number;
  text: string;
  styles: ReturnType<typeof createStatusCardStyles>;
};

// Step component for reuse
function StatusStep({ number, text, styles }: StatusStepProps): React.JSX.Element {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

type InfoRowProps = {
  icon: string;
  text?: string;
  styles: ReturnType<typeof createInfoCardStyles>;
  iconSize: number;
  iconColor: string;
};

// Info row component
function InfoRow({ icon, text, styles, iconSize, iconColor }: InfoRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <MaterialCommunityIcons name={icon as never} size={iconSize} color={iconColor} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

type StatusStepsContentProps = {
  isClubAdmin: boolean;
  t: ReturnType<typeof useTranslation>['t'];
  styles: ReturnType<typeof createStatusCardStyles>;
};

// Status steps content
function StatusStepsContent({
  isClubAdmin,
  t,
  styles,
}: StatusStepsContentProps): React.JSX.Element {
  const prefix = isClubAdmin ? 'adminStep' : 'userStep';
  return (
    <>
      <StatusStep number={1} text={t(`screens.pendingApproval.${prefix}1`)} styles={styles} />
      <StatusStep number={2} text={t(`screens.pendingApproval.${prefix}2`)} styles={styles} />
      <StatusStep number={3} text={t(`screens.pendingApproval.${prefix}3`)} styles={styles} />
    </>
  );
}

const PendingApprovalScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { colors, spacing, radii, typography, iconSizes } = useTheme();
  const isClubAdmin = user?.role === UserRole.CLUB_ADMIN;

  // Create styles using theme
  const screenStyles = useMemo(() => createScreenStyles(colors, spacing), [colors, spacing]);
  const textStyles = useMemo(
    () => createTextStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );
  const infoCardStyles = useMemo(
    () => createInfoCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const statusCardStyles = useMemo(
    () => createStatusCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const noteCardStyles = useMemo(
    () => createNoteCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const buttonStyles = useMemo(
    () => createButtonStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

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
    <SafeAreaView style={screenStyles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <ScrollView contentContainerStyle={screenStyles.container}>
        <View style={screenStyles.content}>
          <View style={screenStyles.iconContainer}>
            <MaterialCommunityIcons
              name={ICONS.CLOCK_ALERT_OUTLINE}
              size={iconSizes['4xl']}
              color={colors.warning}
            />
          </View>
          <Text style={textStyles.title}>{t('screens.pendingApproval.title')}</Text>
          <Text style={textStyles.message}>
            {t('screens.pendingApproval.thankYouMessage', { name: user?.name })}
          </Text>
          <View style={infoCardStyles.card}>
            <InfoRow
              icon={ICONS.EMAIL}
              text={user?.email}
              styles={infoCardStyles}
              iconSize={iconSizes.md}
              iconColor={colors.textSecondary}
            />
            <InfoRow
              icon={ICONS.WHATSAPP}
              text={user?.whatsappNumber}
              styles={infoCardStyles}
              iconSize={iconSizes.md}
              iconColor={colors.textSecondary}
            />
          </View>
          <View style={statusCardStyles.card}>
            <View style={statusCardStyles.header}>
              <MaterialCommunityIcons
                name={ICONS.INFORMATION}
                size={iconSizes.lg}
                color={colors.primary}
              />
              <Text style={statusCardStyles.title}>
                {t('screens.pendingApproval.whatHappensNext')}
              </Text>
            </View>
            <StatusStepsContent isClubAdmin={isClubAdmin} t={t} styles={statusCardStyles} />
          </View>
          <View style={noteCardStyles.card}>
            <MaterialCommunityIcons
              name={ICONS.ALERT_CIRCLE}
              size={iconSizes.md}
              color={colors.warning}
            />
            <Text style={noteCardStyles.text}>
              {t('screens.pendingApproval.noteText', { admin: adminLabel })}
            </Text>
          </View>
          <TouchableOpacity
            style={buttonStyles.logout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
            onPress={handleLogout}
          >
            <MaterialCommunityIcons
              name={ICONS.LOGOUT}
              size={iconSizes.md}
              color={colors.textInverse}
            />
            <Text style={buttonStyles.logoutText}>{t('screens.pendingApproval.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PendingApprovalScreen;
