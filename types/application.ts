import type {
  Application as PrismaApplication,
  ApplicationStageLog as PrismaApplicationStageLog,
  Attachment as PrismaAttachment,
  Interview as PrismaInterview,
  Reminder as PrismaReminder,
  User as PrismaUser,
} from "@/generated/prisma/client";
import type { ApplicationStatus, Priority } from "@/generated/prisma/enums";
import type {
  AttachmentDetailDto,
  AttachmentFormDto,
} from "@/types/attachment";
import type {
  InterviewDetailDto,
  InterviewFormDto,
} from "@/types/interview";
import type {
  ReminderDetailDto,
  ReminderFormDto,
} from "@/types/reminder";
import type { ApplicationStageLogDetailDto } from "@/types/stage-log";
import type {
  ApplicationStatusValue,
  IsoDateTimeString,
  PriorityValue,
  UserSummary,
} from "@/types/shared";

export type UserEntity = PrismaUser;
export type ApplicationEntity = PrismaApplication;
export type ApplicationStageLogEntity = PrismaApplicationStageLog;
export type InterviewEntity = PrismaInterview;
export type ReminderEntity = PrismaReminder;
export type AttachmentEntity = PrismaAttachment;

export type ApplicationStatusType = ApplicationStatus;
export type PriorityType = Priority;

export interface UserSummaryDto {
  id: string;
  email: string;
  name: string | null;
}

export interface ApplicationDto {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  priority: Priority;
  city: string | null;
  source: string | null;
  sourceUrl: string | null;
  salaryRange: string | null;
  notes: string | null;
  appliedAt: string | null;
  deadlineAt: string | null;
  nextAction: string | null;
  nextActionAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: UserSummaryDto;
}

export interface CreateApplicationDto {
  userId: string;
  companyName: string;
  jobTitle: string;
  status?: ApplicationStatus;
  priority?: Priority;
  city?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  salaryRange?: string | null;
  notes?: string | null;
  appliedAt?: string | null;
  deadlineAt?: string | null;
  nextAction?: string | null;
  nextActionAt?: string | null;
}

export interface UpdateApplicationDto {
  userId?: string;
  companyName?: string;
  jobTitle?: string;
  status?: ApplicationStatus;
  priority?: Priority;
  city?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  salaryRange?: string | null;
  notes?: string | null;
  appliedAt?: string | null;
  deadlineAt?: string | null;
  nextAction?: string | null;
  nextActionAt?: string | null;
}

export interface ApplicationListQueryDto {
  userId?: string;
  status?: ApplicationStatus;
  priority?: Priority;
  search?: string;
  deadlineSort?: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatusValue;
  priority: PriorityValue;
  city: string | null;
  source: string | null;
  sourceUrl: string | null;
  salaryRange: string | null;
  notes: string | null;
  appliedAt: IsoDateTimeString | null;
  deadlineAt: IsoDateTimeString | null;
  nextAction: string | null;
  nextActionAt: IsoDateTimeString | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface ApplicationListItemDto {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatusValue;
  priority: PriorityValue;
  city: string | null;
  source: string | null;
  appliedAt: IsoDateTimeString | null;
  deadlineAt: IsoDateTimeString | null;
  nextAction: string | null;
  nextActionAt: IsoDateTimeString | null;
  updatedAt: IsoDateTimeString;
  user: UserSummary;
}

export interface ApplicationListPageDto {
  items: ApplicationListItemDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApplicationDetailDto extends Application {
  user: UserSummary;
  stageLogs: ApplicationStageLogDetailDto[];
  interviews: InterviewDetailDto[];
  reminders: ReminderDetailDto[];
  attachments: AttachmentDetailDto[];
}

export interface ApplicationDetailPageDto {
  application: ApplicationDetailDto;
}

export interface ApplicationFormDto {
  userId: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatusValue;
  priority: PriorityValue;
  city: string;
  source: string;
  sourceUrl: string;
  salaryRange: string;
  notes: string;
  appliedAt: string;
  deadlineAt: string;
  nextAction: string;
  nextActionAt: string;
}

export interface ApplicationFormPageDto {
  initialValues: ApplicationFormDto;
}

export interface ApplicationRelationsDetailDto {
  interviews: InterviewDetailDto[];
  reminders: ReminderDetailDto[];
  attachments: AttachmentDetailDto[];
}

export interface ApplicationRelationsFormDto {
  interview: InterviewFormDto;
  reminder: ReminderFormDto;
  attachment: AttachmentFormDto;
}
