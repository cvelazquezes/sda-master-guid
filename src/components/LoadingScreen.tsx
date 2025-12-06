/**
 * Loading Screen Component
 * Reusable loading state display
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../shared/components';
import { designTokens } from '../shared/theme/designTokens';
import { mobileTypography } from '../shared/theme/mobileTypography';
import { layoutConstants } from '../shared/theme';
import { flexValues, ACTIVITY_INDICATOR_SIZE } from '../shared/constants';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { t } = useTranslation();
  const displayMessage = message ?? t('common.loading');

  return (
    <View style={styles.container}>
      <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.large} color={designTokens.colors.primary} />
      <Text style={styles.message}>{displayMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  message: {
    marginTop: designTokens.spacing.md,
    ...mobileTypography.bodyLarge,
    color: designTokens.colors.textSecondary,
  },
});
