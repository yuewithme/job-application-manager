"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ErrorState
        title="Dashboard 加载失败"
        description="概览数据暂时没有成功加载，你可以重新尝试，或先去申请列表继续操作。"
        onRetry={reset}
        actionHref="/applications"
        actionLabel="前往申请列表"
      />
    </div>
  );
}
