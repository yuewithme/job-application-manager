import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import {
  applicationDetailInclude,
  applicationFullDetailInclude,
  toApplicationDetailDto,
  toApplicationDto,
} from "@/lib/application-dto";
import type {
  ApplicationDetailDto,
  ApplicationDto,
  ApplicationListQueryDto,
  CreateApplicationDto,
  PaginatedResult,
  UpdateApplicationDto,
} from "@/types";

function toDateOrNull(value: string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return new Date(value);
}

async function ensureUserExists(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
}

async function resolveCreateUserId(userId?: string) {
  if (userId) {
    await ensureUserExists(userId);
    return userId;
  }

  const defaultUser = await prisma.user.upsert({
    where: {
      email: "default@jobhunter.local",
    },
    update: {},
    create: {
      email: "default@jobhunter.local",
      name: "默认用户",
    },
    select: {
      id: true,
    },
  });

  return defaultUser.id;
}

function buildListWhere(query: ApplicationListQueryDto): Prisma.ApplicationWhereInput {
  const where: Prisma.ApplicationWhereInput = {};

  if (query.userId) {
    where.userId = query.userId;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.search) {
    where.OR = [
      {
        companyName: {
          contains: query.search,
        },
      },
      {
        jobTitle: {
          contains: query.search,
        },
      },
      {
        source: {
          contains: query.search,
        },
      },
    ];
  }

  return where;
}

function compareByDeadline(
  left: { deadlineAt: string | null; updatedAt: string },
  right: { deadlineAt: string | null; updatedAt: string },
  sortOrder: "asc" | "desc",
) {
  if (!left.deadlineAt && !right.deadlineAt) {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  }

  if (!left.deadlineAt) {
    return 1;
  }

  if (!right.deadlineAt) {
    return -1;
  }

  const leftTime = new Date(left.deadlineAt).getTime();
  const rightTime = new Date(right.deadlineAt).getTime();

  if (leftTime === rightTime) {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  }

  return sortOrder === "asc" ? leftTime - rightTime : rightTime - leftTime;
}

export async function listApplications(
  query: ApplicationListQueryDto,
): Promise<PaginatedResult<ApplicationDto>> {
  const where = buildListWhere(query);
  const skip = (query.page - 1) * query.pageSize;

  if (query.deadlineSort) {
    const [records, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: applicationDetailInclude,
      }),
      prisma.application.count({ where }),
    ]);

    const sorted = records
      .map(toApplicationDto)
      .sort((left, right) =>
        compareByDeadline(
          { deadlineAt: left.deadlineAt, updatedAt: left.updatedAt },
          { deadlineAt: right.deadlineAt, updatedAt: right.updatedAt },
          query.deadlineSort!,
        ),
      );

    return {
      items: sorted.slice(skip, skip + query.pageSize),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  const [records, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: applicationDetailInclude,
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: query.pageSize,
    }),
    prisma.application.count({ where }),
  ]);

  return {
    items: records.map(toApplicationDto),
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export async function getApplicationById(
  id: string,
): Promise<ApplicationDetailDto | null> {
  const record = await prisma.application.findUnique({
    where: { id },
    include: applicationFullDetailInclude,
  });

  if (!record) {
    return null;
  }

  return toApplicationDetailDto(record);
}

export async function createApplication(input: CreateApplicationDto) {
  const userId = await resolveCreateUserId(input.userId);

  const record = await prisma.application.create({
    data: {
      userId,
      companyName: input.companyName,
      jobTitle: input.jobTitle,
      status: input.status,
      priority: input.priority,
      city: input.city,
      source: input.source,
      sourceUrl: input.sourceUrl,
      salaryRange: input.salaryRange,
      notes: input.notes,
      appliedAt: toDateOrNull(input.appliedAt),
      deadlineAt: toDateOrNull(input.deadlineAt),
      nextAction: input.nextAction,
      nextActionAt: toDateOrNull(input.nextActionAt),
    },
    include: applicationDetailInclude,
  });

  return toApplicationDto(record);
}

export async function updateApplication(id: string, input: UpdateApplicationDto) {
  const existing = await prisma.application.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  if (input.userId) {
    await ensureUserExists(input.userId);
  }

  const record = await prisma.application.update({
    where: { id },
    data: {
      ...(input.userId !== undefined ? { userId: input.userId } : {}),
      ...(input.companyName !== undefined ? { companyName: input.companyName } : {}),
      ...(input.jobTitle !== undefined ? { jobTitle: input.jobTitle } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.source !== undefined ? { source: input.source } : {}),
      ...(input.sourceUrl !== undefined ? { sourceUrl: input.sourceUrl } : {}),
      ...(input.salaryRange !== undefined ? { salaryRange: input.salaryRange } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.appliedAt !== undefined
        ? { appliedAt: toDateOrNull(input.appliedAt) }
        : {}),
      ...(input.deadlineAt !== undefined
        ? { deadlineAt: toDateOrNull(input.deadlineAt) }
        : {}),
      ...(input.nextAction !== undefined ? { nextAction: input.nextAction } : {}),
      ...(input.nextActionAt !== undefined
        ? { nextActionAt: toDateOrNull(input.nextActionAt) }
        : {}),
    },
    include: applicationDetailInclude,
  });

  return toApplicationDto(record);
}

export async function deleteApplication(id: string) {
  const record = await prisma.application.findUnique({
    where: { id },
    include: applicationDetailInclude,
  });

  if (!record) {
    return null;
  }

  await prisma.application.delete({
    where: { id },
  });

  return toApplicationDto(record);
}
