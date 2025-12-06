import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Input } from '../../../shared/components';
import { designTokens, mobileTypography } from '../../../shared/theme';

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
});
