"use client";

import { extractVariables } from "@/lib/utils";
import { Check, Copy, Edit, Eye, MoreVertical, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface PromptCardProps {
  id: string;
  title: string;
  content: string;
  description?: string | null;
  tags?: Tag[];
  createdAt: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview?: (id: string) => void;
}

export function PromptCard({
  id,
  title,
  content,
  description,
  tags = [],
  onEdit,
  onDelete,
  onPreview,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const variables = extractVariables(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group card p-6 hover-lift relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative corner accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 transition-all duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            tags.length > 0 && tags[0]
              ? `radial-gradient(ellipse at top right, ${tags[0].color}15 0%, transparent 70%)`
              : "radial-gradient(ellipse at top right, hsl(var(--accent) / 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Tags row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full transition-all duration-200"
              style={{
                backgroundColor: `${tag.color}15`,
                color: tag.color,
                border: `1px solid ${tag.color}25`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
              {tag.name}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] text-[hsl(var(--text-muted))] px-1">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-display font-semibold text-[hsl(var(--text-primary))] truncate flex-1 mr-3 group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>
        <div className="flex items-center gap-1">
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

      {/* Variables indicator */}
      {variables.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-[hsl(var(--accent-subtle))] border border-[hsl(var(--accent)_/_0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--accent-light))]" />
          <span className="text-[11px] text-[hsl(var(--accent-light))]">
            {variables.length} 个变量
          </span>
          <div className="flex-1" />
          <div className="flex gap-1.5">
            {variables.slice(0, 2).map((v) => (
              <code
                key={v}
                className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--accent)_/_0.15)] text-[hsl(var(--accent-light))]"
              >
                {v}
              </code>
            ))}
            {variables.length > 2 && (
              <span className="text-[10px] text-[hsl(var(--accent-muted))]">
                +{variables.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {/* Preview button - only show if there are variables */}
        {variables.length > 0 && onPreview && (
          <button
            type="button"
            onClick={() => onPreview(id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] border border-[hsl(var(--border))] hover:border-[hsl(var(--fuchsia)_/_0.5)] hover:text-[hsl(var(--fuchsia-light))] hover:bg-[hsl(var(--fuchsia)_/_0.1)] transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            <span>预览</span>
          </button>
        )}

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
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
              <span>{variables.length > 0 ? "复制" : "复制 Prompt"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
