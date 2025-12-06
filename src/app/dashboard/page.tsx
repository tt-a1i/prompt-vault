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
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[hsl(var(--accent))] opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[hsl(var(--fuchsia))] opacity-[0.02] blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative border-b border-[hsl(var(--border))] bg-[hsl(var(--bg-secondary)_/_0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-display text-[hsl(var(--text-primary))]">
                Prompt<span className="text-gradient">Vault</span>
              </h1>
              <div className="hidden sm:block h-4 w-px bg-[hsl(var(--border))]" />
              <span className="hidden sm:block text-[10px] text-[hsl(var(--text-muted))] tracking-[0.15em] uppercase">
                AI Prompt Manager
              </span>
            </div>

            {/* User section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border))]">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[hsl(var(--text-secondary))]">
                  {user.user_metadata?.user_name || user.email}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <PromptList />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-[hsl(var(--border))] py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--text-muted))]">© 2024 PromptVault</p>
            <p className="text-xs text-[hsl(var(--text-subtle))] font-mono">v0.1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
