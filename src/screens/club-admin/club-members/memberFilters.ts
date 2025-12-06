import { User, UserRole, ApprovalStatus, PathfinderClass } from '../../../types';
import { FILTER_STATUS, STATUS, MEMBER_TAB } from '../../../shared/constants';
import { StatusFilterValue, MemberTabValue } from './types';

interface FilterParams {
  members: User[];
  searchQuery: string;
  statusFilter: StatusFilterValue;
  activeTab: MemberTabValue;
  classFilter: PathfinderClass[];
}

function matchesApproval(member: User, activeTab: MemberTabValue): boolean {
  const isApproved = member.approvalStatus === ApprovalStatus.APPROVED;
  const isPending = member.approvalStatus === ApprovalStatus.PENDING;
  return (
    (activeTab === MEMBER_TAB.APPROVED && isApproved) ||
    (activeTab === MEMBER_TAB.PENDING && isPending)
  );
}

function matchesSearchQuery(member: User, searchQuery: string): boolean {
  if (!searchQuery) {
    return true;
  }
  const searchLower = searchQuery.toLowerCase();
  return (
    member.name.toLowerCase().includes(searchLower) ||
    member.email.toLowerCase().includes(searchLower)
  );
}

function matchesStatusFilter(
  member: User,
  activeTab: MemberTabValue,
  statusFilter: StatusFilterValue
): boolean {
  if (activeTab === MEMBER_TAB.PENDING) {
    return true;
  }
  if (statusFilter === FILTER_STATUS.ALL) {
    return true;
  }
  if (statusFilter === STATUS.active) {
    return member.isActive;
  }
  if (statusFilter === STATUS.inactive) {
    return !member.isActive;
  }
  return true;
}

function matchesClassFilter(member: User, classFilter: PathfinderClass[]): boolean {
  if (classFilter.length === 0) {
    return true;
  }
  return member.classes && member.classes.some((c) => classFilter.includes(c));
}

export function filterMembers(params: FilterParams): User[] {
  const { members, searchQuery, statusFilter, activeTab, classFilter } = params;
  return members.filter((member) => {
    if (member.role === UserRole.CLUB_ADMIN) {
      return false;
    }
    return (
      matchesApproval(member, activeTab) &&
      matchesSearchQuery(member, searchQuery) &&
      matchesStatusFilter(member, activeTab, statusFilter) &&
      matchesClassFilter(member, classFilter)
    );
  });
}

export function countPendingMembers(members: User[]): number {
  return members.filter(
    (m) => m.approvalStatus === ApprovalStatus.PENDING && m.role !== UserRole.CLUB_ADMIN
  ).length;
}

export function countApprovedMembers(members: User[]): number {
  return members.filter((m) => m.approvalStatus === ApprovalStatus.APPROVED).length;
}

export function getAvailableClasses(members: User[]): PathfinderClass[] {
  const classes = new Set<PathfinderClass>();
  members.forEach((member) => {
    if (member.classes) {
      member.classes.forEach((c) => classes.add(c));
    }
  });
  return Array.from(classes);
}
