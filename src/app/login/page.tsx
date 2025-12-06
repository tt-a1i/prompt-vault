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
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden bg-[#0a0a0f]">
      {/* Left Panel - Brand & Visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-950/40 via-transparent to-fuchsia-950/30" />
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-fuchsia-600/15 rounded-full blur-[100px]" />
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Grid lines decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div
            className={`transition-all duration-1000 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="inline-block px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-violet-300/80 border border-violet-500/20 rounded-full backdrop-blur-sm">
              AI Prompt Manager
            </span>
          </div>
        </div>

        {/* Hero typography */}
        <div className="relative z-10 space-y-6">
          <h1
            className={`font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-tight text-white transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="block">存储</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300">
              你的灵感
            </span>
          </h1>
          <p
            className={`max-w-md text-lg text-white/50 leading-relaxed transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            将你精心打磨的 AI Prompt 安全存储，随时调用，让创意永不流失。
          </p>
        </div>

        {/* Bottom decoration */}
        <div
          className={`relative z-10 flex items-center gap-8 transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/40 tracking-wide">系统在线</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs text-white/40 tracking-wide font-mono">v0.1.0</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="relative flex items-center justify-center p-8 lg:p-16">
        {/* Subtle gradient for right panel */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f18] to-[#0a0a0f]" />

        {/* Floating orb decoration */}
        <div
          className={`absolute top-20 right-20 w-32 h-32 rounded-full border border-white/5 transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className={`absolute bottom-32 left-16 w-20 h-20 rounded-full border border-violet-500/10 transition-all duration-1000 delay-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        />

        <div
          className={`relative z-10 w-full max-w-[380px] transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <h1
              className="text-4xl font-serif text-white mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              PromptVault
            </h1>
            <p className="text-sm text-white/40">存储、组织、复用你的 AI Prompt</p>
          </div>

          {/* Form container */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2
                className="text-2xl font-serif text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                欢迎回来
              </h2>
              <p className="text-sm text-white/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                使用 GitHub 账号继续
              </p>
            </div>

            {/* GitHub Login Button */}
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-xl bg-white text-[#0a0a0f] font-medium py-4 px-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-violet-200/50 to-transparent" />

              <span className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
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

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[10px] text-white/30 tracking-[0.15em] uppercase">
                安全加密
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Terms */}
            <p
              className="text-center text-xs text-white/30 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              登录即表示你同意我们的
              <a
                href="/terms"
                className="text-violet-400/70 hover:text-violet-400 transition-colors ml-1"
              >
                服务条款
              </a>{" "}
              和{" "}
              <a
                href="/privacy"
                className="text-violet-400/70 hover:text-violet-400 transition-colors"
              >
                隐私政策
              </a>
            </p>
          </div>

          {/* Desktop footer */}
          <div className="hidden lg:block absolute -bottom-20 left-0 right-0">
            <p className="text-center text-[11px] text-white/20">
              © 2024 PromptVault · Made with precision
            </p>
          </div>
        </div>
      </div>

      {/* Global font imports */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}
