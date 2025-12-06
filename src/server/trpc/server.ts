import "server-only";

import { makeQueryClient } from "@/lib/query-client";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";

/**
 * Create a stable getter for the query client that
 * will return the same client during the same request.
 */
export const getQueryClient = cache(makeQueryClient);

/**
 * Create a tRPC caller for server-side use
 */
const caller = createCallerFactory(appRouter)(createTRPCContext);

/**
 * Hydration helpers for Server Components
 * Use HydrateClient to wrap client components that need hydrated data
 */
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
