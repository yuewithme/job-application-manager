"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  getTomorrowMorningIso,
  toDateTimeLocalValue,
  updateApplicationNextAction,
} from "@/lib/next-action";

interface NextActionInlineEditorProps {
  applicationId: string;
  initialNextAction: string | null;
  initialNextActionAt: string | null;
}

export default function NextActionInlineEditor({
  applicationId,
  initialNextAction,
  initialNextActionAt,
}: NextActionInlineEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [nextAction, setNextAction] = useState(initialNextAction ?? "");
  const [nextActionAt, setNextActionAt] = useState(toDateTimeLocalValue(initialNextActionAt));
  const [error, setError] = useState<string | null>(null);

  function refreshPage() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleSave() {
    setError(null);

    const result = await updateApplicationNextAction(applicationId, {
      nextAction: nextAction.trim() || null,
      nextActionAt: nextActionAt ? new Date(nextActionAt).toISOString() : null,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setIsOpen(false);
    refreshPage();
  }

  async function handleSnooze() {
    setError(null);
    const currentAction = nextAction.trim() || initialNextAction;
    if (!currentAction) {
      setError("先填写动作内容");
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
    setIsOpen(false);
    refreshPage();
  }

  async function handleComplete() {
    setError(null);

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
    setIsOpen(false);
    refreshPage();
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setError(null);
          setIsOpen((current) => !current);
        }}
        className="text-[#2563EB] hover:text-blue-700 font-medium text-[13px]"
      >
        待办
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full mt-2 w-[280px] rounded-xl border border-slate-200 bg-white shadow-xl p-3 z-20 text-left">
          <div className="text-[12px] font-semibold text-slate-900 mb-2">设置下一步动作</div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={nextAction}
              onChange={(event) => setNextAction(event.target.value)}
              className="w-full rounded border border-slate-300 px-2.5 py-2 text-[12px] text-slate-900 outline-none focus:border-[#2563EB]"
              placeholder="例如：补充作品集"
            />
            <input
              type="datetime-local"
              value={nextActionAt}
              onChange={(event) => setNextActionAt(event.target.value)}
              className="w-full rounded border border-slate-300 px-2.5 py-2 text-[12px] text-slate-900 outline-none focus:border-[#2563EB]"
            />
          </div>

          {error ? <p className="mt-2 text-[11px] text-red-500">{error}</p> : null}

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1.5 border border-slate-300 rounded text-[12px] text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSnooze}
              disabled={isPending}
              className="px-2.5 py-1.5 border border-slate-300 rounded text-[12px] text-slate-600 hover:bg-slate-50 disabled:text-slate-400"
            >
              稍后
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={isPending}
              className="px-2.5 py-1.5 border border-slate-300 rounded text-[12px] text-slate-600 hover:bg-slate-50 disabled:text-slate-400"
            >
              完成
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="px-2.5 py-1.5 rounded bg-[#2563EB] text-white text-[12px] font-medium hover:bg-blue-700 disabled:bg-blue-300"
            >
              保存
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
