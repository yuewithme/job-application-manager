import { prisma } from "@/lib/prisma";
import type { InterviewScheduleItemDto, InterviewSchedulePageDto } from "@/types";

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
