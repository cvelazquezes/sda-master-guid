import { Alert } from 'react-native';
import { clubService } from '../../../../infrastructure/repositories/clubService';
import { paymentService } from '../../../../infrastructure/repositories/paymentService';
import { User, Club, ClubFeeSettings, MemberBalance } from '../../../../types';
import { NUMERIC, LIMITS, ALERT_BUTTON_STYLE, LOG_MESSAGES } from '../../../../shared/constants';
import { logger } from '../../../../shared/utils/logger';

type TranslationFn = (key: string, opts?: Record<string, unknown>) => string;

interface SaveFeeSettingsOptions {
  club: Club;
  feeAmount: string;
  currency: string;
  selectedMonths: number[];
  feeSettingsActive: boolean;
  setClub: (c: Club) => void;
  t: TranslationFn;
}

export async function saveFeeSettings(options: SaveFeeSettingsOptions): Promise<void> {
  const { club, feeAmount, currency, selectedMonths, feeSettingsActive, setClub, t } = options;

  const amount = parseFloat(feeAmount);
  if (isNaN(amount) || amount < NUMERIC.MIN_AMOUNT) {
    Alert.alert(t('titles.invalidAmount'), t('screens.clubFees.invalidFeeAmount'));
    return;
  }
  if (selectedMonths.length === LIMITS.MIN_ARRAY_LENGTH && feeSettingsActive) {
    Alert.alert(t('titles.noMonthsSelected'), t('errors.noMonthsSelected'));
    return;
  }
  try {
    const feeSettings: ClubFeeSettings = {
      monthlyFeeAmount: amount,
      currency,
      activeMonths: selectedMonths,
      isActive: feeSettingsActive,
    };
    const updatedClub = { ...club, feeSettings };
    await clubService.updateClub(club.id, updatedClub);
    setClub(updatedClub);
    Alert.alert(t('common.success'), t('screens.clubFees.settingsSaved'));
  } catch {
    Alert.alert(t('common.error'), t('screens.clubFees.failedToSave'));
  }
}

interface GenerateFeesAlertOptions {
  clubId: string;
  members: User[];
  feeSettings: ClubFeeSettings;
  loadData: () => void;
  t: TranslationFn;
}

export function showGenerateFeesAlert(options: GenerateFeesAlertOptions): void {
  const { clubId, members, feeSettings, loadData, t } = options;

  const currentYear = new Date().getFullYear();
  Alert.alert(
    t('screens.clubFees.generateFees'),
    t('screens.clubFees.generateFeesConfirm', { year: currentYear }),
    [
      { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('screens.clubFees.generate'),
        onPress: async (): Promise<void> => {
          try {
            await paymentService.generateMonthlyFees(clubId, members, feeSettings, currentYear);
            Alert.alert(t('common.success'), t('screens.clubFees.feesGenerated'));
            loadData();
          } catch {
            Alert.alert(t('common.error'), t('screens.clubFees.failedToGenerate'));
          }
        },
      },
    ]
  );
}

interface NotifyAllAlertOptions {
  members: User[];
  balances: MemberBalance[];
  club: Club | null;
  t: TranslationFn;
}

export function showNotifyAllAlert(options: NotifyAllAlertOptions): void {
  const { members, balances, club, t } = options;

  Alert.alert(t('screens.clubFees.notifyAllMembers'), t('screens.clubFees.notifyAllConfirm'), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('screens.clubFees.send'),
      onPress: async (): Promise<void> => {
        try {
          let notificationCount = 0;
          for (const member of members) {
            const balance = balances.find((b) => b.userId === member.id);
            if (balance) {
              const message = await paymentService.getNotificationMessage(balance, member.name);
              logger.debug(LOG_MESSAGES.SCREENS.CLUB_FEES.NOTIFICATION_TO_MEMBER, {
                name: member.name,
                whatsappNumber: member.whatsappNumber,
                message,
              });
              notificationCount++;
            }
          }
          if (club?.feeSettings) {
            const updatedSettings = {
              ...club.feeSettings,
              lastNotificationDate: new Date().toISOString(),
            };
            await clubService.updateClub(club.id, { ...club, feeSettings: updatedSettings });
          }
          Alert.alert(
            t('common.success'),
            t('screens.clubFees.notificationsSent', { count: notificationCount })
          );
        } catch {
          Alert.alert(t('common.error'), t('screens.clubFees.failedToSendNotifications'));
        }
      },
    },
  ]);
}

interface NotifySingleMemberAlertOptions {
  member: User;
  balance: MemberBalance;
  t: TranslationFn;
}

export function showNotifySingleMemberAlert(options: NotifySingleMemberAlertOptions): void {
  const { member, balance, t } = options;

  Alert.alert(
    t('screens.clubFees.notifyMember'),
    t('screens.clubFees.notifyMemberConfirm', { name: member.name }),
    [
      { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('screens.clubFees.send'),
        onPress: async (): Promise<void> => {
          try {
            const message = await paymentService.getNotificationMessage(balance, member.name);
            logger.debug(LOG_MESSAGES.SCREENS.CLUB_FEES.NOTIFICATION_TO_MEMBER, {
              name: member.name,
              whatsappNumber: member.whatsappNumber,
              message,
            });
            Alert.alert(t('common.success'), t('screens.clubFees.notificationSent'));
          } catch {
            Alert.alert(t('common.error'), t('screens.clubFees.failedToSendNotification'));
          }
        },
      },
    ]
  );
}
