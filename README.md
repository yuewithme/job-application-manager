# 求职申请管理系统

一个基于 Next.js、TypeScript、Prisma 和 MySQL 的求职申请管理系统，用来统一管理申请进度、下一步动作、面试记录、公司维度视图和 Offer 跟进。

当前仓库已经完成核心数据模型、主要后端 API、以及一套可直接联调真实数据库的前端页面；它已经不是单纯的工程骨架，但也还没有做到完整的企业级产品化交付，例如提醒系统深度闭环、看板页、多角色权限和自动化测试体系都还在后续 backlog 中。

## 当前已实现

- Dashboard 概览页
  - 总申请数
  - 各状态统计
  - 今日待办
  - 即将截止
  - 最近更新
- 所有申请页
  - 真实搜索
  - 状态筛选
  - 优先级筛选
  - 截止时间排序
  - 列表内快速设置下一步动作
- 新增申请页
- 编辑申请页
- 申请详情页
  - 基础信息展示
  - 阶段日志展示
  - 面试记录展示
  - 下一步动作更新
- 面试日程页
- 公司列表页
- Offer 管理页
- 新增面试记录闭环
  - 新增后同步写入 `Interview`
  - 按规则自动推进申请状态为 `INTERVIEWING`
  - 同步写入阶段日志
- 页面级空状态、错误提示、加载反馈统一

## 暂未完成或未纳入本轮交付

- 看板页
- 复杂提醒系统闭环
- 权限系统 / 登录系统
- 自动化测试与 CI 流水线
- 生产部署自动化脚本

## 技术栈

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Prisma 7
- MySQL
- `@prisma/client`
- `@prisma/adapter-mariadb`
- ESLint 9

## 项目结构

```text
.
├─ app/                    # Next.js App Router 页面、API 路由、loading/error 边界
├─ components/             # 页面组件、表单组件、列表组件、统一 UI 状态组件
├─ docs/                   # 开发计划和部署说明
├─ generated/              # Prisma generate 产物（默认不提交到仓库）
├─ lib/                    # Prisma 服务层、DTO、校验、聚合查询、页面数据适配
├─ prisma/                 # schema.prisma 与 migration 文件
├─ public/                 # 静态资源
├─ types/                  # 前后端共享 TypeScript 类型定义
├─ .env.example            # 本地环境变量模板
├─ package.json            # 项目依赖与脚本
└─ README.md               # 项目主文档
```

### 关键目录说明

- `app/`
  - 页面入口与 API 路由
  - 当前主要业务页面包括 `/dashboard`、`/applications`、`/interviews`、`/companies`、`/offers`
- `components/`
  - 页面 UI 主体
  - 各模块客户端交互组件
  - `components/ui/` 下放统一空状态、错误态、骨架屏组件
- `lib/`
  - Prisma 连接
  - Application / Interview / Dashboard / Offer / Company 服务层
  - DTO、参数校验、页面数据转换
- `prisma/`
  - MySQL 数据源配置
  - 当前业务模型与 migration
- `types/`
  - `Application`、`Interview`、`Offer`、`Dashboard` 等共享类型

## 数据模型概览

当前 Prisma schema 里已经有以下核心模型：

- `User`
- `Application`
- `ApplicationStageLog`
- `Interview`
- `Reminder`
- `Attachment`

其中 `Application` 是核心表，已经包含这轮业务用到的重要字段：

- `companyName`
- `jobTitle`
- `status`
- `priority`
- `city`
- `source`
- `notes`
- `appliedAt`
- `deadlineAt`
- `nextAction`
- `nextActionAt`
- `createdAt`
- `updatedAt`

### 状态枚举

- `BOOKMARKED`：收藏中
- `TODO_APPLY`：待投递
- `APPLIED`：已投递
- `WRITTEN_TEST`：笔试中
- `INTERVIEWING`：面试中
- `OFFER`：Offer
- `CLOSED`：已结束

### 优先级枚举

- `low`
- `medium`
- `high`

## 环境变量说明

项目当前强依赖的环境变量只有一个：

### `DATABASE_URL`

MySQL 连接串，例如：

```bash
DATABASE_URL="mysql://root:your_password@localhost:3306/job_application_manager"
```

说明：

- 协议必须是 `mysql://`
- 数据库需要提前存在
- 本项目运行 Prisma 时必须先有这个变量，否则 `lib/prisma.ts` 会直接抛错

请先复制模板：

```bash
cp .env.example .env
```

Windows PowerShell 可以手动复制，或直接新建 `.env` 并粘贴模板内容。

## 本地运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 创建本地 MySQL 数据库

先登录本地 MySQL，然后执行：

```sql
CREATE DATABASE job_application_manager
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，并修改你的账号密码：

```bash
DATABASE_URL="mysql://root:your_password@localhost:3306/job_application_manager"
```

### 4. 生成 Prisma Client

```bash
npx prisma generate
```

说明：

- 本项目的 Prisma Client 输出到 `generated/prisma`
- 该目录默认被 `.gitignore` 忽略
- 新机器克隆仓库后，这一步必须执行一次

### 5. 执行数据库迁移

```bash
npx prisma migrate dev
```

如果你希望明确写迁移名称，也可以：

```bash
npx prisma migrate dev --name init_local
```

### 6. 启动开发环境

```bash
npm run dev
```

默认访问：

- 首页：`http://localhost:3000/`
- Dashboard：`http://localhost:3000/dashboard`
- 所有申请：`http://localhost:3000/applications`

## 数据库初始化说明

### 创建数据库

```sql
CREATE DATABASE job_application_manager
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 执行 migration

开发环境推荐：

```bash
npx prisma migrate dev
```

如果只是想把 schema 直接同步到数据库而不生成 migration，可以临时使用：

```bash
npx prisma db push
```

但正式协作开发仍然建议优先使用 `migrate dev`。

### 生成 Prisma Client

```bash
npx prisma generate
```

### 查看数据库内容

```bash
npx prisma studio
```

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run lint
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

补充说明：

- `npm run build`
  - 用于检查生产构建是否通过
- `npm run lint`
  - 用于检查代码风格和静态问题
- `npx prisma migrate deploy`
  - 主要用于生产环境，不建议替代本地 `migrate dev`

## 本地开发建议流程

推荐的新环境启动顺序：

1. `npm install`
2. 配置 `.env`
3. 创建 MySQL 数据库
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. `npm run dev`

如果你需要查看数据库内容：

7. `npx prisma studio`

## API 与页面现状

当前已经接通的主要能力：

- `POST /api/applications`
- `GET /api/applications`
- `GET /api/applications/[id]`
- `PUT /api/applications/[id]`
- `DELETE /api/applications/[id]`
- `POST /api/applications/[id]/interviews`

当前主要前端页面：

- `/dashboard`
- `/applications`
- `/applications/new`
- `/applications/[id]`
- `/applications/[id]/edit`
- `/applications/[id]/interviews/new`
- `/interviews`
- `/companies`
- `/offers`

## 部署说明

部署文档已单独拆出，见：

- [docs/deployment.md](./docs/deployment.md)

其中包含：

- Vercel + Railway MySQL 的最小上线方案
- GitHub 仓库准备
- 环境变量配置
- 线上 MySQL 配置要求
- Vercel 部署步骤
- Prisma 生产环境注意事项
- 部署后验证建议

## 常见问题

### 1. 数据库连不上怎么办？

先确认：

- MySQL 服务是否启动
- `DATABASE_URL` 用户名、密码、端口、数据库名是否正确
- 本地是否能用数据库客户端连上同一个实例

可以先运行：

```bash
npx prisma migrate status
```

如果这里都连不上，问题通常不是 Next.js，而是数据库连接串或 MySQL 服务本身。

### 2. `prisma migrate dev` 失败怎么办？

常见原因：

- 数据库不存在
- 连接串错误
- 现有 migration 历史和数据库状态不一致

排查建议：

1. 先确认数据库已创建
2. 运行 `npx prisma validate`
3. 运行 `npx prisma migrate status`
4. 如果是纯本地测试库且数据可丢失，可考虑：

```bash
npx prisma migrate reset
```

注意：这会清空当前数据库中的数据。

### 3. 页面能打开但没有数据怎么办？

先确认是不是“真的没有业务数据”：

- `/dashboard`、`/applications`、`/interviews`、`/companies`、`/offers` 现在都已经有统一空状态
- 如果数据库里没有 `User` 或 `Application` 数据，页面会正常打开，但不会有内容

建议先：

1. 打开 `npx prisma studio`
2. 检查 `user`、`application`、`interview` 等表是否有记录

### 4. `build` 失败怎么排查？

优先按这个顺序查：

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`

如果是新环境：

- 先确认已经执行过 `npx prisma generate`
- 因为 `generated/` 默认不会提交到仓库，没生成 Prisma Client 时可能导致构建失败

### 5. 环境变量修改了但没生效怎么办？

常见原因：

- 修改的是 `.env.example`，不是 `.env`
- 改完 `.env` 后没有重启 `npm run dev`
- `DATABASE_URL` 引号或格式写错

建议：

1. 检查项目根目录是否存在真实 `.env`
2. 重启开发服务
3. 再执行一次 `npx prisma migrate status`

## 接手建议

如果你是第一次接手这个项目，推荐先按下面顺序熟悉：

1. 先读本 README
2. 再看 [docs/deployment.md](./docs/deployment.md)
3. 再看 `prisma/schema.prisma`
4. 再看 `app/` 下的页面路由和 `lib/` 下的服务层
5. 最后根据 backlog 继续推进剩余模块
