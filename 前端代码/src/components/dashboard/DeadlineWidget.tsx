import React from 'react';
import { ApplicationListItem } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { PriorityBadge } from './Badges';

export default function DeadlineWidget({ data }: { data: ApplicationListItem[] }) {
  const approaching = data
    .filter(d => d.deadlineAt && new Date(d.deadlineAt).getTime() > Date.now())
    .sort((a, b) => new Date(a.deadlineAt!).getTime() - new Date(b.deadlineAt!).getTime())
    .slice(0, 5);

  return (
    <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden min-h-0">
      <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0">
        即将截止 (Upcoming Deadlines)
      </div>
      <div className="overflow-y-auto flex-1 min-h-0">
        <table className="w-full border-collapse text-[13px] text-slate-900 text-left">
          <thead className="sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">公司/职位</th>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">截止时间</th>
              <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">优先级</th>
            </tr>
          </thead>
          <tbody>
            {approaching.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-[16px] py-[12px] text-center text-slate-500 border-b border-slate-200">近期无即将截止的申请</td>
              </tr>
            ) : approaching.map(item => (
              <tr key={item.id}>
                <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[200px]">
                  <strong className="font-semibold">{item.companyName}</strong> / {item.positionName}
                </td>
                <td className="px-[16px] py-[12px] border-b border-slate-200">{formatDate(item.deadlineAt)}</td>
                <td className="px-[16px] py-[12px] border-b border-slate-200">
                  <PriorityBadge priority={item.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
