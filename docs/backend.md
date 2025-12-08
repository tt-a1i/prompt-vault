# Backend Architecture

The backend is primarily composed of **tRPC** routers serving as the API layer and **Supabase** acting as the database and authentication provider.

## tRPC Integration

The project uses tRPC v11 to provide a type-safe API between the client and server.

### Initialization (`src/server/trpc/init.ts`)
- **Context**: The `createTRPCContext` function initializes the Supabase server client and retrieves the current authenticated user. This context is available to all procedures.
- **Procedures**:
    - `publicProcedure`: Accessible by anyone.
    - `protectedProcedure`: Middleware checks for `ctx.user`. Throws `UNAUTHORIZED` if missing.

### Routers (`src/server/trpc/routers/`)
The API is divided into modular routers:
- **`prompt.ts`**: Handles CRUD operations for prompts.
    - `list`: Fetches prompts for the current user, supports search.
    - `get`: Fetches a single prompt by ID. Checks ownership or public status.
    - `create`: Creates a new prompt and optional tags.
    - `update`: Updates a prompt. Enforces ownership.
    - `delete`: Deletes a prompt. Enforces ownership.
    - `toggleFavorite`: Toggles the `is_favorite` flag.
- **`tag.ts`**: Handles CRUD operations for tags.
    - `list`: Fetches all tags for the user.
    - `create`: Creates a new tag with a name and color.
    - `update`: Updates tag details.
    - `delete`: Deletes a tag.

### App Router (`src/server/trpc/routers/_app.ts`)
All routers are merged into a single `appRouter`, which is exported for the client to generate types.

## Supabase Integration

### Database Schema (Inferred)
Based on the Zod schemas and queries, the database consists of the following tables:

**`prompts`**
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `auth.users`)
- `title`: Text
- `content`: Text
- `description`: Text (Optional)
- `is_public`: Boolean
- `is_favorite`: Boolean
- `created_at`: Timestamp
- `updated_at`: Timestamp

**`tags`**
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `auth.users`)
- `name`: Text
- `color`: Hex Color Code

**`prompt_tags`** (Junction Table)
- `prompt_id`: UUID (Foreign Key to `prompts`)
- `tag_id`: UUID (Foreign Key to `tags`)

### Client Configuration (`src/lib/supabase/`)
- **`server.ts`**: Uses `createServerClient` and Next.js `cookies()` to manage sessions on the server.
- **`client.ts`**: Uses `createBrowserClient` for client-side interactions.
- **`middleware.ts`**: Refreshes the session token on every request to prevent premature logouts in Server Components.
