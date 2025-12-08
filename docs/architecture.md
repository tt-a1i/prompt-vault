# Project Architecture

## Overview
**PromptVault** is a modern web application for managing AI prompts. It allows users to store, organize (via tags), and reuse prompts. The application is built using the **T3 Stack** philosophy, leveraging Next.js for the framework, tRPC for end-to-end type-safe APIs, and Supabase for the backend (Auth & Database).

## Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **API Layer**: [tRPC](https://trpc.io/) (v11)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (via tRPC)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Radix UI (assumed via patterns), Sonner (Toasts)

## Directory Structure
The project follows a standard Next.js App Router structure with a `src` directory.

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── api/             # API routes (including tRPC handler)
│   ├── auth/            # Auth callback routes
│   ├── dashboard/       # Protected dashboard pages
│   ├── login/           # Login page
│   ├── globals.css      # Global styles & Tailwind directives
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # Reusable React components
│   ├── prompts/         # Prompt-related components
│   └── providers/       # Context providers (Query, tRPC)
├── lib/                 # Shared libraries and utilities
│   ├── supabase/        # Supabase client configurations
│   ├── env.ts           # Environment variable validation
│   └── utils.ts         # Helper functions
└── server/              # Server-side code
    └── trpc/            # tRPC setup and routers
        ├── routers/     # API route definitions
        └── init.ts      # tRPC initialization & context
```
