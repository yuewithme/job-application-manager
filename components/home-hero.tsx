const setupChecklist = [
  "Next.js App Router 基础骨架已就位",
  "TypeScript 与 Tailwind CSS 已完成配置",
  "Prisma Schema 与 Client 连接层已准备",
  "MySQL 连接字符串通过 .env 注入",
];

const projectFolders = ["app", "components", "lib", "prisma", "types"];

export function HomeHero() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10">
      <section className="grid gap-6 rounded-[32px] border border-black/5 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          求职申请管理系统
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              一个可直接继续开发的求职申请管理项目初始化骨架。
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              当前项目基于 Next.js、TypeScript、Tailwind CSS、Prisma 与
              MySQL 搭建完成。首页保持最小实现，只用于确认工程可运行，
              后续可以在此基础上继续添加职位列表、申请流程与面试跟踪等功能。
            </p>
          </div>
          <div className="grid gap-3 rounded-[28px] bg-slate-950 p-5 text-slate-50">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
              Core Folders
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {projectFolders.map((folder) => (
                <div
                  key={folder}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-lg font-semibold">{folder}</p>
                  <p className="mt-1 text-sm text-slate-300">initialized</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-semibold text-slate-950">Current setup</h2>
          <div className="mt-5 grid gap-3">
            {setupChecklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed,#eff6ff)] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-semibold text-slate-950">启动提示</h2>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
            <p>1. 先确认本地 MySQL 账号、密码、端口与 `.env` 一致。</p>
            <p>2. 执行 `npm run prisma:generate` 和 `npm run prisma:migrate`。</p>
            <p>3. 运行 `npm run dev` 后访问 `http://localhost:3000`。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
