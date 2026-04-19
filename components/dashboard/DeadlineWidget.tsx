import Link from "next/link";

import { formatDate, getPriorityLabel } from "@/lib/dashboard-format";
import type { DashboardDeadlineItemDto } from "@/types";
import EmptyState from "@/components/ui/EmptyState";

export default function DeadlineWidget({ items }: { items: DashboardDeadlineItemDto[] }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden min-h-0">
      <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0">
        即将截止 (Upcoming Deadlines)
      </div>
      <div className="overflow-y-auto flex-1 min-h-0">
        {items.length === 0 ? (
          <div className="p-3">
            <EmptyState
              compact
              title="近期没有即将截止的申请"
              description="只有存在截止时间且未来 7 天内到期的申请，才会显示在这里。"
              action={{ label: "查看全部申请", href: "/applications" }}
            />
          </div>
        ) : (
          <table className="w-full border-collapse text-[13px] text-slate-900 text-left">
            <thead className="sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">公司/职位</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">截止时间</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">优先级</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[200px]">
                    <Link href={`/applications/${item.id}`} className="hover:underline">
                      <strong className="font-semibold">{item.companyName}</strong> / {item.jobTitle}
                    </Link>
                  </td>
                  <td className="px-[16px] py-[12px] border-b border-slate-200">
                    {formatDate(item.deadlineAt)}
                  </td>
                  <td
                    className={`px-[16px] py-[12px] border-b border-slate-200 ${
                      item.priority === "high"
                        ? "text-[#EF4444]"
                        : item.priority === "medium"
                          ? "text-[#F59E0B]"
                          : "text-[#10B981]"
                    }`}
                  >
                    {getPriorityLabel(item.priority)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
