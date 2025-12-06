# PromptVault

开源 Prompt 管理器 - 存储、组织、复用你的 AI Prompt

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router + Turbopack) | 15.x |
| 运行时 | Node.js / pnpm | - |
| UI | React + Tailwind CSS + shadcn/ui | 19.x |
| API | tRPC (新 TanStack 集成) | 11.x |
| 数据层 | TanStack Query | 5.x |
| 数据库 | Supabase (PostgreSQL + Auth + RLS) | - |
| Lint/Format | Biome | 1.9.x |
| 语言 | TypeScript (Strict Mode) | 5.6.x |

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/prompt-vault.git
cd prompt-vault
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 配置：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── api/trpc/          # tRPC HTTP 处理器
│   └── ...
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── providers/        # Context Providers
├── lib/                   # 工具函数
│   ├── supabase/         # Supabase 客户端
│   └── utils.ts
├── server/               # 服务端代码
│   └── trpc/
│       ├── routers/      # tRPC 路由
│       ├── client.ts     # 客户端 tRPC
│       └── server.ts     # 服务端 tRPC
└── middleware.ts         # Next.js 中间件
```

## 可用脚本

```bash
pnpm dev        # 启动开发服务器 (Turbopack)
pnpm build      # 构建生产版本
pnpm start      # 启动生产服务器
pnpm lint       # 运行 Biome 检查
pnpm lint:fix   # 修复可自动修复的问题
pnpm format     # 格式化代码
pnpm typecheck  # TypeScript 类型检查
```

## 功能规划

### MVP

- [ ] GitHub OAuth 登录
- [ ] Prompt CRUD
- [ ] 变量模板 `{{变量名}}`
- [ ] 标签分类
- [ ] 搜索过滤
- [ ] 一键复制

### Phase 2

- [ ] 文件夹组织
- [ ] 版本历史
- [ ] 导入导出

### Phase 3

- [ ] 团队协作
- [ ] 公开分享
- [ ] 浏览器插件

## License

MIT
