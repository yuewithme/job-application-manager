import React from 'react';
import { ApplicationListItem } from '../../types';
import { formatDateTime } from '../../utils/formatDate';
import { PriorityBadge } from './Badges';

export default function TodoWidget({ data }: { data: ApplicationListItem[] }) {
  const todos = data
    .filter(d => d.nextAction && d.nextActionAt)
    .sort((a, b) => new Date(a.nextActionAt!).getTime() - new Date(b.nextActionAt!).getTime())
    .slice(0, 5);

  const priorityColors = {
    high: 'border-l-[#EF4444]',
    medium: 'border-l-[#F59E0B]',
    low: 'border-l-[#10B981]',
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden min-h-0">
      <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0">
        今日待办 (Next Actions)
      </div>
      <div className="overflow-y-auto p-3 flex-1 min-h-0">
        {todos.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-[13px]">暂无待办事项</div>
        ) : (
          todos.map(item => (
            <div key={item.id} className={`p-[10px] rounded-[6px] bg-[#F1F5F9] mb-2 border-l-[3px] border-solid ${priorityColors[item.priority] || 'border-l-blue-600'}`}>
              <div className="text-[13px] font-medium text-slate-900 mb-1">{item.nextAction}</div>
              <div className="text-[11px] text-[#64748B]">
                {formatDateTime(item.nextActionAt)} | 优先级: <PriorityBadge priority={item.priority} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
