import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../../../shared/components';
import { MatchFrequency } from '../../../types';
import { useTheme } from '../../../contexts/ThemeContext';
import { FLEX, GRID } from '../../../shared/constants';

interface ActivitySettingsSectionProps {
  matchFrequency: MatchFrequency;
  groupSize: number;
  onFrequencyChange: (v: MatchFrequency) => void;
  onGroupSizeChange: (v: number) => void;
  labels: { title: string; frequency: string; groupSize: string };
  frequencyLabels: Record<MatchFrequency, string>;
  colors: {
    surface: string;
    textPrimary: string;
    textSecondary: string;
    textInverse: string;
    border: string;
    inputBackground: string;
    primary: string;
  };
}

// Option button component
function OptionButton({
  selected,
  label,
  onPress,
  colors,
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
  colors: ActivitySettingsSectionProps['colors'];
}): React.JSX.Element {
  const { spacing, radii, typography, borderWidth } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        selectOption: {
          flex: FLEX.ONE,
          padding: spacing.md,
          borderRadius: radii.md,
          borderWidth: borderWidth.thin,
          alignItems: 'center',
        } as ViewStyle,
        selectOptionText: {
          fontSize: typography.fontSizes.md,
        } as TextStyle,
      }),
    [spacing, radii, borderWidth, typography]
  );

  const optionStyle = [
    styles.selectOption,
    { borderColor: colors.border, backgroundColor: colors.inputBackground },
    selected && { backgroundColor: colors.primary, borderColor: colors.primary },
  ];
  const textStyle = [
    styles.selectOptionText,
    { color: colors.textSecondary },
    selected && { color: colors.textInverse, fontWeight: typography.fontWeights.semibold },
  ];
  return (
    <TouchableOpacity style={optionStyle} onPress={onPress}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

export function ActivitySettingsSection(props: ActivitySettingsSectionProps): React.JSX.Element {
  const {
    matchFrequency,
    groupSize,
    onFrequencyChange,
    onGroupSizeChange,
    labels,
    frequencyLabels,
    colors,
  } = props;
  const { spacing, radii, typography } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          padding: spacing.lg,
          borderRadius: radii.md,
          marginBottom: spacing.md,
        } as ViewStyle,
        sectionTitle: {
          fontSize: typography.fontSizes.lg,
          fontWeight: typography.fontWeights.bold,
          marginBottom: spacing.md,
        } as TextStyle,
        selectContainer: {
          marginBottom: spacing.lg,
        } as ViewStyle,
        selectLabel: {
          fontSize: typography.fontSizes.md,
          fontWeight: typography.fontWeights.bold,
          marginBottom: spacing.md,
        } as TextStyle,
        selectOptions: {
          flexDirection: 'row',
          gap: spacing.md,
        } as ViewStyle,
      }),
    [spacing, radii, typography]
  );

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{labels.title}</Text>
      <View style={styles.selectContainer}>
        <Text style={[styles.selectLabel, { color: colors.textPrimary }]}>{labels.frequency}</Text>
        <View style={styles.selectOptions}>
          {Object.values(MatchFrequency).map((freq) => (
            <OptionButton
              key={freq}
              selected={matchFrequency === freq}
              label={frequencyLabels[freq]}
              onPress={() => onFrequencyChange(freq)}
              colors={colors}
            />
          ))}
        </View>
      </View>
      <View style={styles.selectContainer}>
        <Text style={[styles.selectLabel, { color: colors.textPrimary }]}>{labels.groupSize}</Text>
        <View style={styles.selectOptions}>
          {[GRID.COLUMNS_2, GRID.COLUMNS_3].map((size) => (
            <OptionButton
              key={size}
              selected={groupSize === size}
              label={String(size)}
              onPress={() => onGroupSizeChange(size)}
              colors={colors}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
