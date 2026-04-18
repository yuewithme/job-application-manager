import { NextResponse } from "next/server";

import type { ApiErrorPayload, ApiSuccessResponse } from "@/types";

export function jsonSuccess<T>(
  data: T,
  init?: {
    status?: number;
    message?: string;
  },
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(init?.message ? { message: init.message } : {}),
  };

  return NextResponse.json(body, { status: init?.status ?? 200 });
}

export function jsonError(
  error: ApiErrorPayload,
  init?: {
    status?: number;
  },
) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: init?.status ?? 400 },
  );
}
