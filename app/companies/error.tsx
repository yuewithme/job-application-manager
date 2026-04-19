"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function CompaniesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ErrorState
        title="公司列表加载失败"
        description="当前无法统计公司维度的数据，你可以重新尝试，或先回到申请列表。"
        onRetry={reset}
        actionHref="/applications"
        actionLabel="前往申请列表"
      />
    </div>
  );
}
