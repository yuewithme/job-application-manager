import React, { useState, useMemo } from 'react';
import { CompanyListItem } from '../../types';
import { StatusBadge } from '../dashboard/Badges';
import { formatDateTime } from '../../utils/formatDate';

export default function CompanyList({ data }: { data: CompanyListItem[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onlyUpcoming, setOnlyUpcoming] = useState<boolean>(false);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const lowerReq = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.companyName.toLowerCase().includes(lowerReq)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(item => item.topStatus === statusFilter);
    }

    if (onlyUpcoming) {
      result = result.filter(item => item.hasUpcomingDeadline);
    }

    // Sort by latestUpdatedAt descending
    result.sort((a, b) => new Date(b.latestUpdatedAt).getTime() - new Date(a.latestUpdatedAt).getTime());

    return result;
  }, [data, searchTerm, statusFilter, onlyUpcoming]);

  return (
    <>
      <header className="flex justify-between items-center shrink-0">
        <h1 className="text-[22px] font-semibold text-slate-900 m-0">公司列表</h1>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 flex flex-col flex-1 min-h-0">
        {/* Toolbar */}
        <div className="px-4 py-[14px] border-b border-slate-200 flex gap-4 shrink-0 bg-white items-center">
           <input
             type="text"
             placeholder="搜索公司名..."
             className="border border-slate-300 rounded px-3 py-1.5 text-[13px] w-[240px] focus:outline-none focus:border-[#2563EB]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <select 
             className="border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#2563EB] bg-white"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="all">最高进展状态</option>
             <option value="收藏中">收藏中</option>
             <option value="待投递">待投递</option>
             <option value="已投递">已投递</option>
             <option value="笔试中">笔试中</option>
             <option value="面试中">面试中</option>
             <option value="Offer">Offer</option>
             <option value="已结束">已结束</option>
           </select>
           
           <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer ml-2">
             <input 
               type="checkbox" 
               className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
               checked={onlyUpcoming}
               onChange={(e) => setOnlyUpcoming(e.target.checked)}
             />
             仅看有即将截止项
           </label>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 bg-white">
          <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-[#F8FAFC]">
              <tr>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">公司名称</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">申请岗位数</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">活跃申请数</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">当前最高进展</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">最近更新时间</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">即将截止</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC] text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-[16px] py-[40px] text-center text-slate-500">未找到符合条件的公司</td>
                </tr>
              ) : filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F1F5F9] transition-colors border-b border-slate-100 last:border-none">
                  <td className="px-[16px] py-[12px] font-semibold">{item.companyName}</td>
                  <td className="px-[16px] py-[12px] text-slate-700">{item.applicationCount} 份</td>
                  <td className="px-[16px] py-[12px] text-slate-700">{item.activeApplicationCount} 份</td>
                  <td className="px-[16px] py-[12px] whitespace-nowrap">
                    <StatusBadge status={item.topStatus} />
                  </td>
                  <td className="px-[16px] py-[12px] text-[#64748B] whitespace-nowrap">
                    {formatDateTime(item.latestUpdatedAt)}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    {item.hasUpcomingDeadline ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> 紧急
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-[16px] py-[12px] text-right">
                    <button className="text-[#2563EB] hover:text-blue-700 font-medium text-[13px]">
                      查看申请
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
