"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PriorityBadge } from "@/components/dashboard/Badges";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, formatDateTime, getPriorityLabel } from "@/lib/dashboard-format";
import { priorityValues, type OfferListPageDto, type PriorityValue } from "@/types";

interface OfferListPageClientProps {
  data: OfferListPageDto;
}

export default function OfferListPageClient({ data }: OfferListPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | PriorityValue>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const now = new Date(data.currentTime).getTime();

  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm.trim().toLowerCase();

    return [...data.items]
      .filter((item) => {
        if (!lowerSearchTerm) {
          return true;
        }

        return (
          item.companyName.toLowerCase().includes(lowerSearchTerm) ||
          item.jobTitle.toLowerCase().includes(lowerSearchTerm)
        );
      })
      .filter((item) => (priorityFilter === "all" ? true : item.priority === priorityFilter))
      .sort((left, right) => {
        const leftTime = left.deadlineAt ? new Date(left.deadlineAt).getTime() : Number.POSITIVE_INFINITY;
        const rightTime = right.deadlineAt
          ? new Date(right.deadlineAt).getTime()
          : Number.POSITIVE_INFINITY;

        return sortOrder === "asc" ? leftTime - rightTime : rightTime - leftTime;
      });
  }, [data.items, priorityFilter, searchTerm, sortOrder]);
  const hasActiveFilters = searchTerm.trim() !== "" || priorityFilter !== "all";

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
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
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
          className="px-6 py-3 text-[14px] cursor-pointer transition-colors bg-[#334155] text-white border-l-4 border-[#38BDF8]"
        >
          Offer 管理
        </Link>
      </nav>

      <main className="flex-1 flex flex-col p-6 gap-5 overflow-hidden min-w-0">
        <header className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900 m-0">Offer 管理</h1>
            <p className="mt-1 text-[13px] text-slate-500">
              当前共有 {data.items.length} 条 Offer 记录
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSortOrder((current) => (current === "asc" ? "desc" : "asc"))}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              截止时间排序
              <span className="text-slate-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
            </button>
          </div>
        </header>

        <section className="bg-white rounded-xl border border-slate-200 flex flex-col flex-1 min-h-0">
          <div className="px-4 py-[14px] border-b border-slate-200 flex flex-wrap gap-4 shrink-0 bg-white items-center">
            <input
              type="text"
              placeholder="搜索公司或岗位..."
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] w-full md:w-[240px] focus:outline-none focus:border-[#2563EB]"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#2563EB] bg-white"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value as "all" | PriorityValue)}
            >
              <option value="all">所有优先级</option>
              {priorityValues.map((priority) => (
                <option key={priority} value={priority}>
                  {getPriorityLabel(priority)}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-y-auto flex-1 bg-white">
            <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-[#F8FAFC]">
                <tr>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    公司名称
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    岗位名称
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    优先级
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    回复截止时间
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    下一步动作
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    下一步时间
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    更新时间
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[16px] py-[40px] text-center text-slate-500">
                      <EmptyState
                        title={hasActiveFilters ? "没有匹配的 Offer 结果" : "还没有 Offer 记录"}
                        description={
                          hasActiveFilters
                            ? "可以清空搜索词或优先级筛选，重新查看全部 Offer 数据。"
                            : "当申请状态推进到 Offer 后，这里会自动汇总需要跟进的记录。"
                        }
                        action={
                          hasActiveFilters
                            ? {
                                label: "查看全部 Offer",
                                onClick: () => {
                                  setSearchTerm("");
                                  setPriorityFilter("all");
                                },
                              }
                            : { label: "返回申请列表", href: "/applications" }
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const deadlineTime = item.deadlineAt ? new Date(item.deadlineAt).getTime() : null;
                    const isUpcoming =
                      deadlineTime !== null &&
                      deadlineTime > now &&
                      deadlineTime - now < 3 * 24 * 60 * 60 * 1000;
                    const isExpired = deadlineTime !== null && deadlineTime <= now;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F1F5F9] transition-colors border-b border-slate-100 last:border-none"
                      >
                        <td className="px-[16px] py-[12px] font-semibold text-slate-900">
                          <Link
                            href={`/applications/${item.id}`}
                            className="text-[#2563EB] hover:underline"
                          >
                            {item.companyName}
                          </Link>
                        </td>
                        <td className="px-[16px] py-[12px] text-[#64748B]">{item.jobTitle}</td>
                        <td className="px-[16px] py-[12px] whitespace-nowrap">
                          <PriorityBadge priority={item.priority} />
                        </td>
                        <td className="px-[16px] py-[12px] whitespace-nowrap">
                          {isUpcoming ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-rose-600">
                                {formatDate(item.deadlineAt)}
                              </span>
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                即将截止
                              </span>
                            </div>
                          ) : (
                            <span
                              className={
                                isExpired ? "text-slate-400 line-through" : "text-slate-700"
                              }
                            >
                              {item.deadlineAt ? formatDate(item.deadlineAt) : "-"}
                            </span>
                          )}
                        </td>
                        <td
                          className="px-[16px] py-[12px] max-w-[200px] truncate"
                          title={item.nextAction || ""}
                        >
                          {item.nextAction || "-"}
                        </td>
                        <td className="px-[16px] py-[12px] whitespace-nowrap text-[#64748B]">
                          {item.nextActionAt ? formatDateTime(item.nextActionAt) : "-"}
                        </td>
                        <td className="px-[16px] py-[12px] whitespace-nowrap text-[#64748B]">
                          {formatDateTime(item.updatedAt)}
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
