# 部署说明

本文档描述当前版本的求职申请管理系统如何完成基础部署准备，包括 GitHub 仓库、环境变量、MySQL、Vercel 部署步骤，以及 Prisma 在生产环境中的注意事项。

## 1. 部署前提

在开始前，请确认你已经具备：

- 一个可访问的 GitHub 仓库
- 一个线上 MySQL 实例
- 一个 Vercel 账号，或其他支持 Next.js 的部署平台
- 能够在部署平台中配置环境变量

## 2. GitHub 仓库准备

推荐流程：

1. Fork 或直接克隆目标仓库
2. 确认默认分支可以正常安装依赖
3. 在本地先完成一次基础验证：

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run lint
npm run build
```

如果本地都无法跑通，不建议直接开始线上部署。

## 3. 线上环境变量

当前项目必需的线上环境变量：

### `DATABASE_URL`

示例：

```bash
DATABASE_URL="mysql://username:password@host:3306/job_application_manager"
```

要求：

- 指向线上 MySQL
- 部署平台所在网络可以访问该 MySQL
- 生产环境数据库账号建议使用独立用户，不建议直接使用 root

## 4. 线上 MySQL 配置要求

建议至少满足以下条件：

- 字符集使用 `utf8mb4`
- 已创建业务数据库，例如：

```sql
CREATE DATABASE job_application_manager
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

- 对部署平台开放必要的访问白名单
- 使用稳定连接地址，不要依赖只适合本机的 `localhost`

推荐检查项：

- 主机地址是否可从 Vercel 或部署平台访问
- 用户权限是否允许建表、更新表结构、读写数据
- 是否启用了 SSL，如果供应商要求则需要把参数写进连接串

## 5. Vercel 部署步骤

### 方式一：从 GitHub 导入

1. 打开 Vercel
2. 选择 `Add New Project`
3. 导入 GitHub 仓库
4. 在 Project Settings 中配置环境变量：
   - `DATABASE_URL`
5. 进入 Build & Development Settings
6. 建议把 Build Command 显式设置为：

```bash
npx prisma generate && next build
```

原因：

- 当前 Prisma Client 输出到 `generated/prisma`
- `generated/` 默认不提交到仓库
- 新环境构建前需要先生成 Prisma Client

7. 点击 Deploy

### 方式二：已有项目更新

如果项目已经连到 Vercel：

1. 更新 GitHub 分支
2. 确认 Vercel 中的环境变量没有缺失
3. 触发 Redeploy

## 6. Prisma 在生产环境的注意事项

### 不要在生产环境使用 `prisma migrate dev`

开发环境常用：

```bash
npx prisma migrate dev
```

生产环境应使用：

```bash
npx prisma migrate deploy
```

### 推荐的生产迁移顺序

1. 先把代码部署到目标环境
2. 在部署前或部署流程中执行：

```bash
npx prisma generate
npx prisma migrate deploy
```

3. 再启动应用服务

### 如果你的平台不方便直接跑迁移

可以采用以下策略之一：

- 在 CI 中单独执行迁移
- 使用部署平台的 build hook / deploy hook
- 使用一台可访问生产数据库的运维机器手动执行

### Prisma Client 生成问题

如果线上构建报错提示找不到 Prisma Client 或 `generated/prisma` 相关文件：

- 优先确认构建前是否执行了 `npx prisma generate`
- 确认 `DATABASE_URL` 已配置

## 7. 部署后如何验证

建议按这个顺序验收：

### 页面访问

确认以下页面能正常打开：

- `/`
- `/dashboard`
- `/applications`
- `/interviews`
- `/companies`
- `/offers`

### 数据库联通

重点看：

- Dashboard 是否能读到真实统计
- 所有申请页是否能拉到真实列表
- 详情页是否能正常读取一条申请

### 基础写操作

至少验证一遍：

1. 新增申请
2. 编辑申请
3. 设置下一步动作
4. 新增面试记录

如果这些动作都能成功，说明前后端、Prisma、MySQL 基本链路是通的。

## 8. 部署常见问题

### 1. Vercel 构建时报 Prisma Client 不存在

通常是因为没有先执行：

```bash
npx prisma generate
```

请检查 Build Command 是否包含这一句。

### 2. 页面能打开但一直没有数据

先确认：

- `DATABASE_URL` 是否真的指向线上库
- 线上库是否已执行 migration
- 线上库是否已有业务数据

### 3. 线上数据库迁移失败

请检查：

- 数据库账号权限是否足够
- 迁移历史是否一致
- 是否误用了 `prisma migrate dev`

### 4. 本地能跑，线上 build 失败

优先检查：

- Node 版本是否兼容
- 环境变量是否配置完整
- 构建命令是否包含 `npx prisma generate`
- 生产数据库是否可以从平台网络访问

## 9. 交付建议

如果你准备把这个项目交给别人继续维护，建议同时交付：

- 本 README
- 本部署文档
- `.env.example`
- MySQL 数据库访问方式
- 当前已开的 backlog / PR 列表
