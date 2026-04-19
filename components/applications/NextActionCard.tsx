"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import InlineNotice from "@/components/ui/InlineNotice";
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
  const [submittingAction, setSubmittingAction] = useState<"save" | "snooze" | "complete" | null>(null);

  function refreshPage() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleSave() {
    setError(null);
    setMessage(null);
    setSubmittingAction("save");

    const result = await updateApplicationNextAction(applicationId, {
      nextAction: nextAction.trim() || null,
      nextActionAt: nextActionAt ? new Date(nextActionAt).toISOString() : null,
    });

    if (!result.success) {
      setError(result.message);
      setSubmittingAction(null);
      return;
    }

    setMessage("下一步动作已更新。");
    refreshPage();
    setSubmittingAction(null);
  }

  async function handleComplete() {
    setError(null);
    setMessage(null);
    setSubmittingAction("complete");

    const result = await updateApplicationNextAction(applicationId, {
      nextAction: null,
      nextActionAt: null,
    });

    if (!result.success) {
      setError(result.message);
      setSubmittingAction(null);
      return;
    }

    setNextAction("");
    setNextActionAt("");
    setMessage("待办已完成，已从今日待办中移除。");
    refreshPage();
    setSubmittingAction(null);
  }

  async function handleSnooze() {
    setError(null);
    setMessage(null);
    setSubmittingAction("snooze");

    const currentAction = nextAction.trim() || initialNextAction;
    if (!currentAction) {
      setError("请先填写下一步动作，再进行稍后处理。");
      setSubmittingAction(null);
      return;
    }

    const tomorrowMorningIso = getTomorrowMorningIso();
    const result = await updateApplicationNextAction(applicationId, {
      nextAction: currentAction,
      nextActionAt: tomorrowMorningIso,
    });

    if (!result.success) {
      setError(result.message);
      setSubmittingAction(null);
      return;
    }

    setNextAction(currentAction);
    setNextActionAt(toDateTimeLocalValue(tomorrowMorningIso));
    setMessage("已顺延到明天上午 9:00。");
    refreshPage();
    setSubmittingAction(null);
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

      {error ? <InlineNotice tone="error">{error}</InlineNotice> : null}

      {message ? <InlineNotice tone="success">{message}</InlineNotice> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || submittingAction !== null}
          className="px-3 py-2 bg-[#2563EB] text-white rounded text-[12px] font-medium hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {submittingAction === "save" ? "保存中..." : "保存待办"}
        </button>
        <button
          type="button"
          onClick={handleSnooze}
          disabled={isPending || submittingAction !== null}
          className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {submittingAction === "snooze" ? "处理中..." : "稍后处理"}
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={isPending || submittingAction !== null}
          className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {submittingAction === "complete" ? "处理中..." : "标记已完成"}
        </button>
      </div>
    </section>
  );
}
