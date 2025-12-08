export interface AgendaItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  responsibleMemberId?: string;
  responsibleMemberName?: string;
  description?: string;
  order: number;
}

// Reserved for future use
export interface MeetingPlan {
  id: string;
  date: Date;
  title: string;
  agenda: AgendaItem[];
  isShared: boolean;
  createdAt: Date;
}
