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
  const variables = extractVariables(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Tags row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="tag"
              style={{
                backgroundColor: `${tag.color}15`,
                color: tag.color,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
              {tag.name}
            </span>
          ))}
          {tags.length > 3 && (
            <span
              className="text-label-medium px-1"
              style={{ color: "hsl(var(--md-on-surface-variant))" }}
            >
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3
          className="text-title-medium truncate flex-1 mr-3"
          style={{ color: "hsl(var(--md-on-surface))" }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {/* Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="icon-btn w-8 h-8"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div
                  className="absolute right-0 top-10 z-20 rounded-2xl shadow-lg py-2 min-w-[140px] scale-in"
                  style={{ background: "hsl(var(--md-surface-container))" }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-label-large state-layer"
                    style={{ color: "hsl(var(--md-on-surface))" }}
                  >
                    <Edit className="w-4 h-4" />
                    编辑
                  </button>
                  <div className="divider mx-3 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-label-large state-layer"
                    style={{ color: "hsl(var(--md-error))" }}
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
        <p
          className="text-body-medium mb-4 line-clamp-2 leading-relaxed"
          style={{ color: "hsl(var(--md-on-surface-variant))" }}
        >
          {description}
        </p>
      )}

      {/* Content preview */}
      <div className="code-block mb-4 max-h-32 overflow-hidden relative">
        <pre
          className="text-body-medium whitespace-pre-wrap line-clamp-4"
          style={{ color: "hsl(var(--md-on-surface-variant))" }}
        >
          {content}
        </pre>
        {/* Fade out gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--md-surface-container-lowest)), transparent)",
          }}
        />
      </div>

      {/* Variables indicator */}
      {variables.length > 0 && (
        <div
          className="flex items-center gap-2 mb-4 p-3 rounded-2xl"
          style={{
            background: "hsl(var(--md-primary) / 0.08)",
            border: "1px solid hsl(var(--md-primary) / 0.2)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(var(--md-primary))" }} />
          <span className="text-label-medium" style={{ color: "hsl(var(--md-primary))" }}>
            {variables.length} 个变量
          </span>
          <div className="flex-1" />
          <div className="flex gap-1.5">
            {variables.slice(0, 2).map((v) => (
              <code
                key={v}
                className="text-label-medium px-1.5 py-0.5 rounded-lg"
                style={{
                  background: "hsl(var(--md-primary) / 0.12)",
                  color: "hsl(var(--md-primary))",
                }}
              >
                {v}
              </code>
            ))}
            {variables.length > 2 && (
              <span
                className="text-label-medium"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
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
            className="btn-outlined flex-1 flex items-center justify-center gap-2 py-3"
          >
            <Eye className="w-4 h-4" />
            <span>预览</span>
          </button>
        )}

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium text-label-large transition-all duration-200 ${
            copied ? "" : "btn-secondary"
          }`}
          style={
            copied
              ? {
                  background: "hsl(120 60% 50% / 0.15)",
                  color: "hsl(120 60% 40%)",
                }
              : undefined
          }
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
