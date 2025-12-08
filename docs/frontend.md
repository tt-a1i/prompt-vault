# 前端架构 (Frontend Architecture)

前端基于 Next.js 15 构建，采用 App Router 架构，并结合 tRPC 和 TanStack Query 进行数据管理。

## Next.js App Router

### 1. 目录结构
*   **`src/app`**: 所有的路由页面。
*   **`layout.tsx`**: 定义全局布局，包含 `<html>`、`<body>` 以及全局 Providers。
*   **`page.tsx`**: 特定路由的页面内容。

### 2. Server Components vs Client Components
*   **默认服务端渲染 (RSC)**: `src/app` 下的页面默认是 Server Components。它们在服务端运行，直接生成 HTML，不发送 JS 到客户端。
*   **客户端组件**: 当需要交互（onClick, useState, useEffect）或使用 React Context 时，必须在文件顶部添加 `"use client"` 指令。
    *   `src/components/providers/query-provider.tsx` 是一个 Client Component，因为它需要维护 QueryClient 状态。
    *   tRPC 的 Hook (`useTRPC`) 只能在 Client Components 中使用。

## UI 与样式 (UI & Styling)

### 1. Tailwind CSS
我们使用 Tailwind CSS 进行原子化样式开发。
*   **`globals.css`**: 包含 Tailwind 的指令 (`@tailwind base;` 等) 和全局 CSS 变量（用于 shadcn/ui 的主题色）。
*   **`tailwind.config.ts`**: 配置主题扩展、插件 (tailwindcss-animate) 和内容扫描路径。

### 2. shadcn/ui
项目使用 shadcn/ui 组件库。这些组件不是通过 npm 安装的黑盒包，而是直接复制到 `src/components/ui` 目录下的源代码。
*   **优点**: 可以完全控制组件代码，随意修改样式和逻辑。
*   **`cn` helper**: 在 `src/lib/utils.ts` 中，我们定义了 `cn` 函数（结合 `clsx` 和 `tailwind-merge`），用于动态合并 Tailwind 类名并解决冲突。

```typescript
// 示例
<div className={cn("bg-red-500", isActive && "bg-green-500")} />
// 如果 isActive 为 true，结果为 "bg-green-500" (red 被正确覆盖)
```

## 数据获取 (Data Fetching) - tRPC & TanStack Query

前端不直接使用 `fetch`，而是通过 tRPC Client。

### 1. `TRPCProvider`
在 `src/server/trpc/client.ts` 中创建，并在 `src/app/layout.tsx` (通过 `Providers` 组件) 包裹整个应用。这注入了 QueryClient 和 tRPC Client。

### 2. Hooks 使用
在组件中，我们像使用本地函数一样请求数据：

```tsx
"use client";
import { useTRPC } from "@/server/trpc/client";

export function PromptList() {
  // Query: 获取数据
  const { data, isLoading } = useTRPC.prompt.list.useQuery();

  // Mutation: 修改数据
  const createPrompt = useTRPC.prompt.create.useMutation({
    onSuccess: () => {
      // 自动刷新列表
      utils.prompt.list.invalidate();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

*   **Caching**: TanStack Query 会自动缓存数据。当切换页面再回来，如果数据未过期，会立即显示缓存。
*   **Type Safety**: `data` 的类型完全由后端推导，包含数据库字段。

## 图标
使用 `lucide-react`，它是一组轻量级、风格统一的 SVG 图标库，作为 React 组件使用。
