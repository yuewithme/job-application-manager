import { jsonError, jsonSuccess } from "@/lib/api-response";
import { validateApplicationId } from "@/lib/application-validation";
import { createInterviewRecord } from "@/lib/interview-service";
import { validateCreateInterviewRecordInput } from "@/lib/interview-validation";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function resolveId(context: RouteContext) {
  const { id } = await context.params;
  return validateApplicationId(id);
}

export async function POST(request: Request, context: RouteContext) {
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

  const validation = validateCreateInterviewRecordInput(body);
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
    const data = await createInterviewRecord(idValidation.data, validation.data);
    if (!data) {
      return jsonError(
        {
          code: "APPLICATION_NOT_FOUND",
          message: "申请记录不存在。",
        },
        { status: 404 },
      );
    }

    return jsonSuccess(data, {
      status: 201,
      message: data.statusChanged
        ? "面试记录已新增，并已自动更新申请状态为面试中。"
        : "面试记录新增成功。",
    });
  } catch (error) {
    console.error("Failed to create interview record:", error);

    return jsonError(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "新增面试记录失败。",
      },
      { status: 500 },
    );
  }
}
