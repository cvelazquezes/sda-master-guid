import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { MemberBalance } from '../../types';
import { designTokens } from '../../shared/theme';
import { ICONS } from '../../shared/constants';
import { NUMERIC } from '../../shared/constants/validation';
import { styles } from './styles';

interface UserBalanceSectionProps {
  balance: MemberBalance;
  balanceColor: string;
  borderColor: string;
  errorColor: string;
  errorLightColor: string;
}

export const UserBalanceSection: React.FC<UserBalanceSectionProps> = ({
  balance,
  balanceColor,
  borderColor,
  errorColor,
  errorLightColor,
}) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.balanceSection, { borderTopColor: borderColor }]}>
      <View style={styles.balanceRow}>
        <MaterialCommunityIcons
          name={ICONS.WALLET}
          size={designTokens.icon.sizes.sm}
          color={balanceColor}
        />
        <Text style={[styles.balanceText, { color: balanceColor }]}>
          {t('components.userCard.balance.label')}: $
          {Math.abs(balance.balance).toFixed(NUMERIC.DECIMAL_PLACES)}{' '}
          {balance.balance < 0 ? t('components.userCard.balance.owes') : ''}
        </Text>
      </View>
      {balance.overdueCharges > 0 && (
        <View style={[styles.overdueWarning, { backgroundColor: errorLightColor }]}>
          <MaterialCommunityIcons
            name={ICONS.ALERT_CIRCLE}
            size={designTokens.icon.sizes.xs}
            color={errorColor}
          />
          <Text style={[styles.overdueWarningText, { color: errorColor }]}>
            ${balance.overdueCharges.toFixed(NUMERIC.DECIMAL_PLACES)}{' '}
            {t('components.userCard.balance.overdue')}
          </Text>
        </View>
      )}
    </View>
  );
};
