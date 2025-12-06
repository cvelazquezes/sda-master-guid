import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { View, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { designTokens } from '../../../shared/theme';
import { ICONS, TOUCH_OPACITY, KEYBOARD_TYPE, ALL_MONTHS } from '../../../shared/constants';
import { DISPLAY_LIMITS } from '../../../shared/constants/http';
import { styles, settingsStyles } from './styles';
import { MONTH_KEYS } from './types';

interface SettingsTabProps {
  feeAmount: string;
  setFeeAmount: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  selectedMonths: number[];
  setSelectedMonths: (v: number[]) => void;
  feeSettingsActive: boolean;
  setFeeSettingsActive: (v: boolean) => void;
  onSave: () => void;
  onGenerateFees: () => void;
  t: (key: string) => string;
}

export function SettingsTab({
  feeAmount,
  setFeeAmount,
  currency,
  setCurrency,
  selectedMonths,
  setSelectedMonths,
  feeSettingsActive,
  setFeeSettingsActive,
  onSave,
  onGenerateFees,
  t,
}: SettingsTabProps): React.JSX.Element {
  const { colors } = useTheme();

  const toggleMonth = (monthIndex: number): void => {
    if (selectedMonths.includes(monthIndex)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== monthIndex));
    } else {
      setSelectedMonths([...selectedMonths, monthIndex].sort((a, b) => a - b));
    }
  };

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <InfoCard t={t} />
        <ActiveToggleCard
          active={feeSettingsActive}
          setActive={setFeeSettingsActive}
          colors={colors}
          t={t}
        />
        <AmountInputCard
          feeAmount={feeAmount}
          setFeeAmount={setFeeAmount}
          currency={currency}
          setCurrency={setCurrency}
          colors={colors}
          t={t}
        />
        <MonthSelectionCard
          selectedMonths={selectedMonths}
          toggleMonth={toggleMonth}
          selectAll={(): void => setSelectedMonths([...ALL_MONTHS])}
          clearAll={(): void => setSelectedMonths([])}
          t={t}
        />
        <ActionButtons
          onSave={onSave}
          feeSettingsActive={feeSettingsActive}
          onGenerateFees={onGenerateFees}
          colors={colors}
          t={t}
        />
      </View>
    </ScrollView>
  );
}

function InfoCard({ t }: { t: (key: string) => string }): React.JSX.Element {
  return (
    <View style={settingsStyles.infoCard}>
      <View style={settingsStyles.infoIconContainer}>
        <MaterialCommunityIcons
          name={ICONS.INFORMATION}
          size={designTokens.iconSize.md}
          color={designTokens.colors.primary}
        />
      </View>
      <View style={settingsStyles.infoTextContainer}>
        <Text style={settingsStyles.infoTitle}>{t('screens.clubFees.configureMonthlyFees')}</Text>
        <Text style={settingsStyles.infoText}>{t('screens.clubFees.setupDescription')}</Text>
      </View>
    </View>
  );
}

interface ActiveToggleCardProps {
  active: boolean;
  setActive: (v: boolean) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}

function ActiveToggleCard({
  active,
  setActive,
  colors,
  t,
}: ActiveToggleCardProps): React.JSX.Element {
  const trackColors = {
    false: designTokens.colors.borderLight,
    true: colors.primary,
  };
  const thumbColor = active ? colors.primary : designTokens.colors.backgroundSecondary;

  return (
    <View style={settingsStyles.settingCard}>
      <View style={settingsStyles.settingRow}>
        <View style={settingsStyles.settingLabelContainer}>
          <Text style={settingsStyles.settingLabel}>{t('screens.clubFees.enableMonthlyFees')}</Text>
          <Text style={settingsStyles.settingSubtext}>
            {t('screens.clubFees.activateFeeCollection')}
          </Text>
        </View>
        <Switch
          value={active}
          onValueChange={setActive}
          trackColor={trackColors}
          thumbColor={thumbColor}
        />
      </View>
    </View>
  );
}

interface AmountInputCardProps {
  feeAmount: string;
  setFeeAmount: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}

function AmountInputCard({
  feeAmount,
  setFeeAmount,
  currency,
  setCurrency,
  colors,
  t,
}: AmountInputCardProps): React.JSX.Element {
  const currencyMaxLength = 3;
  return (
    <View style={settingsStyles.inputCard}>
      <Text style={settingsStyles.inputLabel}>{t('screens.clubFees.monthlyFeeAmount')}</Text>
      <Text style={settingsStyles.inputSubtext}>{t('screens.clubFees.setRecurringAmount')}</Text>
      <View style={settingsStyles.amountRow}>
        <View style={settingsStyles.amountInputContainer}>
          <Text style={settingsStyles.currencySymbol}>$</Text>
          <TextInput
            style={settingsStyles.amountInput}
            value={feeAmount}
            onChangeText={setFeeAmount}
            keyboardType={KEYBOARD_TYPE.DECIMAL_PAD}
            placeholder={t('screens.clubFees.amountPlaceholder')}
            placeholderTextColor={colors.textTertiary}
          />
        </View>
        <View style={settingsStyles.currencyInputContainer}>
          <TextInput
            style={settingsStyles.currencyInput}
            value={currency}
            onChangeText={setCurrency}
            placeholder={t('screens.clubFees.currencyPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            maxLength={currencyMaxLength}
          />
        </View>
      </View>
    </View>
  );
}

interface MonthSelectionCardProps {
  selectedMonths: number[];
  toggleMonth: (i: number) => void;
  selectAll: () => void;
  clearAll: () => void;
  t: (key: string) => string;
}

function MonthSelectionCard({
  selectedMonths,
  toggleMonth,
  selectAll,
  clearAll,
  t,
}: MonthSelectionCardProps): React.JSX.Element {
  return (
    <View style={settingsStyles.inputCard}>
      <View style={settingsStyles.monthHeaderRow}>
        <View>
          <Text style={settingsStyles.inputLabel}>{t('screens.clubFees.activeMonths')}</Text>
          <Text style={settingsStyles.inputSubtext}>
            {t('screens.clubFees.selectMonthsPayment')}
          </Text>
        </View>
        <View style={settingsStyles.monthActions}>
          <TouchableOpacity onPress={selectAll} style={settingsStyles.monthActionBtn}>
            <Text style={settingsStyles.monthActionText}>{t('screens.clubFees.all')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} style={settingsStyles.monthActionBtn}>
            <Text style={settingsStyles.monthActionText}>{t('screens.clubFees.none')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={settingsStyles.monthGrid}>
        {MONTH_KEYS.map((monthKey, index) => {
          const monthNumber = index + 1;
          const isSelected = selectedMonths.includes(monthNumber);
          const monthName = t(monthKey);
          const chipStyle = [
            settingsStyles.monthChip,
            isSelected && settingsStyles.monthChipSelected,
          ];
          const textStyle = [
            settingsStyles.monthChipText,
            isSelected && settingsStyles.monthChipTextSelected,
          ];
          return (
            <TouchableOpacity
              key={monthNumber}
              style={chipStyle}
              onPress={(): void => toggleMonth(monthNumber)}
              activeOpacity={TOUCH_OPACITY.default}
            >
              <Text style={textStyle}>
                {monthName.substring(0, DISPLAY_LIMITS.MAX_PREVIEW_ITEMS)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

interface ActionButtonsProps {
  onSave: () => void;
  feeSettingsActive: boolean;
  onGenerateFees: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}

function ActionButtons({
  onSave,
  feeSettingsActive,
  onGenerateFees,
  colors,
  t,
}: ActionButtonsProps): React.JSX.Element {
  return (
    <View style={settingsStyles.actionButtonsContainer}>
      <TouchableOpacity
        style={[settingsStyles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={onSave}
        activeOpacity={TOUCH_OPACITY.light}
      >
        <MaterialCommunityIcons
          name={ICONS.CONTENT_SAVE}
          size={designTokens.iconSize.md}
          color={colors.textOnPrimary}
        />
        <Text variant="body" weight="semibold" color="onPrimary">
          {t('screens.clubFees.saveSettings')}
        </Text>
      </TouchableOpacity>
      {feeSettingsActive && (
        <TouchableOpacity
          style={[
            settingsStyles.secondaryButton,
            { backgroundColor: colors.surface, borderColor: colors.primary },
          ]}
          onPress={onGenerateFees}
          activeOpacity={TOUCH_OPACITY.light}
        >
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_PLUS}
            size={designTokens.iconSize.md}
            color={colors.primary}
          />
          <Text variant="body" weight="semibold" style={{ color: colors.primary }}>
            {t('screens.clubFees.generateFeesCurrentYear')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
