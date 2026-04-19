"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useState, useTransition } from "react";

import NextActionInlineEditor from "@/components/applications/NextActionInlineEditor";
import { PriorityBadge, StatusBadge } from "@/components/dashboard/Badges";
import {
  type ApplicationDeadlineSort,
  type ApplicationFilterPriority,
  type ApplicationFilterStatus,
  type ApplicationListFilters,
  buildApplicationsPath,
  hasActiveApplicationFilters,
} from "@/lib/applications";
import { formatDate, formatDateTime, getPriorityLabel, getStatusLabel } from "@/lib/dashboard-format";
import { applicationStatusValues, priorityValues, type ApplicationListPageDto } from "@/types";

interface ApplicationListPageClientProps {
  data: ApplicationListPageDto;
  filters: ApplicationListFilters;
}

export default function ApplicationListPageClient({
  data,
  filters,
}: ApplicationListPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState<ApplicationFilterStatus>(filters.status);
  const [priorityFilter, setPriorityFilter] = useState<ApplicationFilterPriority>(filters.priority);
  const [deadlineSort, setDeadlineSort] = useState<ApplicationDeadlineSort>(filters.deadlineSort);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const nextFilters: ApplicationListFilters = {
      ...filters,
      search: deferredSearchTerm.trim(),
      status: statusFilter,
      priority: priorityFilter,
      deadlineSort,
      page: 1,
    };

    const currentPath = buildApplicationsPath(filters);
    const nextPath = buildApplicationsPath(nextFilters);

    if (currentPath === nextPath) {
      return;
    }

    startTransition(() => {
      router.replace(nextPath);
    });
  }, [
    deadlineSort,
    deferredSearchTerm,
    filters,
    priorityFilter,
    router,
    startTransition,
    statusFilter,
  ]);

  const hasFilters = hasActiveApplicationFilters(filters);

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
          className="px-6 py-3 text-[14px] cursor-pointer transition-colors bg-[#334155] text-white border-l-4 border-[#38BDF8]"
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
          className="px-6 py-3 text-[14px] text-[#94A3B8] cursor-pointer hover:bg-slate-700/50 border-l-4 border-transparent"
        >
          Offer 管理
        </Link>
      </nav>

      <main className="flex-1 flex flex-col p-6 gap-5 overflow-hidden min-w-0">
        <header className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900 m-0">所有申请</h1>
            <p className="mt-1 text-[13px] text-slate-500">
              {isPending ? "正在更新列表..." : `当前共 ${data.total} 条申请记录`}
            </p>
          </div>
          <Link
            href="/applications/new"
            className="px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors"
          >
            + 新增申请
          </Link>
        </header>

        <section className="bg-white rounded-xl border border-slate-200 flex flex-col flex-1 min-h-0">
          <div className="px-4 py-[14px] border-b border-slate-200 flex flex-wrap gap-4 shrink-0 bg-white items-center">
            <input
              type="text"
              placeholder="搜索公司或岗位..."
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] w-full max-w-[240px] focus:outline-none focus:border-[#2563EB]"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#2563EB] bg-white"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as ApplicationFilterStatus)}
            >
              <option value="all">所有状态</option>
              {applicationStatusValues.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
            <select
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#2563EB] bg-white"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as ApplicationFilterPriority)
              }
            >
              <option value="all">所有优先级</option>
              {priorityValues.map((priority) => (
                <option key={priority} value={priority}>
                  {getPriorityLabel(priority)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setDeadlineSort((current) =>
                  current === "none" ? "asc" : current === "asc" ? "desc" : "none",
                )
              }
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
            >
              截止时间排序
              <span className="ml-1 text-slate-500">
                {deadlineSort === "none" ? "-" : deadlineSort === "asc" ? "↑" : "↓"}
              </span>
            </button>
          </div>

          <div className="overflow-y-auto flex-1 bg-white">
            <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-[#F8FAFC]">
                <tr>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    公司
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    岗位
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    状态
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    优先级
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    截止时间
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    下一步动作
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    更新时间
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC] text-right">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-[16px] py-[40px] text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-[14px] text-slate-600">
                          {hasFilters ? "未找到符合条件的申请" : "还没有申请记录"}
                        </p>
                        <p className="text-[12px] text-slate-400">
                          {hasFilters ? "试试调整搜索词、筛选条件或排序方式。" : "可以先创建第一条申请。"}
                        </p>
                        {!hasFilters ? (
                          <Link
                            href="/applications/new"
                            className="mt-2 px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors"
                          >
                            去新增申请
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.items.map((item) => (
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
                      <td className="px-[16px] py-[12px] text-[#64748B]">
                        {item.jobTitle || "-"}
                      </td>
                      <td className="px-[16px] py-[12px] whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-[16px] py-[12px] whitespace-nowrap">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="px-[16px] py-[12px] text-[#64748B] whitespace-nowrap">
                        {formatDate(item.deadlineAt)}
                      </td>
                      <td
                        className="px-[16px] py-[12px] max-w-[240px] truncate text-slate-700"
                        title={item.nextAction ?? ""}
                      >
                        {item.nextAction || "-"}
                      </td>
                      <td className="px-[16px] py-[12px] text-[#64748B] whitespace-nowrap">
                        {formatDateTime(item.updatedAt)}
                      </td>
                      <td className="px-[16px] py-[12px] text-right whitespace-nowrap relative">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/applications/${item.id}/edit`}
                            className="text-[#2563EB] hover:text-blue-700 font-medium text-[13px]"
                          >
                            编辑
                          </Link>
                          <NextActionInlineEditor
                            applicationId={item.id}
                            initialNextAction={item.nextAction}
                            initialNextActionAt={item.nextActionAt}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
