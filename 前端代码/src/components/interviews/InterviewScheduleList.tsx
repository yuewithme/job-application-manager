import React, { useState, useMemo } from 'react';
import { InterviewScheduleItem } from '../../types';
import { formatDateTime } from '../../utils/formatDate';

export default function InterviewScheduleList({ data }: { data: InterviewScheduleItem[] }) {
  const [filterMode, setFilterMode] = useState<'upcoming' | 'past'>('upcoming');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let result = [...data];
    const now = Date.now();
    
    if (filterMode === 'upcoming') {
      result = result.filter(item => new Date(item.interviewAt).getTime() > now);
    } else {
      result = result.filter(item => new Date(item.interviewAt).getTime() <= now);
    }

    result.sort((a, b) => {
      const timeA = new Date(a.interviewAt).getTime();
      const timeB = new Date(b.interviewAt).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [data, filterMode, sortOrder]);

  return (
    <>
      <header className="flex justify-between items-center shrink-0">
        <h1 className="text-[22px] font-semibold text-slate-900 m-0">面试日程</h1>
        <div className="flex gap-2">
           <button 
             onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
             className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
           >
             时间排序 
             <span className="text-slate-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
           </button>
        </div>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 flex flex-col flex-1 min-h-0">
        
        {/* Tabs for Upcoming / Past */}
        <div className="flex gap-6 px-4 border-b border-slate-200 shrink-0 bg-[#F8FAFC] rounded-t-xl">
          <button 
             onClick={() => setFilterMode('upcoming')}
             className={`py-[14px] text-[14px] font-semibold transition-colors relative border-b-2 ${filterMode === 'upcoming' ? 'text-[#2563EB] border-[#2563EB]' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
          >
            即将开始
          </button>
          <button 
             onClick={() => setFilterMode('past')}
             className={`py-[14px] text-[14px] font-semibold transition-colors relative border-b-2 ${filterMode === 'past' ? 'text-[#2563EB] border-[#2563EB]' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
          >
            已结束
          </button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 bg-white">
          <table className="w-full border-collapse text-[13px] text-slate-900 text-left m-0">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white">
              <tr>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">公司</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">岗位</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">面试轮次</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">面试时间</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">形式</th>
                <th className="px-[16px] py-[10px] text-[#64748B] font-medium border-b border-slate-200 bg-white">结果</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-[16px] py-[40px] text-center text-slate-500">
                    {filterMode === 'upcoming' ? '暂无即将开始的面试安排' : '近期无已结束的面试记录'}
                  </td>
                </tr>
              ) : filteredData.map(item => {
                const isPast = new Date(item.interviewAt).getTime() <= Date.now();
                return (
                  <tr key={item.id} className="hover:bg-[#F1F5F9] transition-colors border-b border-slate-100 last:border-none">
                    <td className="px-[16px] py-[12px] font-semibold text-slate-900">{item.companyName}</td>
                    <td className="px-[16px] py-[12px] text-[#64748B]">{item.positionName}</td>
                    <td className="px-[16px] py-[12px] text-slate-800">{item.roundName}</td>
                    <td className="px-[16px] py-[12px] whitespace-nowrap">
                      <span className={`font-medium ${isPast ? 'text-slate-500' : 'text-[#2563EB]'}`}>
                        {formatDateTime(item.interviewAt)}
                      </span>
                    </td>
                    <td className="px-[16px] py-[12px] whitespace-nowrap text-[#64748B]">
                      {item.mode || '-'}
                    </td>
                    <td className="px-[16px] py-[12px] whitespace-nowrap">
                      <span className={`px-[8px] py-[2px] rounded-[4px] text-[11px] font-medium ${
                           item.result === '通过' ? 'bg-[#DCFCE7] text-[#166534]' :
                           item.result === '拒绝' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                           'bg-[#E2E8F0] text-[#475569]'
                      }`}>
                        {item.result || '待定'}
                      </span>
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
