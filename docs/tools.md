# 工具链与配置 (Tools & Configuration)

优秀的项目离不开强大的工具链支持。本项目选型注重**速度**和**开发者体验**。

## 1. Biome (Linting & Formatting)

[Biome](https://biomejs.dev/) 是 Web 开发的下一代工具链。

### 为什么选择 Biome?
*   **速度**: 基于 Rust 编写，在大型项目中比 Prettier 快 35 倍，比 ESLint 快 100 倍。
*   **零配置**: 默认配置已经非常合理，开箱即用。
*   **统一**: 解决了 "Prettier 和 ESLint 规则冲突" 这个长期存在的痛点。

### 核心功能
*   **Linter**: 静态分析代码，捕获潜在 Bug（如 `noExplicitAny`，`useExhaustiveDependencies`）。
*   **Formatter**: 固定的代码风格（2 空格缩进，双引号，尾随逗号等）。
*   **Organizer**: 自动根据规范排序 import 语句，保持代码整洁。

### 常用命令
```bash
pnpm lint      # 检查代码
pnpm lint:fix  # 自动修复
pnpm format    # 仅格式化
```

## 2. Vitest (Testing)

[Vitest](https://vitest.dev/) 是专为 Vite 生态设计的单元测试框架。

### 架构优势
*   **Vite Native**: 它直接使用 `vite.config.ts` (或 `vitest.config.ts`)。这意味着你项目里的路径别名 (`@/lib/utils`)、插件处理、环境变量加载，在测试中完全一致。无需像 Jest 那样配置 `babel` 或 `ts-jest`。
*   **Watch Mode**: 利用 Vite 的 HMR 技术，测试文件的重新运行几乎是实时的。
*   **兼容性**: 提供了兼容 Jest 的 API (`describe`, `it`, `expect`, `vi.fn()`)，迁移成本极低。

### 最佳实践
*   **单元测试**: 测试纯函数 (`src/lib/utils.ts`) 和独立的 UI 组件。
*   **集成测试**: 测试 tRPC Router (`src/server/trpc/routers/*.test.ts`)。我们可以 mock 数据库层，直接测试业务逻辑。

## 3. Husky & Lint-staged (Git Hooks)

为了防止脏代码提交到仓库，我们在 Git 流程中卡点。

*   **Husky**: 管理 Git Hooks。
*   **Lint-staged**: 这是一个过滤器。它只提取本次 Commit 修改过的文件列表，并传给后续命令。
    *   **配置**:
        ```json
        "*.{ts,tsx,js,jsx}": [
          "biome check --write"
        ]
        ```
    *   **流程**: `git commit` -> `husky` 触发 -> `lint-staged` 找到修改的 `.ts` 文件 -> 运行 `biome check --write` -> 如果修复了代码，自动 `git add` -> 完成提交。如果无法修复（如逻辑错误），提交失败。

## 4. 环境变量类型安全

文件：`src/lib/env.ts`

在 Next.js 中，环境变量 (`process.env`) 默认是 `string | undefined`。这很容易导致运行时错误。
我们使用 `zod` 库来验证环境变量：
1.  **定义 Schema**: 定义哪些变量是必须的，格式是什么（如 URL）。
2.  **运行时验证**: 应用启动时立即检查。如果缺少 `NEXT_PUBLIC_SUPABASE_URL`，应用直接崩溃并打印清晰的错误信息，而不是等到用户点击登录时才报错。
3.  **类型推导**: 导出的 `env` 对象具有精确的 TypeScript 类型。

## 5. TypeScript 配置

*   **Strict Mode**: 开启所有严格检查（`noImplicitAny`, `strictNullChecks` 等）。
*   **Path Aliases**:
    ```json
    "paths": {
      "@/*": ["./src/*"]
    }
    ```
    这消除了 `../../../../components/ui/button` 这种地狱式引用。
