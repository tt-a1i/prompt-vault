# Authentication

Authentication is handled entirely by **Supabase Auth**.

## Key Components

### Middleware (`src/middleware.ts`)
The middleware is the first line of defense.
```typescript
export async function updateSession(request: NextRequest) {
  // ... creates client ...
  const { data: { user } } = await supabase.auth.getUser();

  // Route Protection Logic
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(url_to_login);
  }
}
```

### Server-Side Access (`src/lib/supabase/server.ts`)
In Server Actions or Server Components, the client is initialized using `cookies()`.
```typescript
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(..., {
    cookies: {
      getAll() { return cookieStore.getAll() },
      // ...
    }
  });
}
```

### Client-Side Access (`src/lib/supabase/client.ts`)
In Client Components, the singleton browser client is used.
```typescript
export function createClient() {
  return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
```

### tRPC Context
The tRPC context (`src/server/trpc/init.ts`) validates the user for every request.
```typescript
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```
