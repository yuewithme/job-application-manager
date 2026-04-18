import React, { useState, useMemo } from 'react';
import { OfferListItem } from '../../types';
import { PriorityBadge } from '../dashboard/Badges';
import { formatDate, formatDateTime } from '../../utils/formatDate';

export default function OfferList({ data }: { data: OfferListItem[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm) {
      const lowerReq = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.companyName.toLowerCase().includes(lowerReq) ||
        item.positionName.toLowerCase().includes(lowerReq)
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(item => item.priority === priorityFilter);
    }

    // Sort by deadline
    result.sort((a, b) => {
      // Treating null deadlines as far in future
      const timeA = a.deadlineAt ? new Date(a.deadlineAt).getTime() : Infinity;
      const timeB = b.deadlineAt ? new Date(b.deadlineAt).getTime() : Infinity;
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [data, searchTerm, priorityFilter, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <header className="flex justify-between items-center shrink-0">
        <h1 className="text-[22px] font-semibold text-slate-900 m-0">Offer 管理</h1>
        <div className="flex gap-2">
           <button 
             onClick={toggleSort}
             className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
           >
             截止时间排序 
             <span className="text-slate-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
           </button>
        </div>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 flex flex-col flex-1 min-h-0">
        {/* Toolbar */}
        <div className="px-4 py-[14px] border-b border-slate-200 flex gap-4 shrink-0 bg-white items-center">
           <input
             type="text"
             placeholder="搜索公司或岗位..."
             className="border border-slate-300 rounded px-3 py-1.5 text-[13px] w-[240px] focus:outline-none focus:border-[#2563EB]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <select 
             className="border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#2563EB] bg-white"
             value={priorityFilter}
             onChange={(e) => setPriorityFilter(e.target.value)}
           >
             <option value="all">所有优先级</option>
             <option value="high">高优先</option>
             <option value="medium">中优先</option>
             <option value="low">低优先</option>
           </select>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 bg-white">
          <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-[#F8FAFC]">
              <tr>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">公司名称</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">岗位名称</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">优先级</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">回复截止时间</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">下一步动作</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">下一步时间</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-[16px] py-[40px] text-center text-slate-500">未找到符合条件的 Offer 记录</td>
                </tr>
              ) : filteredData.map(item => {
                const isUpcoming = item.deadlineAt && (new Date(item.deadlineAt).getTime() - Date.now() > 0) && (new Date(item.deadlineAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000);
                const isExpired = item.deadlineAt && new Date(item.deadlineAt).getTime() <= Date.now();

                return (
                  <tr key={item.id} className="hover:bg-[#F1F5F9] transition-colors border-b border-slate-100 last:border-none">
                    <td className="px-[16px] py-[12px] font-semibold text-slate-900">{item.companyName}</td>
                    <td className="px-[16px] py-[12px] text-[#64748B]">{item.positionName}</td>
                    <td className="px-[16px] py-[12px] whitespace-nowrap">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="px-[16px] py-[12px] whitespace-nowrap">
                      {isUpcoming ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-rose-600">{formatDate(item.deadlineAt!)}</span>
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            即将截止
                          </span>
                        </div>
                      ) : (
                        <span className={isExpired ? 'text-slate-400 line-through' : 'text-slate-700'}>
                          {item.deadlineAt ? formatDate(item.deadlineAt) : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-[16px] py-[12px] max-w-[200px] truncate" title={item.nextAction || ''}>
                      {item.nextAction || '-'}
                    </td>
                    <td className="px-[16px] py-[12px] whitespace-nowrap text-[#64748B]">
                      {item.nextActionAt ? formatDateTime(item.nextActionAt) : '-'}
                    </td>
                    <td className="px-[16px] py-[12px] whitespace-nowrap text-[#64748B]">
                      {formatDateTime(item.updatedAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
