import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { User } from '../../../types';
import { designTokens } from '../../../shared/theme';
import {
  ANIMATION,
  ICONS,
  DATE_FORMATS,
  TOUCH_OPACITY,
  TEXT_LINES,
  KEYBOARD_TYPE,
} from '../../../shared/constants';
import { settingsStyles } from './styles';
import { modalStyles } from './modalStyles';

interface ChargeModalProps {
  visible: boolean;
  onClose: () => void;
  modalWidth: number;
  windowHeight: number;
  chargeDescription: string;
  setChargeDescription: (v: string) => void;
  chargeAmount: string;
  setChargeAmount: (v: string) => void;
  chargeDueDate: string;
  setChargeDueDate: (v: string) => void;
  chargeApplyToAll: boolean;
  setChargeApplyToAll: (v: boolean) => void;
  selectedMemberIds: string[];
  setSelectedMemberIds: (v: string[]) => void;
  members: User[];
  onCreate: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

const MODAL_HEIGHT_RATIO = 0.85;

export function ChargeModal({
  visible,
  onClose,
  modalWidth,
  windowHeight,
  chargeDescription,
  setChargeDescription,
  chargeAmount,
  setChargeAmount,
  chargeDueDate,
  setChargeDueDate,
  chargeApplyToAll,
  setChargeApplyToAll,
  selectedMemberIds,
  setSelectedMemberIds,
  members,
  onCreate,
  t,
}: ChargeModalProps): React.JSX.Element {
  const { colors } = useTheme();
  const maxHeight = windowHeight * MODAL_HEIGHT_RATIO;

  return (
    <Modal visible={visible} animationType={ANIMATION.FADE} transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.content, { width: modalWidth, maxHeight }]}>
          <ModalHeader onClose={onClose} colors={colors} t={t} />
          <ScrollView style={modalStyles.body} showsVerticalScrollIndicator={false}>
            <DescriptionInput
              value={chargeDescription}
              onChange={setChargeDescription}
              colors={colors}
              t={t}
            />
            <AmountInput value={chargeAmount} onChange={setChargeAmount} colors={colors} t={t} />
            <DueDateInput value={chargeDueDate} onChange={setChargeDueDate} colors={colors} t={t} />
            <ApplyToSection
              chargeApplyToAll={chargeApplyToAll}
              setChargeApplyToAll={setChargeApplyToAll}
              selectedMemberIds={selectedMemberIds}
              setSelectedMemberIds={setSelectedMemberIds}
              members={members}
              colors={colors}
              t={t}
            />
          </ScrollView>
          <ModalFooter onClose={onClose} onCreate={onCreate} t={t} />
        </View>
      </View>
    </Modal>
  );
}

interface ModalHeaderProps {
  onClose: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}

function ModalHeader({ onClose, colors, t }: ModalHeaderProps): React.JSX.Element {
  return (
    <View style={modalStyles.header}>
      <Text style={modalStyles.title}>{t('screens.clubFees.createCustomCharge')}</Text>
      <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={designTokens.iconSize.lg}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

interface InputProps {
  value: string;
  onChange: (v: string) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}

function DescriptionInput({ value, onChange, colors, t }: InputProps): React.JSX.Element {
  return (
    <View style={modalStyles.inputGroup}>
      <Text style={modalStyles.label}>{t('screens.clubFees.description')}</Text>
      <TextInput
        style={modalStyles.input}
        value={value}
        onChangeText={onChange}
        placeholder={t('screens.clubFees.descriptionPlaceholder')}
        placeholderTextColor={colors.textTertiary}
        multiline
        numberOfLines={TEXT_LINES.double}
      />
    </View>
  );
}

function AmountInput({ value, onChange, colors, t }: InputProps): React.JSX.Element {
  return (
    <View style={modalStyles.inputGroup}>
      <Text style={modalStyles.label}>{t('screens.clubFees.amount')}</Text>
      <View style={settingsStyles.amountInputContainer}>
        <Text style={settingsStyles.currencySymbol}>$</Text>
        <TextInput
          style={[settingsStyles.amountInput, { paddingLeft: designTokens.spacing.none }]}
          value={value}
          onChangeText={onChange}
          keyboardType={KEYBOARD_TYPE.DECIMAL_PAD}
          placeholder={t('screens.clubFees.amountPlaceholder')}
          placeholderTextColor={colors.textTertiary}
        />
      </View>
    </View>
  );
}

function DueDateInput({ value, onChange, colors, t }: InputProps): React.JSX.Element {
  return (
    <View style={modalStyles.inputGroup}>
      <Text style={modalStyles.label}>{t('screens.clubFees.dueDateLabel')}</Text>
      <TextInput
        style={modalStyles.input}
        value={value}
        onChangeText={onChange}
        placeholder={DATE_FORMATS.ISO_DATE}
        placeholderTextColor={colors.textTertiary}
      />
      <Text style={modalStyles.hint}>{t('screens.clubFees.dueDateFormat')}</Text>
    </View>
  );
}

interface ApplyToSectionProps {
  chargeApplyToAll: boolean;
  setChargeApplyToAll: (v: boolean) => void;
  selectedMemberIds: string[];
  setSelectedMemberIds: (v: string[]) => void;
  members: User[];
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

function ApplyToSection({
  chargeApplyToAll,
  setChargeApplyToAll,
  selectedMemberIds,
  setSelectedMemberIds,
  members,
  colors,
  t,
}: ApplyToSectionProps): React.JSX.Element {
  const toggleAll = (): void => {
    setChargeApplyToAll(true);
    setSelectedMemberIds([]);
  };
  const toggleSelect = (): void => setChargeApplyToAll(false);

  return (
    <View style={modalStyles.inputGroup}>
      <Text style={modalStyles.label}>{t('screens.clubFees.applyTo')}</Text>
      <View style={modalStyles.applyToContainer}>
        <ApplyToOption
          icon={ICONS.ACCOUNT_GROUP}
          label={t('screens.clubFees.allMembersOption')}
          active={chargeApplyToAll}
          onPress={toggleAll}
          colors={colors}
        />
        <ApplyToOption
          icon={ICONS.ACCOUNT_MULTIPLE_CHECK}
          label={t('screens.clubFees.selectMembersOption')}
          active={!chargeApplyToAll}
          onPress={toggleSelect}
          colors={colors}
        />
      </View>
      {!chargeApplyToAll && (
        <MemberSelection
          selectedMemberIds={selectedMemberIds}
          setSelectedMemberIds={setSelectedMemberIds}
          members={members}
          t={t}
        />
      )}
    </View>
  );
}

interface ApplyToOptionProps {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
  colors: Record<string, string>;
}

function ApplyToOption({
  icon,
  label,
  active,
  onPress,
  colors,
}: ApplyToOptionProps): React.JSX.Element {
  const optionStyle = [modalStyles.applyToOption, active && modalStyles.applyToOptionActive];
  const textStyle = [modalStyles.applyToText, active && modalStyles.applyToTextActive];
  const iconColor = active ? colors.primary : colors.textSecondary;
  return (
    <TouchableOpacity style={optionStyle} onPress={onPress} activeOpacity={TOUCH_OPACITY.default}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.ACCOUNT_GROUP}
        size={designTokens.iconSize.md}
        color={iconColor}
      />
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

function MemberItem({
  member,
  isSelected,
  onToggle,
}: {
  member: User;
  isSelected: boolean;
  onToggle: () => void;
}): React.JSX.Element {
  const itemStyle = [modalStyles.memberItem, isSelected && modalStyles.memberItemSelected];
  const checkboxStyle = [modalStyles.checkbox, isSelected && modalStyles.checkboxSelected];
  return (
    <TouchableOpacity
      key={member.id}
      style={itemStyle}
      onPress={onToggle}
      activeOpacity={TOUCH_OPACITY.default}
    >
      <View style={modalStyles.memberItemLeft}>
        <View style={checkboxStyle}>
          {isSelected && (
            <MaterialCommunityIcons
              name={ICONS.CHECK}
              size={designTokens.iconSize.sm}
              color={designTokens.colors.white}
            />
          )}
        </View>
        <View style={modalStyles.memberItemInfo}>
          <Text style={modalStyles.memberItemName}>{member.name}</Text>
          <Text style={modalStyles.memberItemEmail}>{member.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface MemberSelectionProps {
  selectedMemberIds: string[];
  setSelectedMemberIds: (v: string[]) => void;
  members: User[];
  t: (key: string, opts?: Record<string, unknown>) => string;
}

function MemberSelection({
  selectedMemberIds,
  setSelectedMemberIds,
  members,
  t,
}: MemberSelectionProps): React.JSX.Element {
  const toggleMember = (id: string): void => {
    setSelectedMemberIds(
      selectedMemberIds.includes(id)
        ? selectedMemberIds.filter((m) => m !== id)
        : [...selectedMemberIds, id]
    );
  };
  const toggleSelectAll = (): void => {
    setSelectedMemberIds(
      selectedMemberIds.length === members.length ? [] : members.map((m) => m.id)
    );
  };
  const label =
    selectedMemberIds.length === members.length
      ? t('screens.clubFees.clearAll')
      : t('screens.clubFees.selectAll');

  return (
    <View style={modalStyles.memberSelectionContainer}>
      <View style={modalStyles.memberSelectionHeader}>
        <Text style={modalStyles.memberSelectionTitle}>
          {t('screens.clubFees.selectedOfTotal', {
            selected: selectedMemberIds.length,
            total: members.length,
          })}
        </Text>
        <TouchableOpacity onPress={toggleSelectAll} style={modalStyles.selectAllButton}>
          <Text style={modalStyles.selectAllText}>{label}</Text>
        </TouchableOpacity>
      </View>
      <View style={modalStyles.membersList}>
        {members.map((m) => (
          <MemberItem
            key={m.id}
            member={m}
            isSelected={selectedMemberIds.includes(m.id)}
            onToggle={(): void => toggleMember(m.id)}
          />
        ))}
      </View>
    </View>
  );
}

interface ModalFooterProps {
  onClose: () => void;
  onCreate: () => void;
  t: (key: string) => string;
}

function ModalFooter({ onClose, onCreate, t }: ModalFooterProps): React.JSX.Element {
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity
        style={modalStyles.cancelButton}
        onPress={onClose}
        activeOpacity={TOUCH_OPACITY.default}
      >
        <Text style={modalStyles.cancelText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={modalStyles.createButton}
        onPress={onCreate}
        activeOpacity={TOUCH_OPACITY.light}
      >
        <MaterialCommunityIcons
          name={ICONS.PLUS_CIRCLE}
          size={designTokens.iconSize.md}
          color={designTokens.colors.white}
        />
        <Text style={modalStyles.createText}>{t('screens.clubFees.createCharge')}</Text>
      </TouchableOpacity>
    </View>
  );
}
