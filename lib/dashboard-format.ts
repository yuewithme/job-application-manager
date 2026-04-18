import type { ApplicationStatusValue, PriorityValue } from "@/types";

const statusLabels: Record<ApplicationStatusValue, string> = {
  BOOKMARKED: "收藏中",
  TODO_APPLY: "待投递",
  APPLIED: "已投递",
  WRITTEN_TEST: "笔试中",
  INTERVIEWING: "面试中",
  OFFER: "Offer",
  CLOSED: "已结束",
};

const priorityLabels: Record<PriorityValue, string> = {
  high: "高优先",
  medium: "中优先",
  low: "低优先",
};

export function getStatusLabel(status: ApplicationStatusValue) {
  return statusLabels[status];
}

export function getPriorityLabel(priority: PriorityValue) {
  return priorityLabels[priority];
}

export function formatDateTime(dateString: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatSyncTimestamp(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}
