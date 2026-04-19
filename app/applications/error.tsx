"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function ApplicationsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ErrorState
        title="申请列表加载失败"
        description="当前无法读取申请列表数据，你可以重新加载页面，或先去新增申请。"
        onRetry={reset}
        actionHref="/applications/new"
        actionLabel="去新增申请"
      />
    </div>
  );
}
