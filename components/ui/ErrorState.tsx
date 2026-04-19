"use client";

import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  actionHref?: string;
  actionLabel?: string;
}

export default function ErrorState({
  title = "数据加载失败",
  description = "当前页面暂时无法完成加载，你可以稍后重试，或先返回其他页面继续操作。",
  retryLabel = "重新加载",
  onRetry,
  actionHref,
  actionLabel,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/70 px-6 py-12 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-sm ring-1 ring-red-200">
        !
      </div>
      <h2 className="text-[16px] font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-[13px] leading-6 text-slate-600">{description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {retryLabel}
          </button>
        ) : null}
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
