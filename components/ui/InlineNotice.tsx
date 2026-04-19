import type { ReactNode } from "react";

interface InlineNoticeProps {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}

const toneClasses = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-700",
  info: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function InlineNotice({
  tone = "info",
  children,
}: InlineNoticeProps) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-[12px] ${toneClasses[tone]}`}>
      {children}
    </div>
  );
}
