import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../primitives';
import { MemberBalance } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';
import { EMPTY_VALUE, ICONS, SINGLE_SPACE } from '../../../../shared/constants';
import { NUMERIC } from '../../../../shared/constants/validation';
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
  const { iconSizes } = useTheme();

  return (
    <View style={[styles.balanceSection, { borderTopColor: borderColor }]}>
      <View style={styles.balanceRow}>
        <MaterialCommunityIcons name={ICONS.WALLET} size={iconSizes.sm} color={balanceColor} />
        <Text style={[styles.balanceText, { color: balanceColor }]}>
          {t('components.userCard.balance.label')}: $
          {Math.abs(balance.balance).toFixed(NUMERIC.DECIMAL_PLACES)}
          {SINGLE_SPACE}
          {balance.balance < 0 ? t('components.userCard.balance.owes') : EMPTY_VALUE}
        </Text>
      </View>
      {balance.overdueCharges > 0 && (
        <View style={[styles.overdueWarning, { backgroundColor: errorLightColor }]}>
          <MaterialCommunityIcons
            name={ICONS.ALERT_CIRCLE}
            size={iconSizes.xs}
            color={errorColor}
          />
          <Text style={[styles.overdueWarningText, { color: errorColor }]}>
            ${balance.overdueCharges.toFixed(NUMERIC.DECIMAL_PLACES)}
            {SINGLE_SPACE}
            {t('components.userCard.balance.overdue')}
          </Text>
        </View>
      )}
    </View>
  );
};
