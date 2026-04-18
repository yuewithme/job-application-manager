import type { CreateInterviewRecordDto } from "@/types";

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

function readIsoDate(value: unknown, field: string, errors: ValidationErrors) {
  if (typeof value !== "string") {
    addError(errors, field, "该字段必须是合法的 ISO 日期字符串。");
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    addError(errors, field, "该字段不能为空。");
    return undefined;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    addError(errors, field, "该字段必须是合法的 ISO 日期字符串。");
    return undefined;
  }

  return parsed.toISOString();
}

function hasErrors(errors: ValidationErrors) {
  return Object.keys(errors).length > 0;
}

export function validateCreateInterviewRecordInput(
  payload: unknown,
): ValidationResult<CreateInterviewRecordDto> {
  const errors: ValidationErrors = {};

  if (!isObject(payload)) {
    return {
      success: false,
      errors: {
        body: ["请求体必须是 JSON 对象。"],
      },
    };
  }

  const result: CreateInterviewRecordDto = {
    roundName:
      readTrimmedString(payload.roundName, "roundName", errors, {
        required: true,
      }) ?? "",
    interviewAt: readIsoDate(payload.interviewAt, "interviewAt", errors) ?? "",
  };

  const mode = readNullableString(payload.mode, "mode", errors);
  const resultValue = readNullableString(payload.result, "result", errors);
  const notes = readNullableString(payload.notes, "notes", errors);

  if (mode !== undefined) {
    result.mode = mode;
  }

  if (resultValue !== undefined) {
    result.result = resultValue;
  }

  if (notes !== undefined) {
    result.notes = notes;
  }

  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  return { success: true, data: result };
}
