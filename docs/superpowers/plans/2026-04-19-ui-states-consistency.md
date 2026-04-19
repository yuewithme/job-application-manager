# UI States Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一主要页面的空状态、错误提示与加载反馈，提升页面级体验一致性，同时不改变现有业务结构和视觉风格。

**Architecture:** 通过 3 个轻量复用组件统一页面状态表达，再在 App Router 各主页面补齐 `loading.tsx` 与 `error.tsx`，最后逐页把已有零散空状态替换成统一组件，并收敛行内操作的禁用与提交提示。看板页不纳入本轮交付。

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, React Server/Client Components

---

### Task 1: 通用状态组件

**Files:**
- Create: `components/ui/EmptyState.tsx`
- Create: `components/ui/ErrorState.tsx`
- Create: `components/ui/PageSkeleton.tsx`

- [ ] **Step 1: 创建统一空状态组件**
- [ ] **Step 2: 创建统一错误状态组件**
- [ ] **Step 3: 创建统一页面骨架屏组件**

### Task 2: 页面级 loading / error 路由

**Files:**
- Create: `app/dashboard/loading.tsx`
- Create: `app/dashboard/error.tsx`
- Create: `app/applications/loading.tsx`
- Create: `app/applications/error.tsx`
- Create: `app/applications/[id]/loading.tsx`
- Create: `app/applications/[id]/error.tsx`
- Create: `app/interviews/loading.tsx`
- Create: `app/interviews/error.tsx`
- Create: `app/companies/loading.tsx`
- Create: `app/companies/error.tsx`
- Create: `app/offers/loading.tsx`
- Create: `app/offers/error.tsx`

- [ ] **Step 1: 为主要页面补齐 loading.tsx**
- [ ] **Step 2: 为主要页面补齐 error.tsx**

### Task 3: 逐页统一空状态和错误反馈

**Files:**
- Modify: `components/dashboard/TodoWidget.tsx`
- Modify: `components/dashboard/DeadlineWidget.tsx`
- Modify: `components/dashboard/RecentWidget.tsx`
- Modify: `components/applications/ApplicationListPageClient.tsx`
- Modify: `components/applications/ApplicationDetailPage.tsx`
- Modify: `components/interviews/InterviewSchedulePageClient.tsx`
- Modify: `components/companies/CompanyListPageClient.tsx`
- Modify: `components/offers/OfferListPageClient.tsx`
- Modify: `components/applications/NextActionCard.tsx`
- Modify: `components/applications/NextActionInlineEditor.tsx`
- Modify: `components/interviews/InterviewRecordFormPageClient.tsx`

- [ ] **Step 1: Dashboard 三个区块统一空状态**
- [ ] **Step 2: 所有申请页统一“无数据 / 无匹配结果”**
- [ ] **Step 3: 申请详情页统一区块空状态**
- [ ] **Step 4: 面试日程 / 公司列表 / Offer 管理页统一空状态**
- [ ] **Step 5: 行内操作统一提交中和失败提示**

### Task 4: 验证与提交流程

**Files:**
- Modify: `docs/superpowers/plans/2026-04-19-ui-states-consistency.md`

- [ ] **Step 1: 运行 `npm run lint`**
- [ ] **Step 2: 运行 `npx tsc --noEmit`**
- [ ] **Step 3: 运行 `npm run build`**
- [ ] **Step 4: 提交并推送 feature branch**
- [ ] **Step 5: 创建或更新 Draft PR**
