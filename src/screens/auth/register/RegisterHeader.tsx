import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { mobileTypography, designTokens, layoutConstants } from '../../../shared/theme';
import { ICONS } from '../../../shared/constants';

interface RegisterHeaderProps {
  title: string;
  subtitle: string;
}

export function RegisterHeader({ title, subtitle }: RegisterHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_PLUS}
        size={designTokens.iconSize['3xl']}
        color={designTokens.colors.primary}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xxl,
  },
  title: {
    ...mobileTypography.displayMedium,
    marginTop: designTokens.spacing.md,
  },
  subtitle: {
    ...mobileTypography.bodyLarge,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.sm,
  },
});
