import type { ApplicationDto, ApplicationListPageDto, ApplicationListQueryDto } from "@/types";
import { applicationStatusValues, priorityValues } from "@/types";

export type ApplicationFilterStatus = "all" | (typeof applicationStatusValues)[number];
export type ApplicationFilterPriority = "all" | (typeof priorityValues)[number];
export type ApplicationDeadlineSort = "none" | "asc" | "desc";

export interface ApplicationListFilters {
  search: string;
  status: ApplicationFilterStatus;
  priority: ApplicationFilterPriority;
  deadlineSort: ApplicationDeadlineSort;
  page: number;
  pageSize: number;
}

type SearchParamValue = string | string[] | undefined;

export interface ApplicationPageSearchParams {
  search?: SearchParamValue;
  status?: SearchParamValue;
  priority?: SearchParamValue;
  deadlineSort?: SearchParamValue;
  page?: SearchParamValue;
  pageSize?: SearchParamValue;
}

function readFirst(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function readPositiveInt(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
}

function isApplicationStatus(value: string): value is (typeof applicationStatusValues)[number] {
  return applicationStatusValues.includes(value as (typeof applicationStatusValues)[number]);
}

function isPriorityValue(value: string): value is (typeof priorityValues)[number] {
  return priorityValues.includes(value as (typeof priorityValues)[number]);
}

export function readApplicationListFilters(
  searchParams?: ApplicationPageSearchParams,
): ApplicationListFilters {
  const search = readFirst(searchParams?.search)?.trim() ?? "";
  const statusValue = readFirst(searchParams?.status);
  const priorityValue = readFirst(searchParams?.priority);
  const deadlineSortValue = readFirst(searchParams?.deadlineSort);

  return {
    search,
    status: statusValue && isApplicationStatus(statusValue) ? statusValue : "all",
    priority: priorityValue && isPriorityValue(priorityValue) ? priorityValue : "all",
    deadlineSort:
      deadlineSortValue === "asc" || deadlineSortValue === "desc" ? deadlineSortValue : "none",
    page: readPositiveInt(readFirst(searchParams?.page), 1),
    pageSize: readPositiveInt(readFirst(searchParams?.pageSize), 100),
  };
}

export function toApplicationListQuery(filters: ApplicationListFilters): ApplicationListQueryDto {
  return {
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.status !== "all" ? { status: filters.status } : {}),
    ...(filters.priority !== "all" ? { priority: filters.priority } : {}),
    ...(filters.deadlineSort !== "none" ? { deadlineSort: filters.deadlineSort } : {}),
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function toApplicationListPageDto(
  result: { items: ApplicationDto[]; total: number; page: number; pageSize: number },
): ApplicationListPageDto {
  return {
    items: result.items.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      jobTitle: item.jobTitle,
      status: item.status,
      priority: item.priority,
      city: item.city,
      source: item.source,
      appliedAt: item.appliedAt,
      deadlineAt: item.deadlineAt,
      nextAction: item.nextAction,
      nextActionAt: item.nextActionAt,
      updatedAt: item.updatedAt,
      user: item.user,
    })),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
  };
}

export function buildApplicationsPath(filters: ApplicationListFilters) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.priority !== "all") {
    params.set("priority", filters.priority);
  }

  if (filters.deadlineSort !== "none") {
    params.set("deadlineSort", filters.deadlineSort);
  }

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  if (filters.pageSize !== 100) {
    params.set("pageSize", String(filters.pageSize));
  }

  const queryString = params.toString();
  return queryString.length > 0 ? `/applications?${queryString}` : "/applications";
}

export function hasActiveApplicationFilters(filters: ApplicationListFilters) {
  return (
    filters.search.length > 0 ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.deadlineSort !== "none"
  );
}
