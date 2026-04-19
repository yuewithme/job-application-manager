"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import InlineNotice from "@/components/ui/InlineNotice";

interface InterviewRecordFormPageClientProps {
  applicationId: string;
  companyName: string;
  jobTitle: string;
  existingInterviewCount: number;
}

interface FormState {
  roundName: string;
  interviewAt: string;
  mode: string;
  result: string;
  notes: string;
}

function createInitialState(nextRound: number): FormState {
  return {
    roundName: `第 ${nextRound} 轮面试`,
    interviewAt: "",
    mode: "",
    result: "",
    notes: "",
  };
}

export default function InterviewRecordFormPageClient({
  applicationId,
  companyName,
  jobTitle,
  existingInterviewCount,
}: InterviewRecordFormPageClientProps) {
  const router = useRouter();
  const nextRound = useMemo(() => existingInterviewCount + 1, [existingInterviewCount]);
  const [formState, setFormState] = useState<FormState>(() => createInitialState(nextRound));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/applications/${applicationId}/interviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roundName: formState.roundName,
          interviewAt: formState.interviewAt
            ? new Date(formState.interviewAt).toISOString()
            : "",
          mode: formState.mode || null,
          result: formState.result || null,
          notes: formState.notes || null,
        }),
      });

      const payload = (await response.json()) as
        | {
            success: true;
          }
        | {
            success: false;
            error?: {
              message?: string;
              details?: Record<string, string[]>;
            };
          };

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.error?.details) {
          setFieldErrors(payload.error.details);
        }

        setServerError(
          !payload.success && payload.error?.message
            ? payload.error.message
            : "新增面试记录失败，请稍后重试。",
        );
        return;
      }

      router.push(`/applications/${applicationId}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to submit interview record:", error);
      setServerError("网络异常，暂时无法提交面试记录。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      <nav className="w-[200px] bg-[#1E293B] text-white flex-col py-5 shrink-0 hidden md:flex">
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
          className="px-6 py-3 text-[14px] cursor-pointer transition-colors bg-[#334155] text-white border-l-4 border-[#38BDF8]"
        >
          所有申请
        </Link>
        <Link
          href="/applications/new"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
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

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-6">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-900 m-0">新增面试记录</h1>
              <p className="text-[14px] text-slate-500 mt-1 font-medium">
                {companyName} / {jobTitle}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href={`/applications/${applicationId}`}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors"
              >
                返回详情
              </Link>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-200 bg-[#F8FAFC]">
              <h2 className="text-[15px] font-semibold text-slate-900">面试信息</h2>
              <p className="text-[13px] text-slate-500 mt-1">
                当前预计新增第 {nextRound} 轮面试；保存后将写入申请详情与面试日程。
              </p>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-slate-700" htmlFor="roundName">
                  面试轮次名称
                </label>
                <input
                  id="roundName"
                  type="text"
                  value={formState.roundName}
                  onChange={(event) => updateField("roundName", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  placeholder="例如：二面 / HR 面 / 终面"
                />
                {fieldErrors.roundName ? (
                  <p className="text-[12px] text-red-500">{fieldErrors.roundName[0]}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-slate-700" htmlFor="interviewAt">
                  面试时间
                </label>
                <input
                  id="interviewAt"
                  type="datetime-local"
                  value={formState.interviewAt}
                  onChange={(event) => updateField("interviewAt", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
                {fieldErrors.interviewAt ? (
                  <p className="text-[12px] text-red-500">{fieldErrors.interviewAt[0]}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-slate-700" htmlFor="mode">
                  面试形式
                </label>
                <input
                  id="mode"
                  type="text"
                  value={formState.mode}
                  onChange={(event) => updateField("mode", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  placeholder="例如：现场 / 电话 / 视频会议"
                />
                {fieldErrors.mode ? (
                  <p className="text-[12px] text-red-500">{fieldErrors.mode[0]}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-slate-700" htmlFor="result">
                  面试结果
                </label>
                <select
                  id="result"
                  value={formState.result}
                  onChange={(event) => updateField("result", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="">待定</option>
                  <option value="通过">通过</option>
                  <option value="拒绝">拒绝</option>
                  <option value="进行中">进行中</option>
                </select>
                {fieldErrors.result ? (
                  <p className="text-[12px] text-red-500">{fieldErrors.result[0]}</p>
                ) : null}
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[13px] font-medium text-slate-700" htmlFor="notes">
                  面试备注
                </label>
                <textarea
                  id="notes"
                  rows={6}
                  value={formState.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 resize-y"
                  placeholder="记录本轮面试亮点、问题反馈、后续跟进事项等"
                />
                {fieldErrors.notes ? (
                  <p className="text-[12px] text-red-500">{fieldErrors.notes[0]}</p>
                ) : null}
              </div>

              {serverError ? (
                <div className="md:col-span-2">
                  <InlineNotice tone="error">{serverError}</InlineNotice>
                </div>
              ) : null}
            </div>

            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <Link
                href={`/applications/${applicationId}`}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-100 transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSubmitting ? "保存中..." : "保存面试记录"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
