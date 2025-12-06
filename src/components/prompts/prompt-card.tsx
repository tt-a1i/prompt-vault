"use client";

import { extractVariables } from "@/lib/utils";
import { Check, Copy, Edit, Heart, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface PromptCardProps {
  id: string;
  title: string;
  content: string;
  description?: string | null;
  isFavorite: boolean;
  createdAt: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function PromptCard({
  id,
  title,
  content,
  description,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const variables = extractVariables(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group card p-6 hover-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-display font-medium text-[hsl(var(--text-primary))] truncate flex-1 mr-3 group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {/* Favorite button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isFavorite
                ? "text-rose-400 bg-rose-400/10"
                : "text-[hsl(var(--text-muted))] hover:text-rose-400 hover:bg-rose-400/10"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-elevated))] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 z-20 bg-[hsl(var(--bg-elevated))] rounded-xl shadow-2xl py-2 min-w-[140px] border border-[hsl(var(--border))] slide-down">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-card))] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    编辑
                  </button>
                  <div className="mx-3 my-1 h-px bg-[hsl(var(--border))]" />
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-400/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-[hsl(var(--text-muted))] mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Content preview */}
      <div className="code-block mb-4 max-h-32 overflow-hidden relative">
        <pre className="text-sm whitespace-pre-wrap line-clamp-4 text-[hsl(var(--text-secondary))]">
          {content}
        </pre>
        {/* Fade out gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[hsl(var(--bg-primary))] to-transparent" />
      </div>

      {/* Variables */}
      {variables.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {variables.map((v) => (
            <span key={v} className="tag text-[11px]">
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}

      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
          copied
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            : "bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)_/_0.5)] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--accent)_/_0.1)]"
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>已复制</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>复制 Prompt</span>
          </>
        )}
      </button>
    </div>
  );
}
