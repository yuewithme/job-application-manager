import { ApplicationStatus, Priority } from "@/generated/prisma/enums";
import type {
  ApplicationListQueryDto,
  CreateApplicationDto,
  UpdateApplicationDto,
} from "@/types";

type ValidationErrors = Record<string, string[]>;

interface ValidationSuccess<T> {
  success: true;
  data: T;
}

interface ValidationFailure {
  success: false;
  errors: ValidationErrors;
}

type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

const applicationStatuses = Object.values(ApplicationStatus);
const priorities = Object.values(Priority);
const sortOrders = ["asc", "desc"] as const;

function addError(errors: ValidationErrors, field: string, message: string) {
  errors[field] ??= [];
  errors[field].push(message);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readTrimmedString(
  value: unknown,
  field: string,
  errors: ValidationErrors,
  options?: { required?: boolean },
) {
  if (value === undefined) {
    if (options?.required) {
      addError(errors, field, "该字段不能为空。");
    }
    return undefined;
  }

  if (typeof value !== "string") {
    addError(errors, field, "该字段必须是字符串。");
    return undefined;
  }

  const normalized = value.trim();

  if (options?.required && normalized.length === 0) {
    addError(errors, field, "该字段不能为空。");
    return undefined;
  }

  return normalized;
}

function readNullableString(
  value: unknown,
  field: string,
  errors: ValidationErrors,
) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    addError(errors, field, "该字段必须是字符串或 null。");
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length === 0 ? null : normalized;
}

function readEnumValue<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
  errors: ValidationErrors,
) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string" || !allowed.includes(value as T)) {
    addError(errors, field, `该字段必须是以下值之一：${allowed.join(", ")}。`);
    return undefined;
  }

  return value as T;
}

function readIsoDate(
  value: unknown,
  field: string,
  errors: ValidationErrors,
) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    addError(errors, field, "该字段必须是 ISO 日期字符串或 null。");
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    addError(errors, field, "该字段必须是合法的 ISO 日期字符串。");
    return undefined;
  }

  return parsed.toISOString();
}

function readPositiveInt(
  value: string | null,
  field: string,
  fallback: number,
  errors: ValidationErrors,
) {
  if (value === null || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    addError(errors, field, "该字段必须是大于 0 的整数。");
    return fallback;
  }

  return parsed;
}

function hasErrors(errors: ValidationErrors) {
  return Object.keys(errors).length > 0;
}

export function validateCreateApplicationInput(
  payload: unknown,
): ValidationResult<CreateApplicationDto> {
  const errors: ValidationErrors = {};

  if (!isObject(payload)) {
    return {
      success: false,
      errors: {
        body: ["请求体必须是 JSON 对象。"],
      },
    };
  }

  const result: CreateApplicationDto = {
    userId: readTrimmedString(payload.userId, "userId", errors, {
      required: true,
    }) ?? "",
    companyName:
      readTrimmedString(payload.companyName, "companyName", errors, {
        required: true,
      }) ?? "",
    jobTitle:
      readTrimmedString(payload.jobTitle, "jobTitle", errors, {
        required: true,
      }) ?? "",
  };

  const status = readEnumValue(
    payload.status,
    "status",
    applicationStatuses,
    errors,
  );
  const priority = readEnumValue(payload.priority, "priority", priorities, errors);
  const city = readNullableString(payload.city, "city", errors);
  const source = readNullableString(payload.source, "source", errors);
  const sourceUrl = readNullableString(payload.sourceUrl, "sourceUrl", errors);
  const salaryRange = readNullableString(payload.salaryRange, "salaryRange", errors);
  const notes = readNullableString(payload.notes, "notes", errors);
  const appliedAt = readIsoDate(payload.appliedAt, "appliedAt", errors);
  const deadlineAt = readIsoDate(payload.deadlineAt, "deadlineAt", errors);
  const nextAction = readNullableString(payload.nextAction, "nextAction", errors);
  const nextActionAt = readIsoDate(payload.nextActionAt, "nextActionAt", errors);

  if (status !== undefined) result.status = status;
  if (priority !== undefined) result.priority = priority;
  if (city !== undefined) result.city = city;
  if (source !== undefined) result.source = source;
  if (sourceUrl !== undefined) result.sourceUrl = sourceUrl;
  if (salaryRange !== undefined) result.salaryRange = salaryRange;
  if (notes !== undefined) result.notes = notes;
  if (appliedAt !== undefined) result.appliedAt = appliedAt;
  if (deadlineAt !== undefined) result.deadlineAt = deadlineAt;
  if (nextAction !== undefined) result.nextAction = nextAction;
  if (nextActionAt !== undefined) result.nextActionAt = nextActionAt;

  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  return { success: true, data: result };
}

export function validateUpdateApplicationInput(
  payload: unknown,
): ValidationResult<UpdateApplicationDto> {
  const errors: ValidationErrors = {};

  if (!isObject(payload)) {
    return {
      success: false,
      errors: {
        body: ["请求体必须是 JSON 对象。"],
      },
    };
  }

  const result: UpdateApplicationDto = {};

  const userId = readTrimmedString(payload.userId, "userId", errors);
  const companyName = readTrimmedString(payload.companyName, "companyName", errors);
  const jobTitle = readTrimmedString(payload.jobTitle, "jobTitle", errors);
  const status = readEnumValue(
    payload.status,
    "status",
    applicationStatuses,
    errors,
  );
  const priority = readEnumValue(payload.priority, "priority", priorities, errors);
  const city = readNullableString(payload.city, "city", errors);
  const source = readNullableString(payload.source, "source", errors);
  const sourceUrl = readNullableString(payload.sourceUrl, "sourceUrl", errors);
  const salaryRange = readNullableString(payload.salaryRange, "salaryRange", errors);
  const notes = readNullableString(payload.notes, "notes", errors);
  const appliedAt = readIsoDate(payload.appliedAt, "appliedAt", errors);
  const deadlineAt = readIsoDate(payload.deadlineAt, "deadlineAt", errors);
  const nextAction = readNullableString(payload.nextAction, "nextAction", errors);
  const nextActionAt = readIsoDate(payload.nextActionAt, "nextActionAt", errors);

  if (userId !== undefined) result.userId = userId;
  if (companyName !== undefined) result.companyName = companyName;
  if (jobTitle !== undefined) result.jobTitle = jobTitle;
  if (status !== undefined) result.status = status;
  if (priority !== undefined) result.priority = priority;
  if (city !== undefined) result.city = city;
  if (source !== undefined) result.source = source;
  if (sourceUrl !== undefined) result.sourceUrl = sourceUrl;
  if (salaryRange !== undefined) result.salaryRange = salaryRange;
  if (notes !== undefined) result.notes = notes;
  if (appliedAt !== undefined) result.appliedAt = appliedAt;
  if (deadlineAt !== undefined) result.deadlineAt = deadlineAt;
  if (nextAction !== undefined) result.nextAction = nextAction;
  if (nextActionAt !== undefined) result.nextActionAt = nextActionAt;

  if (Object.keys(result).length === 0) {
    addError(errors, "body", "至少需要提供一个可更新字段。");
  }

  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  return { success: true, data: result };
}

export function validateApplicationId(id: string): ValidationResult<string> {
  const normalized = id.trim();

  if (normalized.length === 0) {
    return {
      success: false,
      errors: {
        id: ["id 不能为空。"],
      },
    };
  }

  return {
    success: true,
    data: normalized,
  };
}

export function validateApplicationListQuery(
  searchParams: URLSearchParams,
): ValidationResult<ApplicationListQueryDto> {
  const errors: ValidationErrors = {};

  const userId = searchParams.get("userId")?.trim();
  const search = searchParams.get("search")?.trim();
  const status = readEnumValue(
    searchParams.get("status"),
    "status",
    applicationStatuses,
    errors,
  );
  const priority = readEnumValue(
    searchParams.get("priority"),
    "priority",
    priorities,
    errors,
  );
  const deadlineSort = readEnumValue(
    searchParams.get("deadlineSort"),
    "deadlineSort",
    sortOrders,
    errors,
  );
  const page = readPositiveInt(searchParams.get("page"), "page", 1, errors);
  const pageSize = readPositiveInt(
    searchParams.get("pageSize"),
    "pageSize",
    20,
    errors,
  );

  if (pageSize > 100) {
    addError(errors, "pageSize", "pageSize 不能大于 100。");
  }

  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      ...(userId ? { userId } : {}),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(deadlineSort ? { deadlineSort } : {}),
        page,
        pageSize,
      },
  };
}
