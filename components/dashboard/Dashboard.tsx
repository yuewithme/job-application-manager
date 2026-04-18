import Link from "next/link";

import { formatSyncTimestamp } from "@/lib/dashboard-format";
import type { DashboardPageDto } from "@/types";

import DeadlineWidget from "./DeadlineWidget";
import RecentWidget from "./RecentWidget";
import StatCards from "./StatCards";
import TodoWidget from "./TodoWidget";

export default function Dashboard({ data }: { data: DashboardPageDto }) {
  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      <nav className="w-[200px] bg-[#1E293B] text-white flex flex-col py-5 shrink-0 hidden md:flex">
        <div className="px-6 pb-8 text-[18px] font-bold text-[#38BDF8] tracking-[-0.5px] shrink-0">
          JobHunter Pro
        </div>
        <Link
          href="/dashboard"
          className="px-6 py-3 text-[14px] bg-[#334155] text-white border-l-4 border-[#38BDF8] cursor-pointer"
        >
          仪表盘
        </Link>
        <Link
          href="/applications"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50"
        >
          所有申请
        </Link>
        <Link
          href="/applications/new"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50"
        >
          新增申请
        </Link>
        <Link
          href="/interviews"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50"
        >
          面试日程
        </Link>
        <Link
          href="/companies"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50"
        >
          公司列表
        </Link>
        <Link
          href="/offers"
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50"
        >
          Offer 管理
        </Link>
      </nav>

      <main className="flex-1 flex flex-col p-6 gap-5 overflow-hidden min-w-0">
        <header className="flex justify-between items-center shrink-0">
          <h1 className="text-[22px] font-semibold text-slate-900 m-0">概览 Dashboard</h1>
          <div className="text-[13px] text-[#64748B]">
            最后同步: {formatSyncTimestamp(data.lastSyncAt)}
          </div>
        </header>

        <StatCards stats={data.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] lg:grid-rows-[auto_1fr] gap-[20px] flex-1 min-h-0">
          <TodoWidget items={data.todayTodos} />
          <DeadlineWidget items={data.upcomingDeadlines} />
          <RecentWidget items={data.recentApplications} />
        </div>
      </main>
    </div>
  );
}
