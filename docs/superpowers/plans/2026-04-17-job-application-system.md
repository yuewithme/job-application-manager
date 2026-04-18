# Job Application System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 初始化一个可运行的“求职申请管理系统”工程骨架，技术栈为 Next.js、TypeScript、Tailwind CSS、Prisma 和 PostgreSQL。

**Architecture:** 先用 create-next-app 创建 App Router 工程，再补充 Prisma 和 PostgreSQL 连接配置。项目仅包含最小首页、Prisma Client 单例、基础目录与占位类型，避免引入业务逻辑。

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma, PostgreSQL

---

### Task 1: 初始化 Next.js 工程

**Files:**
- Create: `package.json`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `tsconfig.json`
- Create: `next.config.ts`

- [ ] **Step 1: 用 create-next-app 初始化 TypeScript + App Router + Tailwind 工程**

Run: `npx create-next-app@latest . --ts --tailwind --eslint --app --use-npm --import-alias "@/*" --yes`
Expected: 创建 Next.js 项目文件并完成依赖安装

- [ ] **Step 2: 检查首页和基础配置是否生成**

Run: `Get-ChildItem app, package.json, tsconfig.json, next.config.ts`
Expected: 能看到 `app` 目录和核心配置文件

### Task 2: 接入 Prisma 与 PostgreSQL

**Files:**
- Modify: `.env`
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`

- [ ] **Step 1: 安装数据库依赖**

Run: `npm install @prisma/client pg && npm install -D prisma`
Expected: `package.json` 中出现 Prisma 与 PostgreSQL 依赖

- [ ] **Step 2: 初始化 Prisma 目录**

Run: `npx prisma init`
Expected: 创建 `prisma/schema.prisma`

- [ ] **Step 3: 将 schema 调整为 PostgreSQL 最小模型**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model JobApplication {
  id          String   @id @default(cuid())
  companyName String
  jobTitle    String
  status      String   @default("applied")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 4: 生成 Prisma Client**

Run: `npx prisma generate`
Expected: 成功生成 Prisma Client

### Task 3: 补齐基础工程结构

**Files:**
- Create: `components/home-hero.tsx`
- Create: `types/index.ts`
- Create: `lib/utils.ts`

- [ ] **Step 1: 创建基础组件与占位类型**

```tsx
export function HomeHero() {
  return <section>...</section>;
}
```

```ts
export type ApplicationStatus = "applied" | "interviewing" | "offer" | "rejected";
```

- [ ] **Step 2: 调整首页引用基础组件**

Run: `Get-Content app/page.tsx`
Expected: 首页从默认模板改为项目欢迎页

### Task 4: 验证可运行性

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 运行 Prisma generate**

Run: `npx prisma generate`
Expected: PASS

- [ ] **Step 2: 运行 Next.js 构建检查**

Run: `npm run build`
Expected: PASS，应用能成功构建

- [ ] **Step 3: 补充启动说明**

Run: `Get-Content README.md`
Expected: 包含安装、数据库连接、启动步骤
