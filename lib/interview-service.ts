import { ApplicationStatus } from "@/generated/prisma/enums";

import { prisma } from "@/lib/prisma";
import type {
  CreateInterviewRecordDto,
  InterviewDetailDto,
  InterviewScheduleItemDto,
  InterviewSchedulePageDto,
} from "@/types";

function toInterviewScheduleItemDto(record: {
  id: string;
  applicationId: string;
  round: number;
  title: string;
  interviewType: string | null;
  scheduledAt: Date;
  result: string | null;
  application: {
    companyName: string;
    jobTitle: string;
  };
}): InterviewScheduleItemDto {
  return {
    id: record.id,
    applicationId: record.applicationId,
    companyName: record.application.companyName,
    jobTitle: record.application.jobTitle,
    round: record.round,
    title: record.title,
    interviewType: record.interviewType,
    scheduledAt: record.scheduledAt.toISOString(),
    result: record.result,
  };
}

function toInterviewDetailDto(record: {
  id: string;
  applicationId: string;
  round: number;
  title: string;
  interviewType: string | null;
  scheduledAt: Date;
  location: string | null;
  meetingUrl: string | null;
  interviewer: string | null;
  result: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): InterviewDetailDto {
  return {
    id: record.id,
    applicationId: record.applicationId,
    round: record.round,
    title: record.title,
    interviewType: record.interviewType,
    scheduledAt: record.scheduledAt.toISOString(),
    location: record.location,
    meetingUrl: record.meetingUrl,
    interviewer: record.interviewer,
    result: record.result,
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

const statusesPromotedToInterviewing: Set<ApplicationStatus> = new Set([
  ApplicationStatus.BOOKMARKED,
  ApplicationStatus.TODO_APPLY,
  ApplicationStatus.APPLIED,
  ApplicationStatus.WRITTEN_TEST,
]);

export async function createInterviewRecord(
  applicationId: string,
  input: CreateInterviewRecordDto,
) {
  const result = await prisma.$transaction(async (tx) => {
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!application) {
      return null;
    }

    const maxRound = await tx.interview.aggregate({
      where: {
        applicationId,
      },
      _max: {
        round: true,
      },
    });

    const nextRound = (maxRound._max.round ?? 0) + 1;

    const createdInterview = await tx.interview.create({
      data: {
        applicationId,
        round: nextRound,
        title: input.roundName,
        interviewType: input.mode ?? null,
        scheduledAt: new Date(input.interviewAt),
        result: input.result ?? null,
        notes: input.notes ?? null,
      },
    });

    let statusChanged = false;

    if (statusesPromotedToInterviewing.has(application.status)) {
      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: ApplicationStatus.INTERVIEWING,
        },
      });

      await tx.applicationStageLog.create({
        data: {
          applicationId,
          fromStatus: application.status,
          toStatus: ApplicationStatus.INTERVIEWING,
          note: `新增面试记录：${input.roundName}`,
          changedAt: new Date(),
        },
      });

      statusChanged = true;
    }

    return {
      interview: toInterviewDetailDto(createdInterview),
      statusChanged,
      applicationStatus: statusChanged
        ? ApplicationStatus.INTERVIEWING
        : application.status,
    };
  });

  return result;
}

export async function listInterviewSchedules(): Promise<InterviewScheduleItemDto[]> {
  const records = await prisma.interview.findMany({
    include: {
      application: {
        select: {
          companyName: true,
          jobTitle: true,
        },
      },
    },
    orderBy: [
      {
        scheduledAt: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return records.map(toInterviewScheduleItemDto);
}

export async function getInterviewSchedulePageData(): Promise<InterviewSchedulePageDto> {
  return {
    items: await listInterviewSchedules(),
    currentTime: new Date().toISOString(),
  };
}
