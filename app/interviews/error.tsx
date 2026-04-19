"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function InterviewsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ErrorState
        title="面试日程加载失败"
        description="当前无法读取面试安排，你可以重新加载，或先回到申请详情页继续操作。"
        onRetry={reset}
        actionHref="/applications"
        actionLabel="前往申请列表"
      />
    </div>
  );
}
