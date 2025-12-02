/**
 * Loading Screen Component
 * Reusable loading state display
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { designTokens } from '../shared/theme/designTokens';
import { mobileTypography } from '../shared/theme/mobileTypography';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={designTokens.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  message: {
    marginTop: designTokens.spacing.md,
    ...mobileTypography.bodyLarge,
    color: designTokens.colors.textSecondary,
  },
});

