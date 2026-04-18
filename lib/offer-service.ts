import { prisma } from "@/lib/prisma";
import type { OfferListItemDto, OfferListPageDto } from "@/types";

function toOfferListItemDto(record: {
  id: string;
  companyName: string;
  jobTitle: string;
  priority: "low" | "medium" | "high";
  deadlineAt: Date | null;
  nextAction: string | null;
  nextActionAt: Date | null;
  updatedAt: Date;
}): OfferListItemDto {
  return {
    id: record.id,
    companyName: record.companyName,
    jobTitle: record.jobTitle,
    priority: record.priority,
    deadlineAt: record.deadlineAt?.toISOString() ?? null,
    nextAction: record.nextAction,
    nextActionAt: record.nextActionAt?.toISOString() ?? null,
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getOfferListPageData(): Promise<OfferListPageDto> {
  const records = await prisma.application.findMany({
    where: {
      status: "OFFER",
    },
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      priority: true,
      deadlineAt: true,
      nextAction: true,
      nextActionAt: true,
      updatedAt: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return {
    items: records.map(toOfferListItemDto),
    currentTime: new Date().toISOString(),
  };
}
