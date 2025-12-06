import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from '../../../shared/components';
import { designTokens, mobileTypography, layoutConstants } from '../../../shared/theme';
import { dimensionValues } from '../../../shared/constants';

interface BasicInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  labels: { title: string; namePlaceholder: string; descPlaceholder: string };
  colors: {
    surface: string;
    textPrimary: string;
    border: string;
    inputBackground: string;
    textTertiary: string;
  };
}

export function BasicInfoSection(props: BasicInfoSectionProps): React.JSX.Element {
  const { name, description, onNameChange, onDescriptionChange, labels, colors } = props;
  const inputStyle = [
    styles.input,
    {
      borderColor: colors.border,
      color: colors.textPrimary,
      backgroundColor: colors.inputBackground,
    },
  ];
  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{labels.title}</Text>
      <TextInput
        style={inputStyle}
        placeholder={labels.namePlaceholder}
        placeholderTextColor={colors.textTertiary}
        value={name}
        onChangeText={onNameChange}
      />
      <TextInput
        style={[...inputStyle, styles.textArea]}
        placeholder={labels.descPlaceholder}
        placeholderTextColor={colors.textTertiary}
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        numberOfLines={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.md,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.md,
  },
  input: {
    borderWidth: designTokens.borderWidth.thin,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
    ...mobileTypography.bodyLarge,
  },
  textArea: {
    minHeight: dimensionValues.minHeight.textarea,
    textAlignVertical: layoutConstants.textAlignVertical.top,
  },
});
