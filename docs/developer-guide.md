# 学习助手开发者文档

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [开发环境设置](#开发环境设置)
5. [API文档](#API文档)
6. [数据库模型](#数据库模型)
7. [测试指南](#测试指南)
8. [部署流程](#部署流程)
9. [数据备份与恢复](#数据备份与恢复)

## 项目概述

学习助手是一个基于Next.js和MongoDB的全栈应用，旨在帮助用户管理学习目标、记录学习过程、整理学习笔记。本文档提供了项目的技术细节和开发指南，帮助开发者理解系统架构和贡献代码。

## 技术栈

- **前端**：Next.js 14, React 18, TailwindCSS
- **后端**：Next.js API Routes
- **数据库**：MongoDB (Mongoose ORM)
- **认证**：NextAuth.js
- **测试**：Jest, React Testing Library
- **CI/CD**：GitHub Actions
- **部署**：Vercel

## 项目结构

```
/
├── .github/            # GitHub配置文件
│   └── workflows/      # GitHub Actions工作流配置
├── __tests__/          # 测试文件
│   ├── api/            # API测试
│   ├── components/     # 组件测试
│   └── models/         # 模型测试
├── backups/            # 数据备份文件（自动生成）
├── docs/               # 文档
├── public/             # 静态资源
├── scripts/            # 脚本文件
├── src/                # 源代码
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API路由
│   │   └── ...         # 页面路由
│   ├── components/     # React组件
│   ├── lib/            # 工具库
│   ├── middleware/     # 中间件
│   └── models/         # 数据库模型
└── ...                 # 配置文件
```

## 开发环境设置

### 前提条件

- Node.js 18+
- MongoDB

### 安装步骤

1. 克隆仓库
   ```bash
   git clone <repository-url>
   cd nextjs-app
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 创建环境变量文件
   ```bash
   cp .env.example .env.local
   ```
   并填写必要的环境变量：
   ```
   MONGODB_URI=mongodb://localhost:27017/study-assistant
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

## API文档

### 目标管理API

#### GET /api/goals

获取用户的目标列表。

**查询参数**：
- `type`: 目标类型（short_term/long_term）
- `status`: 目标状态（not_started/in_progress/completed）
- `page`: 页码，默认为1
- `limit`: 每页数量，默认为10

**响应**：
```json
{
  "goals": [...],
  "pagination": {
    "total": 20,
    "page": 1,
    "totalPages": 2
  }
}
```

#### POST /api/goals

创建新目标。

**请求体**：
```json
{
  "title": "目标标题",
  "description": "目标描述",
  "type": "short_term",
  "startDate": "2023-12-01",
  "endDate": "2023-12-31",
  "priority": "medium"
}
```

**响应**：新创建的目标对象

#### PUT /api/goals

更新目标。

**请求体**：
```json
{
  "id": "目标ID",
  "title": "更新的标题",
  "status": "in_progress",
  "progress": 50
}
```

**响应**：更新后的目标对象

#### DELETE /api/goals

删除目标。

**查询参数**：
- `id`: 目标ID

**响应**：
```json
{
  "message": "目标删除成功"
}
```

### 统计API

#### GET /api/statistics

获取学习统计数据。

**响应**：
```json
{
  "studyTimeData": {
    "labels": [...],
    "durations": [...]
  },
  "readingProgressData": {
    "labels": [...],
    "progress": [...]
  },
  "totalStudyTime": 1200,
  "activeBooks": 3
}
```

## 数据库模型

### Goal模型

```typescript
export interface IGoal extends Document {
  title: string;
  description: string;
  type: 'short_term' | 'long_term';
  startDate: Date;
  endDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  milestones: {
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | null;
  lastReminderSent?: Date;
  points: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## 测试指南

### 运行测试

```bash
# 运行所有测试
npm test

# 监视模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 编写测试

- 单元测试放在 `__tests__` 目录下，与源代码结构保持一致
- 使用 Jest 作为测试框架
- 使用 React Testing Library 测试React组件
- 使用 mongodb-memory-server 进行数据库测试

**示例：模型测试**

```typescript
describe('Goal Model', () => {
  it('应该成功创建一个目标', async () => {
    const mockGoalData = {
      title: '测试目标',
      description: '这是一个测试目标',
      type: 'short_term',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      userId: new mongoose.Types.ObjectId(),
    };

    const goal = new Goal(mockGoalData);
    const savedGoal = await goal.save();

    expect(savedGoal._id).toBeDefined();
    expect(savedGoal.title).toBe(mockGoalData.title);
  });
});
```

## 部署流程

项目使用GitHub Actions进行CI/CD，配置文件位于 `.github/workflows/ci.yml`。

### CI流程

1. 代码提交到main或master分支时触发
2. 运行代码检查和测试
3. 测试通过后自动构建
4. 构建成功后部署到Vercel

### 手动部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

### 环境变量

部署时需要设置以下环境变量：

- `MONGODB_URI`: MongoDB连接字符串
- `NEXTAUTH_SECRET`: NextAuth加密密钥
- `NEXTAUTH_URL`: 应用URL

## 数据备份与恢复

### 备份数据

```bash
npm run backup
```

备份文件将保存在 `backups` 目录下，格式为 `backup-YYYY-MM-DD-HH-MM.json`。

### 恢复数据

```bash
# 从最新备份恢复
npm run restore

# 从指定备份文件恢复
npm run restore -- backup-2023-12-01-10-30.json
```

---

如有任何问题或建议，请提交Issue或Pull Request。