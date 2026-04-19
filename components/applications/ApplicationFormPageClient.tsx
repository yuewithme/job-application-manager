"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getPriorityLabel, getStatusLabel } from "@/lib/dashboard-format";
import type { ApiResponse, ApplicationDetailDto, ApplicationDto, UserSummary } from "@/types";
import { applicationStatusValues, priorityValues } from "@/types";

type ApplicationFormMode = "create" | "edit";

interface ApplicationFormState {
  userId: string;
  companyName: string;
  jobTitle: string;
  status: (typeof applicationStatusValues)[number];
  priority: (typeof priorityValues)[number];
  city: string;
  source: string;
  deadlineAt: string;
  appliedAt: string;
  nextAction: string;
  nextActionAt: string;
  notes: string;
}

interface ApplicationFormPageClientProps {
  mode: ApplicationFormMode;
  users?: UserSummary[];
  application?: ApplicationDetailDto;
}

type FormErrors = Partial<Record<keyof ApplicationFormState, string>> & {
  form?: string;
};

function toIsoOrNull(value: string) {
  return value.trim().length > 0 ? new Date(value).toISOString() : null;
}

function toNullableText(value: string) {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toDateTimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function createInitialState(
  mode: ApplicationFormMode,
  users: UserSummary[],
  application?: ApplicationDetailDto,
): ApplicationFormState {
  if (mode === "edit" && application) {
    return {
      userId: application.user.id,
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      status: application.status,
      priority: application.priority,
      city: application.city ?? "",
      source: application.source ?? "",
      deadlineAt: toDateTimeLocalValue(application.deadlineAt),
      appliedAt: toDateTimeLocalValue(application.appliedAt),
      nextAction: application.nextAction ?? "",
      nextActionAt: toDateTimeLocalValue(application.nextActionAt),
      notes: application.notes ?? "",
    };
  }

  return {
    userId: users[0]?.id ?? "",
    companyName: "",
    jobTitle: "",
    status: "TODO_APPLY",
    priority: "medium",
    city: "",
    source: "",
    deadlineAt: "",
    appliedAt: "",
    nextAction: "",
    nextActionAt: "",
    notes: "",
  };
}

export default function ApplicationFormPageClient({
  mode,
  users = [],
  application,
}: ApplicationFormPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ApplicationFormState>(() =>
    createInitialState(mode, users, application),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = mode === "edit";
  const activeNavHref = isEditMode ? "/applications" : "/applications/new";
  const pageTitle = isEditMode ? "编辑申请" : "新增申请";
  const submitLabel = isEditMode ? "保存修改" : "确认创建";
  const pendingLabel = isEditMode ? "保存中..." : "创建中...";
  const cancelHref = isEditMode && application ? `/applications/${application.id}` : "/applications";
  const successHref = isEditMode && application ? `/applications/${application.id}` : "/applications";

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      nextErrors.companyName = "请填写公司名称。";
    }

    if (!formData.jobTitle.trim()) {
      nextErrors.jobTitle = "请填写岗位名称。";
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      ...(isEditMode ? { userId: formData.userId } : {}),
      companyName: formData.companyName.trim(),
      jobTitle: formData.jobTitle.trim(),
      status: formData.status,
      priority: formData.priority,
      city: toNullableText(formData.city),
      source: toNullableText(formData.source),
      deadlineAt: toIsoOrNull(formData.deadlineAt),
      appliedAt: toIsoOrNull(formData.appliedAt),
      nextAction: toNullableText(formData.nextAction),
      nextActionAt: toIsoOrNull(formData.nextActionAt),
      notes: toNullableText(formData.notes),
    };

    const endpoint = isEditMode && application ? `/api/applications/${application.id}` : "/api/applications";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ApiResponse<ApplicationDto>;

      if (!response.ok || !result.success) {
        if (!result.success && result.error.details && !Array.isArray(result.error.details)) {
          const fieldErrors = Object.fromEntries(
            Object.entries(result.error.details).map(([key, value]) => [
              key,
              value[0] ?? "输入有误。",
            ]),
          );

          setErrors((current) => ({
            ...current,
            ...fieldErrors,
            form: result.error.message,
          }));
          return;
        }

        setErrors((current) => ({
          ...current,
          form: !result.success
            ? result.error.message
            : isEditMode
              ? "保存修改失败。"
              : "创建申请失败。",
        }));
        return;
      }

      startTransition(() => {
        router.push(successHref);
        router.refresh();
      });
    } catch {
      setErrors((current) => ({
        ...current,
        form: "请求失败，请稍后重试。",
      }));
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      <nav className="w-[200px] bg-[#1E293B] text-white flex flex-col py-5 shrink-0 hidden md:flex">
        <div className="px-6 pb-8 text-[18px] font-bold text-[#38BDF8] tracking-[-0.5px] shrink-0">
          JobHunter Pro
        </div>
        <Link
          href="/dashboard"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
        >
          仪表盘
        </Link>
        <Link
          href="/applications"
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors border-l-4 ${
            activeNavHref === "/applications"
              ? "bg-[#334155] text-white border-[#38BDF8]"
              : "text-[#94A3B8] hover:bg-slate-700/50 border-transparent"
          }`}
        >
          所有申请
        </Link>
        <Link
          href="/applications/new"
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors border-l-4 ${
            activeNavHref === "/applications/new"
              ? "bg-[#334155] text-white border-[#38BDF8]"
              : "text-[#94A3B8] hover:bg-slate-700/50 border-transparent"
          }`}
        >
          新增申请
        </Link>
        <Link
          href="/interviews"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
        >
          面试日程
        </Link>
        <Link
          href="/companies"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
        >
          公司列表
        </Link>
        <Link
          href="/offers"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
        >
          Offer 管理
        </Link>
      </nav>

      <main className="flex-1 flex flex-col p-6 gap-5 overflow-hidden min-w-0">
        <header className="flex justify-between items-center shrink-0">
          <h1 className="text-[22px] font-semibold text-slate-900 m-0">{pageTitle}</h1>
          <div className="flex gap-3">
            <Link
              href={cancelHref}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors"
            >
              取消 / 返回
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {isPending ? pendingLabel : submitLabel}
            </button>
          </div>
        </header>

        <section className="bg-white rounded-xl border border-slate-200 flex-1 min-h-0 overflow-y-auto">
          <div className="p-6">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-[15px] font-semibold text-slate-800">智能识别导入</h2>
                  <span className="text-[12px] text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#BFDBFE]">
                    {isEditMode ? "当前为编辑模式，复用同一套表单保存回数据库" : "本轮先接入真实创建，智能识别后续再对接后端"}
                  </span>
                </div>
              </div>

              <div className="flex gap-6 mb-5 border-b border-slate-200">
                <button className="pb-2.5 text-[13px] font-medium border-b-2 border-[#2563EB] text-[#2563EB]">
                  链接导入
                </button>
                <button className="pb-2.5 text-[13px] font-medium border-b-2 border-transparent text-slate-500">
                  文本导入
                </button>
                <button className="pb-2.5 text-[13px] font-medium border-b-2 border-transparent text-slate-500">
                  图片导入
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-[13px] bg-white text-slate-400"
                    placeholder="粘贴岗位链接，后续接入解析能力..."
                    disabled
                  />
                  <button
                    type="button"
                    disabled
                    className="px-5 py-2.5 bg-slate-300 text-white rounded-lg text-[13px] font-medium cursor-not-allowed shrink-0"
                  >
                    解析链接
                  </button>
                </div>
                <p className="text-[12px] text-slate-500">
                  {isEditMode
                    ? "当前阶段优先补齐编辑闭环，避免再引入新的假解析流程。"
                    : "当前阶段先保证真实创建链路可用，避免继续保留假解析数据。"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">
                核对与补充表单数据
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {errors.form ? (
              <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
                {errors.form}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="col-span-1 border-b border-slate-100 pb-2 md:col-span-2">
                <h2 className="text-[14px] font-semibold text-slate-800">基本信息</h2>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="例如: ByteDance"
                  className={`w-full border ${errors.companyName ? "border-red-400" : "border-slate-300"} rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]`}
                />
                {errors.companyName ? (
                  <p className="text-[11px] text-red-500 mt-1">{errors.companyName}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  岗位名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="例如: 前端开发工程师"
                  className={`w-full border ${errors.jobTitle ? "border-red-400" : "border-slate-300"} rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]`}
                />
                {errors.jobTitle ? (
                  <p className="text-[11px] text-red-500 mt-1">{errors.jobTitle}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  当前状态
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {applicationStatusValues.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  优先级
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {priorityValues.map((priority) => (
                    <option key={priority} value={priority}>
                      {getPriorityLabel(priority)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 border-b border-slate-100 pb-2 mt-2 md:col-span-2">
                <h2 className="text-[14px] font-semibold text-slate-800">详细情况</h2>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  工作地点
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="例如: 杭州 / Remote"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  来源渠道
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="例如: 官网 / 牛客网 / 猎头推荐"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div className="col-span-1 border-b border-slate-100 pb-2 mt-2 md:col-span-2">
                <h2 className="text-[14px] font-semibold text-slate-800">时间与进度</h2>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  截止时间
                </label>
                <input
                  type="datetime-local"
                  name="deadlineAt"
                  value={formData.deadlineAt}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  投递时间
                </label>
                <input
                  type="datetime-local"
                  name="appliedAt"
                  value={formData.appliedAt}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  下一步动作
                </label>
                <input
                  type="text"
                  name="nextAction"
                  value={formData.nextAction}
                  onChange={handleChange}
                  placeholder="例如: 准备二面笔试"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  下一步时间
                </label>
                <input
                  type="datetime-local"
                  name="nextActionAt"
                  value={formData.nextActionAt}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  备注
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="记录任何面试感受、需要准备的事项等..."
                  rows={4}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
