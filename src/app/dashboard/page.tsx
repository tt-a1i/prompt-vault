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
    <div className="min-h-screen relative overflow-hidden">
      {/* MD3 Background - Subtle gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-primary) / 0.1)" }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-tertiary) / 0.08)" }}
        />
      </div>

      {/* Header - MD3 Top App Bar */}
      <header className="nav-bar fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="text-title-large"
                style={{ color: "hsl(var(--md-on-surface))" }}
              >
                Prompt<span style={{ color: "hsl(var(--md-primary))" }}>Vault</span>
              </a>
            </div>

            {/* User section */}
            <div className="flex items-center gap-3">
              <div className="chip">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "hsl(120 60% 50%)" }}
                />
                <span className="max-w-[120px] truncate">
                  {user.user_metadata?.user_name || user.email?.split("@")[0]}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12">
        <PromptList />
      </main>
    </div>
  );
}
