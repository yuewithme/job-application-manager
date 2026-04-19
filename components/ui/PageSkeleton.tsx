interface PageSkeletonProps {
  title: string;
  description?: string;
  variant?: "dashboard" | "table" | "detail";
}

function SkeletonLine({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-slate-200/80 ${className}`} />;
}

function SidebarSkeleton() {
  return (
    <nav className="hidden w-[200px] shrink-0 flex-col bg-[#1E293B] py-5 md:flex">
      <SkeletonLine className="mx-6 mb-8 h-7 w-28 bg-slate-600" />
      <div className="space-y-3 px-4">
        <SkeletonLine className="h-10 w-full bg-slate-700" />
        <SkeletonLine className="h-10 w-full bg-slate-800" />
        <SkeletonLine className="h-10 w-full bg-slate-800" />
        <SkeletonLine className="h-10 w-full bg-slate-800" />
        <SkeletonLine className="h-10 w-full bg-slate-800" />
      </div>
    </nav>
  );
}

function DashboardBody() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5">
            <SkeletonLine className="mx-auto h-8 w-10" />
            <SkeletonLine className="mx-auto mt-4 h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-1">
          <SkeletonLine className="h-5 w-28" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLine key={index} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <SkeletonLine className="h-5 w-36" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonLine key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
          <SkeletonLine className="h-5 w-32" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLine key={index} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TableBody() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="flex flex-wrap gap-3">
          <SkeletonLine className="h-10 w-60" />
          <SkeletonLine className="h-10 w-36" />
          <SkeletonLine className="h-10 w-36" />
        </div>
      </div>
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonLine key={index} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

function DetailBody() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SkeletonLine className="h-5 w-20" />
          <SkeletonLine className="mt-4 h-20 w-full" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SkeletonLine className="h-5 w-28" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLine key={index} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SkeletonLine className="h-28 w-full" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <SkeletonLine className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function PageSkeleton({
  title,
  description,
  variant = "table",
}: PageSkeletonProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans text-[#0F172A]">
      <SidebarSkeleton />
      <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-hidden p-6">
        <header className="shrink-0">
          <SkeletonLine className="h-9 w-52" />
          <SkeletonLine className="mt-3 h-4 w-64" />
          {description ? <span className="sr-only">{description}</span> : null}
        </header>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2">
            <div className="space-y-5">
              {variant === "dashboard"
                ? <DashboardBody />
                : variant === "detail"
                  ? <DetailBody />
                  : <TableBody />}
            </div>
          </div>
        </div>
        <span className="sr-only">{title}</span>
      </main>
    </div>
  );
}
