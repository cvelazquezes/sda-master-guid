import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';
import { createStyles, createLoadingStyles } from './styles';

interface LoadingStateProps {
  colors: Record<string, string>;
}

export function LoadingState({ colors }: LoadingStateProps): React.JSX.Element {
  const { spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const loadingStyles = useMemo(
    () => createLoadingStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerGradient, { backgroundColor: colors.primary }]}>
        <View style={loadingStyles.skeletonHeader}>
          <View
            style={[
              loadingStyles.skeleton,
              loadingStyles.skeletonTitle,
              { backgroundColor: `${colors.textInverse}30` },
            ]}
          />
          <View
            style={[
              loadingStyles.skeleton,
              loadingStyles.skeletonSubtitle,
              { backgroundColor: `${colors.textInverse}20` },
            ]}
          />
        </View>
      </View>
      <View style={loadingStyles.skeletonContent}>
        <View
          style={[
            loadingStyles.skeleton,
            loadingStyles.skeletonCard,
            { backgroundColor: colors.border },
          ]}
        />
        <View
          style={[
            loadingStyles.skeleton,
            loadingStyles.skeletonCard,
            { backgroundColor: colors.border },
          ]}
        />
      </View>
    </View>
  );
}

interface NotAMemberStateProps {
  colors: Record<string, string>;
  t: (key: string) => string;
}

export function NotAMemberState({ colors, t }: NotAMemberStateProps): React.JSX.Element {
  const { iconSizes, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const loadingStyles = useMemo(
    () => createLoadingStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerGradient, { backgroundColor: colors.textTertiary }]}>
        <View style={loadingStyles.emptyHeader}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_OFF_OUTLINE}
            size={iconSizes['3xl']}
            color={`${colors.textInverse}50`}
          />
          <Text style={[loadingStyles.emptyHeaderTitle, { color: colors.textInverse }]}>
            {t('screens.myFees.notAClubMember')}
          </Text>
          <Text style={[loadingStyles.emptyHeaderSubtitle, { color: `${colors.textInverse}80` }]}>
            {t('screens.myFees.joinClubToViewFees')}
          </Text>
        </View>
      </View>
    </View>
  );
}
