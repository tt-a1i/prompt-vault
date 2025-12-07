import { PromptList } from "@/components/prompts/prompt-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-primary))] noise">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 right-1/4 w-[800px] h-[800px] bg-[hsl(var(--accent))] opacity-[0.04] blur-[180px] rounded-full animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-0 -left-40 w-[600px] h-[600px] bg-[hsl(var(--fuchsia))] opacity-[0.03] blur-[150px] rounded-full animate-pulse"
          style={{ animationDuration: "12s" }}
        />
      </div>

      {/* Header */}
      <header className="relative border-b border-[hsl(var(--border)_/_0.5)] bg-[hsl(var(--bg-primary)_/_0.9)] backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-display text-[hsl(var(--text-primary))] tracking-tight">
                Prompt<span className="text-gradient font-semibold">Vault</span>
              </h1>
            </div>

            {/* User section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[hsl(var(--bg-elevated)_/_0.6)] border border-[hsl(var(--border)_/_0.5)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-xs text-[hsl(var(--text-secondary))] max-w-[120px] truncate">
                  {user.user_metadata?.user_name || user.email?.split("@")[0]}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <PromptList />
      </main>
    </div>
  );
}
