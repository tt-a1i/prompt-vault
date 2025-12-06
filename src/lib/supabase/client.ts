import { env } from "@/lib/env";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Create a Supabase client for client-side use (Client Components)
 */
export function createClient() {
  return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
