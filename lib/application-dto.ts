import type { Prisma } from "@/generated/prisma/client";

import type {
  ApplicationDetailDto,
  ApplicationDto,
  AttachmentDetailDto,
  InterviewDetailDto,
  ReminderDetailDto,
  UserSummaryDto,
} from "@/types";

export const applicationDetailInclude = {
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
} satisfies Prisma.ApplicationInclude;

export const applicationFullDetailInclude = {
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
  stageLogs: {
    orderBy: {
      changedAt: "asc",
    },
  },
  interviews: {
    orderBy: [
      {
        scheduledAt: "asc",
      },
      {
        round: "asc",
      },
    ],
  },
  reminders: {
    orderBy: {
      remindAt: "asc",
    },
  },
  attachments: {
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.ApplicationInclude;

type ApplicationRecord = Prisma.ApplicationGetPayload<{
  include: typeof applicationDetailInclude;
}>;

type ApplicationDetailRecord = Prisma.ApplicationGetPayload<{
  include: typeof applicationFullDetailInclude;
}>;

function toUserSummary(user: ApplicationRecord["user"]): UserSummaryDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export function toApplicationDto(record: ApplicationRecord): ApplicationDto {
  return {
    id: record.id,
    userId: record.userId,
    companyName: record.companyName,
    jobTitle: record.jobTitle,
    status: record.status,
    priority: record.priority,
    city: record.city,
    source: record.source,
    sourceUrl: record.sourceUrl,
    salaryRange: record.salaryRange,
    notes: record.notes,
    appliedAt: record.appliedAt?.toISOString() ?? null,
    deadlineAt: record.deadlineAt?.toISOString() ?? null,
    nextAction: record.nextAction,
    nextActionAt: record.nextActionAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    user: toUserSummary(record.user),
  };
}

function toInterviewDetailDto(
  interview: ApplicationDetailRecord["interviews"][number],
): InterviewDetailDto {
  return {
    id: interview.id,
    applicationId: interview.applicationId,
    round: interview.round,
    title: interview.title,
    interviewType: interview.interviewType,
    scheduledAt: interview.scheduledAt.toISOString(),
    location: interview.location,
    meetingUrl: interview.meetingUrl,
    interviewer: interview.interviewer,
    result: interview.result,
    notes: interview.notes,
    createdAt: interview.createdAt.toISOString(),
    updatedAt: interview.updatedAt.toISOString(),
  };
}

function toReminderDetailDto(
  reminder: ApplicationDetailRecord["reminders"][number],
): ReminderDetailDto {
  return {
    id: reminder.id,
    applicationId: reminder.applicationId,
    title: reminder.title,
    remindAt: reminder.remindAt.toISOString(),
    isCompleted: reminder.isCompleted,
    notes: reminder.notes,
    createdAt: reminder.createdAt.toISOString(),
    updatedAt: reminder.updatedAt.toISOString(),
  };
}

function toAttachmentDetailDto(
  attachment: ApplicationDetailRecord["attachments"][number],
): AttachmentDetailDto {
  return {
    id: attachment.id,
    applicationId: attachment.applicationId,
    fileName: attachment.fileName,
    fileType: attachment.fileType,
    fileUrl: attachment.fileUrl,
    notes: attachment.notes,
    createdAt: attachment.createdAt.toISOString(),
    updatedAt: attachment.updatedAt.toISOString(),
  };
}

export function toApplicationDetailDto(
  record: ApplicationDetailRecord,
): ApplicationDetailDto {
  return {
    id: record.id,
    userId: record.userId,
    companyName: record.companyName,
    jobTitle: record.jobTitle,
    status: record.status,
    priority: record.priority,
    city: record.city,
    source: record.source,
    sourceUrl: record.sourceUrl,
    salaryRange: record.salaryRange,
    notes: record.notes,
    appliedAt: record.appliedAt?.toISOString() ?? null,
    deadlineAt: record.deadlineAt?.toISOString() ?? null,
    nextAction: record.nextAction,
    nextActionAt: record.nextActionAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    user: toUserSummary(record.user),
    stageLogs: record.stageLogs.map((log) => ({
      id: log.id,
      applicationId: log.applicationId,
      fromStatus: log.fromStatus,
      toStatus: log.toStatus,
      note: log.note,
      changedAt: log.changedAt.toISOString(),
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    })),
    interviews: record.interviews.map(toInterviewDetailDto),
    reminders: record.reminders.map(toReminderDetailDto),
    attachments: record.attachments.map(toAttachmentDetailDto),
  };
}
