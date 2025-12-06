/**
 * Loading Screen Component
 * Reusable loading state display
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../shared/components';
import { useTheme } from '../contexts/ThemeContext';
import { designTokens } from '../shared/theme/designTokens';
import { mobileTypography } from '../shared/theme/mobileTypography';
import { layoutConstants } from '../shared/theme';
import { flexValues, ACTIVITY_INDICATOR_SIZE } from '../shared/constants';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const displayMessage = message ?? t('common.loading');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.large} color={colors.primary} />
      <Text style={[styles.message, { color: colors.textSecondary }]}>{displayMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  message: {
    marginTop: designTokens.spacing.md,
    ...mobileTypography.bodyLarge,
  },
});
