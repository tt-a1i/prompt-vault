"use client";

import { extractVariables } from "@/lib/utils";
import { Check, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
  }) => void;
  initialData?: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
  };
  availableTags: Tag[];
  isLoading?: boolean;
}

export function PromptForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  availableTags,
  isLoading,
}: PromptFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when modal opens/closes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setDescription(initialData.description);
      setSelectedTagIds(initialData.tagIds || []);
    } else {
      setTitle("");
      setContent("");
      setDescription("");
      setSelectedTagIds([]);
    }
    setShowTagDropdown(false);
  }, [initialData, isOpen]);

  const variables = extractVariables(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, description, tagIds: selectedTagIds });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const selectedTags = availableTags.filter((tag) => selectedTagIds.includes(tag.id));
  const unselectedTags = availableTags.filter((tag) => !selectedTagIds.includes(tag.id));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Scrim */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div className="scrim absolute inset-0" onClick={onClose} />

      {/* Dialog */}
      <div className="dialog relative w-full max-w-2xl max-h-[85vh] scale-in flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between pb-4 border-b shrink-0"
          style={{ borderColor: "hsl(var(--md-outline-variant))" }}
        >
          <h2 className="text-headline-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
            {initialData ? "编辑 Prompt" : "新建 Prompt"}
          </h2>
          <button type="button" onClick={onClose} className="icon-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="py-4 space-y-5 overflow-y-auto flex-1">
            <div>
              <label
                htmlFor="title"
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                标题 <span style={{ color: "hsl(var(--md-error))" }}>*</span>
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
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
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

            {/* Tags */}
            <div>
              <span
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                标签
              </span>
              <div className="relative">
                {/* Selected tags + Add button */}
                <div
                  className="flex flex-wrap items-center gap-2 p-3 rounded-2xl min-h-[48px]"
                  style={{
                    background: "hsl(var(--md-surface-container-highest))",
                    border: "1px solid hsl(var(--md-outline-variant))",
                  }}
                >
                  {selectedTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="chip"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  ))}
                  {availableTags.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="chip"
                      style={{ borderStyle: "dashed" }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      添加标签
                    </button>
                  )}
                  {availableTags.length === 0 && (
                    <span
                      className="text-body-medium"
                      style={{ color: "hsl(var(--md-on-surface-variant))" }}
                    >
                      暂无标签，请先在列表页创建标签
                    </span>
                  )}
                </div>

                {/* Dropdown */}
                {showTagDropdown && unselectedTags.length > 0 && (
                  <>
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: dropdown backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setShowTagDropdown(false)} />
                    <div
                      className="absolute left-0 right-0 top-full mt-2 z-20 rounded-2xl shadow-lg p-2 scale-in"
                      style={{ background: "hsl(var(--md-surface-container))" }}
                    >
                      {unselectedTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            toggleTag(tag.id);
                            if (unselectedTags.length === 1) {
                              setShowTagDropdown(false);
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-label-large state-layer"
                          style={{ color: "hsl(var(--md-on-surface))" }}
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                          {selectedTagIds.includes(tag.id) && (
                            <Check
                              className="w-4 h-4 ml-auto"
                              style={{ color: "hsl(var(--md-primary))" }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                内容 <span style={{ color: "hsl(var(--md-error))" }}>*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入你的 Prompt 内容，使用 {{变量名}} 定义变量"
                required
                rows={8}
                className="input font-mono text-body-medium resize-none"
              />
            </div>

            {variables.length > 0 && (
              <div
                className="p-3 rounded-2xl"
                style={{
                  background: "hsl(var(--md-surface-container-lowest))",
                  border: "1px solid hsl(var(--md-outline-variant))",
                }}
              >
                <p
                  className="text-label-medium mb-2"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  检测到的变量
                </p>
                <div className="flex flex-wrap gap-2">
                  {variables.map((v) => (
                    <span key={v} className="tag">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div
            className="pt-4 border-t shrink-0"
            style={{ borderColor: "hsl(var(--md-outline-variant))" }}
          >
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-outlined flex-1">
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
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
