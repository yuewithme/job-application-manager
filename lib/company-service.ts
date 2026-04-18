import { prisma } from "@/lib/prisma";
import type { ApplicationStatusValue, CompanyListItemDto, CompanyListPageDto } from "@/types";

const statusRank: Record<ApplicationStatusValue, number> = {
  BOOKMARKED: 1,
  TODO_APPLY: 2,
  APPLIED: 3,
  WRITTEN_TEST: 4,
  INTERVIEWING: 5,
  OFFER: 6,
  CLOSED: 7,
};

function isUpcomingDeadline(deadlineAt: Date | null, now: number, upcomingLimit: number) {
  if (!deadlineAt) {
    return false;
  }

  const deadlineTime = deadlineAt.getTime();
  return deadlineTime >= now && deadlineTime <= upcomingLimit;
}

export async function getCompanyListPageData(): Promise<CompanyListPageDto> {
  const records = await prisma.application.findMany({
    select: {
      companyName: true,
      status: true,
      updatedAt: true,
      deadlineAt: true,
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

  const now = Date.now();
  const upcomingLimit = now + 7 * 24 * 60 * 60 * 1000;
  const grouped = new Map<string, CompanyListItemDto>();

  for (const record of records) {
    const existing = grouped.get(record.companyName);
    const currentStatus = record.status as ApplicationStatusValue;

    if (!existing) {
      grouped.set(record.companyName, {
        companyName: record.companyName,
        applicationCount: 1,
        activeApplicationCount: record.status === "CLOSED" ? 0 : 1,
        topStatus: currentStatus,
        latestUpdatedAt: record.updatedAt.toISOString(),
        hasUpcomingDeadline: isUpcomingDeadline(record.deadlineAt, now, upcomingLimit),
      });
      continue;
    }

    existing.applicationCount += 1;

    if (record.status !== "CLOSED") {
      existing.activeApplicationCount += 1;
    }

    if (statusRank[currentStatus] > statusRank[existing.topStatus]) {
      existing.topStatus = currentStatus;
    }

    if (new Date(record.updatedAt).getTime() > new Date(existing.latestUpdatedAt).getTime()) {
      existing.latestUpdatedAt = record.updatedAt.toISOString();
    }

    existing.hasUpcomingDeadline =
      existing.hasUpcomingDeadline || isUpcomingDeadline(record.deadlineAt, now, upcomingLimit);
  }

  return {
    items: [...grouped.values()].sort(
      (left, right) =>
        new Date(right.latestUpdatedAt).getTime() - new Date(left.latestUpdatedAt).getTime(),
    ),
  };
}
