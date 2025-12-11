/**
 * ScreenHeader Primitive Component
 *
 * Standard header for screens with title and subtitle.
 * Uses Text primitive for proper theme integration.
 *
 * @example
 * <ScreenHeader
 *   title={t('screens.home.title')}
 *   subtitle={t('screens.home.subtitle')}
 * />
 */

import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { TEXT_COLOR, TEXT_VARIANT } from '../../../shared/constants';
import { useTheme } from '../../state/ThemeContext';
import { designTokens } from '../../theme/designTokens';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  style?: ViewStyle;
  testID?: string;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  children,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        style,
      ]}
      testID={testID}
    >
      <View style={styles.textContainer}>
        <Text variant={TEXT_VARIANT.DISPLAY_MEDIUM}>{title}</Text>
        {subtitle && (
          <Text
            variant={TEXT_VARIANT.BODY_LARGE}
            color={TEXT_COLOR.SECONDARY}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  textContainer: {
    marginBottom: designTokens.spacing.sm,
  },
  subtitle: {
    marginTop: designTokens.spacing.xs,
  },
});

export default ScreenHeader;
