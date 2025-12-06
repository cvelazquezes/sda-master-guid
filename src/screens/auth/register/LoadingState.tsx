import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../../shared/components';
import { mobileTypography, designTokens, layoutConstants } from '../../../shared/theme';
import { ACTIVITY_INDICATOR_SIZE, SAFE_AREA_EDGES, FLEX } from '../../../shared/constants';

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <View style={styles.container}>
        <ActivityIndicator
          size={ACTIVITY_INDICATOR_SIZE.large}
          color={designTokens.colors.primary}
        />
        <Text style={styles.text}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  container: {
    flex: FLEX.ONE,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  text: {
    ...mobileTypography.bodyMedium,
    marginTop: designTokens.spacing.md,
  },
});
