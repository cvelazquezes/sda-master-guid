import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { MY_FEES_TAB, PAYMENT_STATUS, DISPLAY_LIMITS } from '../../../shared/constants';
import { SPACING } from '../../../shared/constants/numbers';
import { styles } from './styles';
import { MyFeesTabValue } from './types';
import { useMyFees } from './useMyFees';
import { getBalanceStatus } from './statusUtils';
import { LoadingState, NotAMemberState } from './LoadingState';
import { BalanceHeader } from './BalanceHeader';
import { FeeTabs } from './FeeTabs';
import { OverviewTab } from './OverviewTab';
import { HistoryTab } from './HistoryTab';
import { ChargesTab } from './ChargesTab';
import { HelpCard } from './HelpCard';

const MyFeesScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState<MyFeesTabValue>(MY_FEES_TAB.OVERVIEW);
  const {
    club,
    balance,
    payments,
    customCharges,
    refreshing,
    loading,
    fadeAnim,
    slideAnim,
    onRefresh,
  } = useMyFees(user?.id, user?.clubId);

  if (loading) {
    return <LoadingState colors={colors} />;
  }
  if (!user?.clubId) {
    return <NotAMemberState colors={colors} t={t} />;
  }

  const balanceStatus = getBalanceStatus(balance, colors);
  const paidPayments = payments.filter((p) => p.status === PAYMENT_STATUS.PAID).length;
  const totalPayments = payments.length;
  const paymentProgress =
    totalPayments > 0 ? (paidPayments / totalPayments) * DISPLAY_LIMITS.PERCENTAGE_SCALE : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BalanceHeader
        club={club}
        balance={balance}
        balanceStatus={balanceStatus}
        paidPayments={paidPayments}
        totalPayments={totalPayments}
        chargesCount={customCharges.length}
        colors={colors}
        t={t}
      />
      <FeeTabs selectedTab={selectedTab} onTabChange={setSelectedTab} colors={colors} t={t} />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {selectedTab === MY_FEES_TAB.OVERVIEW && (
            <OverviewTab
              club={club}
              balance={balance}
              payments={payments}
              paidPayments={paidPayments}
              totalPayments={totalPayments}
              paymentProgress={paymentProgress}
              setSelectedTab={setSelectedTab}
              colors={colors}
              t={t}
            />
          )}
          {selectedTab === MY_FEES_TAB.HISTORY && (
            <HistoryTab payments={payments} colors={colors} t={t} />
          )}
          {selectedTab === MY_FEES_TAB.CHARGES && (
            <ChargesTab customCharges={customCharges} colors={colors} t={t} />
          )}
          <HelpCard colors={colors} t={t} />
          <View style={{ height: SPACING.XXL }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default MyFeesScreen;
