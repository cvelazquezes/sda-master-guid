import React from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { CustomCharge } from '../../../types';
import { designTokens } from '../../../shared/theme';
import { ICONS } from '../../../shared/constants';
import { NUMERIC } from '../../../shared/constants/http';
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
  return (
    <View style={chargeStyles.header}>
      <View>
        <Text style={chargeStyles.title}>{t('screens.clubFees.customCharges')}</Text>
        <Text style={chargeStyles.subtitle}>{count} active charges</Text>
      </View>
      <TouchableOpacity style={chargeStyles.addButton} onPress={onAddCharge}>
        <MaterialCommunityIcons
          name={ICONS.PLUS}
          size={designTokens.iconSize.md}
          color={designTokens.colors.white}
        />
        <Text style={chargeStyles.addButtonText}>{t('screens.clubFees.newCharge')}</Text>
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
  const memberCount = charge.appliedToUserIds.length;
  const memberText =
    memberCount === 0
      ? t('screens.clubFees.allMembers')
      : t('screens.clubFees.memberCount', { count: memberCount });

  return (
    <View style={chargeStyles.card}>
      <View style={chargeStyles.cardHeader}>
        <Text style={chargeStyles.description}>{charge.description}</Text>
        <Text style={chargeStyles.amount}>${charge.amount.toFixed(NUMERIC.DECIMAL_PLACES)}</Text>
      </View>
      <View style={chargeStyles.details}>
        <View style={chargeStyles.detailRow}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_OUTLINE}
            size={designTokens.iconSize.sm}
            color={colors.textSecondary}
          />
          <Text style={chargeStyles.detailText}>
            Due: {new Date(charge.dueDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={chargeStyles.detailRow}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_GROUP_OUTLINE}
            size={designTokens.iconSize.sm}
            color={colors.textSecondary}
          />
          <Text style={chargeStyles.detailText}>{memberText}</Text>
        </View>
      </View>
    </View>
  );
}

function EmptyCharges({ t }: { t: (key: string) => string }): React.JSX.Element {
  return (
    <View style={emptyStyles.container}>
      <MaterialCommunityIcons
        name={ICONS.FILE_DOCUMENT_OUTLINE}
        size={designTokens.iconSize['4xl']}
        color={designTokens.colors.borderLight}
      />
      <Text style={emptyStyles.text}>{t('screens.clubFees.noCustomCharges')}</Text>
      <Text style={emptyStyles.subtext}>{t('screens.clubFees.createChargesDescription')}</Text>
    </View>
  );
}
