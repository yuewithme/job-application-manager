import { jsonError, jsonSuccess } from "@/lib/api-response";
import { createApplication, listApplications } from "@/lib/application-service";
import {
  validateApplicationListQuery,
  validateCreateApplicationInput,
} from "@/lib/application-validation";

export async function GET(request: Request) {
  const queryResult = validateApplicationListQuery(new URL(request.url).searchParams);

  if (!queryResult.success) {
    return jsonError(
      {
        code: "VALIDATION_ERROR",
        message: "查询参数校验失败。",
        details: queryResult.errors,
      },
      { status: 400 },
    );
  }

  try {
    const data = await listApplications(queryResult.data);
    return jsonSuccess(data);
  } catch (error) {
    console.error("Failed to list applications:", error);

    return jsonError(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "获取申请列表失败。",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

  const validation = validateCreateApplicationInput(body);
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
    const data = await createApplication(validation.data);
    return jsonSuccess(data, { status: 201, message: "申请记录创建成功。" });
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

    console.error("Failed to create application:", error);

    return jsonError(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "创建申请记录失败。",
      },
      { status: 500 },
    );
  }
}
