import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

interface BasicInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  labels: { title: string; namePlaceholder: string; descPlaceholder: string };
  colors: {
    surface: string;
    textPrimary: string;
  };
}

export function BasicInfoSection(props: BasicInfoSectionProps): React.JSX.Element {
  const { name, description, onNameChange, onDescriptionChange, labels, colors } = props;
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
      }),
    [spacing, radii, typography]
  );

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{labels.title}</Text>
      <Input placeholder={labels.namePlaceholder} value={name} onChangeText={onNameChange} />
      <Input
        placeholder={labels.descPlaceholder}
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        numberOfLines={4}
      />
    </View>
  );
}
