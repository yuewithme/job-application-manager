"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatDateTime, getPriorityLabel } from "@/lib/dashboard-format";
import { getTomorrowMorningIso, updateApplicationNextAction } from "@/lib/next-action";
import type { DashboardTodoItemDto } from "@/types";

export default function TodoWidget({ items }: { items: DashboardTodoItemDto[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const priorityColors = {
    high: "border-l-[#EF4444]",
    medium: "border-l-[#F59E0B]",
    low: "border-l-[#10B981]",
  };

  async function handleComplete(applicationId: string) {
    setPendingId(applicationId);
    setError(null);

    const result = await updateApplicationNextAction(applicationId, {
      nextAction: null,
      nextActionAt: null,
    });

    if (!result.success) {
      setError(result.message);
      setPendingId(null);
      return;
    }

    startTransition(() => {
      router.refresh();
      setPendingId(null);
    });
  }

  async function handleSnooze(item: DashboardTodoItemDto) {
    setPendingId(item.id);
    setError(null);

    const result = await updateApplicationNextAction(item.id, {
      nextAction: item.nextAction,
      nextActionAt: getTomorrowMorningIso(),
    });

    if (!result.success) {
      setError(result.message);
      setPendingId(null);
      return;
    }

    startTransition(() => {
      router.refresh();
      setPendingId(null);
    });
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden min-h-0">
      <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0">
        今日待办 (Next Actions)
      </div>
      <div className="overflow-y-auto p-3 flex-1 min-h-0">
        {error ? (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {error}
          </div>
        ) : null}
        {items.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-[13px]">
            <p>暂无待办事项</p>
            <Link href="/applications/new" className="mt-2 inline-block text-[#2563EB] hover:underline">
              去新增申请
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-[10px] rounded-[6px] bg-[#F1F5F9] mb-2 border-l-[3px] border-solid ${priorityColors[item.priority]}`}
            >
              <div className="text-[13px] font-medium text-slate-900 mb-1">{item.nextAction}</div>
              <div className="text-[11px] text-[#64748B]">
                {item.companyName} / {item.jobTitle}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {formatDateTime(item.nextActionAt)} | 优先级: {getPriorityLabel(item.priority)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[12px]">
                <button
                  type="button"
                  disabled={isPending && pendingId === item.id}
                  onClick={() => handleComplete(item.id)}
                  className="rounded border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  已完成
                </button>
                <button
                  type="button"
                  disabled={isPending && pendingId === item.id}
                  onClick={() => handleSnooze(item)}
                  className="rounded border border-slate-300 bg-white px-2.5 py-1 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  稍后处理
                </button>
                <Link href={`/applications/${item.id}`} className="text-[#2563EB] hover:underline">
                  查看详情
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
