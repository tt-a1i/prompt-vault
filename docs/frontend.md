# 前端架构 (Frontend Architecture)

前端架构紧密围绕 **Next.js 15 App Router**、**TanStack Query** 和 **Server Components** 展开，旨在实现极致的性能和优秀的用户体验。

## 数据流向 (Data Flow)

在 App Router 中，数据获取可以发生在服务端（RSC）也可以发生在客户端（Client Components）。

```mermaid
graph TD
    subgraph Server["Server (Next.js)"]
        RSC[Server Component (page.tsx)]
        Prefetch[tRPC Caller (Prefetch)]
        Dehydrate[Dehydrate State]
    end

    subgraph Client["Client (Browser)"]
        Provider[TanStack Query Provider]
        Hydrate[Hydrate State]
        CC[Client Component (PromptList.tsx)]
        Hook[useTRPC Hook]
    end

    RSC -- "1. Prefetch Data" --> Prefetch
    Prefetch -- "2. Pass to Client" --> Dehydrate
    Dehydrate -- "3. Serialize JSON" --> Provider
    Provider -- "4. Hydrate Cache" --> Hydrate
    Hydrate -- "5. Initial Render" --> CC
    CC -- "6. Refetch/Mutate (Interaction)" --> Hook
    Hook -- "7. Background Update" --> Provider
```

### 1. 混合渲染策略 (Hybrid Rendering)
*   **首屏加载 (Initial Load)**: 利用 Server Components 在服务端直接调用 tRPC (`server/trpc/server.ts`) 获取数据。数据被序列化并传递给客户端的 `HydrationBoundary`。
*   **客户端交互 (Interaction)**: 页面加载后，Client Components 接管。用户点击翻页或搜索时，通过 `useTRPC` Hook 发起 HTTP 请求更新数据。
*   **优势**: 结合了 SSR 的 SEO/首屏速度优势和 SPA 的交互体验。

## UI 组件体系 (Component System)

我们采用 **Headless UI + Utility CSS** 的现代组合。

### 1. Tailwind CSS 最佳实践
*   **Utility-First**: 不写 `.card { ... }`，而是写 `p-4 rounded-xl shadow-sm`。这减少了 CSS 体积增长，避免了命名困难。
*   **Design Tokens**: 在 `tailwind.config.ts` 中定义颜色、字体、圆角等 Design Tokens。
    ```typescript
    // tailwind.config.ts
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))", // 引用 CSS 变量
          foreground: "hsl(var(--primary-foreground))",
        },
      }
    }
    ```
*   **Dark Mode**: 使用 CSS 变量 (`globals.css`) 实现暗色模式切换，而不是使用 Tailwind 的 `dark:` 前缀（这使得代码更整洁）。

### 2. shadcn/ui 架构
*   **Copy-Paste Philosophy**: 组件代码直接存在于项目中 (`src/components/ui`)。你需要修改 Button 的圆角？直接改 `button.tsx`。
*   **Radix UI**: 这是一个无头组件库，处理了复杂的交互逻辑（如 Dialog 的焦点捕获、Dropdown 的键盘导航）。shadcn/ui 只是给 Radix UI 加上了 Tailwind 的皮肤。
*   **`cn` Helper**: 核心工具函数。
    ```typescript
    import { clsx, type ClassValue } from "clsx"
    import { twMerge } from "tailwind-merge"

    // 合并类名，处理条件逻辑 (clsx)，并解决 Tailwind 冲突 (twMerge)
    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }
    ```

## 状态管理 (State Management)

### 1. TanStack Query (Server State)
我们几乎不使用 `useEffect` 来获取数据。TanStack Query 处理了所有服务端状态。
*   **Stale-While-Revalidate**: 默认配置下，数据被认为是“陈旧”的，但在后台静默刷新。
*   **Window Focus Refetching**: 用户切出标签页再切回来，自动刷新数据。
*   **Optimistic Updates**: 在 Mutation 发送前，先手动更新 Cache，让 UI 立即响应。如果请求失败，自动回滚。

### 2. URL State (Client State)
对于搜索框、分页、筛选等状态，我们优先将其同步到 URL Search Params 中，而不是 `useState`。
*   **好处**: 用户刷新页面或分享链接，状态（如搜索关键词）得以保留。
*   **实现**: 使用 `useSearchParams` 和 `useRouter`。

## 图标系统
使用 `lucide-react`。
*   **特点**: 风格统一、体积小。
*   **使用**: `<IconName className="w-4 h-4" />`。
