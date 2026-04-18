import Link from "next/link";

import { formatDateTime } from "@/lib/dashboard-format";
import type { DashboardRecentItemDto } from "@/types";

import { PriorityBadge, StatusBadge } from "./Badges";

export default function RecentWidget({ items }: { items: DashboardRecentItemDto[] }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden lg:col-span-2 min-h-0">
      <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0">
        最近更新 (Recent Updates)
      </div>
      <div className="overflow-y-auto flex-1 min-h-0">
        <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
          <thead className="sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">公司名称</th>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">职位名称</th>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">当前状态</th>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">优先级</th>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">后续行动</th>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">更新于</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-[16px] py-[24px] text-center text-slate-500 border-b border-slate-200">
                  暂无最近更新的申请
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[150px]">
                    <Link href={`/applications/${item.id}`} className="hover:underline">
                      {item.companyName}
                    </Link>
                  </td>
                  <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[150px]">
                    {item.jobTitle}
                  </td>
                  <td className="px-[16px] py-[12px] border-b border-slate-200">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-[16px] py-[12px] border-b border-slate-200">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[200px]">
                    {item.nextAction || "-"}
                  </td>
                  <td className="px-[16px] py-[12px] border-b border-slate-200 text-[#64748B]">
                    {formatDateTime(item.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
