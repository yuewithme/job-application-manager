import Link from "next/link";

import NextActionCard from "@/components/applications/NextActionCard";
import { PriorityBadge, StatusBadge } from "@/components/dashboard/Badges";
import { formatDateTime, getStatusLabel } from "@/lib/dashboard-format";
import type { ApplicationDetailDto } from "@/types";

interface ApplicationDetailPageProps {
  application: ApplicationDetailDto;
}

function getInterviewMode(application: ApplicationDetailDto["interviews"][number]) {
  return application.interviewType || application.location || application.meetingUrl || "-";
}

export default function ApplicationDetailPage({
  application,
}: ApplicationDetailPageProps) {
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
        <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900 m-0">
              {application.companyName}
            </h1>
            <p className="text-[14px] text-slate-500 mt-1 font-medium">
              {application.jobTitle}
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/applications"
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors"
            >
              返回列表
            </Link>
            <Link
              href={`/applications/${application.id}/edit`}
              className="px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors"
            >
              编辑申请
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] flex-1 min-h-0 overflow-y-auto pb-6 pr-2">
          <div className="lg:col-span-2 flex flex-col gap-[20px]">
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0">
              <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] text-slate-900 bg-[#F8FAFC]">
                备注 (Notes)
              </div>
              <div className="p-4 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                {application.notes || "暂无备注"}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col min-h-[300px]">
              <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0 bg-[#F8FAFC]">
                面试记录 (Interviews)
                <Link
                  href={`/applications/${application.id}/interviews/new`}
                  className="text-[#2563EB] text-[13px] font-medium hover:underline"
                >
                  + 新增记录
                </Link>
              </div>
              <div className="overflow-x-auto flex-1 p-0">
                <table className="w-full border-collapse text-[13px] text-slate-900 text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-medium text-[#64748B]">轮次</th>
                      <th className="px-4 py-3 font-medium text-[#64748B]">时间</th>
                      <th className="px-4 py-3 font-medium text-[#64748B]">形式</th>
                      <th className="px-4 py-3 font-medium text-[#64748B]">结果</th>
                      <th className="px-4 py-3 font-medium text-[#64748B]">记录</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {application.interviews.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          暂无面试记录
                        </td>
                      </tr>
                    ) : (
                      application.interviews.map((interview) => (
                        <tr key={interview.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium whitespace-nowrap">
                            第 {interview.round} 轮 · {interview.title}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {formatDateTime(interview.scheduledAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {getInterviewMode(interview)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                interview.result === "通过"
                                  ? "bg-green-100 text-green-700"
                                  : interview.result === "拒绝"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {interview.result || "待定"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 min-w-[200px]">
                            {interview.notes || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-[20px]">
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 flex flex-col gap-5 shrink-0 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-[12px] text-slate-500 font-medium">当前状态</span>
                  <span>
                    <StatusBadge status={application.status} />
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 border-l border-slate-100 pl-4">
                  <span className="text-[12px] text-slate-500 font-medium">优先级</span>
                  <span>
                    <PriorityBadge priority={application.priority} />
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-slate-100 w-full" />

              <div className="grid grid-cols-1 gap-y-3 gap-x-2 text-[13px]">
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">投递时间</span>
                  <span className="text-slate-900 font-medium text-right">
                    {application.appliedAt ? formatDateTime(application.appliedAt) : "-"}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-500">截止时间</span>
                  <span className="text-slate-900 font-medium text-right">
                    {application.deadlineAt ? formatDateTime(application.deadlineAt) : "-"}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-500">下一步动作</span>
                  <span className="text-slate-900 font-medium text-right flex-1 ml-4">
                    {application.nextAction || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-500">下一步时间</span>
                  <span className="font-medium text-right text-slate-900">
                    {application.nextActionAt ? formatDateTime(application.nextActionAt) : "-"}
                  </span>
                </div>

                <div className="flex justify-between items-start mt-2">
                  <span className="text-slate-500">来源渠道</span>
                  <span className="text-slate-900 text-right">{application.source || "-"}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-500">工作地点</span>
                  <span className="text-slate-900 text-right">{application.city || "-"}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-500">归属用户</span>
                  <span className="text-slate-900 text-right">
                    {application.user.name || application.user.email}
                  </span>
                </div>

                <div className="flex justify-between items-start mt-2 pt-2 border-t border-slate-50 text-[12px]">
                  <span className="text-slate-400">最后更新</span>
                  <span className="text-slate-400 text-right">
                    {formatDateTime(application.updatedAt)}
                  </span>
                </div>
              </div>
            </section>

            <NextActionCard
              applicationId={application.id}
              initialNextAction={application.nextAction}
              initialNextActionAt={application.nextActionAt}
            />

            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex-1 flex flex-col">
              <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] text-slate-900 bg-[#F8FAFC]">
                状态变更时间线
              </div>
              <div className="p-5 flex-1">
                {application.stageLogs.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-[13px] text-slate-500">
                    暂无阶段记录
                  </div>
                ) : (
                  <div className="border-l-2 border-indigo-100 ml-2 space-y-7 mt-2 mb-2 relative">
                    {application.stageLogs.map((log, index) => (
                      <div key={log.id} className="relative pl-6">
                        <div
                          className={`absolute w-3.5 h-3.5 rounded-full -left-[8px] top-1 ring-4 ring-white ${
                            index === application.stageLogs.length - 1
                              ? "bg-indigo-500"
                              : "bg-slate-300"
                          }`}
                        />

                        <div className="text-[13px] font-semibold text-slate-900 mb-0.5">
                          阶段：{getStatusLabel(log.toStatus)}
                        </div>
                        <div className="text-[11px] text-slate-500 mb-1.5">
                          {formatDateTime(log.changedAt)}
                        </div>

                        {log.note ? (
                          <div className="text-[12px] bg-slate-50 border border-slate-100 p-2 rounded-[6px] text-slate-600 inline-block max-w-[90%] leading-relaxed mt-1">
                            备注：{log.note}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
