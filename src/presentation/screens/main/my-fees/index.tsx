import React, { useState, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BalanceCard } from './BalanceHeader';
import { ChargesTab } from './ChargesTab';
import { FeeTabs } from './FeeTabs';
import { HelpCard } from './HelpCard';
import { HistoryTab } from './HistoryTab';
import { LoadingState, NotAMemberState } from './LoadingState';
import { OverviewTab } from './OverviewTab';
import { getBalanceStatus } from './statusUtils';
import { createStyles } from './styles';
import { useMyFees } from './useMyFees';
import { MY_FEES_TAB, PAYMENT_STATUS, DISPLAY_LIMITS } from '../../../../shared/constants';
import { SPACING } from '../../../../shared/constants/numbers';
import { PageHeader } from '../../../components/primitives';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';
import type { MyFeesTabValue } from './types';

const MyFeesScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
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
      <PageHeader
        showActions
        title={t('screens.myFees.title')}
        subtitle={t('screens.myFees.subtitle')}
      />
      <BalanceCard
        balance={balance}
        balanceStatus={balanceStatus}
        paidPayments={paidPayments}
        totalPayments={totalPayments}
        chargesCount={customCharges.length}
        colors={colors}
        t={t}
      />
      <FeeTabs selectedTab={selectedTab} colors={colors} t={t} onTabChange={setSelectedTab} />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.primary}
            onRefresh={onRefresh}
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
