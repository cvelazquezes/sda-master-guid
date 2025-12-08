/**
 * SectionHeader Primitive Component
 *
 * Reusable section header with title and optional badge/action.
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 *
 * @example
 * <SectionHeader title={t('sections.overview')} />
 * <SectionHeader title={t('sections.members')} badge={12} />
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { FLEX, TEXT_VARIANT, TEXT_WEIGHT } from '../constants';
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
  const { colors, spacing, radii } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  };

  const titleContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: FLEX.ONE,
  };

  const badgeStyle: ViewStyle = {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    minWidth: spacing.xxl,
    height: SPACING.LG,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryAlpha10,
  };

  return (
    <View style={[containerStyle, style]} testID={testID}>
      <View style={titleContainerStyle}>
        <Text variant={TEXT_VARIANT.H2}>{title}</Text>
        {badge !== undefined && (
          <View style={badgeStyle}>
            <Text
              variant={TEXT_VARIANT.CAPTION}
              weight={TEXT_WEIGHT.BOLD}
              style={{ color: colors.primary }}
            >
              {badge}
            </Text>
          </View>
        )}
      </View>
      {action && <View style={{ marginLeft: spacing.md }}>{action}</View>}
    </View>
  );
};

export default SectionHeader;
