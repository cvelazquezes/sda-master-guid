import React from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { CustomCharge } from '../../../../types';
import {
  ICONS,
  TEXT_ALIGN,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../../shared/constants';
import { NUMERIC } from '../../../../shared/constants/validation';
import { styles, chargeStyles, emptyStyles } from './styles';

interface ChargesTabProps {
  customCharges: CustomCharge[];
  refreshing: boolean;
  onRefresh: () => void;
  onAddCharge: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function ChargesTab({
  customCharges,
  refreshing,
  onRefresh,
  onAddCharge,
  t,
}: ChargesTabProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={styles.tabContent}>
      <ChargesHeader count={customCharges.length} onAddCharge={onAddCharge} t={t} />
      {customCharges.length === 0 ? (
        <EmptyCharges t={t} />
      ) : (
        <FlatList
          data={customCharges}
          keyExtractor={(item): string => item.id}
          contentContainerStyle={chargeStyles.header}
          renderItem={({ item }): React.JSX.Element => (
            <ChargeCard charge={item} colors={colors} t={t} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

function ChargesHeader({
  count,
  onAddCharge,
  t,
}: {
  count: number;
  onAddCharge: () => void;
  t: (key: string) => string;
}): React.JSX.Element {
  const { colors, iconSizes } = useTheme();
  return (
    <View style={[chargeStyles.header, { backgroundColor: colors.surface }]}>
      <View>
        <Text variant={TEXT_VARIANT.H3} color={TEXT_COLOR.PRIMARY}>
          {t('screens.clubFees.customCharges')}
        </Text>
        <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.SECONDARY}>
          {count} active charges
        </Text>
      </View>
      <TouchableOpacity
        style={[chargeStyles.addButton, { backgroundColor: colors.primary }]}
        onPress={onAddCharge}
      >
        <MaterialCommunityIcons
          name={ICONS.PLUS}
          size={iconSizes.md}
          color={colors.textOnPrimary}
        />
        <Text
          variant={TEXT_VARIANT.LABEL}
          weight={TEXT_WEIGHT.SEMIBOLD}
          color={TEXT_COLOR.ON_PRIMARY}
        >
          {t('screens.clubFees.newCharge')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ChargeCard({
  charge,
  colors,
  t,
}: {
  charge: CustomCharge;
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const memberCount = charge.appliedToUserIds.length;
  const memberText =
    memberCount === 0
      ? t('screens.clubFees.allMembers')
      : t('screens.clubFees.memberCount', { count: memberCount });

  return (
    <View
      style={[
        chargeStyles.card,
        { backgroundColor: colors.surface, borderLeftColor: colors.primary },
      ]}
    >
      <View style={chargeStyles.cardHeader}>
        <Text
          variant={TEXT_VARIANT.BODY}
          weight={TEXT_WEIGHT.SEMIBOLD}
          style={chargeStyles.description}
        >
          {charge.description}
        </Text>
        <Text variant={TEXT_VARIANT.H3} style={{ color: colors.primary }}>
          ${charge.amount.toFixed(NUMERIC.DECIMAL_PLACES)}
        </Text>
      </View>
      <View style={chargeStyles.details}>
        <View style={chargeStyles.detailRow}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_OUTLINE}
            size={iconSizes.sm}
            color={colors.textSecondary}
          />
          <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
            Due: {new Date(charge.dueDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={chargeStyles.detailRow}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_GROUP_OUTLINE}
            size={iconSizes.sm}
            color={colors.textSecondary}
          />
          <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
            {memberText}
          </Text>
        </View>
      </View>
    </View>
  );
}

function EmptyCharges({ t }: { t: (key: string) => string }): React.JSX.Element {
  const { colors, iconSizes } = useTheme();
  return (
    <View style={emptyStyles.container}>
      <MaterialCommunityIcons
        name={ICONS.FILE_DOCUMENT_OUTLINE}
        size={iconSizes['4xl']}
        color={colors.border}
      />
      <Text
        variant={TEXT_VARIANT.BODY}
        weight={TEXT_WEIGHT.SEMIBOLD}
        color={TEXT_COLOR.TERTIARY}
        align={TEXT_ALIGN.CENTER}
      >
        {t('screens.clubFees.noCustomCharges')}
      </Text>
      <Text
        variant={TEXT_VARIANT.BODY_SMALL}
        color={TEXT_COLOR.TERTIARY}
        align={TEXT_ALIGN.CENTER}
        style={emptyStyles.subtext}
      >
        {t('screens.clubFees.createChargesDescription')}
      </Text>
    </View>
  );
}
