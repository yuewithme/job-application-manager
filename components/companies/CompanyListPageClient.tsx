"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/dashboard/Badges";
import { formatDateTime, getStatusLabel } from "@/lib/dashboard-format";
import { applicationStatusValues, type CompanyListPageDto } from "@/types";

interface CompanyListPageClientProps {
  data: CompanyListPageDto;
}

export default function CompanyListPageClient({ data }: CompanyListPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | (typeof applicationStatusValues)[number]>(
    "all",
  );
  const [onlyUpcoming, setOnlyUpcoming] = useState(false);

  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm.trim().toLowerCase();

    return [...data.items]
      .filter((item) =>
        lowerSearchTerm ? item.companyName.toLowerCase().includes(lowerSearchTerm) : true,
      )
      .filter((item) => (statusFilter === "all" ? true : item.topStatus === statusFilter))
      .filter((item) => (onlyUpcoming ? item.hasUpcomingDeadline : true))
      .sort(
        (left, right) =>
          new Date(right.latestUpdatedAt).getTime() - new Date(left.latestUpdatedAt).getTime(),
      );
  }, [data.items, onlyUpcoming, searchTerm, statusFilter]);

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
          className="px-6 py-3 text-[14px] cursor-pointer transition-colors bg-[#334155] text-white border-l-4 border-[#38BDF8]"
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
            <h1 className="text-[22px] font-semibold text-slate-900 m-0">公司列表</h1>
            <p className="mt-1 text-[13px] text-slate-500">
              当前覆盖 {data.items.length} 家公司
            </p>
          </div>
        </header>

        <section className="bg-white rounded-xl border border-slate-200 flex flex-col flex-1 min-h-0">
          <div className="px-4 py-[14px] border-b border-slate-200 flex flex-wrap gap-4 shrink-0 bg-white items-center">
            <input
              type="text"
              placeholder="搜索公司名..."
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] w-full md:w-[240px] focus:outline-none focus:border-[#2563EB]"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#2563EB] bg-white"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | (typeof applicationStatusValues)[number])
              }
            >
              <option value="all">最高进展状态</option>
              {applicationStatusValues.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                checked={onlyUpcoming}
                onChange={(event) => setOnlyUpcoming(event.target.checked)}
              />
              仅看有即将截止项
            </label>
          </div>

          <div className="overflow-y-auto flex-1 bg-white">
            <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-[#F8FAFC]">
                <tr>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    公司名称
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    申请岗位数
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    活跃申请数
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    当前最高进展
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    最近更新时间
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">
                    即将截止
                  </th>
                  <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC] text-right">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-[16px] py-[40px] text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-[14px] text-slate-600">未找到符合条件的公司</p>
                        <p className="text-[12px] text-slate-400">
                          可以调整搜索词、最高状态筛选或截止条件。
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.companyName}
                      className="hover:bg-[#F1F5F9] transition-colors border-b border-slate-100 last:border-none"
                    >
                      <td className="px-[16px] py-[12px] font-semibold">{item.companyName}</td>
                      <td className="px-[16px] py-[12px] text-slate-700">
                        {item.applicationCount} 份
                      </td>
                      <td className="px-[16px] py-[12px] text-slate-700">
                        {item.activeApplicationCount} 份
                      </td>
                      <td className="px-[16px] py-[12px] whitespace-nowrap">
                        <StatusBadge status={item.topStatus} />
                      </td>
                      <td className="px-[16px] py-[12px] text-[#64748B] whitespace-nowrap">
                        {formatDateTime(item.latestUpdatedAt)}
                      </td>
                      <td className="px-[16px] py-[12px]">
                        {item.hasUpcomingDeadline ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            紧急
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-[16px] py-[12px] text-right">
                        <Link
                          href={`/applications?search=${encodeURIComponent(item.companyName)}`}
                          className="text-[#2563EB] hover:text-blue-700 font-medium text-[13px]"
                        >
                          查看申请
                        </Link>
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
