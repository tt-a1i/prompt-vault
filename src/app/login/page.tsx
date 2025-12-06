"use client";

import { createClient } from "@/lib/supabase/client";
import { Github, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(var(--bg-dark))] via-[hsl(var(--bg-dark-secondary))] to-[hsl(var(--bg-dark))]" />

      {/* Soft accent glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[hsl(var(--accent))] opacity-[0.03] blur-[150px] rounded-full" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(var(--teal))] opacity-[0.03] blur-[120px] rounded-full" />

      {/* Main Content */}
      <div
        className={`w-full max-w-sm px-6 relative z-10 ${mounted ? "animate-fade-in" : "opacity-0"}`}
      >
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent-light))] flex items-center justify-center shadow-lg shadow-[hsl(var(--accent)_/_0.25)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-display font-semibold text-[hsl(var(--text-dark-primary))] mb-2">
            PromptVault
          </h1>
          <p className="text-[hsl(var(--text-dark-secondary))] text-sm">
            存储、组织、复用你的 AI Prompt
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <h2 className="text-lg font-medium text-[hsl(var(--text-dark-primary))] mb-6 text-center">
            欢迎回来
          </h2>

          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>正在连接...</span>
              </>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>使用 GitHub 登录</span>
              </>
            )}
          </button>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-[hsl(var(--border-dark))]" />
            <span className="text-xs text-[hsl(var(--text-dark-muted))]">安全登录</span>
            <div className="flex-1 h-px bg-[hsl(var(--border-dark))]" />
          </div>

          <p className="mt-6 text-center text-xs text-[hsl(var(--text-dark-muted))] leading-relaxed">
            登录即表示你同意我们的
            <a href="/terms" className="text-[hsl(var(--accent-light))] hover:underline ml-1">
              服务条款
            </a>{" "}
            和{" "}
            <a href="/privacy" className="text-[hsl(var(--accent-light))] hover:underline">
              隐私政策
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[hsl(var(--text-dark-muted))]">© 2024 PromptVault · v0.1.0</p>
        </div>
      </div>
    </div>
  );
}
