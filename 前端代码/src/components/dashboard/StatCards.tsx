import React from 'react';
import { ApplicationListItem } from '../../types';

export default function StatCards({ data }: { data: ApplicationListItem[] }) {
  const total = data.length;
  const interviewing = data.filter(d => d.status === "面试中" || d.status === "笔试中").length;
  const offers = data.filter(d => d.status === "Offer").length;
  const pending = data.filter(d => d.status === "待投递").length;
  const saved = data.filter(d => d.status === "收藏中").length;
  const rejected = data.filter(d => d.status === "已结束").length;

  return (
    <section className="grid grid-cols-2 md:grid-cols-6 gap-3 shrink-0">
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <span className="block text-[20px] font-bold text-slate-900 mb-[2px]">{total}</span>
        <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">总申请</span>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <span className="block text-[20px] font-bold text-[#2563EB] mb-[2px]">{interviewing}</span>
        <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">面试中</span>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <span className="block text-[20px] font-bold text-[#10B981] mb-[2px]">{offers}</span>
        <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">Offer</span>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <span className="block text-[20px] font-bold text-slate-900 mb-[2px]">{pending}</span>
        <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">待投递</span>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <span className="block text-[20px] font-bold text-slate-900 mb-[2px]">{saved}</span>
        <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">收藏中</span>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <span className="block text-[20px] font-bold text-[#EF4444] mb-[2px]">{rejected}</span>
        <span className="text-[11px] text-[#64748B] uppercase tracking-[0.5px]">已结束</span>
      </div>
    </section>
  );
}
