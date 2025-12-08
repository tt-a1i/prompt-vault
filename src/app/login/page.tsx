"use client";

import { createClient } from "@/lib/supabase/client";
import { Github } from "lucide-react";
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
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* MD3 Background - Subtle gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-primary) / 0.15)" }}
        />
        <div
          className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--md-tertiary) / 0.1)" }}
        />
      </div>

      {/* Left Panel - Brand & Visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* Content */}
        <div className="relative z-10">
          <div
            className={`transition-all duration-500 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="chip">AI Prompt Manager</span>
          </div>
        </div>

        {/* Hero typography - MD3 Display */}
        <div className="relative z-10 space-y-6">
          <h1
            className={`transition-all duration-500 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span
              className="text-display-large block"
              style={{ color: "hsl(var(--md-on-surface))" }}
            >
              存储
            </span>
            <span
              className="text-display-large block font-medium"
              style={{ color: "hsl(var(--md-primary))" }}
            >
              你的灵感
            </span>
          </h1>
          <p
            className={`max-w-md text-body-large leading-relaxed transition-all duration-500 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ color: "hsl(var(--md-on-surface-variant))" }}
          >
            将你精心打磨的 AI Prompt 安全存储，随时调用，让创意永不流失。
          </p>
        </div>

        {/* Bottom decoration */}
        <div
          className={`relative z-10 flex items-center gap-8 transition-all duration-500 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "hsl(120 60% 50%)" }}
            />
            <span
              className="text-label-medium tracking-wide"
              style={{ color: "hsl(var(--md-on-surface-variant))" }}
            >
              系统在线
            </span>
          </div>
          <div className="divider w-px h-4" />
          <span
            className="text-label-medium tracking-wide font-mono"
            style={{ color: "hsl(var(--md-on-surface-variant))" }}
          >
            v0.1.0
          </span>
        </div>
      </div>

      {/* Right Panel - Login Form (MD3 Card) */}
      <div className="relative flex items-center justify-center p-8 lg:p-16">
        <div
          className={`relative z-10 w-full max-w-[400px] transition-all duration-500 delay-300 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
        >
          {/* MD3 Card Container */}
          <div className="card p-8 lg:p-10">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-10">
              <h1
                className="text-headline-large mb-2"
                style={{ color: "hsl(var(--md-on-surface))" }}
              >
                Prompt<span style={{ color: "hsl(var(--md-primary))" }}>Vault</span>
              </h1>
              <p
                className="text-body-medium"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                存储、组织、复用你的 AI Prompt
              </p>
            </div>

            {/* Form content */}
            <div className="space-y-8">
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-headline-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
                  欢迎回来
                </h2>
                <p
                  className="text-body-medium"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  使用 GitHub 账号继续
                </p>
              </div>

              {/* GitHub Login Button - MD3 Filled Button */}
              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>正在连接...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-5 h-5" />
                      <span>使用 GitHub 登录</span>
                    </>
                  )}
                </span>
              </button>

              {/* Divider - MD3 Style */}
              <div className="flex items-center gap-4">
                <div className="flex-1 divider" />
                <span
                  className="text-label-medium tracking-[0.15em] uppercase"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  安全加密
                </span>
                <div className="flex-1 divider" />
              </div>

              {/* Terms */}
              <p
                className="text-center text-label-medium leading-relaxed"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                登录即表示你同意我们的
                <a
                  href="/terms"
                  className="transition-colors ml-1"
                  style={{ color: "hsl(var(--md-primary))" }}
                >
                  服务条款
                </a>{" "}
                和{" "}
                <a
                  href="/privacy"
                  className="transition-colors"
                  style={{ color: "hsl(var(--md-primary))" }}
                >
                  隐私政策
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
