import ErrorState from "@/components/ui/ErrorState";

export default function ApplicationDetailNotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ErrorState
        title="未找到这条申请"
        description="这条申请可能已被删除，或当前链接已经失效。你可以返回申请列表重新选择。"
        actionHref="/applications"
        actionLabel="返回申请列表"
      />
    </div>
  );
}
