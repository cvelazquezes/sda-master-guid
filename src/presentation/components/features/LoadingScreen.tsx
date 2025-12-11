/**
 * Loading Screen Component
 * Reusable loading state display
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React from 'react';
import { View, ActivityIndicator, type TextStyle, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FLEX, ACTIVITY_INDICATOR_SIZE } from '../../../shared/constants';
import { useTheme } from '../../state/ThemeContext';
import { Text } from '../primitives';

type LoadingScreenProps = {
  message?: string;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { t } = useTranslation();
  const { colors, spacing, typography } = useTheme();
  const displayMessage = message ?? t('common.loading');

  const containerStyle: ViewStyle = {
    flex: FLEX.ONE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  };

  const messageStyle: TextStyle = {
    marginTop: spacing.md,
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
  };

  return (
    <View style={containerStyle}>
      <ActivityIndicator
        size={ACTIVITY_INDICATOR_SIZE.large}
        color={colors.primary}
        accessibilityLabel="Loading"
      />
      <Text style={messageStyle}>{displayMessage}</Text>
    </View>
  );
};
