import React, { useState, useEffect, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../shared/components';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { designTokens } from '../../../shared/theme';
import { ICONS, EMPTY_VALUE, FEE_TABS } from '../../../shared/constants';
import { styles } from './styles';
import { FeeTabValue, BREAKPOINTS, MODAL_WIDTH_CONFIG } from './types';
import { useClubFees } from './useClubFees';
import {
  saveFeeSettings,
  showGenerateFeesAlert,
  showNotifyAllAlert,
  showNotifySingleMemberAlert,
} from './feeHandlers';
import { createCustomCharge, createResetForm } from './chargeHandlers';
import { FeeTabs } from './FeeTabs';
import { SettingsTab } from './SettingsTab';
import { BalancesTab } from './BalancesTab';
import { ChargesTab } from './ChargesTab';
import { ChargeModal } from './ChargeModal';

function useChargeState(_t: ReturnType<typeof useTranslation>['t']): {
  chargeModalVisible: boolean;
  setChargeModalVisible: (v: boolean) => void;
  chargeDescription: string;
  setChargeDescription: (v: string) => void;
  chargeAmount: string;
  setChargeAmount: (v: string) => void;
  chargeDueDate: string;
  setChargeDueDate: (v: string) => void;
  chargeApplyToAll: boolean;
  setChargeApplyToAll: (v: boolean) => void;
  selectedMemberIds: string[];
  setSelectedMemberIds: (v: string[]) => void;
  resetForm: () => void;
  openModal: () => void;
  closeModal: () => void;
} {
  const [chargeModalVisible, setChargeModalVisible] = useState(false);
  const [chargeDescription, setChargeDescription] = useState(EMPTY_VALUE);
  const [chargeAmount, setChargeAmount] = useState(EMPTY_VALUE);
  const [chargeDueDate, setChargeDueDate] = useState(EMPTY_VALUE);
  const [chargeApplyToAll, setChargeApplyToAll] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const resetForm = createResetForm(
    setChargeDescription,
    setChargeAmount,
    setChargeDueDate,
    setChargeApplyToAll,
    setSelectedMemberIds
  );
  const openModal = (): void => {
    resetForm();
    setChargeModalVisible(true);
  };
  const closeModal = (): void => setChargeModalVisible(false);
  return {
    chargeModalVisible,
    setChargeModalVisible,
    chargeDescription,
    setChargeDescription,
    chargeAmount,
    setChargeAmount,
    chargeDueDate,
    setChargeDueDate,
    chargeApplyToAll,
    setChargeApplyToAll,
    selectedMemberIds,
    setSelectedMemberIds,
    resetForm,
    openModal,
    closeModal,
  };
}

function useFeeState(t: ReturnType<typeof useTranslation>['t']): {
  feeAmount: string;
  setFeeAmount: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  selectedMonths: number[];
  setSelectedMonths: (v: number[]) => void;
  feeSettingsActive: boolean;
  setFeeSettingsActive: (v: boolean) => void;
} {
  const [feeAmount, setFeeAmount] = useState(t('screens.clubFees.defaultAmount'));
  const [currency, setCurrency] = useState(t('screens.clubFees.defaultCurrency'));
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [feeSettingsActive, setFeeSettingsActive] = useState(false);
  return {
    feeAmount,
    setFeeAmount,
    currency,
    setCurrency,
    selectedMonths,
    setSelectedMonths,
    feeSettingsActive,
    setFeeSettingsActive,
  };
}

function getModalWidth(windowWidth: number): number {
  if (windowWidth > BREAKPOINTS.DESKTOP) {
    return Math.min(MODAL_WIDTH_CONFIG.DESKTOP_MAX, windowWidth * MODAL_WIDTH_CONFIG.DESKTOP_RATIO);
  }
  if (windowWidth > BREAKPOINTS.TABLET) {
    return windowWidth * MODAL_WIDTH_CONFIG.TABLET_RATIO;
  }
  return windowWidth * MODAL_WIDTH_CONFIG.MOBILE_RATIO;
}

const ClubFeesScreen = (): React.JSX.Element | null => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const {
    club,
    setClub,
    members,
    balances,
    customCharges,
    refreshing,
    loading,
    loadData,
    onRefresh,
  } = useClubFees(user?.clubId, t);
  const feeState = useFeeState(t);
  const chargeState = useChargeState(t);
  const [activeTab, setActiveTab] = useState<FeeTabValue>(FEE_TABS.SETTINGS);

  useEffect(() => {
    if (club?.feeSettings) {
      feeState.setFeeAmount(club.feeSettings.monthlyFeeAmount.toString());
      feeState.setCurrency(club.feeSettings.currency);
      feeState.setSelectedMonths(club.feeSettings.activeMonths);
      feeState.setFeeSettingsActive(club.feeSettings.isActive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- feeState setters are stable, only re-run when club changes
  }, [club]);

  const handleSave = useCallback((): void => {
    if (user?.clubId && club) {
      saveFeeSettings(
        user.clubId,
        club,
        feeState.feeAmount,
        feeState.currency,
        feeState.selectedMonths,
        feeState.feeSettingsActive,
        setClub,
        t
      );
    }
  }, [user, club, feeState, setClub, t]);
  const handleGenerateFees = useCallback((): void => {
    if (user?.clubId && club?.feeSettings) {
      showGenerateFeesAlert(user.clubId, members, club.feeSettings, loadData, t);
    }
  }, [user, club, members, loadData, t]);
  const handleNotifyAll = useCallback(
    (): void => showNotifyAllAlert(members, balances, club, t),
    [members, balances, club, t]
  );
  const handleCreateCharge = useCallback((): void => {
    if (user?.clubId) {
      createCustomCharge(
        user.clubId,
        user.id,
        members,
        chargeState.chargeDescription,
        chargeState.chargeAmount,
        chargeState.chargeDueDate,
        chargeState.chargeApplyToAll,
        chargeState.selectedMemberIds,
        loadData,
        chargeState.resetForm,
        chargeState.closeModal,
        t
      );
    }
  }, [user, members, chargeState, loadData, t]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name={ICONS.LOADING}
          size={designTokens.iconSize['4xl']}
          color={colors.primary}
        />
        <Text style={styles.loadingText}>{t('screens.clubFees.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('screens.clubFees.title')}</Text>
        <Text style={styles.headerSubtitle}>{club?.name}</Text>
      </View>
      <FeeTabs activeTab={activeTab} onTabChange={setActiveTab} t={t} />
      {activeTab === FEE_TABS.SETTINGS && (
        <SettingsTab
          feeAmount={feeState.feeAmount}
          setFeeAmount={feeState.setFeeAmount}
          currency={feeState.currency}
          setCurrency={feeState.setCurrency}
          selectedMonths={feeState.selectedMonths}
          setSelectedMonths={feeState.setSelectedMonths}
          feeSettingsActive={feeState.feeSettingsActive}
          setFeeSettingsActive={feeState.setFeeSettingsActive}
          onSave={handleSave}
          onGenerateFees={handleGenerateFees}
          t={t}
        />
      )}
      {activeTab === FEE_TABS.BALANCES && (
        <BalancesTab
          balances={balances}
          members={members}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onNotifyAll={handleNotifyAll}
          onNotifySingle={showNotifySingleMemberAlert}
          t={t}
        />
      )}
      {activeTab === FEE_TABS.CHARGES && (
        <ChargesTab
          customCharges={customCharges}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onAddCharge={chargeState.openModal}
          t={t}
        />
      )}
      <ChargeModal
        visible={chargeState.chargeModalVisible}
        onClose={chargeState.closeModal}
        modalWidth={getModalWidth(windowWidth)}
        windowHeight={windowHeight}
        chargeDescription={chargeState.chargeDescription}
        setChargeDescription={chargeState.setChargeDescription}
        chargeAmount={chargeState.chargeAmount}
        setChargeAmount={chargeState.setChargeAmount}
        chargeDueDate={chargeState.chargeDueDate}
        setChargeDueDate={chargeState.setChargeDueDate}
        chargeApplyToAll={chargeState.chargeApplyToAll}
        setChargeApplyToAll={chargeState.setChargeApplyToAll}
        selectedMemberIds={chargeState.selectedMemberIds}
        setSelectedMemberIds={chargeState.setSelectedMemberIds}
        members={members}
        onCreate={handleCreateCharge}
        t={t}
      />
    </View>
  );
};

export default ClubFeesScreen;
