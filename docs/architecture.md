# 项目架构 (Architecture)

PromptVault 采用了现代化的全栈 TypeScript 架构，旨在提供高性能、类型安全且易于维护的开发体验。

## 核心技术栈 (Tech Stack)

### 1. 核心框架 (Core Framework)
*   **Next.js 15 (App Router)**: 使用 Next.js 最新的 App Router 模式，利用 Server Components (RSC) 减少客户端 JS 体积，提高首屏加载速度。支持流式渲染 (Streaming) 和 Suspense，优化用户体验。
*   **React 19**: 紧跟 React 最新特性，利用 Server Actions 处理表单提交和数据变更，简化了前后端交互。

### 2. 编程语言 (Language)
*   **TypeScript 5.x**: 全项目采用严格模式 (Strict Mode)，提供端到端的类型安全。

### 3. 后端与 API (Backend & API)
*   **tRPC v11**:
    *   实现了端到端的类型安全 API，无需手动编写 API 类型定义或生成 SDK。
    *   v11 版本深度集成了 TanStack Query，提供了更好的缓存策略和数据获取体验。
    *   后端 Router 定义在 `src/server/trpc/routers`，前端直接调用，享受 IDE 自动补全。
*   **Supabase (BaaS)**:
    *   **PostgreSQL**: 提供强大的关系型数据库支持。
    *   **Auth**: 处理用户注册、登录和会话管理。
    *   **Row Level Security (RLS)**: 在数据库层面保证数据安全，确保用户只能访问自己的数据。
    *   **@supabase/ssr**: 专门用于 Next.js SSR 环境的客户端库，处理 Cookie 和会话同步。

### 4. 前端与状态管理 (Frontend & State)
*   **TanStack Query v5**: 与 tRPC 结合，处理异步数据状态（加载中、错误、缓存、重新验证）。
*   **Tailwind CSS 3.4**: 实用主义 CSS 框架，通过类名快速构建 UI。
*   **shadcn/ui (基于 Radix UI)**: 提供无障碍、可定制的组件库（代码位于 `src/components/ui`）。
*   **Lucide React**: 统一的图标库。

### 5. 工具链 (Tooling)
*   **Biome**: 下一代 Web 工具链，替代了 ESLint 和 Prettier，提供极速的代码格式化和 Lint 检查。
*   **Vitest**: 基于 Vite 的单元测试框架，速度极快，兼容 Jest API。
*   **pnpm**: 高效的包管理器，节省磁盘空间。

---

## 目录结构 (Project Structure)

```
src/
├── app/                    # Next.js App Router 页面
│   ├── api/trpc/           # tRPC API 端点 (Route Handler)
│   ├── auth/               # 认证相关页面
│   ├── dashboard/          # 受保护的仪表盘页面
│   ├── login/              # 登录页面
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # React 组件
│   ├── providers/          # Context Providers (如 TRPCProvider)
│   └── ui/                 # 通用 UI 组件 (Button, Input 等)
├── lib/                    # 核心库与工具
│   ├── supabase/           # Supabase 客户端配置 (Browser, Server, Middleware)
│   ├── env.ts              # 环境变量验证
│   ├── query-client.ts     # QueryClient 配置
│   └── utils.ts            # 通用辅助函数 (cn 等)
├── server/                 # 服务端逻辑
│   └── trpc/               # tRPC 核心配置
│       ├── routers/        # API 路由定义
│       ├── client.ts       # 客户端 tRPC 实例
│       ├── init.ts         # tRPC 初始化 (Context, Procedures)
│       └── server.ts       # 服务端 Caller (Server Components 用)
└── middleware.ts           # Next.js 中间件 (处理 Auth 重定向)
```

## 数据流向 (Data Flow)

1.  **客户端请求**: 用户在前端组件触发操作 (如点击按钮)。
2.  **tRPC Client**: 调用 `trpc.prompt.create.useMutation` 等 Hook。
3.  **HTTP Request**: tRPC Client 将请求打包发送至 `/api/trpc/[trpc]`。
4.  **Next.js Route Handler**: `src/app/api/trpc/[trpc]/route.ts` 接收请求。
5.  **tRPC Context**: `src/server/trpc/init.ts` 创建上下文，验证 Supabase Session。
6.  **Router**: 请求路由到对应的 Procedure (如 `src/server/trpc/routers/prompt.ts`)。
7.  **Supabase Interaction**: Procedure 调用 `ctx.supabase` 操作数据库。
8.  **Response**: 结果返回前端，TanStack Query 更新缓存并重新渲染 UI。
