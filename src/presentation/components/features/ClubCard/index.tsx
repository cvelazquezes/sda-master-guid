/**
 * ClubCard Component
 * Displays club information in a card format
 * Uses EntityCard for unified card behavior and theming
 */

import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ClubActions } from './ClubActions';
import { ClubIcon } from './ClubIcon';
import { ClubInfo } from './ClubInfo';
import { styles } from './styles';
import { COMPONENT_NAMES } from '../../../../shared/constants';
import { formatViewDetailsLabel } from '../../../../shared/utils/formatters';
import { useTheme } from '../../../state/ThemeContext';
import {
  EntityCard,
  type EntityCardActionProps,
  type EntityCardRenderProps,
} from '../../primitives/EntityCard';
import type { ClubCardProps } from './types';
import type { Club } from '../../../../types';

const ClubCardComponent: React.FC<ClubCardProps> = ({
  club,
  onPress,
  showAdminActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Render icon using render prop pattern
  const renderIcon = useCallback(
    ({ isActive }: EntityCardRenderProps<Club>) => (
      <ClubIcon
        isActive={isActive}
        primaryColor={colors.primary}
        inactiveColor={colors.textTertiary}
        activeBackground={colors.primaryAlpha10}
        inactiveBackground={colors.surfaceLight}
      />
    ),
    [colors]
  );

  // Render info section
  const renderInfo = useCallback(
    ({ entity, isActive }: EntityCardRenderProps<Club>) => (
      <ClubInfo
        club={entity}
        textPrimaryColor={isActive ? colors.textPrimary : colors.textTertiary}
        textSecondaryColor={isActive ? colors.textSecondary : colors.textTertiary}
        textTertiaryColor={colors.textTertiary}
        primaryColor={colors.primary}
      />
    ),
    [colors]
  );

  // Render actions section
  const renderActions = useCallback(
    ({ entity, onPress: cardOnPress }: EntityCardActionProps<Club>) => (
      <ClubActions
        club={entity}
        showAdminActions={showAdminActions}
        colors={{ error: colors.error, success: colors.success, textTertiary: colors.textTertiary }}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onPress={cardOnPress}
      />
    ),
    [showAdminActions, onToggleStatus, onDelete, colors]
  );

  return (
    <EntityCard
      entity={club}
      isActive={club.isActive}
      renderIcon={renderIcon}
      renderInfo={renderInfo}
      renderActions={renderActions}
      accessibilityLabel={formatViewDetailsLabel(club.name, t)}
      accessibilityHint={t('accessibility.doubleTapToOpenClubDetails')}
      style={styles.card}
      testID={`club-card-${club.id}`}
      onPress={onPress}
    />
  );
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
