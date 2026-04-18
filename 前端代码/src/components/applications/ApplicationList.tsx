import React, { useState, useMemo } from 'react';
import { ApplicationListItem } from '../../types';
import { StatusBadge, PriorityBadge } from '../dashboard/Badges';
import { formatDate, formatDateTime } from '../../utils/formatDate';

export default function ApplicationList({ data, onCreateNew, onViewDetail }: { data: ApplicationListItem[], onCreateNew?: () => void, onViewDetail?: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const lowerReq = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.companyName.toLowerCase().includes(lowerReq) ||
        item.positionName.toLowerCase().includes(lowerReq)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(item => item.priority === priorityFilter);
    }

    if (sortOrder !== 'none') {
      result.sort((a, b) => {
        if (!a.deadlineAt && !b.deadlineAt) return 0;
        if (!a.deadlineAt) return 1;
        if (!b.deadlineAt) return -1;
        const timeA = new Date(a.deadlineAt).getTime();
        const timeB = new Date(b.deadlineAt).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }

    return result;
  }, [data, searchTerm, statusFilter, priorityFilter, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none');
  };

  return (
    <>
      <header className="flex justify-between items-center shrink-0">
        <h1 className="text-[22px] font-semibold text-slate-900 m-0">所有申请</h1>
        <div className="flex gap-3">
          <button 
            onClick={onCreateNew}
            className="px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors"
          >
            + 新增申请
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
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="all">所有状态</option>
             <option value="收藏中">收藏中</option>
             <option value="待投递">待投递</option>
             <option value="已投递">已投递</option>
             <option value="笔试中">笔试中</option>
             <option value="面试中">面试中</option>
             <option value="Offer">Offer</option>
             <option value="已结束">已结束</option>
           </select>
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
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">公司</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">岗位</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">状态</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">优先级</th>
                <th 
                  className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC] cursor-pointer hover:bg-slate-200 transition-colors select-none group"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-1">
                    截止时间
                    <span className={`text-[10px] ${sortOrder === 'none' ? 'text-transparent group-hover:text-slate-400' : 'text-slate-600'}`}>
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  </div>
                </th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">下一步动作</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium bg-[#F8FAFC]">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-[16px] py-[40px] text-center text-slate-500">未找到符合条件的申请</td>
                </tr>
              ) : filteredData.map(item => (
                <tr key={item.id} className="hover:bg-[#F1F5F9] transition-colors border-b border-slate-100 last:border-none">
                  <td className="px-[16px] py-[12px] font-semibold text-[#2563EB] cursor-pointer hover:underline" onClick={() => onViewDetail && onViewDetail(item.id)}>
                    {item.companyName}
                  </td>
                  <td className="px-[16px] py-[12px] text-[#64748B]">{item.positionName}</td>
                  <td className="px-[16px] py-[12px] whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-[16px] py-[12px] whitespace-nowrap">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="px-[16px] py-[12px] text-[#64748B] whitespace-nowrap">
                    {formatDate(item.deadlineAt)}
                  </td>
                  <td className="px-[16px] py-[12px] max-w-[200px] truncate" title={item.nextAction || ''}>
                    {item.nextAction || '-'}
                  </td>
                  <td className="px-[16px] py-[12px] text-[#64748B] whitespace-nowrap">
                    {formatDateTime(item.updatedAt)}
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
