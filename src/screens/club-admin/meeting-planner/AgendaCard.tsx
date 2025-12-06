import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { mobileIconSizes, designTokens } from '../../../shared/theme';
import { ICONS, TEXT_LINES, MOVE_DIRECTION } from '../../../shared/constants';
import { agendaCardStyles, assignButtonStyles } from './styles';
import { AgendaItem } from './types';

interface AgendaCardProps {
  item: AgendaItem;
  index: number;
  totalItems: number;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onRemoveMember: () => void;
  onMove: (direction: typeof MOVE_DIRECTION.UP | typeof MOVE_DIRECTION.DOWN) => void;
  t: (key: string) => string;
}

export function AgendaCard({
  item,
  index,
  totalItems,
  onEdit,
  onDelete,
  onAssign,
  onRemoveMember,
  onMove,
  t,
}: AgendaCardProps): React.JSX.Element {
  return (
    <View style={agendaCardStyles.card}>
      <View style={agendaCardStyles.orderBadge}>
        <Text style={agendaCardStyles.orderText}>{index + 1}</Text>
      </View>
      <AgendaContent item={item} onAssign={onAssign} onRemoveMember={onRemoveMember} t={t} />
      <AgendaActions
        index={index}
        totalItems={totalItems}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
      />
    </View>
  );
}

interface AgendaContentProps {
  item: AgendaItem;
  onAssign: () => void;
  onRemoveMember: () => void;
  t: (key: string) => string;
}

function AgendaContent({
  item,
  onAssign,
  onRemoveMember,
  t,
}: AgendaContentProps): React.JSX.Element {
  return (
    <View style={agendaCardStyles.content}>
      <View style={agendaCardStyles.header}>
        <Text style={agendaCardStyles.title} numberOfLines={TEXT_LINES.double}>
          {item.title}
        </Text>
        <View style={agendaCardStyles.timeChip}>
          <MaterialCommunityIcons
            name={ICONS.CLOCK_OUTLINE}
            size={mobileIconSizes.tiny}
            color={designTokens.colors.textSecondary}
          />
          <Text style={agendaCardStyles.timeText}>{item.estimatedMinutes}m</Text>
        </View>
      </View>
      {item.description && (
        <Text style={agendaCardStyles.description} numberOfLines={TEXT_LINES.double}>
          {item.description}
        </Text>
      )}
      <ResponsibleSection item={item} onAssign={onAssign} onRemoveMember={onRemoveMember} t={t} />
    </View>
  );
}

interface ResponsibleSectionProps {
  item: AgendaItem;
  onAssign: () => void;
  onRemoveMember: () => void;
  t: (key: string) => string;
}

function ResponsibleSection({
  item,
  onAssign,
  onRemoveMember,
  t,
}: ResponsibleSectionProps): React.JSX.Element {
  return (
    <View style={agendaCardStyles.responsibleSection}>
      {item.responsibleMemberId ? (
        <View style={agendaCardStyles.memberChip}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT}
            size={mobileIconSizes.small}
            color={designTokens.colors.primary}
          />
          <Text style={agendaCardStyles.memberName} numberOfLines={TEXT_LINES.single}>
            {item.responsibleMemberName}
          </Text>
          <TouchableOpacity onPress={onRemoveMember}>
            <MaterialCommunityIcons
              name={ICONS.CLOSE_CIRCLE}
              size={mobileIconSizes.small}
              color={designTokens.colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={assignButtonStyles.button} onPress={onAssign}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_PLUS}
            size={mobileIconSizes.small}
            color={designTokens.colors.primary}
          />
          <Text style={assignButtonStyles.text}>{t('screens.meetingPlanner.assignMember')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface AgendaActionsProps {
  index: number;
  totalItems: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: typeof MOVE_DIRECTION.UP | typeof MOVE_DIRECTION.DOWN) => void;
}

function AgendaActions({
  index,
  totalItems,
  onEdit,
  onDelete,
  onMove,
}: AgendaActionsProps): React.JSX.Element {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;
  const upColor = isFirst ? designTokens.colors.borderLight : designTokens.colors.textSecondary;
  const downColor = isLast ? designTokens.colors.borderLight : designTokens.colors.textSecondary;

  return (
    <View style={agendaCardStyles.actions}>
      <View style={agendaCardStyles.moveButtons}>
        <TouchableOpacity
          style={[agendaCardStyles.moveButton, isFirst && agendaCardStyles.moveButtonDisabled]}
          onPress={(): void => onMove(MOVE_DIRECTION.UP)}
          disabled={isFirst}
        >
          <MaterialCommunityIcons
            name={ICONS.CHEVRON_UP}
            size={mobileIconSizes.medium}
            color={upColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[agendaCardStyles.moveButton, isLast && agendaCardStyles.moveButtonDisabled]}
          onPress={(): void => onMove(MOVE_DIRECTION.DOWN)}
          disabled={isLast}
        >
          <MaterialCommunityIcons
            name={ICONS.CHEVRON_DOWN}
            size={mobileIconSizes.medium}
            color={downColor}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={agendaCardStyles.actionButton} onPress={onEdit}>
        <MaterialCommunityIcons
          name={ICONS.PENCIL}
          size={mobileIconSizes.medium}
          color={designTokens.colors.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity style={agendaCardStyles.actionButton} onPress={onDelete}>
        <MaterialCommunityIcons
          name={ICONS.DELETE}
          size={mobileIconSizes.medium}
          color={designTokens.colors.error}
        />
      </TouchableOpacity>
    </View>
  );
}
