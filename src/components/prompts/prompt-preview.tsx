"use client";

import { extractVariables } from "@/lib/utils";
import { Check, Copy, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  const variableNames = extractVariables(content);
  const variablesKey = variableNames.join(",");

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Scrim */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div className="scrim absolute inset-0" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 overflow-hidden scale-in">
        {/* Content container */}
        <div className="dialog overflow-hidden p-0">
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: "hsl(var(--md-outline-variant))" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "hsl(var(--md-primary-container))" }}
                >
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: "hsl(var(--md-on-primary-container))" }}
                  />
                </div>
                <h2
                  className="text-title-large truncate"
                  style={{ color: "hsl(var(--md-on-surface))" }}
                >
                  {title}
                </h2>
              </div>
              {description && (
                <p
                  className="text-body-medium ml-11 truncate"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  {description}
                </p>
              )}
            </div>
            <button type="button" onClick={onClose} className="icon-btn ml-4">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body - Two columns */}
          <div
            className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x"
            style={{ borderColor: "hsl(var(--md-outline-variant))" }}
          >
            {/* Variables Input */}
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-title-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
                  填写变量
                </h3>
                <span
                  className="text-label-medium"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  {Object.values(variables).filter((v) => v.trim()).length} / {variableNames.length}
                </span>
              </div>

              {variableNames.length === 0 ? (
                <div className="py-8 text-center">
                  <p
                    className="text-body-medium"
                    style={{ color: "hsl(var(--md-on-surface-variant))" }}
                  >
                    此 Prompt 没有变量
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {variableNames.map((v, index) => (
                    <div key={v} className="group">
                      <label
                        htmlFor={`var-${v}`}
                        className="flex items-center gap-2 text-label-large mb-1.5"
                        style={{ color: "hsl(var(--md-on-surface-variant))" }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-label-medium"
                          style={{
                            backgroundColor: variables[v]?.trim()
                              ? "hsl(120 60% 50% / 0.15)"
                              : "hsl(var(--md-primary) / 0.15)",
                            color: variables[v]?.trim()
                              ? "hsl(120 60% 40%)"
                              : "hsl(var(--md-primary))",
                          }}
                        >
                          {index + 1}
                        </span>
                        <code style={{ color: "hsl(var(--md-primary))" }}>{v}</code>
                      </label>
                      <input
                        id={`var-${v}`}
                        type="text"
                        value={variables[v] || ""}
                        onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
                        onFocus={() => setActiveField(v)}
                        onBlur={() => setActiveField(null)}
                        placeholder={`输入 ${v} 的值...`}
                        className="input-outlined transition-all duration-200"
                        style={{
                          borderColor:
                            activeField === v
                              ? "hsl(var(--md-primary))"
                              : variables[v]?.trim()
                                ? "hsl(120 60% 50% / 0.5)"
                                : undefined,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Output */}
            <div className="p-6 flex flex-col max-h-[50vh]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
                  预览结果
                </h3>
                {allFilled && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-medium"
                    style={{
                      background: "hsl(120 60% 50% / 0.15)",
                      color: "hsl(120 60% 40%)",
                    }}
                  >
                    <Check className="w-3 h-3" />
                    已填写完成
                  </span>
                )}
              </div>

              {/* Preview content with highlighted variables */}
              <div className="flex-1 overflow-y-auto">
                <div className="code-block min-h-[200px] text-body-medium whitespace-pre-wrap leading-relaxed">
                  {content.split(/(\{\{[^}]+\}\})/).map((part) => {
                    const match = part.match(/\{\{([^}]+)\}\}/);
                    if (match?.[1]) {
                      const varName = match[1];
                      const value = variables[varName];
                      if (value?.trim()) {
                        return (
                          <span
                            key={`filled-${varName}-${part}`}
                            className="px-1.5 py-0.5 rounded-lg font-medium"
                            style={{
                              background: "hsl(120 60% 50% / 0.15)",
                              color: "hsl(120 60% 40%)",
                            }}
                          >
                            {value}
                          </span>
                        );
                      }
                      return (
                        <span
                          key={`empty-${varName}-${part}`}
                          className="px-1.5 py-0.5 rounded-lg"
                          style={{
                            background: "hsl(var(--md-primary) / 0.15)",
                            color: "hsl(var(--md-primary))",
                            border: "1px dashed hsl(var(--md-primary) / 0.3)",
                          }}
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
          <div
            className="flex items-center justify-between gap-4 p-6 border-t"
            style={{ borderColor: "hsl(var(--md-outline-variant))" }}
          >
            <p className="text-label-medium" style={{ color: "hsl(var(--md-on-surface-variant))" }}>
              {allFilled ? (
                "所有变量已填写，可以复制使用"
              ) : (
                <>
                  还有{" "}
                  <span style={{ color: "hsl(var(--md-primary))" }}>
                    {variableNames.length - Object.values(variables).filter((v) => v.trim()).length}
                  </span>{" "}
                  个变量未填写
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-outlined">
                取消
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-primary flex items-center gap-2"
                style={
                  copied
                    ? {
                        background: "hsl(120 60% 45%)",
                      }
                    : undefined
                }
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
    </div>,
    document.body
  );
}
