import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  screenStyles,
  textStyles,
  infoCardStyles,
  statusCardStyles,
  noteCardStyles,
  buttonStyles,
} from './pending-approval/styles';
import { Text } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { UserRole } from '../../../types';
import { designTokens } from '../../theme';
import { logger } from '../../../shared/utils/logger';
import { ICONS, LOG_MESSAGES, SAFE_AREA_EDGES } from '../../../shared/constants';

// Step component for reuse
function StatusStep({ number, text }: { number: number; text: string }): React.JSX.Element {
  return (
    <View style={statusCardStyles.step}>
      <View style={statusCardStyles.stepNumber}>
        <Text style={statusCardStyles.stepNumberText}>{number}</Text>
      </View>
      <Text style={statusCardStyles.stepText}>{text}</Text>
    </View>
  );
}

// Info row component
function InfoRow({ icon, text }: { icon: string; text?: string }): React.JSX.Element {
  return (
    <View style={infoCardStyles.row}>
      <MaterialCommunityIcons
        name={icon as never}
        size={designTokens.iconSize.md}
        color={designTokens.colors.textSecondary}
      />
      <Text style={infoCardStyles.text}>{text}</Text>
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
    <SafeAreaView style={screenStyles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <ScrollView contentContainerStyle={screenStyles.container}>
        <View style={screenStyles.content}>
          <View style={screenStyles.iconContainer}>
            <MaterialCommunityIcons
              name={ICONS.CLOCK_ALERT_OUTLINE}
              size={designTokens.iconSize['4xl']}
              color={designTokens.colors.warning}
            />
          </View>
          <Text style={textStyles.title}>{t('screens.pendingApproval.title')}</Text>
          <Text style={textStyles.message}>
            {t('screens.pendingApproval.thankYouMessage', { name: user?.name })}
          </Text>
          <View style={infoCardStyles.card}>
            <InfoRow icon={ICONS.EMAIL} text={user?.email} />
            <InfoRow icon={ICONS.WHATSAPP} text={user?.whatsappNumber} />
          </View>
          <View style={statusCardStyles.card}>
            <View style={statusCardStyles.header}>
              <MaterialCommunityIcons
                name={ICONS.INFORMATION}
                size={designTokens.iconSize.lg}
                color={designTokens.colors.primary}
              />
              <Text style={statusCardStyles.title}>{t('screens.pendingApproval.whatHappensNext')}</Text>
            </View>
            <StatusStepsContent isClubAdmin={isClubAdmin} t={t} />
          </View>
          <View style={noteCardStyles.card}>
            <MaterialCommunityIcons
              name={ICONS.ALERT_CIRCLE}
              size={designTokens.iconSize.md}
              color={designTokens.colors.warning}
            />
            <Text style={noteCardStyles.text}>
              {t('screens.pendingApproval.noteText', { admin: adminLabel })}
            </Text>
          </View>
          <TouchableOpacity style={buttonStyles.logout} onPress={handleLogout}>
            <MaterialCommunityIcons
              name={ICONS.LOGOUT}
              size={designTokens.iconSize.md}
              color={designTokens.colors.textInverse}
            />
            <Text style={buttonStyles.logoutText}>{t('screens.pendingApproval.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PendingApprovalScreen;
