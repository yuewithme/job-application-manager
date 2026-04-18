import { getPriorityLabel, getStatusLabel } from "@/lib/dashboard-format";
import type { ApplicationStatusValue, PriorityValue } from "@/types";

export function StatusBadge({ status }: { status: ApplicationStatusValue }) {
  let badgeClass = "bg-[#E2E8F0] text-[#475569]";

  if (status === "OFFER") {
    badgeClass = "bg-[#DCFCE7] text-[#166534]";
  } else if (status === "INTERVIEWING" || status === "WRITTEN_TEST") {
    badgeClass = "bg-[#DBEAFE] text-[#1E40AF]";
  } else if (status === "CLOSED") {
    badgeClass = "bg-rose-100 text-rose-700";
  }

  return (
    <span className={`px-[8px] py-[2px] rounded-[4px] text-[11px] font-medium ${badgeClass}`}>
      {getStatusLabel(status)}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: PriorityValue }) {
  const priorityColors = {
    high: "text-[#EF4444]",
    medium: "text-[#F59E0B]",
    low: "text-[#10B981]",
  };

  return (
    <span className={`text-[11px] font-medium ${priorityColors[priority]}`}>
      {getPriorityLabel(priority)}
    </span>
  );
}
