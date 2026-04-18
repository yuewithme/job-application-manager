import Link from "next/link";

import { formatDateTime, getPriorityLabel } from "@/lib/dashboard-format";
import type { DashboardTodoItemDto } from "@/types";

export default function TodoWidget({ items }: { items: DashboardTodoItemDto[] }) {
  const priorityColors = {
    high: "border-l-[#EF4444]",
    medium: "border-l-[#F59E0B]",
    low: "border-l-[#10B981]",
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden min-h-0">
      <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0">
        今日待办 (Next Actions)
      </div>
      <div className="overflow-y-auto p-3 flex-1 min-h-0">
        {items.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-[13px]">
            <p>暂无待办事项</p>
            <Link href="/applications/new" className="mt-2 inline-block text-[#2563EB] hover:underline">
              去新增申请
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/applications/${item.id}`}
              className={`p-[10px] rounded-[6px] bg-[#F1F5F9] mb-2 border-l-[3px] border-solid ${priorityColors[item.priority]}`}
            >
              <div className="text-[13px] font-medium text-slate-900 mb-1">{item.nextAction}</div>
              <div className="text-[11px] text-[#64748B]">
                {item.companyName} / {item.jobTitle}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {formatDateTime(item.nextActionAt)} | 优先级: {getPriorityLabel(item.priority)}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
