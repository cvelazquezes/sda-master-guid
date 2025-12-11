import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStyles, createSettingsStyles } from './styles';
import { MONTH_KEYS } from './types';
import {
  ICONS,
  TOUCH_OPACITY,
  KEYBOARD_TYPE,
  ALL_MONTHS,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../../shared/constants';
import { DISPLAY_LIMITS } from '../../../../shared/constants/ui';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type SettingsTabProps = {
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
};

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
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );
  const settingsStyles = useMemo(
    () => createSettingsStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

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
        <InfoCard t={t} settingsStyles={settingsStyles} />
        <ActiveToggleCard
          active={feeSettingsActive}
          setActive={setFeeSettingsActive}
          colors={colors}
          t={t}
          settingsStyles={settingsStyles}
        />
        <AmountInputCard
          feeAmount={feeAmount}
          setFeeAmount={setFeeAmount}
          currency={currency}
          setCurrency={setCurrency}
          t={t}
          settingsStyles={settingsStyles}
        />
        <MonthSelectionCard
          selectedMonths={selectedMonths}
          toggleMonth={toggleMonth}
          selectAll={(): void => setSelectedMonths([...ALL_MONTHS])}
          clearAll={(): void => setSelectedMonths([])}
          t={t}
          settingsStyles={settingsStyles}
        />
        <ActionButtons
          feeSettingsActive={feeSettingsActive}
          colors={colors}
          t={t}
          settingsStyles={settingsStyles}
          onSave={onSave}
          onGenerateFees={onGenerateFees}
        />
      </View>
    </ScrollView>
  );
}

function InfoCard({
  t,
  settingsStyles,
}: {
  t: (key: string) => string;
  settingsStyles: ReturnType<typeof createSettingsStyles>;
}): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={settingsStyles.infoCard}>
      <View style={settingsStyles.infoIconContainer}>
        <MaterialCommunityIcons
          name={ICONS.INFORMATION}
          size={iconSizes.md}
          color={colors.primary}
        />
      </View>
      <View style={settingsStyles.infoTextContainer}>
        <Text style={settingsStyles.infoTitle}>{t('screens.clubFees.configureMonthlyFees')}</Text>
        <Text style={settingsStyles.infoText}>{t('screens.clubFees.setupDescription')}</Text>
      </View>
    </View>
  );
}

type ActiveToggleCardProps = {
  active: boolean;
  setActive: (v: boolean) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
  settingsStyles: ReturnType<typeof createSettingsStyles>;
};

function ActiveToggleCard({
  active,
  setActive,
  colors,
  t,
  settingsStyles,
}: ActiveToggleCardProps): React.JSX.Element {
  const trackColors = {
    false: colors.borderLight,
    true: colors.primary,
  };
  const thumbColor = active ? colors.primary : colors.backgroundSecondary;

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
          trackColor={trackColors}
          thumbColor={thumbColor}
          accessibilityLabel="Enable monthly fees toggle"
          onValueChange={setActive}
        />
      </View>
    </View>
  );
}

type AmountInputCardProps = {
  feeAmount: string;
  setFeeAmount: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  t: (key: string) => string;
  settingsStyles: ReturnType<typeof createSettingsStyles>;
};

function AmountInputCard({
  feeAmount,
  setFeeAmount,
  currency,
  setCurrency,
  t,
  settingsStyles,
}: AmountInputCardProps): React.JSX.Element {
  const currencyMaxLength = 3;
  return (
    <View style={settingsStyles.inputCard}>
      <Text style={settingsStyles.inputLabel}>{t('screens.clubFees.monthlyFeeAmount')}</Text>
      <Text style={settingsStyles.inputSubtext}>{t('screens.clubFees.setRecurringAmount')}</Text>
      <View style={settingsStyles.amountRow}>
        <View style={settingsStyles.amountInputWrapper}>
          <Input
            value={feeAmount}
            keyboardType={KEYBOARD_TYPE.DECIMAL_PAD}
            placeholder={`$ ${t('screens.clubFees.amountPlaceholder')}`}
            onChangeText={setFeeAmount}
          />
        </View>
        <View style={settingsStyles.currencyInputWrapper}>
          <Input
            value={currency}
            placeholder={t('screens.clubFees.currencyPlaceholder')}
            maxLength={currencyMaxLength}
            onChangeText={setCurrency}
          />
        </View>
      </View>
    </View>
  );
}

type MonthSelectionCardProps = {
  selectedMonths: number[];
  toggleMonth: (i: number) => void;
  selectAll: () => void;
  clearAll: () => void;
  t: (key: string) => string;
  settingsStyles: ReturnType<typeof createSettingsStyles>;
};

function MonthSelectionCard({
  selectedMonths,
  toggleMonth,
  selectAll,
  clearAll,
  t,
  settingsStyles,
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
          <TouchableOpacity
            style={settingsStyles.monthActionBtn}
            accessibilityRole="button"
            accessibilityLabel="Select all months"
            onPress={selectAll}
          >
            <Text style={settingsStyles.monthActionText}>{t('screens.clubFees.all')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={settingsStyles.monthActionBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear all months"
            onPress={clearAll}
          >
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
              activeOpacity={TOUCH_OPACITY.default}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={monthName}
              onPress={(): void => toggleMonth(monthNumber)}
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

type ActionButtonsProps = {
  onSave: () => void;
  feeSettingsActive: boolean;
  onGenerateFees: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
  settingsStyles: ReturnType<typeof createSettingsStyles>;
};

function ActionButtons({
  onSave,
  feeSettingsActive,
  onGenerateFees,
  colors,
  t,
  settingsStyles,
}: ActionButtonsProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={settingsStyles.actionButtonsContainer}>
      <TouchableOpacity
        style={[settingsStyles.primaryButton, { backgroundColor: colors.primary }]}
        activeOpacity={TOUCH_OPACITY.light}
        accessibilityRole="button"
        accessibilityLabel="Save settings"
        onPress={onSave}
      >
        <MaterialCommunityIcons
          name={ICONS.CONTENT_SAVE}
          size={iconSizes.md}
          color={colors.textOnPrimary}
        />
        <Text
          variant={TEXT_VARIANT.BODY}
          weight={TEXT_WEIGHT.SEMIBOLD}
          color={TEXT_COLOR.ON_PRIMARY}
        >
          {t('screens.clubFees.saveSettings')}
        </Text>
      </TouchableOpacity>
      {feeSettingsActive && (
        <TouchableOpacity
          style={[
            settingsStyles.secondaryButton,
            { backgroundColor: colors.surface, borderColor: colors.primary },
          ]}
          activeOpacity={TOUCH_OPACITY.light}
          accessibilityRole="button"
          accessibilityLabel="Generate fees"
          onPress={onGenerateFees}
        >
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_PLUS}
            size={iconSizes.md}
            color={colors.primary}
          />
          <Text
            variant={TEXT_VARIANT.BODY}
            weight={TEXT_WEIGHT.SEMIBOLD}
            style={{ color: colors.primary }}
          >
            {t('screens.clubFees.generateFeesCurrentYear')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
