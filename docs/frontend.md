# Frontend Architecture

The frontend is built with **Next.js 15 App Router** and **React 19**.

## Styling
- **Tailwind CSS**: Used for all styling.
- **`globals.css`**: Defines CSS variables for the theme (dark mode by default) and base styles.
- **Fonts**: Uses `Inter` from `next/font/google`.

## Routing (`src/app/`)
- **`/`**: Landing page (Public).
- **`/login`**: Authentication page. Redirects to dashboard if already logged in.
- **`/dashboard`**: Protected area for managing prompts.
- **`/api/trpc/[trpc]`**: The API endpoint that handles tRPC requests.

## Data Fetching
Data fetching is handled by **TanStack Query** wrapper for tRPC.
- `Providers` component (`src/components/providers/query-provider.tsx`) wraps the application with the QueryClient and trpcClient.
- Components use hooks like `trpc.prompt.list.useQuery()` or `trpc.prompt.create.useMutation()`.

## Authentication Flow
1. **Login**: User logs in via Supabase Auth (likely Email/Password or OAuth, UI handled in `/login`).
2. **Session**: Supabase manages the session via cookies.
3. **Middleware**: `src/middleware.ts` runs on every request.
    - Updates the session cookie.
    - Redirects unauthenticated users trying to access `/dashboard` to `/login`.
    - Redirects authenticated users trying to access `/login` to `/dashboard`.
4. **Server Components**: Use `createClient` from `src/lib/supabase/server.ts` to access the user session securely.
