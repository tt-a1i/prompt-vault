"use client";

import {
  ArrowRight,
  Code2,
  Database,
  Github,
  Layers,
  Lock,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const techStack = [
    {
      category: "Frontend",
      icon: <Layers className="w-5 h-5" />,
      color: "violet",
      items: [
        { name: "Next.js 15", desc: "App Router + Turbopack" },
        { name: "React 19", desc: "最新特性支持" },
        { name: "TypeScript", desc: "类型安全" },
        { name: "Tailwind CSS", desc: "原子化样式" },
      ],
    },
    {
      category: "Backend",
      icon: <Code2 className="w-5 h-5" />,
      color: "fuchsia",
      items: [
        { name: "tRPC v11", desc: "端到端类型安全" },
        { name: "TanStack Query", desc: "智能数据缓存" },
        { name: "Zod", desc: "运行时验证" },
        { name: "Server Actions", desc: "服务端操作" },
      ],
    },
    {
      category: "Database",
      icon: <Database className="w-5 h-5" />,
      color: "emerald",
      items: [
        { name: "Supabase", desc: "PostgreSQL 云数据库" },
        { name: "Row Level Security", desc: "行级安全策略" },
        { name: "Realtime", desc: "实时数据同步" },
        { name: "Edge Functions", desc: "边缘计算" },
      ],
    },
    {
      category: "Auth & Security",
      icon: <Shield className="w-5 h-5" />,
      color: "amber",
      items: [
        { name: "Supabase Auth", desc: "OAuth 2.0 认证" },
        { name: "GitHub OAuth", desc: "一键登录" },
        { name: "JWT Tokens", desc: "安全会话" },
        { name: "PKCE Flow", desc: "增强安全" },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
      violet: {
        bg: "bg-violet-500/5",
        text: "text-violet-400",
        border: "border-violet-500/20 hover:border-violet-500/40",
        iconBg: "bg-violet-500/10",
      },
      fuchsia: {
        bg: "bg-fuchsia-500/5",
        text: "text-fuchsia-400",
        border: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
        iconBg: "bg-fuchsia-500/10",
      },
      emerald: {
        bg: "bg-emerald-500/5",
        text: "text-emerald-400",
        border: "border-emerald-500/20 hover:border-emerald-500/40",
        iconBg: "bg-emerald-500/10",
      },
      amber: {
        bg: "bg-amber-500/5",
        text: "text-amber-400",
        border: "border-amber-500/20 hover:border-amber-500/40",
        iconBg: "bg-amber-500/10",
      },
    };
    return colors[color] || colors.violet;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-violet-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Grid lines decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 lg:px-8 py-6">
        <div
          className={`flex items-center gap-3 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-violet-300/80 border border-violet-500/20 rounded-full backdrop-blur-sm">
            AI Prompt Manager
          </span>
        </div>
        <div
          className={`flex items-center gap-4 transition-all duration-1000 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <a
            href="https://github.com/tt-a1i/prompt-vault"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="/login"
            className="px-5 py-2 text-sm font-medium text-[#0a0a0f] bg-white rounded-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300"
          >
            登录
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-16 pb-24 px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300/90">开源 · 免费 · 安全</span>
          </div>

          {/* Main Title */}
          <h1
            className={`text-[clamp(2.5rem,8vw,5rem)] leading-[1.1] tracking-tight mb-6 transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="text-white">你的 AI Prompt</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300">
              私人保险库
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            存储、组织、复用你精心打磨的 AI Prompt。
            <br className="hidden sm:block" />
            支持变量模板，让创意永不流失。
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <a
              href="/login"
              className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-white text-[#0a0a0f] font-medium py-4 px-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-violet-200/50 to-transparent" />
              <span className="relative flex items-center justify-center gap-2">
                立即开始
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="https://github.com/tt-a1i/prompt-vault"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Github className="w-5 h-5" />
              查看源码
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-600 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2
              className="text-3xl sm:text-4xl text-white mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              核心功能
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">简洁而强大的功能设计，让你专注于创作</p>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <Zap className="w-5 h-5 text-violet-400" />
              </div>
              <h3
                className="text-white font-medium mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                变量模板
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                使用 {"{{变量}}"} 语法，一键替换内容，复用 Prompt 更高效
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-fuchsia-500/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-4 group-hover:bg-fuchsia-500/20 transition-colors">
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
              </div>
              <h3
                className="text-white font-medium mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                智能分类
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                标签管理，收藏功能，快速检索，让你的 Prompt 库井井有条
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <h3
                className="text-white font-medium mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                安全存储
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                数据加密，隐私优先，云端同步，随时随地访问你的 Prompt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-800 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5">
              <Code2 className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Built with Modern Stack</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl text-white mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              技术栈
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              采用最新的开源技术构建，注重性能、类型安全与开发体验
            </p>
          </div>

          {/* Tech Stack Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-900 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {techStack.map((stack) => {
              const colors = getColorClasses(stack.color);
              return (
                <div
                  key={stack.category}
                  className={`group p-6 rounded-2xl border ${colors.border} ${colors.bg} transition-all duration-300`}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.text}`}
                    >
                      {stack.icon}
                    </div>
                    <h3
                      className="text-white font-semibold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {stack.category}
                    </h3>
                  </div>

                  {/* Tech Items */}
                  <div className="space-y-3">
                    {stack.items.map((item) => (
                      <div key={item.name} className="flex flex-col">
                        <span className="text-white/90 text-sm font-medium">{item.name}</span>
                        <span className="text-white/40 text-xs">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Tech Badges */}
          <div
            className={`flex flex-wrap justify-center gap-3 mt-12 transition-all duration-1000 delay-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {["Biome", "pnpm", "Vercel", "Edge Runtime", "SSR", "ISR"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-xs text-white/50 border border-white/10 rounded-full hover:border-white/20 hover:text-white/70 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`p-12 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent transition-all duration-1000 delay-1100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2
              className="text-2xl sm:text-3xl text-white mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              准备好开始了吗？
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              使用 GitHub 账号一键登录，开始构建你的 Prompt 库
            </p>
            <a
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white text-[#0a0a0f] font-medium py-4 px-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-violet-200/50 to-transparent" />
              <Github className="w-5 h-5 relative" />
              <span className="relative">使用 GitHub 登录</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-1000 delay-1200 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/40">系统在线</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-xs text-white/40 font-mono">v0.1.0</span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="/terms"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                服务条款
              </a>
              <a
                href="/privacy"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                隐私政策
              </a>
              <p className="text-xs text-white/30">© 2024 PromptVault</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Global font imports */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}
