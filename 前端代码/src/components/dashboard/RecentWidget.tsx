import React from 'react';
import { ApplicationListItem } from '../../types';
import { StatusBadge, PriorityBadge } from './Badges';
import { formatDateTime } from '../../utils/formatDate';

export default function RecentWidget({ data }: { data: ApplicationListItem[] }) {
  const recent = [...data]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

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
             {recent.map(item => (
               <tr key={item.id}>
                 <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[150px]">{item.companyName}</td>
                 <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[150px]">{item.positionName}</td>
                 <td className="px-[16px] py-[12px] border-b border-slate-200">
                   <StatusBadge status={item.status} />
                 </td>
                 <td className="px-[16px] py-[12px] border-b border-slate-200">
                   <PriorityBadge priority={item.priority} />
                 </td>
                 <td className="px-[16px] py-[12px] border-b border-slate-200 truncate max-w-[200px]">{item.nextAction || '-'}</td>
                 <td className="px-[16px] py-[12px] border-b border-slate-200 text-[#64748B]">{formatDateTime(item.updatedAt)}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
