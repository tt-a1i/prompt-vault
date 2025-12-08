# 工具链与配置 (Tools & Configuration)

为了保证代码质量和开发体验，项目集成了一系列现代化工具。

## 1. Biome (Linting & Formatting)

本项目使用 [Biome](https://biomejs.dev/) 替代了传统的 ESLint + Prettier 组合。

*   **配置文件**: `biome.json`
*   **功能**:
    *   **Linting**: 静态代码分析，发现潜在错误和反模式。
    *   **Formatting**: 统一代码风格（缩进、引号、分号等）。
    *   **Import Sorting**: 自动优化和排序 import 语句。
*   **常用命令**:
    *   `pnpm lint`: 检查代码问题。
    *   `pnpm lint:fix`: 自动修复可修复的问题。
    *   `pnpm format`: 格式化代码。

## 2. Vitest (Testing)

使用 [Vitest](https://vitest.dev/) 进行单元测试和集成测试。

*   **配置文件**: `vitest.config.ts`
*   **特点**:
    *   与 Vite 配置兼容（支持路径别名 `@/*`）。
    *   速度极快，开箱即用支持 TypeScript。
*   **测试文件**: 通常位于 `__tests__` 目录或与源文件同级（如 `prompt.test.ts`）。
*   **运行**: `pnpm test` (在 package.json 中可能未定义，可添加 `"test": "vitest"`).

## 3. Husky & Lint-staged (Git Hooks)

在代码提交前自动执行检查，防止坏代码进入仓库。

*   **Pre-commit Hook**: 当你执行 `git commit` 时触发。
*   **Lint-staged**: 只检查本次提交修改过的文件。
    *   对于 `.ts, .tsx` 文件：运行 `biome check --write`。
    *   这确保了每次提交的代码都是格式化过且无 Lint 错误的。

## 4. 环境变量验证

为了防止因缺少环境变量导致的运行时错误，我们在 `src/lib/env.ts` 中实现了验证逻辑。

*   **原理**: 手动读取 `process.env`，如果缺少必要变量（如 `NEXT_PUBLIC_SUPABASE_URL`），在应用启动时抛出错误。
*   **类型安全**: 导出的 `env` 对象具有确定的类型，使用时会有自动补全。

## 5. TypeScript 配置

*   **`tsconfig.json`**:
    *   `"strict": true`: 启用所有严格类型检查选项。
    *   `"paths"`: 配置路径别名（`@/*` 映射到 `./src/*`），简化导入路径。
