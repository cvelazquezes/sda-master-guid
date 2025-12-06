/**
 * SectionHeader Primitive Component
 *
 * Reusable section header with title and optional badge/action.
 * Uses Text primitive for proper theme integration.
 *
 * @example
 * <SectionHeader title={t('sections.overview')} />
 * <SectionHeader title={t('sections.members')} badge={12} />
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { layoutConstants } from '../theme';
import { FLEX } from '../constants';
import { SPACING } from '../constants/numbers';
import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  badge?: string | number;
  action?: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  badge,
  action,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.titleContainer}>
        <Text variant="h2">{title}</Text>
        {badge !== undefined && (
          <View style={[styles.badge, { backgroundColor: colors.primaryAlpha10 }]}>
            <Text variant="caption" weight="bold" style={{ color: colors.primary }}>
              {badge}
            </Text>
          </View>
        )}
      </View>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    marginBottom: designTokens.spacing.lg,
  },
  titleContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
    flex: FLEX.ONE,
  },
  badge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    minWidth: designTokens.spacing.xxl,
    height: SPACING.LG,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  actionContainer: {
    marginLeft: designTokens.spacing.md,
  },
});

export default SectionHeader;
