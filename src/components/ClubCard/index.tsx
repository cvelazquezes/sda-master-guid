/**
 * ClubCard Component
 * Displays club information in a card format
 * Supports dynamic theming (light/dark mode)
 */

import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { formatViewDetailsLabel } from '../../shared/utils/formatters';
import { A11Y_ROLE, COMPONENT_NAMES, TOUCH_OPACITY } from '../../shared/constants';
import { OPACITY_VALUE, ELEVATION } from '../../shared/constants/numbers';
import { ClubCardProps } from './types';
import { ClubIcon } from './ClubIcon';
import { ClubInfo } from './ClubInfo';
import { ClubActions } from './ClubActions';
import { styles } from './styles';

const ClubCardComponent: React.FC<ClubCardProps> = ({
  club,
  onPress,
  showAdminActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  // Shadow configuration from theme
  const shadowOpacity = isDark ? OPACITY_VALUE.MEDIUM : OPACITY_VALUE.LIGHT;
  const shadowElevation = isDark ? ELEVATION.LG : ELEVATION.MD;

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.surface,
      shadowColor: colors.shadow || '#000000',
      shadowOpacity,
      elevation: shadowElevation,
    },
    !club.isActive && {
      backgroundColor: colors.surfaceLight,
      opacity: OPACITY_VALUE.HIGH,
    },
  ];

  const CardContent = (
    <View style={cardStyle}>
      <ClubIcon
        isActive={club.isActive}
        primaryColor={colors.primary}
        inactiveColor={colors.textTertiary}
        activeBackground={colors.primaryAlpha10}
        inactiveBackground={colors.surfaceLight}
      />
      <ClubInfo
        club={club}
        textPrimaryColor={colors.textPrimary}
        textSecondaryColor={colors.textSecondary}
        textTertiaryColor={colors.textTertiary}
        primaryColor={colors.primary}
      />
      <ClubActions
        club={club}
        showAdminActions={showAdminActions}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onPress={onPress}
        colors={{ error: colors.error, success: colors.success, textTertiary: colors.textTertiary }}
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={TOUCH_OPACITY.default}
        accessible
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={formatViewDetailsLabel(club.name, t)}
        accessibilityHint={t('accessibility.doubleTapToOpenClubDetails')}
        accessibilityState={{ disabled: !club.isActive }}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

// Memoize component with custom comparison for performance
export const ClubCard = memo(ClubCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.club.id === nextProps.club.id &&
    prevProps.club.name === nextProps.club.name &&
    prevProps.club.description === nextProps.club.description &&
    prevProps.club.isActive === nextProps.club.isActive &&
    prevProps.club.memberCount === nextProps.club.memberCount &&
    prevProps.club.division === nextProps.club.division &&
    prevProps.club.union === nextProps.club.union &&
    prevProps.club.association === nextProps.club.association &&
    prevProps.club.church === nextProps.club.church &&
    prevProps.showAdminActions === nextProps.showAdminActions
  );
});

ClubCard.displayName = COMPONENT_NAMES.CLUB_CARD;
