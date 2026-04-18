"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatDateTime } from "@/lib/dashboard-format";
import type { InterviewScheduleItemDto, InterviewSchedulePageDto } from "@/types";

interface InterviewSchedulePageClientProps {
  data: InterviewSchedulePageDto;
}

function getResultBadgeClass(result: string | null) {
  if (result === "通过") {
    return "bg-[#DCFCE7] text-[#166534]";
  }

  if (result === "拒绝") {
    return "bg-[#FEE2E2] text-[#991B1B]";
  }

  return "bg-[#E2E8F0] text-[#475569]";
}

function getRoundLabel(item: InterviewScheduleItemDto) {
  return `第 ${item.round} 轮${item.title ? ` · ${item.title}` : ""}`;
}

export default function InterviewSchedulePageClient({
  data,
}: InterviewSchedulePageClientProps) {
  const [filterMode, setFilterMode] = useState<"upcoming" | "past">("upcoming");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const now = new Date(data.currentTime).getTime();

  const filteredData = useMemo(() => {
    return [...data.items]
      .filter((item) => {
        const interviewTime = new Date(item.scheduledAt).getTime();
        return filterMode === "upcoming" ? interviewTime > now : interviewTime <= now;
      })
      .sort((left, right) => {
        const leftTime = new Date(left.scheduledAt).getTime();
        const rightTime = new Date(right.scheduledAt).getTime();
        return sortOrder === "asc" ? leftTime - rightTime : rightTime - leftTime;
      });
  }, [data.items, filterMode, now, sortOrder]);

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      <nav className="w-[200px] bg-[#1E293B] text-white flex flex-col py-5 shrink-0 hidden md:flex">
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
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
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
          className="px-6 py-3 text-[14px] cursor-pointer transition-colors bg-[#334155] text-white border-l-4 border-[#38BDF8]"
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

      <main className="flex-1 flex flex-col p-6 gap-5 overflow-hidden min-w-0">
        <header className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900 m-0">面试日程</h1>
            <p className="mt-1 text-[13px] text-slate-500">
              当前共有 {data.items.length} 条面试安排
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSortOrder((current) => (current === "asc" ? "desc" : "asc"))}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              时间排序
              <span className="text-slate-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
            </button>
          </div>
        </header>

        <section className="bg-white rounded-xl border border-slate-200 flex flex-col flex-1 min-h-0">
          <div className="flex gap-6 px-4 border-b border-slate-200 shrink-0 bg-[#F8FAFC] rounded-t-xl">
            <button
              type="button"
              onClick={() => setFilterMode("upcoming")}
              className={`py-[14px] text-[14px] font-semibold transition-colors relative border-b-2 ${
                filterMode === "upcoming"
                  ? "text-[#2563EB] border-[#2563EB]"
                  : "text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              即将开始
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("past")}
              className={`py-[14px] text-[14px] font-semibold transition-colors relative border-b-2 ${
                filterMode === "past"
                  ? "text-[#2563EB] border-[#2563EB]"
                  : "text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              已结束
            </button>
          </div>

          <div className="overflow-y-auto flex-1 bg-white">
            <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white">
                <tr>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">
                    公司
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">
                    岗位
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">
                    面试轮次
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">
                    面试时间
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">
                    形式
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">
                    结果
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-[16px] py-[40px] text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <p>
                          {filterMode === "upcoming"
                            ? "暂无即将开始的面试安排"
                            : "近期无已结束的面试记录"}
                        </p>
                        <p className="text-[12px] text-slate-400">
                          {filterMode === "upcoming"
                            ? "可以先去申请详情页补充面试记录。"
                            : "等面试结果产生后，这里会自动出现历史记录。"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const isPast = new Date(item.scheduledAt).getTime() <= now;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F1F5F9] transition-colors border-b border-slate-100 last:border-none"
                      >
                        <td className="px-[16px] py-[12px] font-semibold text-slate-900">
                          <Link
                            href={`/applications/${item.applicationId}`}
                            className="text-[#2563EB] hover:underline"
                          >
                            {item.companyName}
                          </Link>
                        </td>
                        <td className="px-[16px] py-[12px] text-[#64748B]">{item.jobTitle}</td>
                        <td className="px-[16px] py-[12px] text-slate-800">
                          {getRoundLabel(item)}
                        </td>
                        <td className="px-[16px] py-[12px] whitespace-nowrap">
                          <span
                            className={`font-medium ${
                              isPast ? "text-slate-500" : "text-[#2563EB]"
                            }`}
                          >
                            {formatDateTime(item.scheduledAt)}
                          </span>
                        </td>
                        <td className="px-[16px] py-[12px] whitespace-nowrap text-[#64748B]">
                          {item.interviewType || "-"}
                        </td>
                        <td className="px-[16px] py-[12px] whitespace-nowrap">
                          <span
                            className={`px-[8px] py-[2px] rounded-[4px] text-[11px] font-medium ${getResultBadgeClass(
                              item.result,
                            )}`}
                          >
                            {item.result || "待定"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
