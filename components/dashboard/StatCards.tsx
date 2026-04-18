import Link from "next/link";

import { getStatusLabel } from "@/lib/dashboard-format";
import type { DashboardStatusCounts } from "@/types";

const statItems = [
  { key: "bookmarked", label: getStatusLabel("BOOKMARKED"), color: "text-slate-900" },
  { key: "todoApply", label: getStatusLabel("TODO_APPLY"), color: "text-slate-900" },
  { key: "applied", label: getStatusLabel("APPLIED"), color: "text-slate-900" },
  { key: "writtenTest", label: getStatusLabel("WRITTEN_TEST"), color: "text-[#2563EB]" },
  { key: "interviewing", label: getStatusLabel("INTERVIEWING"), color: "text-[#2563EB]" },
  { key: "offer", label: getStatusLabel("OFFER"), color: "text-[#10B981]" },
  { key: "closed", label: getStatusLabel("CLOSED"), color: "text-[#EF4444]" },
] as const;

export default function StatCards({ stats }: { stats: DashboardStatusCounts }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 shrink-0">
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <Link href="/applications" className="block">
          <span className="block text-[20px] font-bold text-slate-900 mb-[2px]">{stats.total}</span>
        </Link>
        <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">总申请</span>
      </div>
      {statItems.map((item) => (
        <div key={item.key} className="bg-white p-3 rounded-lg border border-slate-200 text-center">
          <span className={`block text-[20px] font-bold mb-[2px] ${item.color}`}>
            {stats[item.key]}
          </span>
          <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">
            {item.label}
          </span>
        </div>
      ))}
    </section>
  );
}
