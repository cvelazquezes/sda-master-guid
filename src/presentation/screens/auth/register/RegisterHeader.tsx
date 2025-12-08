import React from 'react';
import { View, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';

interface RegisterHeaderProps {
  title: string;
  subtitle: string;
}

export function RegisterHeader({ title, subtitle }: RegisterHeaderProps): React.JSX.Element {
  const { colors, spacing, iconSizes, typography } = useTheme();

  const headerStyle = {
    alignItems: 'center' as const,
    marginBottom: spacing.xxl,
  };

  const titleStyle: TextStyle = {
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    marginTop: spacing.md,
  };

  const subtitleStyle: TextStyle = {
    fontSize: typography.fontSizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  };

  return (
    <View style={headerStyle}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_PLUS}
        size={iconSizes['3xl']}
        color={colors.primary}
      />
      <Text style={titleStyle}>{title}</Text>
      <Text style={subtitleStyle}>{subtitle}</Text>
    </View>
  );
}
