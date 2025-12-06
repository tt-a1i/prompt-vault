import { PromptList } from "@/components/prompts/prompt-list";
import { createClient } from "@/lib/supabase/server";
import { Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[hsl(var(--bg-dark))]">
      {/* Subtle background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--accent))] opacity-[0.02] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[hsl(var(--teal))] opacity-[0.02] blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative border-b border-[hsl(var(--border-dark))] bg-[hsl(var(--bg-dark-secondary)_/_0.8)] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent-light))] flex items-center justify-center shadow-md shadow-[hsl(var(--accent)_/_0.2)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-display font-semibold text-[hsl(var(--text-dark-primary))]">
                  PromptVault
                </h1>
              </div>
            </div>

            {/* User section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--bg-dark-tertiary))] border border-[hsl(var(--border-dark))]">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--teal))]" />
                <span className="text-xs text-[hsl(var(--text-dark-secondary))]">
                  {user.user_metadata?.user_name || user.email}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PromptList />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-[hsl(var(--border-dark))] py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-xs text-[hsl(var(--text-dark-muted))]">
            <span>PromptVault v0.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
