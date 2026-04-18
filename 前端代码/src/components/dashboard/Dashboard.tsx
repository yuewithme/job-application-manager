"use client";

import React from 'react';
import StatCards from './StatCards';
import TodoWidget from './TodoWidget';
import DeadlineWidget from './DeadlineWidget';
import RecentWidget from './RecentWidget';
import { ApplicationListItem } from '../../types';

export default function Dashboard({ data }: { data: ApplicationListItem[] }) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <>
      <header className="flex justify-between items-center shrink-0">
        <h1 className="text-[22px] font-semibold text-slate-900 m-0">概览 Dashboard</h1>
        <div className="text-[13px] text-[#64748B]">最后同步: {dateStr}</div>
      </header>

      <StatCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] lg:grid-rows-[auto_1fr] gap-[20px] flex-1 min-h-0">
        <TodoWidget data={data} />
        <DeadlineWidget data={data} />
        <RecentWidget data={data} />
      </div>
    </>
  );
}
