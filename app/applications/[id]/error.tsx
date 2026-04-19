"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function ApplicationDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ErrorState
        title="申请详情加载失败"
        description="这条申请的详情暂时无法加载，你可以重新尝试，或先返回申请列表。"
        onRetry={reset}
        actionHref="/applications"
        actionLabel="返回申请列表"
      />
    </div>
  );
}
