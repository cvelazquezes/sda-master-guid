import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { CustomCharge } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';
import { NUMERIC } from '../../../../shared/constants/http';
import { DATE_LOCALE_OPTIONS } from '../../../../shared/constants/formats';
import { styles, itemStyles } from './styles';

interface ChargesTabProps {
  customCharges: CustomCharge[];
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function ChargesTab({ customCharges, colors, t }: ChargesTabProps): React.JSX.Element {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          {t('screens.myFees.customCharges')}
        </Text>
      </View>
      {customCharges.map((charge, index) => (
        <ChargeItem
          key={charge.id}
          charge={charge}
          index={index}
          total={customCharges.length}
          colors={colors}
          t={t}
        />
      ))}
      {customCharges.length === 0 && <EmptyCharges colors={colors} t={t} />}
    </View>
  );
}

function ChargeItem({
  charge,
  index,
  total,
  colors,
  t,
}: {
  charge: CustomCharge;
  index: number;
  total: number;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const borderStyle =
    index < total - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : {};

  return (
    <View style={[itemStyles.chargeItem, borderStyle]}>
      <View style={[itemStyles.chargeIcon, { backgroundColor: `${colors.primary}15` }]}>
        <MaterialCommunityIcons
          name={ICONS.FILE_DOCUMENT_OUTLINE}
          size={iconSizes.lg}
          color={colors.primary}
        />
      </View>
      <View style={itemStyles.chargeInfo}>
        <Text style={[itemStyles.chargeTitle, { color: colors.textPrimary }]}>
          {charge.description}
        </Text>
        <Text style={[itemStyles.chargeMeta, { color: colors.textTertiary }]}>
          {t('screens.myFees.due', {
            date: new Date(charge.dueDate).toLocaleDateString(
              undefined,
              DATE_LOCALE_OPTIONS.SHORT_DATE
            ),
          })}
        </Text>
      </View>
      <Text style={[itemStyles.chargeAmount, { color: colors.primary }]}>
        ${charge.amount.toFixed(NUMERIC.DECIMAL_PLACES)}
      </Text>
    </View>
  );
}

function EmptyCharges({
  colors,
  t,
}: {
  colors: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={ICONS.CHECK_CIRCLE_OUTLINE}
        size={iconSizes['3xl']}
        color={colors.success}
      />
      <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
        {t('screens.myFees.noCustomCharges')}
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
        {t('screens.myFees.noAdditionalCharges')}
      </Text>
    </View>
  );
}
