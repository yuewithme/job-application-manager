import React from 'react';
import { ApplicationListItem } from '../../types';

export function StatusBadge({ status }: { status: ApplicationListItem["status"] }) {
  let badgeClass = "bg-[#E2E8F0] text-[#475569]"; // default badge-status
  if (status === "Offer") {
    badgeClass = "bg-[#DCFCE7] text-[#166534]"; // badge-offer
  } else if (status === "面试中" || status === "笔试中") {
    badgeClass = "bg-[#DBEAFE] text-[#1E40AF]"; // badge-interview
  } else if (status === "已结束") {
    badgeClass = "bg-rose-100 text-rose-700";
  }

  return (
    <span className={`px-[8px] py-[2px] rounded-[4px] text-[11px] font-medium ${badgeClass}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ApplicationListItem["priority"] }) {
  const labels = { high: "高优先", medium: "中优先", low: "低优先" };
  const priorityColors = {
    high: "text-[#EF4444]",
    medium: "text-[#F59E0B]",
    low: "text-[#10B981]"
  };
  return (
    <span className={`font-medium ${priorityColors[priority]}`}>
      {labels[priority]}
    </span>
  );
}
