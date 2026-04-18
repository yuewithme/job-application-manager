import type {
  ApplicationStatusValue,
  IsoDateTimeString,
  PriorityValue,
} from "@/types/shared";

export interface DashboardStatusCounts {
  total: number;
  bookmarked: number;
  todoApply: number;
  applied: number;
  writtenTest: number;
  interviewing: number;
  offer: number;
  closed: number;
}

export interface DashboardTodoItemDto {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatusValue;
  priority: PriorityValue;
  nextAction: string;
  nextActionAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface DashboardDeadlineItemDto {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatusValue;
  priority: PriorityValue;
  deadlineAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface DashboardRecentItemDto {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatusValue;
  priority: PriorityValue;
  nextAction: string | null;
  nextActionAt: IsoDateTimeString | null;
  updatedAt: IsoDateTimeString;
}

export interface DashboardPageDto {
  lastSyncAt: IsoDateTimeString;
  stats: DashboardStatusCounts;
  todayTodos: DashboardTodoItemDto[];
  upcomingDeadlines: DashboardDeadlineItemDto[];
  recentApplications: DashboardRecentItemDto[];
}
