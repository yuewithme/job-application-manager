"use client";

import Link from "next/link";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  compact?: boolean;
}

function ActionButton({
  action,
  secondary = false,
}: {
  action: EmptyStateAction;
  secondary?: boolean;
}) {
  const className = secondary
    ? "inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
    : "inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-700 transition-colors";

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

export default function EmptyState({
  title,
  description,
  action,
  secondaryAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 text-center ${
        compact ? "px-5 py-8" : "px-6 py-12"
      }`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        <span className="text-lg">○</span>
      </div>
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-[13px] leading-6 text-slate-500">{description}</p>
      {action || secondaryAction ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {action ? <ActionButton action={action} /> : null}
          {secondaryAction ? <ActionButton action={secondaryAction} secondary /> : null}
        </div>
      ) : null}
    </div>
  );
}
