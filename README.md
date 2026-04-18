# 求职申请管理系统

一个最小可继续扩展的工程骨架，当前数据层已经切换为 MySQL + Prisma。项目保留基础 Next.js 结构，但本轮只完善数据库配置与数据模型，不开始前端页面开发。

## 技术栈

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Prisma 7
- MySQL

## 当前目录结构

```text
.
├─ app
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  └─ home-hero.tsx
├─ lib
│  └─ prisma.ts
├─ prisma
│  └─ schema.prisma
├─ public
├─ types
│  └─ index.ts
├─ .env
├─ .env.example
├─ package.json
└─ README.md
```

## 数据模型说明

- `User`
  负责应用拥有者信息，一对多关联 `Application`
- `Application`
  核心表，保存岗位申请主信息
- `ApplicationStageLog`
  记录申请状态流转历史
- `Interview`
  记录面试安排与结果
- `Reminder`
  记录跟进提醒
- `Attachment`
  记录简历、JD、作品集等附件信息

## 状态枚举

Prisma 中使用英文枚举名，语义对应如下：

- `BOOKMARKED`：收藏中
- `TODO_APPLY`：待投递
- `APPLIED`：已投递
- `WRITTEN_TEST`：笔试中
- `INTERVIEWING`：面试中
- `OFFER`：Offer
- `CLOSED`：已结束

## 优先级枚举

- `low`
- `medium`
- `high`

## MySQL 环境变量

复制 `.env.example` 为 `.env`，并按你的本地 MySQL 实例修改：

```bash
DATABASE_URL="mysql://root:your_password@localhost:3306/job_application_manager"
```

如果数据库 `job_application_manager` 还不存在，请先在 MySQL 中创建它。

## 迁移和初始化步骤

1. 安装依赖

```bash
npm install
```

2. 确认 `.env` 中的 `DATABASE_URL` 指向你的 MySQL

3. 生成 Prisma Client

```bash
npm run prisma:generate
```

4. 创建首个迁移并同步到 MySQL

```bash
npm run prisma:migrate -- --name init_mysql_schema
```

5. 如果只是想把当前 schema 直接推送到数据库而不生成迁移，也可以使用：

```bash
npx prisma db push
```

6. 打开 Prisma Studio 检查表结构：

```bash
npm run prisma:studio
```

## 可用脚本

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```
