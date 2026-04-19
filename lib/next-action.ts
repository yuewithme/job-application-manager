"use client";

import type { ApiResponse, ApplicationDto } from "@/types";

interface UpdateNextActionInput {
  nextAction: string | null;
  nextActionAt: string | null;
}

interface UpdateNextActionResult {
  success: true;
  data: ApplicationDto;
  message?: string;
}

interface UpdateNextActionFailure {
  success: false;
  message: string;
  details?: Record<string, string[]> | string[];
}

export type UpdateNextActionResponse = UpdateNextActionResult | UpdateNextActionFailure;

export function toDateTimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function getTomorrowMorningIso(baseDate = new Date()) {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + 1);
  next.setHours(9, 0, 0, 0);
  return next.toISOString();
}

export async function updateApplicationNextAction(
  applicationId: string,
  input: UpdateNextActionInput,
): Promise<UpdateNextActionResponse> {
  try {
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nextAction: input.nextAction,
        nextActionAt: input.nextActionAt,
      }),
    });

    const payload = (await response.json()) as ApiResponse<ApplicationDto>;

    if (!response.ok || !payload.success) {
      return {
        success: false,
        message: payload.success ? "更新下一步动作失败。" : payload.error.message,
        details: payload.success ? undefined : payload.error.details,
      };
    }

    return {
      success: true,
      data: payload.data,
      message: payload.message,
    };
  } catch (error) {
    console.error("Failed to update next action:", error);
    return {
      success: false,
      message: "网络异常，暂时无法更新下一步动作。",
    };
  }
}
