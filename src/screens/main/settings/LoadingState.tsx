import React from 'react';
import { View } from 'react-native';
import { styles, skeletonStyles } from './styles';

interface LoadingStateProps {
  colors: Record<string, string>;
}

export function LoadingState({ colors }: LoadingStateProps): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={skeletonStyles.skeletonProfile}>
          <View
            style={[skeletonStyles.skeletonAvatar, { backgroundColor: `${colors.textInverse}30` }]}
          />
          <View
            style={[skeletonStyles.skeletonName, { backgroundColor: `${colors.textInverse}20` }]}
          />
          <View
            style={[skeletonStyles.skeletonEmail, { backgroundColor: `${colors.textInverse}15` }]}
          />
        </View>
      </View>
    </View>
  );
}
