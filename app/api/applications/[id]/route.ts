import { jsonError, jsonSuccess } from "@/lib/api-response";
import {
  deleteApplication,
  getApplicationById,
  updateApplication,
} from "@/lib/application-service";
import {
  validateApplicationId,
  validateUpdateApplicationInput,
} from "@/lib/application-validation";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function resolveId(context: RouteContext) {
  const { id } = await context.params;
  return validateApplicationId(id);
}

export async function GET(_request: Request, context: RouteContext) {
  const idValidation = await resolveId(context);
  if (!idValidation.success) {
    return jsonError(
      {
        code: "VALIDATION_ERROR",
        message: "路径参数校验失败。",
        details: idValidation.errors,
      },
      { status: 400 },
    );
  }

  try {
    const data = await getApplicationById(idValidation.data);
    if (!data) {
      return jsonError(
        {
          code: "APPLICATION_NOT_FOUND",
          message: "申请记录不存在。",
        },
        { status: 404 },
      );
    }

    return jsonSuccess(data);
  } catch (error) {
    console.error("Failed to fetch application:", error);

    return jsonError(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "获取申请记录失败。",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const idValidation = await resolveId(context);
  if (!idValidation.success) {
    return jsonError(
      {
        code: "VALIDATION_ERROR",
        message: "路径参数校验失败。",
        details: idValidation.errors,
      },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      {
        code: "INVALID_JSON",
        message: "请求体必须是合法的 JSON。",
      },
      { status: 400 },
    );
  }

  const validation = validateUpdateApplicationInput(body);
  if (!validation.success) {
    return jsonError(
      {
        code: "VALIDATION_ERROR",
        message: "请求参数校验失败。",
        details: validation.errors,
      },
      { status: 400 },
    );
  }

  try {
    const data = await updateApplication(idValidation.data, validation.data);
    if (!data) {
      return jsonError(
        {
          code: "APPLICATION_NOT_FOUND",
          message: "申请记录不存在。",
        },
        { status: 404 },
      );
    }

    return jsonSuccess(data, { message: "申请记录更新成功。" });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return jsonError(
        {
          code: "USER_NOT_FOUND",
          message: "关联的用户不存在。",
        },
        { status: 404 },
      );
    }

    console.error("Failed to update application:", error);

    return jsonError(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "更新申请记录失败。",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const idValidation = await resolveId(context);
  if (!idValidation.success) {
    return jsonError(
      {
        code: "VALIDATION_ERROR",
        message: "路径参数校验失败。",
        details: idValidation.errors,
      },
      { status: 400 },
    );
  }

  try {
    const data = await deleteApplication(idValidation.data);
    if (!data) {
      return jsonError(
        {
          code: "APPLICATION_NOT_FOUND",
          message: "申请记录不存在。",
        },
        { status: 404 },
      );
    }

    return jsonSuccess(data, { message: "申请记录删除成功。" });
  } catch (error) {
    console.error("Failed to delete application:", error);

    return jsonError(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "删除申请记录失败。",
      },
      { status: 500 },
    );
  }
}
