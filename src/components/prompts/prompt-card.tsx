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
    <div className="card p-5 hover-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-[hsl(var(--text-dark-primary))] truncate flex-1 mr-2">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {/* Favorite button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isFavorite
                ? "text-[hsl(var(--rose))]"
                : "text-[hsl(var(--text-dark-muted))] hover:text-[hsl(var(--rose))]"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-[hsl(var(--text-dark-muted))] hover:text-[hsl(var(--text-dark-primary))] hover:bg-[hsl(var(--bg-dark-tertiary))] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-[hsl(var(--bg-dark-secondary))] rounded-xl shadow-xl py-1 min-w-[120px] border border-[hsl(var(--border-dark))] slide-down">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--text-dark-secondary))] hover:text-[hsl(var(--text-dark-primary))] hover:bg-[hsl(var(--bg-dark-tertiary))] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    编辑
                  </button>
                  <div className="mx-3 h-px bg-[hsl(var(--border-dark))]" />
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(var(--rose))] hover:bg-[hsl(var(--rose)_/_0.1)] transition-colors"
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
        <p className="text-sm text-[hsl(var(--text-dark-muted))] mb-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Content preview */}
      <div className="code-block mb-4">
        <pre className="text-sm whitespace-pre-wrap line-clamp-4 text-[hsl(var(--text-dark-secondary))]">
          {content}
        </pre>
      </div>

      {/* Variables */}
      {variables.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {variables.map((v) => (
            <span key={v} className="tag">
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}

      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          copied
            ? "bg-[hsl(var(--teal)_/_0.15)] text-[hsl(var(--teal-light))] border border-[hsl(var(--teal)_/_0.3)]"
            : "btn-secondary"
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
