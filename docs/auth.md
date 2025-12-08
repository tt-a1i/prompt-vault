# 认证架构 (Authentication Architecture)

认证系统由 Supabase Auth 驱动，结合 Next.js Middleware 和 tRPC Context 实现了完整的安全流程。

## 核心流程

1.  **用户登录**: 用户在前端通过 Supabase Client (Browser) 登录（例如使用 OAuth 或邮箱密码）。
2.  **Session 存储**: Supabase SDK 自动将 JWT (Access Token) 存储在 Cookie 中。
3.  **请求拦截**: 所有的页面请求和 API 请求都会携带这些 Cookie。
4.  **中间件校验**: Next.js Middleware 拦截请求，刷新 Session，并决定是否允许访问。
5.  **服务端获取用户**: 在 tRPC Context 或 Server Components 中，通过 `getUser()` 获取当前用户。

## 详细实现

### 1. Middleware (`src/middleware.ts`)

这是保护路由的第一道防线。

*   **Session 刷新**: 调用 `updateSession` (`src/lib/supabase/middleware.ts`)。这非常重要，因为它会检查 Cookie 中的 Token 是否过期，如果过期则尝试刷新，并**将新的 Set-Cookie header 写入 Response**。
*   **路由保护**:
    *   检查 `request.nextUrl.pathname`。
    *   如果用户未登录 (`!user`) 且访问 `/dashboard` 或 `/prompts`，重定向到 `/login`。
    *   如果用户已登录 (`user`) 且访问 `/login`，重定向到 `/dashboard`。

### 2. tRPC Context 保护 (`src/server/trpc/init.ts`)

这是 API 层的防线。

*   在 `createTRPCContext` 中，我们调用 `supabase.auth.getUser()`。
*   `protectedProcedure` 中间件会检查 context 中是否有 `user`。
*   如果没有 `user`，直接抛出 `TRPCError` (UNAUTHORIZED)。这确保了即使中间件配置失误，API 接口本身也是安全的。

### 3. Row Level Security (RLS)

这是数据层的最后一道防线。

即使有人绕过了前端和 API 层，直接向 Supabase 发起请求（持有 Anon Key），数据库的 RLS 策略也会阻止他们访问不属于他们的数据。
*   `auth.uid()`: Supabase Postgres 中的特殊函数，返回当前请求的 User ID。

## 客户端 Supabase (`src/lib/supabase/client.ts`)

用于浏览器端的交互，例如：

```typescript
const supabase = createClient();

// 登录
await supabase.auth.signInWithOAuth({ provider: 'github' });

// 登出
await supabase.auth.signOut();
```

注意：在组件中创建客户端时，应该使用 `createBrowserClient`，它会自动处理浏览器环境下的 Cookie。
