"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function OffersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ErrorState
        title="Offer 数据加载失败"
        description="当前无法读取 Offer 列表，你可以重新加载页面，或先返回申请列表。"
        onRetry={reset}
        actionHref="/applications"
        actionLabel="前往申请列表"
      />
    </div>
  );
}
