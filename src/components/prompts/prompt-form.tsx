"use client";

import { extractVariables } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; description: string }) => void;
  initialData?: {
    title: string;
    content: string;
    description: string;
  };
  isLoading?: boolean;
}

export function PromptForm({ isOpen, onClose, onSubmit, initialData, isLoading }: PromptFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when modal opens/closes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setDescription(initialData.description);
    } else {
      setTitle("");
      setContent("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const variables = extractVariables(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, description });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div
        className="absolute inset-0 bg-[hsl(var(--bg-dark)_/_0.8)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border-dark))]">
          <h2 className="text-lg font-semibold text-[hsl(var(--text-dark-primary))]">
            {initialData ? "编辑 Prompt" : "新建 Prompt"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[hsl(var(--text-dark-muted))] hover:text-[hsl(var(--text-dark-primary))] hover:bg-[hsl(var(--bg-dark-tertiary))] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[hsl(var(--text-dark-secondary))] mb-2"
            >
              标题 <span className="text-[hsl(var(--rose))]">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的 Prompt 起个名字"
              required
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[hsl(var(--text-dark-secondary))] mb-2"
            >
              描述
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述这个 Prompt 的用途"
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[hsl(var(--text-dark-secondary))] mb-2"
            >
              内容 <span className="text-[hsl(var(--rose))]">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入你的 Prompt 内容，使用 {{变量名}} 定义变量"
              required
              rows={8}
              className="input font-mono text-sm resize-none"
            />
          </div>

          {variables.length > 0 && (
            <div className="p-3 rounded-xl bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-dark))]">
              <p className="text-xs text-[hsl(var(--text-dark-muted))] mb-2">检测到的变量</p>
              <div className="flex flex-wrap gap-2">
                {variables.map((v) => (
                  <span key={v} className="tag">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  保存中...
                </span>
              ) : (
                "保存"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
