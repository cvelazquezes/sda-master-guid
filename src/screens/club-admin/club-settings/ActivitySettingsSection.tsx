import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../../../shared/components';
import { MatchFrequency } from '../../../types';
import { designTokens, mobileTypography, layoutConstants } from '../../../shared/theme';
import { flexValues, GRID } from '../../../shared/constants';

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
  const optionStyle = [
    styles.selectOption,
    { borderColor: colors.border, backgroundColor: colors.inputBackground },
    selected && { backgroundColor: colors.primary, borderColor: colors.primary },
  ];
  const textStyle = [
    styles.selectOptionText,
    { color: colors.textSecondary },
    selected && { color: colors.textInverse, fontWeight: designTokens.fontWeight.semibold },
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

const styles = StyleSheet.create({
  section: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.md,
  },
  sectionTitle: { ...mobileTypography.heading3, marginBottom: designTokens.spacing.md },
  selectContainer: { marginBottom: designTokens.spacing.lg },
  selectLabel: { ...mobileTypography.bodyLargeBold, marginBottom: designTokens.spacing.md },
  selectOptions: { flexDirection: layoutConstants.flexDirection.row, gap: designTokens.spacing.md },
  selectOption: {
    flex: flexValues.one,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: designTokens.borderWidth.thin,
    alignItems: layoutConstants.alignItems.center,
  },
  selectOptionText: { ...mobileTypography.body },
});
