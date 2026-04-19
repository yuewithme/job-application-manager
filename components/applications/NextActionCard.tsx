"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  getTomorrowMorningIso,
  toDateTimeLocalValue,
  updateApplicationNextAction,
} from "@/lib/next-action";

interface NextActionCardProps {
  applicationId: string;
  initialNextAction: string | null;
  initialNextActionAt: string | null;
}

export default function NextActionCard({
  applicationId,
  initialNextAction,
  initialNextActionAt,
}: NextActionCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nextAction, setNextAction] = useState(initialNextAction ?? "");
  const [nextActionAt, setNextActionAt] = useState(toDateTimeLocalValue(initialNextActionAt));
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function refreshPage() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleSave() {
    setError(null);
    setMessage(null);

    const result = await updateApplicationNextAction(applicationId, {
      nextAction: nextAction.trim() || null,
      nextActionAt: nextActionAt ? new Date(nextActionAt).toISOString() : null,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage("下一步动作已更新。");
    refreshPage();
  }

  async function handleComplete() {
    setError(null);
    setMessage(null);

    const result = await updateApplicationNextAction(applicationId, {
      nextAction: null,
      nextActionAt: null,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setNextAction("");
    setNextActionAt("");
    setMessage("待办已完成，已从今日待办中移除。");
    refreshPage();
  }

  async function handleSnooze() {
    setError(null);
    setMessage(null);

    const currentAction = nextAction.trim() || initialNextAction;
    if (!currentAction) {
      setError("请先填写下一步动作，再进行稍后处理。");
      return;
    }

    const tomorrowMorningIso = getTomorrowMorningIso();
    const result = await updateApplicationNextAction(applicationId, {
      nextAction: currentAction,
      nextActionAt: tomorrowMorningIso,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setNextAction(currentAction);
    setNextActionAt(toDateTimeLocalValue(tomorrowMorningIso));
    setMessage("已顺延到明天上午 9:00。");
    refreshPage();
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 flex flex-col gap-4 shrink-0 shadow-sm">
      <div>
        <h2 className="text-[14px] font-semibold text-slate-900">下一步动作</h2>
        <p className="mt-1 text-[12px] text-slate-500">这里的内容会同步影响 Dashboard 今日待办。</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-medium text-slate-600" htmlFor={`next-action-${applicationId}`}>
          动作内容
        </label>
        <input
          id={`next-action-${applicationId}`}
          type="text"
          value={nextAction}
          onChange={(event) => setNextAction(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
          placeholder="例如：补充简历并提交 / 跟进面试结果"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-[12px] font-medium text-slate-600"
          htmlFor={`next-action-at-${applicationId}`}
        >
          动作时间
        </label>
        <input
          id={`next-action-at-${applicationId}`}
          type="datetime-local"
          value={nextActionAt}
          onChange={(event) => setNextActionAt(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[12px] text-green-700">
          {message}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-3 py-2 bg-[#2563EB] text-white rounded text-[12px] font-medium hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          保存待办
        </button>
        <button
          type="button"
          onClick={handleSnooze}
          disabled={isPending}
          className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:text-slate-400"
        >
          稍后处理
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={isPending}
          className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:text-slate-400"
        >
          标记已完成
        </button>
      </div>
    </section>
  );
}
