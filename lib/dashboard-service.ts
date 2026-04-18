import { ApplicationStatus } from "@/generated/prisma/enums";

import { prisma } from "@/lib/prisma";
import type {
  DashboardDeadlineItemDto,
  DashboardPageDto,
  DashboardRecentItemDto,
  DashboardStatusCounts,
  DashboardTodoItemDto,
} from "@/types";

function createEmptyStatusCounts(total: number): DashboardStatusCounts {
  return {
    total,
    bookmarked: 0,
    todoApply: 0,
    applied: 0,
    writtenTest: 0,
    interviewing: 0,
    offer: 0,
    closed: 0,
  };
}

function mapStatusCounts(
  total: number,
  grouped: Array<{ status: ApplicationStatus; _count: { _all: number } }>,
) {
  const counts = createEmptyStatusCounts(total);

  for (const item of grouped) {
    switch (item.status) {
      case "BOOKMARKED":
        counts.bookmarked = item._count._all;
        break;
      case "TODO_APPLY":
        counts.todoApply = item._count._all;
        break;
      case "APPLIED":
        counts.applied = item._count._all;
        break;
      case "WRITTEN_TEST":
        counts.writtenTest = item._count._all;
        break;
      case "INTERVIEWING":
        counts.interviewing = item._count._all;
        break;
      case "OFFER":
        counts.offer = item._count._all;
        break;
      case "CLOSED":
        counts.closed = item._count._all;
        break;
    }
  }

  return counts;
}

function toTodoItem(item: {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  priority: "low" | "medium" | "high";
  nextAction: string | null;
  nextActionAt: Date | null;
  updatedAt: Date;
}): DashboardTodoItemDto | null {
  if (!item.nextAction || !item.nextActionAt) {
    return null;
  }

  return {
    id: item.id,
    companyName: item.companyName,
    jobTitle: item.jobTitle,
    status: item.status,
    priority: item.priority,
    nextAction: item.nextAction,
    nextActionAt: item.nextActionAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function toDeadlineItem(item: {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  priority: "low" | "medium" | "high";
  deadlineAt: Date | null;
  updatedAt: Date;
}): DashboardDeadlineItemDto | null {
  if (!item.deadlineAt) {
    return null;
  }

  return {
    id: item.id,
    companyName: item.companyName,
    jobTitle: item.jobTitle,
    status: item.status,
    priority: item.priority,
    deadlineAt: item.deadlineAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function toRecentItem(item: {
  id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  priority: "low" | "medium" | "high";
  nextAction: string | null;
  nextActionAt: Date | null;
  updatedAt: Date;
}): DashboardRecentItemDto {
  return {
    id: item.id,
    companyName: item.companyName,
    jobTitle: item.jobTitle,
    status: item.status,
    priority: item.priority,
    nextAction: item.nextAction,
    nextActionAt: item.nextActionAt?.toISOString() ?? null,
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function getDashboardPageData(): Promise<DashboardPageDto> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const [total, grouped, todoRows, deadlineRows, recentRows] = await Promise.all([
    prisma.application.count(),
    prisma.application.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
    prisma.application.findMany({
      where: {
        nextAction: {
          not: null,
        },
        nextActionAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        status: true,
        priority: true,
        nextAction: true,
        nextActionAt: true,
        updatedAt: true,
      },
      orderBy: [{ nextActionAt: "asc" }, { updatedAt: "desc" }],
      take: 5,
    }),
    prisma.application.findMany({
      where: {
        deadlineAt: {
          gte: now,
        },
      },
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        status: true,
        priority: true,
        deadlineAt: true,
        updatedAt: true,
      },
      orderBy: [{ deadlineAt: "asc" }, { updatedAt: "desc" }],
      take: 5,
    }),
    prisma.application.findMany({
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        status: true,
        priority: true,
        nextAction: true,
        nextActionAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
    }),
  ]);

  return {
    lastSyncAt: now.toISOString(),
    stats: mapStatusCounts(total, grouped),
    todayTodos: todoRows.map(toTodoItem).filter((item): item is DashboardTodoItemDto => item !== null),
    upcomingDeadlines: deadlineRows
      .map(toDeadlineItem)
      .filter((item): item is DashboardDeadlineItemDto => item !== null),
    recentApplications: recentRows.map(toRecentItem),
  };
}
