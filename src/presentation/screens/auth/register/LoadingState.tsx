import React from 'react';
import { View, ActivityIndicator, TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ACTIVITY_INDICATOR_SIZE, SAFE_AREA_EDGES, FLEX } from '../../../../shared/constants';

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();

  const safeAreaStyle: ViewStyle = {
    flex: FLEX.ONE,
    backgroundColor: colors.backgroundPrimary,
  };

  const containerStyle: ViewStyle = {
    flex: FLEX.ONE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundPrimary,
  };

  const textStyle: TextStyle = {
    fontSize: typography.fontSizes.md,
    marginTop: spacing.md,
  };

  return (
    <SafeAreaView style={safeAreaStyle} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <View style={containerStyle}>
        <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.large} color={colors.primary} />
        <Text style={textStyle}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}
