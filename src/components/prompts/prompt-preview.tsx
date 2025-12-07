"use client";

import { extractVariables } from "@/lib/utils";
import { Check, Copy, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PromptPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  description?: string | null;
}

export function PromptPreview({
  isOpen,
  onClose,
  title,
  content,
  description,
}: PromptPreviewProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const variableNames = extractVariables(content);
  const variablesKey = variableNames.join(",");

  // biome-ignore lint/correctness/useExhaustiveDependencies: using serialized key for array comparison
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, string> = {};
      for (const v of variableNames) {
        initial[v] = "";
      }
      setVariables(initial);
    }
  }, [isOpen, variablesKey]);

  // Generate filled content
  const filledContent = variableNames.reduce((acc, v) => {
    const value = variables[v] || `{{${v}}}`;
    return acc.replace(new RegExp(`\\{\\{${v}\\}\\}`, "g"), value);
  }, content);

  // Check if all variables are filled
  const allFilled = variableNames.every((v) => variables[v]?.trim());

  const handleCopy = async () => {
    await navigator.clipboard.writeText(filledContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div
        className="absolute inset-0 bg-[hsl(var(--bg-primary)_/_0.9)] backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 overflow-hidden slide-down">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[hsl(var(--accent))] opacity-10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[hsl(var(--fuchsia))] opacity-10 blur-[100px] rounded-full" />

        {/* Content container */}
        <div className="relative bg-gradient-to-b from-[hsl(var(--bg-card))] to-[hsl(var(--bg-secondary))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-subtle))] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[hsl(var(--accent-light))]" />
                </div>
                <h2 className="text-lg font-display font-semibold text-[hsl(var(--text-primary))] truncate">
                  {title}
                </h2>
              </div>
              {description && (
                <p className="text-sm text-[hsl(var(--text-muted))] ml-11 truncate">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-elevated))] transition-colors ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body - Two columns */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[hsl(var(--border))]">
            {/* Variables Input */}
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[hsl(var(--text-secondary))]">填写变量</h3>
                <span className="text-xs text-[hsl(var(--text-muted))]">
                  {Object.values(variables).filter((v) => v.trim()).length} / {variableNames.length}
                </span>
              </div>

              {variableNames.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-[hsl(var(--text-muted))]">此 Prompt 没有变量</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {variableNames.map((v, index) => (
                    <div key={v} className="group">
                      <label
                        htmlFor={`var-${v}`}
                        className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] mb-1.5"
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium"
                          style={{
                            backgroundColor: variables[v]?.trim()
                              ? "hsl(var(--success) / 0.15)"
                              : "hsl(var(--accent) / 0.15)",
                            color: variables[v]?.trim()
                              ? "hsl(var(--success))"
                              : "hsl(var(--accent-light))",
                          }}
                        >
                          {index + 1}
                        </span>
                        <code className="text-[hsl(var(--accent-light))]">{v}</code>
                      </label>
                      <input
                        id={`var-${v}`}
                        type="text"
                        value={variables[v] || ""}
                        onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
                        onFocus={() => setActiveField(v)}
                        onBlur={() => setActiveField(null)}
                        placeholder={`输入 ${v} 的值...`}
                        className={`input transition-all duration-300 ${
                          activeField === v ? "ring-2 ring-[hsl(var(--accent)_/_0.3)]" : ""
                        } ${variables[v]?.trim() ? "border-[hsl(var(--success)_/_0.3)]" : ""}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Output */}
            <div className="p-6 flex flex-col max-h-[50vh]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[hsl(var(--text-secondary))]">预览结果</h3>
                {allFilled && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[hsl(var(--success)_/_0.15)] text-[hsl(var(--success))]">
                    <Check className="w-3 h-3" />
                    已填写完成
                  </span>
                )}
              </div>

              {/* Preview content with highlighted variables */}
              <div className="flex-1 overflow-y-auto">
                <div className="code-block min-h-[200px] text-sm whitespace-pre-wrap leading-relaxed">
                  {content.split(/(\{\{[^}]+\}\})/).map((part) => {
                    const match = part.match(/\{\{([^}]+)\}\}/);
                    if (match?.[1]) {
                      const varName = match[1];
                      const value = variables[varName];
                      if (value?.trim()) {
                        return (
                          <span
                            key={`filled-${varName}-${part}`}
                            className="px-1.5 py-0.5 rounded bg-[hsl(var(--success)_/_0.15)] text-[hsl(var(--success))] font-medium"
                          >
                            {value}
                          </span>
                        );
                      }
                      return (
                        <span
                          key={`empty-${varName}-${part}`}
                          className="px-1.5 py-0.5 rounded bg-[hsl(var(--accent)_/_0.2)] text-[hsl(var(--accent-light))] border border-dashed border-[hsl(var(--accent)_/_0.3)]"
                        >
                          {`{{${varName}}}`}
                        </span>
                      );
                    }
                    return <span key={`text-${part.slice(0, 20)}`}>{part}</span>;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 p-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-secondary)_/_0.5)]">
            <p className="text-xs text-[hsl(var(--text-muted))]">
              {allFilled ? (
                "所有变量已填写，可以复制使用"
              ) : (
                <>
                  还有{" "}
                  <span className="text-[hsl(var(--accent-light))]">
                    {variableNames.length - Object.values(variables).filter((v) => v.trim()).length}
                  </span>{" "}
                  个变量未填写
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                取消
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={`btn-primary flex items-center gap-2 ${
                  copied ? "!bg-[hsl(var(--success))] !text-white" : ""
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制结果
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
