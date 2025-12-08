import React from 'react';
import { User, MemberBalance } from '../../../../types';
import { EmptyState } from '../../../components/primitives';
import { ICONS, MEMBER_TAB } from '../../../../shared/constants';
import { MemberTabValue } from './types';
import { PendingMemberCard } from './PendingMemberCard';
import { ApprovedMemberCard } from './ApprovedMemberCard';

interface MembersListProps {
  members: User[];
  balances: MemberBalance[];
  activeTab: MemberTabValue;
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
  onPress: (member: User) => void;
  onEditClasses: (member: User) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDelete: (id: string, name: string) => void;
  labels: Record<string, string>;
  t: (key: string) => string;
}

export function MembersList({
  members,
  balances,
  activeTab,
  onApprove,
  onReject,
  onPress,
  onEditClasses,
  onToggleStatus,
  onDelete,
  labels,
  t,
}: MembersListProps): React.JSX.Element {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={activeTab === MEMBER_TAB.PENDING ? ICONS.CLOCK_CHECK_OUTLINE : ICONS.ACCOUNT_SEARCH}
        title={
          activeTab === MEMBER_TAB.PENDING
            ? t('screens.clubMembers.noPendingApprovals')
            : t('screens.clubMembers.noMembersFound')
        }
        description={
          activeTab === MEMBER_TAB.PENDING
            ? t('screens.clubMembers.allRegistrationsProcessed')
            : t('screens.clubMembers.tryAdjustingFilters')
        }
      />
    );
  }

  if (activeTab === MEMBER_TAB.PENDING) {
    return (
      <>
        {members.map((m) => (
          <PendingMemberCard
            key={m.id}
            member={m}
            onApprove={onApprove}
            onReject={onReject}
            labels={labels}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {members.map((m) => (
        <ApprovedMemberCard
          key={m.id}
          member={m}
          balance={balances.find((b) => b.userId === m.id)}
          onPress={(): void => onPress(m)}
          onEditClasses={(): void => onEditClasses(m)}
          onToggleStatus={(): void => onToggleStatus(m.id, m.isActive)}
          onDelete={(): void => onDelete(m.id, m.name)}
          labels={labels}
        />
      ))}
    </>
  );
}
