# 后端架构 (Backend Architecture)

本项目后端主要依赖 **tRPC** 提供 API 层，以及 **Supabase** 提供数据库和认证服务。

## tRPC 架构

tRPC 允许我们在服务端定义函数，并直接在客户端作为类型安全的函数调用。

### 1. 初始化与上下文 (Initialization & Context)

文件：`src/server/trpc/init.ts`

*   **Context**: 每次请求都会创建 Context。在这里，我们初始化 Supabase Server Client，并获取当前登录用户 (`ctx.user`)。这使得每个 Procedure 都能直接访问用户状态。
*   **t 实例**: 使用 `initTRPC` 初始化 tRPC 实例。
*   **Procedures**:
    *   `publicProcedure`: 公开接口，无需登录即可访问。
    *   `protectedProcedure`: 受保护接口，通过中间件 (`.use()`) 强制检查 `ctx.user` 是否存在。如果用户未登录，抛出 `UNAUTHORIZED` 错误。

### 2. 路由 (Routers)

文件：`src/server/trpc/routers/`

所有的 API 逻辑都组织在 Router 中。

*   **`_app.ts`**: 主 Router，合并所有子 Router（如 `promptRouter`, `tagRouter`）。
*   **子 Router (例如 `prompt.ts`)**:
    *   定义具体的 CRUD 操作。
    *   使用 `zod` 进行输入验证 (`.input(z.object(...))`)。
    *   在 `.query()` 或 `.mutation()` 中执行业务逻辑。

示例：
```typescript
export const promptRouter = router({
  // 获取所有 Prompts
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", ... });
    return data;
  }),
});
```

### 3. 类型安全 (Type Safety)

tRPC 的核心优势在于类型推导。`AppRouter` 类型被导出并在前端使用，这意味着：
*   后端修改了返回值，前端会立即报错。
*   后端修改了入参验证，前端调用处会提示参数错误。

## Supabase 集成

文件：`src/lib/supabase/server.ts`

我们使用 `@supabase/ssr` 库中的 `createServerClient`。

### 1. 服务端客户端 (Server Client)
在 Next.js 的 Server Components、Server Actions 和 Route Handlers 中使用。
*   **Cookie 处理**: 需要传入 `cookies` 对象，以便 Supabase 能够读取和设置 Auth Cookie（例如 JWT 刷新）。

### 2. 数据库设计 (Database Design)
*   **PostgreSQL**: 底层使用 Postgres。
*   **RLS (Row Level Security)**: 这是一个关键的安全概念。我们不在应用代码中写 `where user_id = ?`，而是在数据库层面定义策略 (Policy)。
    *   例如：`CREATE POLICY "Users can only see their own prompts" ON "public"."prompts" FOR SELECT USING (auth.uid() = user_id);`
    *   这样，`select * from prompts` 只会返回当前用户的数据。

## 环境变量
后端依赖以下环境变量（定义在 `src/lib/env.ts` 中验证）：
*   `SUPABASE_URL`: Supabase 项目 URL。
*   `SUPABASE_ANON_KEY`: 公开的匿名 Key，用于客户端和服务端（受 RLS 限制）。
